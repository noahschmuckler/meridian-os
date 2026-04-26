// Brain bubble — the LLM's visible context as a Windows-task-manager-style
// status bar. Two modes:
//   - bar (default): just a colored progress bar, no labels.
//   - task: rows of (name, type, % context).
//
// Tap the bar (off any segment) or tap any row to toggle modes. Hover a bar
// segment for a floating-row tooltip. Tap a segment or a row for a contextual
// menu (Read deeply / Compress / Toggle editable / Dismiss), filtered to the
// actions that apply to that segment.
//
// Slice 2 (later): corner edit-icon → full editor; gentle continuous animation
// + state-change color shift on context churn.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { AttachRelationship, BrainBubbleConfig, MiniBubble } from '../types';

// Approximate share of the LLM context window each relationship type
// occupies. Hand-tuned for v1; real implementation would use token counts.
// 'held' is intentionally tiny — title + a sentence, the executive-assistant
// "hold this, I'll ask later" mode.
const REL_WEIGHT: Record<AttachRelationship, number> = {
  deep: 0.25,
  edit: 0.18,
  summary: 0.04,
  held: 0.015,
};

const REL_TYPE_LABEL: Record<AttachRelationship, string> = {
  deep: 'complete ingestion',
  summary: 'summarized',
  edit: 'edit allowed',
  held: 'held not read',
};

const REL_FILL_COLOR: Record<AttachRelationship, string> = {
  deep: 'hsl(150, 60%, 35%)',
  edit: 'hsl(30, 60%, 55%)',
  summary: 'hsl(150, 45%, 52%)',
  held: 'hsl(150, 30%, 70%)',
};

const CHAT_HISTORY_COLOR = 'hsl(150, 50%, 60%)';
const COMPACTED_HISTORY_COLOR = 'hsl(200, 35%, 55%)';
const FREE_COLOR = 'hsl(150, 18%, 90%)';

// Persisted state from before the rename may carry 'reference' — coerce to 'held'.
function normalizeRel(rel: MiniBubble['relationship']): AttachRelationship {
  if (rel === 'deep' || rel === 'summary' || rel === 'edit' || rel === 'held') return rel;
  return 'held';
}

type SegmentKind = 'chat-history' | 'compacted-history' | 'mini' | 'free';

interface Segment {
  id: string;
  kind: SegmentKind;
  label: string;
  typeLabel: string;
  weight: number; // raw share (may sum > 1 → overfilled)
  color: string;
  miniId?: string;
  relationship?: AttachRelationship;
}

interface BrainProps {
  brain: BrainBubbleConfig;
  chatHistoryWeight?: number;
  chatCompacted?: boolean;
  onDismissMini?: (miniId: string) => void;
  onSetMiniRelationship?: (miniId: string, rel: AttachRelationship) => void;
  onCompactChat?: () => void;
  onClearChat?: () => void;
}

const DEFAULT_CHAT_HISTORY_WEIGHT = 0.05;

