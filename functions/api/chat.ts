// Cloudflare Pages Function — meridian-os chat proxy.
//
// Non-streaming for v1. Receives chat history + brain context + persona;
// assembles a system prompt with per-relationship sections (cache-controlled),
// calls Anthropic Messages API server-side, returns { text }.
//
// Streaming is a future v2 — the typing-feel matters but doubles the scope
// (SSE on both sides, transformer to translate Anthropic's deltas).
//
// Required secret (set once via `wrangler pages secret put` or the CF dashboard):
//   - ANTHROPIC_API_KEY

interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  brain?: {
    deep?: Array<{ label: string; body: string }>;
    edit?: Array<{ label: string; body: string }>;
    summary?: Array<{ label: string; body: string }>;
    held?: Array<{ label: string }>;
  };
  persona?: string;
  workspaceTitle?: string;
}

interface AnthropicSystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;

interface Env {
  ANTHROPIC_API_KEY?: string;
}

interface Context {
  request: Request;
  env: Env;
}

export const onRequestPost = async (context: Context): Promise<Response> => {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
    return jsonError(
      "Server is missing ANTHROPIC_API_KEY. Set it via `npx wrangler pages secret put ANTHROPIC_API_KEY --project-name=meridian-os`.",
      500,
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return jsonError('Invalid JSON body.', 400);
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) return jsonError('No messages.', 400);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemBlocks(body),
      messages,
    }),
  }).catch((err: unknown) => {
    return new Response(JSON.stringify({ error: 'Upstream fetch failed: ' + String(err) }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    return jsonError(`Anthropic error ${upstream.status}: ${text.slice(0, 400)}`, 502);
  }

  const data = (await upstream.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = (data.content ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n')
    .trim();

  return new Response(JSON.stringify({ text }), {
    headers: { 'content-type': 'application/json' },
  });
};

// System prompt: persona + per-relationship brain sections. Each section gets
// a separate text block with cache_control so first-turn cost is paid once
// per attach-set; turns 2+ hit the cache.
function buildSystemBlocks(body: ChatRequestBody): AnthropicSystemBlock[] {
  const blocks: AnthropicSystemBlock[] = [];

  // Always-present base.
  blocks.push({
    type: 'text',
    text: basePrompt(body),
    cache_control: { type: 'ephemeral' },
  });

  const brain = body.brain ?? {};

  // Edit-allowed first — write authority is the most important context.
  if (brain.edit?.length) {
    blocks.push({
      type: 'text',
      text:
        '## Artifacts you may modify\n\n' +
        'You have explicit write access to the following items. When proposing changes, ' +
        'be specific about what you would update.\n\n' +
        brain.edit.map((it) => `### ${it.label}\n\n${it.body}`).join('\n\n---\n\n'),
      cache_control: { type: 'ephemeral' },
    });
  }

  // Deep reads — full content embedded.
  if (brain.deep?.length) {
    blocks.push({
      type: 'text',
      text:
        '## Deeply read items\n\n' +
        'You have full content of the following in active context.\n\n' +
        brain.deep.map((it) => `### ${it.label}\n\n${it.body}`).join('\n\n---\n\n'),
      cache_control: { type: 'ephemeral' },
    });
  }

  // Summaries.
  if (brain.summary?.length) {
    blocks.push({
      type: 'text',
      text:
        '## Summarized items\n\n' +
        brain.summary.map((it) => `- **${it.label}** — ${it.body}`).join('\n'),
    });
  }

  // Held — title only.
  if (brain.held?.length) {
    blocks.push({
      type: 'text',
      text:
        '## Held (title only)\n\n' +
        'You know these exist and can ask the user about them, but you have not read them.\n\n' +
        brain.held.map((it) => `- ${it.label}`).join('\n'),
    });
  }

  return blocks;
}

function basePrompt(body: ChatRequestBody): string {
  const persona = body.persona?.trim() || 'general';
  const ws = body.workspaceTitle?.trim() || 'workspace';

  const personaText: Record<string, string> = {
    trainer:
      'You are a primary-care training assistant. The user is a clinical educator working ' +
      'with a specific provider on Epic + clinical workflow onboarding. Be concrete, cite ' +
      'specific Epic features (LOS, HCC, SmartPhrases, In-Basket, AWV, etc.) by name. Keep ' +
      'replies tight; trainers prefer punch lists over prose.',
    general:
      'You are an assistant embedded in a workspace OS. The user has attached relevant ' +
      'context to your brain; reason from that context. Keep replies tight and concrete.',
  };

  return [
    `You are an assistant in the meridian-os workspace OS, in the "${ws}" workspace.`,
    personaText[persona] ?? personaText.general,
    'When you do not have enough information, say so and ask for what you need rather than guessing.',
  ].join(' ');
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
