// Global feedback-modal signal. Any component can call openFeedback(ctx)
// to surface the modal pre-filled with module / item / FAQ context. The
// modal lives at the App level so it overlays whatever's underneath. No
// persistence — the modal is transient state.

import { signal } from '@preact/signals';
import type { FeedbackContext } from '../lib/feedbackMailto';

export type FeedbackContextDraft = Omit<FeedbackContext, 'userText'>;

export interface FeedbackModalState {
  open: boolean;
  context: FeedbackContextDraft;
}

export const feedbackModalSignal = signal<FeedbackModalState>({
  open: false,
  context: {},
});

export function openFeedback(context: FeedbackContextDraft = {}): void {
  feedbackModalSignal.value = { open: true, context };
}

export function closeFeedback(): void {
  feedbackModalSignal.value = { open: false, context: {} };
}
