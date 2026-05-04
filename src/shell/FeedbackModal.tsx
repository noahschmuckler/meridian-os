// Feedback modal — opens when feedbackModalSignal.value.open is true.
// Captures a free-text comment, attaches the contextual fields the caller
// pre-filled (module title/id, FAQ topic, item text), and on submit
// triggers a mailto: with the destination from feedbackMailto.ts. The
// user's mail client picks up the draft so they hit Send themselves —
// no server, no queue.

import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { feedbackModalSignal, closeFeedback } from '../data/feedbackSignal';
import { buildFeedbackMailto } from '../lib/feedbackMailto';

export function FeedbackModal(): JSX.Element | null {
  const state = feedbackModalSignal.value;
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.open) {
      setText('');
      const t = window.setTimeout(() => textareaRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [state.open]);

  useEffect(() => {
    if (!state.open) return;
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') closeFeedback();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.open]);

  if (!state.open) return null;

  const ctx = state.context;
  const moduleLabel = ctx.moduleTitle ?? ctx.moduleId ?? '(no module focused)';

  function send(): void {
    if (!text.trim()) return;
    const url = buildFeedbackMailto({ ...ctx, userText: text.trim() });
    window.location.href = url;
    closeFeedback();
  }

  return (
    <div class="feedback-modal-scrim" onClick={() => closeFeedback()}>
      <div class="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div class="feedback-modal__header">
          <span class="feedback-modal__title">Send feedback</span>
          <button
            type="button"
            class="feedback-modal__close"
            aria-label="Close"
            onClick={() => closeFeedback()}
          >×</button>
        </div>
        <div class="feedback-modal__context">
          <div><strong>Module:</strong> {moduleLabel}</div>
          {ctx.faqTopic && <div><strong>FAQ:</strong> {ctx.faqTopic}</div>}
          {ctx.itemText && (
            <div class="feedback-modal__item">
              <strong>Item:</strong> <em>{ctx.itemText}</em>
            </div>
          )}
        </div>
        <textarea
          ref={textareaRef}
          class="feedback-modal__textarea"
          placeholder="What's wrong, what would help, what's missing…"
          value={text}
          onInput={(e) => setText((e.currentTarget as HTMLTextAreaElement).value)}
        />
        <div class="feedback-modal__actions">
          <button type="button" class="feedback-modal__cancel" onClick={() => closeFeedback()}>
            Cancel
          </button>
          <button
            type="button"
            class="feedback-modal__send"
            disabled={!text.trim()}
            onClick={send}
          >
            Send via email
          </button>
        </div>
        <div class="feedback-modal__note">
          Opens your mail app with a pre-filled draft to nschmuckler@crystalrunhealthcare.com.
        </div>
      </div>
    </div>
  );
}
