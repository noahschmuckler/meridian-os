// Build mailto: URLs for the feedback flow. Ported from
// meridian-server/index.html:6732-6740 (sendFeedbackFromModal). The
// destination address is the same one used in earlier meridian iterations;
// no server, no localStorage queue — the user's mail client picks up the
// pre-filled draft and they hit send. Side benefit: native mail draft is
// recognizable to clinical leadership and doesn't ask them to learn a
// new feedback workflow.

export const FEEDBACK_EMAIL = 'nschmuckler@crystalrunhealthcare.com';

export interface FeedbackContext {
  moduleTitle?: string | null;   // e.g. "Benzodiazepines — escalation review"
  moduleId?: string | null;      // e.g. "benzos"
  itemText?: string | null;      // selected snippet, checklist row text, FAQ question, etc.
  faqTopic?: string | null;      // "PDMP", "Cognitive impairment", etc.
  userText: string;              // free-text feedback the user typed
}

export function buildFeedbackMailto(ctx: FeedbackContext): string {
  const moduleLabel = ctx.moduleTitle ?? ctx.moduleId ?? 'Meridian';
  const subjectItem = ctx.itemText ? truncate(ctx.itemText, 60) : 'general';
  const subject = `[Meridian / ${moduleLabel}] ${subjectItem}`;

  const lines: string[] = [];
  if (ctx.moduleTitle || ctx.moduleId) {
    lines.push(`Module: ${ctx.moduleTitle ?? ctx.moduleId}`);
  }
  if (ctx.faqTopic) lines.push(`FAQ topic: ${ctx.faqTopic}`);
  if (ctx.itemText) lines.push(`Item: ${ctx.itemText}`);
  lines.push('', 'Feedback:', ctx.userText);

  const body = lines.join('\n');
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + '…';
}
