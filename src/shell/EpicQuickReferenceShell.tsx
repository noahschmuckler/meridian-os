import type { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import EpicQuickReferenceApp from '../apps/epic-quick-reference/EpicQuickReferenceApp';
import { BackToLauncherChevron } from './Launcher';
import { epicReferenceFocusSignal, clearEpicReferenceFocus } from '../data/epicReferenceFocus';

export function EpicQuickReferenceShell(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const focus = epicReferenceFocusSignal.value;

  // When a deep-link from another app sets epicReferenceFocusSignal, scroll
  // the matching entry into view and synthetically click its header to expand
  // it. The SPA is byte-identical from Scott's TSX (// @ts-nocheck), so we
  // can't reach into its component state directly — we drive the SPA from
  // the outside via DOM. Fires after the SPA has mounted and the entry list
  // has rendered (rAF + small timeout to clear React-on-Preact effect order).
  useEffect(() => {
    if (!focus.entryId) return;
    const targetId = focus.entryId;
    let cancelled = false;
    const tick = window.setTimeout(() => {
      if (cancelled) return;
      const root = rootRef.current;
      if (!root) return;
      const headers = root.querySelectorAll('div[style*="cursor: pointer"]');
      // The TSX renders entry titles in the inner header div. Match by title
      // text or by data fallback. Simpler: match by checking which header's
      // title text corresponds to the targeted id's title via the entries
      // table — but we don't have that mapping in the wrapper. Use a
      // different anchor: the SPA's headers each contain the entry's title
      // text; the click handler toggles `expandedId`. We look for a header
      // whose element-tree contains the target via a synthetic data attribute
      // we attach below.
      const all = Array.from(headers) as HTMLElement[];
      const m = all.find((el) => el.dataset.eqrId === targetId);
      if (m) {
        m.scrollIntoView({ behavior: 'smooth', block: 'start' });
        m.click();
      }
      clearEpicReferenceFocus();
    }, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(tick);
    };
  }, [focus.entryId]);

  // Tag each rendered entry header with its data-eqr-id so the deep-link
  // effect above can find it. The SPA renders the id only as a React key, not
  // in the DOM. We MutationObserver the rendered list and tag headers in
  // document order using the source entries[] array order, which is the same
  // order the SPA renders. (Filter by category changes the order; the deep-
  // link effect resets selectedCat to "all" via the click on a related-pill,
  // but here we only fire on first arrival, so the SPA is in its default
  // selectedCat="all" state with no search — the rendered order matches the
  // source array.) See ENTRY_IDS below for the order.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    function tag(): void {
      const headers = root!.querySelectorAll<HTMLDivElement>('div[style*="cursor: pointer"]');
      headers.forEach((h, i) => {
        if (h.dataset.eqrId) return;
        // Heuristic: tag by index against ENTRY_IDS only when the rendered
        // count matches the source count (no filter / no search). When the
        // user is filtering, headers won't have ids — that's fine, the
        // deep-link effect won't be firing during filter usage.
        if (headers.length === ENTRY_IDS.length) {
          h.dataset.eqrId = ENTRY_IDS[i];
        }
      });
    }
    tag();
    const obs = new MutationObserver(tag);
    obs.observe(root, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div class="epic-reference-shell" ref={rootRef}>
      <BackToLauncherChevron variant="on-light" />
      <EpicQuickReferenceApp />
    </div>
  );
}

// Source-of-truth ordering of entries[] in EpicQuickReferenceApp.tsx.
// Used to tag rendered headers with their entry id so deep-links can find
// them. If the SPA is iterated and the order changes, update this list.
const ENTRY_IDS = [
  // ORDERS
  'create-smartset', 'star-order', 'link-dx-order', 'eprescribe',
  'med-renewal', 'place-referral', 'med-reconciliation',
  // NOTES
  'create-smartphrase', 'find-smartphrase', 'create-smartlist',
  'note-from-template', 'pull-results-note',
  // INBOX
  'inbasket-organize', 'inbasket-quickaction', 'mychart-respond',
  'result-notification', 'staff-message',
  // CARE GAPS
  'find-care-gaps', 'close-care-gap', 'caregap-orderset',
  'caregap-not-firing', 'update-problem-list', 'update-social-hx',
  // CHART
  'chart-review-filter', 'use-synopsis', 'use-snapshot', 'care-everywhere',
  // WORKFLOW
  'close-encounter', 'link-dx-billing', 'telephone-encounter',
  // PERSONALIZE
  'customize-tabs', 'customize-sidebar', 'customize-schedule',
  'keyboard-shortcuts',
];