export function BrainBubble({
  brain,
  chatHistoryWeight,
  chatCompacted,
  onDismissMini,
  onSetMiniRelationship,
  onCompactChat,
  onClearChat,
}: BrainProps): JSX.Element {
  const [view, setView] = useState<'bar' | 'task'>('bar');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ segId: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const segments = useMemo<Segment[]>(() => {
    const list: Segment[] = [];
    const histW = chatHistoryWeight ?? DEFAULT_CHAT_HISTORY_WEIGHT;
    if (chatCompacted) {
      list.push({
        id: 'seg-compacted',
        kind: 'compacted-history',
        label: 'Conversation (compacted)',
        typeLabel: 'compacted chat history',
        weight: histW,
        color: COMPACTED_HISTORY_COLOR,
      });
    } else {
      list.push({
        id: 'seg-history',
        kind: 'chat-history',
        label: 'Conversation',
        typeLabel: 'chat history',
        weight: histW,
        color: CHAT_HISTORY_COLOR,
      });
    }
    for (const m of brain.miniBubbles) {
      const rel = normalizeRel(m.relationship);
      list.push({
        id: `seg-${m.id}`,
        kind: 'mini',
        label: m.label,
        typeLabel: REL_TYPE_LABEL[rel],
        weight: REL_WEIGHT[rel],
        color: REL_FILL_COLOR[rel],
        miniId: m.id,
        relationship: rel,
      });
    }
    const totalReal = list.reduce((s, x) => s + x.weight, 0);
    if (totalReal < 1.0) {
      list.push({
        id: 'seg-free',
        kind: 'free',
        label: 'Free context',
        typeLabel: 'free context',
        weight: 1 - totalReal,
        color: FREE_COLOR,
      });
    }
    return list;
  }, [brain.miniBubbles, chatHistoryWeight, chatCompacted]);

  const totalReal = segments.filter((s) => s.kind !== 'free').reduce((s, x) => s + x.weight, 0);
  const overfilled = totalReal > 1.0;
  // Normalize layout positions so segments always tile to 100% of the bar.
  const totalForLayout = segments.reduce((s, x) => s + x.weight, 0);
  const scale = totalForLayout > 0 ? 1.0 / totalForLayout : 0;

  // Cumulative left positions for each segment (in percent).
  const positions: { id: string; left: number; width: number }[] = [];
  {
    let cursor = 0;
    for (const seg of segments) {
      const w = seg.weight * scale * 100;
      positions.push({ id: seg.id, left: cursor, width: w });
      cursor += w;
    }
  }

  // Close menu on outside click.
  useEffect(() => {
    if (!menu) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      setMenu(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menu]);

  function openMenuAt(seg: Segment, e: MouseEvent): void {
    if (seg.kind === 'free') return; // free context has no actions
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenu({ segId: seg.id, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function toggleView(): void {
    setView((v) => (v === 'bar' ? 'task' : 'bar'));
    setMenu(null);
  }

  const segById = new Map(segments.map((s) => [s.id, s]));
  const hoverSeg = hoverId ? segById.get(hoverId) ?? null : null;
  const hoverPos = hoverId ? positions.find((p) => p.id === hoverId) ?? null : null;
  const menuSeg = menu ? segById.get(menu.segId) ?? null : null;

  return (
    <div
      ref={containerRef}
      class={`brain brain--${view}${overfilled ? ' brain--overfilled' : ''}`}
      aria-label="LLM context"
      onClick={toggleView}
    >
      <div class="brain__bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(1, totalReal) * 100)}>
        {positions.map((p) => {
          const seg = segById.get(p.id);
          if (!seg) return null;
          return (
            <div
              key={seg.id}
              class={`brain__bar-seg brain__bar-seg--${seg.kind}`}
              style={{
                left: `${p.left}%`,
                width: `${p.width}%`,
                background: seg.color,
              }}
              onMouseEnter={() => setHoverId(seg.id)}
              onMouseLeave={() => setHoverId((id) => (id === seg.id ? null : id))}
              onClick={(e) => openMenuAt(seg, e)}
            />
          );
        })}
      </div>

      {hoverSeg && hoverPos && view === 'bar' && (
        <div
          class="brain__floating-row"
          style={{ left: `calc(${hoverPos.left + hoverPos.width / 2}% )` }}
        >
          <span class="brain__row-swatch" style={{ background: hoverSeg.color }} />
          <span class="brain__row-name">{hoverSeg.label}</span>
          <span class="brain__row-type">{hoverSeg.typeLabel}</span>
          <span class="brain__row-pct">{pct(hoverSeg.weight)}</span>
        </div>
      )}

      {view === 'task' && (
        <div class="brain__task" onClick={(e) => e.stopPropagation()}>
          {segments.map((seg) => (
            <div
              key={seg.id}
              class={`brain__row brain__row--${seg.kind}`}
              onClick={(e) => openMenuAt(seg, e)}
            >
              <span class="brain__row-swatch" style={{ background: seg.color }} />
              <span class="brain__row-name">{seg.label}</span>
              <span class="brain__row-type">{seg.typeLabel}</span>
              <span class="brain__row-pct">{pct(seg.weight)}</span>
            </div>
          ))}
        </div>
      )}

      {menu && menuSeg && (
        <div
          ref={menuRef}
          class="brain__menu"
          style={{ left: clamp(menu.x, 4, 320), top: menu.y + 6 }}
          onClick={(e) => e.stopPropagation()}
        >
          {menuItemsFor(menuSeg).map((item) => (
            <button
              key={item.key}
              class={`brain__menu-item${item.danger ? ' brain__menu-item--danger' : ''}`}
              onClick={() => {
                runAction(menuSeg, item.key, {
                  onDismissMini,
                  onSetMiniRelationship,
                  onCompactChat,
                  onClearChat,
                });
                setMenu(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type ActionKey = 'read-deeply' | 'compress' | 'toggle-editable' | 'dismiss';

interface MenuItem {
  key: ActionKey;
  label: string;
  danger?: boolean;
}

function menuItemsFor(seg: Segment): MenuItem[] {
  if (seg.kind === 'chat-history') {
    return [
      { key: 'compress', label: 'Compress' },
      { key: 'dismiss', label: 'Clear conversation', danger: true },
    ];
  }
  if (seg.kind === 'compacted-history') {
    return [{ key: 'dismiss', label: 'Clear conversation', danger: true }];
  }
  if (seg.kind === 'mini') {
    const items: MenuItem[] = [];
    if (seg.relationship !== 'deep') items.push({ key: 'read-deeply', label: 'Read deeply' });
    if (seg.relationship !== 'summary') items.push({ key: 'compress', label: 'Compress' });
    items.push({
      key: 'toggle-editable',
      label: seg.relationship === 'edit' ? 'Stop editing' : 'Toggle editable',
    });
    items.push({ key: 'dismiss', label: 'Dismiss', danger: true });
    return items;
  }
  return [];
}

function runAction(
  seg: Segment,
  key: ActionKey,
  cb: {
    onDismissMini?: (miniId: string) => void;
    onSetMiniRelationship?: (miniId: string, rel: AttachRelationship) => void;
    onCompactChat?: () => void;
    onClearChat?: () => void;
  },
): void {
  if (seg.kind === 'chat-history') {
    if (key === 'compress') cb.onCompactChat?.();
    if (key === 'dismiss') cb.onClearChat?.();
    return;
  }
  if (seg.kind === 'compacted-history') {
    if (key === 'dismiss') cb.onClearChat?.();
    return;
  }
  if (seg.kind === 'mini' && seg.miniId) {
    if (key === 'dismiss') cb.onDismissMini?.(seg.miniId);
    if (key === 'read-deeply') cb.onSetMiniRelationship?.(seg.miniId, 'deep');
    if (key === 'compress') cb.onSetMiniRelationship?.(seg.miniId, 'summary');
    if (key === 'toggle-editable') {
      cb.onSetMiniRelationship?.(seg.miniId, seg.relationship === 'edit' ? 'held' : 'edit');
    }
  }
}

function pct(u: number): string {
  const n = u * 100;
  return n < 1 ? '<1%' : `${Math.round(n)}%`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
