// Markdown primitive — read/edit text bubble.
//
// View mode (default for read-only files): preformatted body, no edit affordances.
// Edit mode: textarea fills the body. Edits flow up via onBodyChange so the
// host can persist to the bubble's registry instance and (if fileId is present)
// write through to the underlying MeridianFile.
//
// `props.editable` is the initial / persistent editability flag — toggled via
// the chrome's edit/view button. We don't render markdown formatting yet
// (no parser); white-space: pre-wrap preserves line breaks, which is the
// 80% case for scratch pads and saved notes.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { renderMarkdown } from '../../lib/md';

interface MarkdownProps {
  body?: string;
  editable?: boolean;
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  onBodyChange?: (body: string) => void;
  onToggleEditable?: () => void;
}

export function Markdown({ instance, onBodyChange, onToggleEditable }: Props): JSX.Element {
  const p = instance.props as MarkdownProps;
  const editable = p.editable === true;
  const body = p.body ?? '';

  // Local draft for the textarea so we don't round-trip on every keystroke.
  // We commit on blur and on Enter (Cmd/Ctrl+Enter for explicit save).
  const [draft, setDraft] = useState(body);

  // If the underlying body changes from outside (e.g. file reload, save-state
  // restore), reset the draft. We compare against the last-known committed body.
  const [lastBody, setLastBody] = useState(body);
  if (lastBody !== body) {
    setLastBody(body);
    setDraft(body);
  }

  function commit(): void {
    if (draft !== body) onBodyChange?.(draft);
  }

  return (
    <div class="md-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title">{instance.title}</span>
        <button
          class="md-bubble__toggle"
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => { e.stopPropagation(); onToggleEditable?.(); }}
          onClick={(e) => e.stopPropagation()}
          title={editable ? 'Switch to read-only' : 'Edit'}
        >
          {editable ? 'view' : 'edit'}
        </button>
      </div>
      <div class="bubble__body md-bubble__body">
        {editable ? (
          <textarea
            class="md-bubble__textarea"
            value={draft}
            placeholder="Type notes here…"
            onInput={(e) => setDraft((e.currentTarget as HTMLTextAreaElement).value)}
            onBlur={commit}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                commit();
              }
            }}
          />
        ) : body.trim() === '' ? (
          <div class="md-bubble__empty">empty · click <em>edit</em> to write</div>
        ) : (
          <div
            class="md-bubble__view markdown-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
          />
        )}
      </div>
    </div>
  );
}
