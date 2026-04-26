// BSP-driven workspace renderer with rearrangement gestures.
//
// Splitter / corner drag: deform existing layout (resize bubbles).
// Long-press a bubble's body: lift it. Original slot collapses (BSP removeLeaf),
//   neighbors flow in. Ghost follows finger.
// Drop on a target leaf: that leaf splits to make room (left/right/top/bottom
//   based on pointer position within target). Drop on a placeholder: placeholder
//   is consumed and the dropped bubble takes the slot exactly.
// + button (top-right): summon a placeholder by splitting the largest leaf.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { AttachRelationship, BubbleInstance, BubblePrimitiveType, ChatProps, GridPlacement, MiniBubble, WorkspaceConfig } from '../types';
import { Cell } from '../cell/Cell';
import { getPrimitiveComponent } from '../bubbles';
import type { SeedDict } from '../data/seedResolver';
import { resolveSeedTokens } from '../data/seedResolver';
import {
  buildBSP,
  renderBSP,
  setSplitAt,
  findCorners,
  removeLeaf,
  splitLeafInsert,
  splitRootInsert,
  replaceLeaf,
  findLargestLeaf,
  type BSPRoot,
  type RenderedSplit,
  type BSPCorner,
  type RenderedLeaf,
} from '../mechanics/bsp';

interface Props {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
}

import { persistentWorkspaceStates, type BubbleBundle } from './workspaceState';

const DEFAULT_MIN_W = 1;
const DEFAULT_MIN_H = 1;
const CELL_MIN_W = 1;
const CELL_MIN_H = 1;
const LONG_PRESS_MS = 380;
const LONG_PRESS_MOVE_TOLERANCE_PX = 8;

interface LiftedState {
  bubbleId: string;
  ghostW: number;
  ghostH: number;
  offsetX: number;
  offsetY: number;
  pointerX: number;
  pointerY: number;
  originalRoot: BSPRoot;
}

let _placeholderSeq = 0;

export function BspWorkspace({ workspace, seeds }: Props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid = workspace.layoutHints.grid;
  const placements = workspace.layoutHints.placements;

  // Bubble registry — load persisted state for this workspace if present,
  // otherwise initialize from JSON. Persistence makes bubbles tangible.
  const [registry, setRegistry] = useState<Record<string, BubbleBundle>>(() => {
    const stored = persistentWorkspaceStates.get(workspace.id);
    return stored ? stored.registry : initialRegistry(workspace, placements);
  });

  const [root, setRoot] = useState<BSPRoot | null>(() => {
    const stored = persistentWorkspaceStates.get(workspace.id);
    return stored ? stored.root : null;
  });

  // On workspace change, swap in this workspace's persisted state (if any).
  useEffect(() => {
    const stored = persistentWorkspaceStates.get(workspace.id);
    if (stored) {
      setRegistry(stored.registry);
      setRoot(stored.root);
    } else {
      setRegistry(initialRegistry(workspace, placements));
      setRoot(null); // will be rebuilt by the buildBSP effect below
    }
    setLifted(null);
  }, [workspace.id]);
  const [isWallDragging, setIsWallDragging] = useState(false);
  const [lifted, setLifted] = useState<LiftedState | null>(null);
  const [attachMenu, setAttachMenu] = useState<{
    sourceBubbleId: string;
    sourceTitle: string;
    chatId: string;
    chatTitle: string;
    originalRoot: BSPRoot;
    anchorX: number;
    anchorY: number;
  } | null>(null);
  const [vaultOpen, setVaultOpen] = useState<{ placeholderId: string } | null>(null);

  // Build BSP from registry only when we don't already have one (first entry
  // to a workspace). Persisted root is preserved across switches.
  useEffect(() => {
    if (root !== null) return;
    try {
      const built = buildBSP(
        Object.entries(registry).map(([id, b]) => ({
          id,
          placement: b.placement,
          minW: b.minW,
          minH: b.minH,
        })),
        { col: 0, row: 0, w: grid.cols, h: grid.rows },
      );
      setRoot(built);
    } catch (err) {
      console.warn('BSP construction failed', err);
    }
  }, [root, workspace.id]);

  // Persist registry + root to the module-level map whenever they change so
  // the next entry to this workspace finds the same bubbles in the same
  // arrangement, with the same attached memories and chat history.
  useEffect(() => {
    if (root) {
      persistentWorkspaceStates.set(workspace.id, { registry, root });
    }
  }, [registry, root, workspace.id]);

  // === Coord helpers ===
  function pxToCol(px: number): number {
    const c = containerRef.current;
    if (!c) return 0;
    const rect = c.getBoundingClientRect();
    return ((px - rect.left) / rect.width) * grid.cols;
  }
  function pxToRow(py: number): number {
    const c = containerRef.current;
    if (!c) return 0;
    const rect = c.getBoundingClientRect();
    return ((py - rect.top) / rect.height) * grid.rows;
  }

  // === Splitter / corner drag (existing behavior) ===
  const wallDragRef = useRef<{ kind: 'splitter' | 'corner'; ids: string[] } | null>(null);
  function onSplitterDown(e: PointerEvent, split: RenderedSplit): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    wallDragRef.current = { kind: 'splitter', ids: [split.id] };
    setIsWallDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }
  function onSplitterMove(e: PointerEvent, split: RenderedSplit): void {
    if (!wallDragRef.current || !root) return;
    const target = split.orientation === 'h' ? pxToRow(e.clientY) : pxToCol(e.clientX);
    setRoot((prev) => (prev ? setSplitAt(prev, split.id, target) : prev));
  }
  function onSplitterUp(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    wallDragRef.current = null;
    setIsWallDragging(false);
  }
  function onCornerDown(e: PointerEvent, corner: BSPCorner): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    wallDragRef.current = { kind: 'corner', ids: [corner.hSplitId, corner.vSplitId] };
    setIsWallDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }
  function onCornerMove(e: PointerEvent, corner: BSPCorner): void {
    if (!wallDragRef.current || !root) return;
    const newRow = pxToRow(e.clientY);
    const newCol = pxToCol(e.clientX);
    setRoot((prev) => {
      if (!prev) return prev;
      const afterH = setSplitAt(prev, corner.hSplitId, newRow);
      return setSplitAt(afterH, corner.vSplitId, newCol);
    });
  }
  function onCornerUp(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    wallDragRef.current = null;
    setIsWallDragging(false);
  }

  // === Long-press lift ===
  const longPressRef = useRef<{
    bubbleId: string;
    timer: number | null;
    startX: number;
    startY: number;
    leafRect: DOMRect | null;
  } | null>(null);

  function onBubblePointerDown(e: PointerEvent, leaf: RenderedLeaf, leafEl: HTMLElement): void {
    if (lifted || isWallDragging) return;
    // Capture so the long-press timer is bound to *this* press, regardless of
    // where the pointer wanders next. Splitter/corner handlers still take
    // priority via z-index for direct hits on those elements.
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    longPressRef.current = {
      bubbleId: leaf.bubbleId,
      timer: window.setTimeout(() => triggerLift(leaf, leafEl), LONG_PRESS_MS),
      startX: e.clientX,
      startY: e.clientY,
      leafRect: leafEl.getBoundingClientRect(),
    };
  }
  function onBubblePointerMove(e: PointerEvent): void {
    const lp = longPressRef.current;
    if (!lp) return;
    const dx = Math.abs(e.clientX - lp.startX);
    const dy = Math.abs(e.clientY - lp.startY);
    if (dx > LONG_PRESS_MOVE_TOLERANCE_PX || dy > LONG_PRESS_MOVE_TOLERANCE_PX) {
      // Movement cancels the long-press
      if (lp.timer) window.clearTimeout(lp.timer);
      longPressRef.current = null;
    }
  }
  function onBubblePointerUp(e: PointerEvent): void {
    const lp = longPressRef.current;
    if (lp?.timer) {
      window.clearTimeout(lp.timer);
      // Long-press timer hadn't fired yet → this was a tap. Placeholders open
      // the vault on tap; other bubble types do nothing on tap (yet).
      const bundle = registry[lp.bubbleId];
      if (bundle?.instance?.type === 'placeholder') {
        setVaultOpen({ placeholderId: lp.bubbleId });
      }
    }
    longPressRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
  }

  function triggerLift(leaf: RenderedLeaf, _leafEl: HTMLElement): void {
    if (!root) return;
    const lp = longPressRef.current;
    if (!lp) return;
    const rect = lp.leafRect ?? _leafEl.getBoundingClientRect();
    const oldRoot = root;
    try {
      const removed = removeLeaf(root, leaf.bubbleId);
      setRoot(removed);
      setLifted({
        bubbleId: leaf.bubbleId,
        ghostW: rect.width,
        ghostH: rect.height,
        offsetX: lp.startX - rect.left,
        offsetY: lp.startY - rect.top,
        pointerX: lp.startX,
        pointerY: lp.startY,
        originalRoot: oldRoot,
      });
    } catch (err) {
      // Last leaf — can't lift
      console.warn('cannot lift the only bubble in the workspace', err);
    }
    longPressRef.current = null;
  }

  // While lifted: track pointer at window level + commit on release
  useEffect(() => {
    if (!lifted) return;
    function onMove(e: PointerEvent): void {
      setLifted((prev) => (prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY } : null));
    }
    function onUp(e: PointerEvent): void {
      handleDrop(e);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [lifted]);

  function handleDrop(e: PointerEvent): void {
    setLifted((current) => {
      if (!current || !root) return current;
      const liftedBundle = registry[current.bubbleId];
      if (!liftedBundle) return null;

      // 1) Screen-edge drop — segmented by which bubbles actually touch that
      //    edge in the pointer's perpendicular position. If two bubbles stack
      //    vertically against the left edge, the left edge has two zones;
      //    dropping in either becomes an in-bubble left-side split of that
      //    specific bubble (not a full-height column).
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const EDGE_PX = 24;
        const px = e.clientX - containerRect.left;
        const py = e.clientY - containerRect.top;
        let edge: 'top' | 'bottom' | 'left' | 'right' | null = null;
        if (py < EDGE_PX) edge = 'top';
        else if (py > containerRect.height - EDGE_PX) edge = 'bottom';
        else if (px < EDGE_PX) edge = 'left';
        else if (px > containerRect.width - EDGE_PX) edge = 'right';
        if (edge) {
          const col = pxToCol(e.clientX);
          const row = pxToRow(e.clientY);
          const { leaves } = renderBSP(root);
          // Find the leaf adjacent to this edge whose perpendicular span
          // contains the pointer.
          const segment = leaves.find((l) => {
            if (edge === 'top') return l.region.row === 0 && col >= l.region.col && col < l.region.col + l.region.w;
            if (edge === 'bottom') return l.region.row + l.region.h === grid.rows && col >= l.region.col && col < l.region.col + l.region.w;
            if (edge === 'left') return l.region.col === 0 && row >= l.region.row && row < l.region.row + l.region.h;
            return l.region.col + l.region.w === grid.cols && row >= l.region.row && row < l.region.row + l.region.h;
          });
          if (segment) {
            const after = splitLeafInsert(
              root,
              segment.bubbleId,
              edge,
              current.bubbleId,
              liftedBundle.minW,
              liftedBundle.minH,
              0.3,
            );
            setRoot(after);
            return null;
          }
          // Fallback (shouldn't normally happen — workspace is fully tiled).
          const after = splitRootInsert(root, edge, current.bubbleId, liftedBundle.minW, liftedBundle.minH, 0.3);
          setRoot(after);
          return null;
        }
      }

      // 2) In-bubble drop. Split point follows the pointer (not 50/50), and
      //    snaps to nearby existing alignment lines so the dropped bubble
      //    naturally lines up with the rest of the layout.
      const col = pxToCol(e.clientX);
      const row = pxToRow(e.clientY);
      const { leaves, splits } = renderBSP(root);
      const target = leaves.find(
        (l) =>
          col >= l.region.col &&
          col < l.region.col + l.region.w &&
          row >= l.region.row &&
          row < l.region.row + l.region.h,
      );
      if (!target) {
        setRoot(current.originalRoot);
        return null;
      }

      const targetBundle = registry[target.bubbleId];

      // Drop on chat: open the attach-relationship menu instead of splitting.
      // The lifted bubble sits in limbo (BSP already excludes it) until the
      // user picks a relationship or cancels.
      if (
        targetBundle?.instance?.type === 'llm-chat' &&
        current.bubbleId !== target.bubbleId
      ) {
        const sourceBundle = registry[current.bubbleId];
        const sourceTitle = sourceBundle?.instance?.title ?? sourceBundle?.cellRef?.id ?? current.bubbleId;
        setAttachMenu({
          sourceBubbleId: current.bubbleId,
          sourceTitle,
          chatId: target.bubbleId,
          chatTitle: targetBundle.instance.title,
          originalRoot: current.originalRoot,
          anchorX: e.clientX,
          anchorY: e.clientY,
        });
        return null;
      }

      // Drop on placeholder: consume the placeholder, take its exact slot.
      if (targetBundle?.instance?.type === 'placeholder') {
        const after = replaceLeaf(root, target.bubbleId, current.bubbleId);
        setRoot(after);
        setRegistry((prev) => {
          const next = { ...prev };
          delete next[target.bubbleId];
          return next;
        });
        return null;
      }

      // Side = closest edge of target.
      const relX = (col - target.region.col) / target.region.w;
      const relY = (row - target.region.row) / target.region.h;
      const distLeft = relX;
      const distRight = 1 - relX;
      const distTop = relY;
      const distBottom = 1 - relY;
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      let side: 'left' | 'right' | 'top' | 'bottom';
      if (minDist === distLeft) side = 'left';
      else if (minDist === distRight) side = 'right';
      else if (minDist === distTop) side = 'top';
      else side = 'bottom';

      // Desired split position = pointer's grid coord on the perpendicular axis.
      const orientation: 'v' | 'h' = side === 'left' || side === 'right' ? 'v' : 'h';
      const desiredSplitAt = orientation === 'v' ? col : row;

      // Snap to a nearby existing splitter line in the same orientation —
      // gives "drop and align with what's already there" behavior.
      const SNAP_THRESHOLD = 1.5;
      let snappedSplitAt = desiredSplitAt;
      let bestDist = SNAP_THRESHOLD;
      for (const s of splits) {
        if (s.orientation !== orientation) continue;
        const dist = Math.abs(s.splitAt - desiredSplitAt);
        if (dist < bestDist) {
          bestDist = dist;
          snappedSplitAt = s.splitAt;
        }
      }

      // Convert split position to a ratio of target's relevant dimension,
      // clamped so neither half collapses past min size.
      let ratio: number;
      if (side === 'left') {
        ratio = (snappedSplitAt - target.region.col) / target.region.w;
      } else if (side === 'right') {
        ratio = (target.region.col + target.region.w - snappedSplitAt) / target.region.w;
      } else if (side === 'top') {
        ratio = (snappedSplitAt - target.region.row) / target.region.h;
      } else {
        ratio = (target.region.row + target.region.h - snappedSplitAt) / target.region.h;
      }
      ratio = Math.max(0.1, Math.min(0.9, ratio));

      const after = splitLeafInsert(
        root,
        target.bubbleId,
        side,
        current.bubbleId,
        liftedBundle.minW,
        liftedBundle.minH,
        ratio,
      );
      setRoot(after);
      return null;
    });
  }

  // === Attach to chat ===
  function commitAttach(rel: AttachRelationship): void {
    if (!attachMenu) return;
    const { sourceBubbleId, chatId, originalRoot, sourceTitle } = attachMenu;
    // Add a mini-bubble to the chat's brain (mutate registry).
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      const oldProps = chat.instance.props as ChatProps;
      const oldMini: MiniBubble[] = oldProps.brain?.miniBubbles ?? [];
      const newMini: MiniBubble = {
        id: `mb-${sourceBubbleId}-${rel}-${Date.now()}`,
        label: sourceTitle,
        source: sourceBubbleId,
        pinned: rel === 'edit' || rel === 'summary',
        relationship: rel,
      };
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: {
              ...oldProps,
              brain: {
                miniBubbles: [...oldMini, newMini],
                hydrationRules: oldProps.brain?.hydrationRules ?? {},
              },
            },
          },
        },
      };
    });
    if (rel === 'summary') {
      // Source is consumed — remove from registry; BSP already excludes it.
      setRegistry((prev) => {
        const next = { ...prev };
        delete next[sourceBubbleId];
        return next;
      });
    } else {
      // Source returns to its original slot (still on screen, now linked).
      setRoot(originalRoot);
    }
    setAttachMenu(null);
  }

  function cancelAttach(): void {
    if (!attachMenu) return;
    setRoot(attachMenu.originalRoot);
    setAttachMenu(null);
  }

  function updateChatMessages(chatId: string, messages: unknown[]): void {
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: { ...chat.instance.props, messages },
          },
        },
      };
    });
  }

  function dismissMini(chatId: string, miniId: string): void {
    setRegistry((prev) => {
      const chat = prev[chatId];
      if (!chat?.instance) return prev;
      const oldProps = chat.instance.props as ChatProps;
      const oldMini: MiniBubble[] = oldProps.brain?.miniBubbles ?? [];
      return {
        ...prev,
        [chatId]: {
          ...chat,
          instance: {
            ...chat.instance,
            props: {
              ...oldProps,
              brain: {
                miniBubbles: oldMini.filter((m) => m.id !== miniId),
                hydrationRules: oldProps.brain?.hydrationRules ?? {},
              },
            },
          },
        },
      };
    });
  }

  // === Vault (tap a placeholder to assign a real type) ===
  function pickFromVault(type: BubblePrimitiveType, label: string): void {
    if (!vaultOpen) return;
    const id = vaultOpen.placeholderId;
    setRegistry((prev) => {
      const ph = prev[id];
      if (!ph?.instance) return prev;
      return {
        ...prev,
        [id]: {
          ...ph,
          instance: {
            ...ph.instance,
            type,
            title: label,
            props: {},
          },
        },
      };
    });
    setVaultOpen(null);
  }

  // === Summon placeholder ===
  function summonPlaceholder(): void {
    if (!root) return;
    const target = findLargestLeaf(root);
    if (!target) return;
    const id = `placeholder-${++_placeholderSeq}`;
    const newBundle: BubbleBundle = {
      kind: 'standalone',
      cellRef: null,
      instance: {
        id,
        type: 'placeholder',
        title: 'Empty slot',
        props: {},
        resize: { initial: 'm', states: {} },
      },
      placement: { col: 0, row: 0, width: 1, height: 1 }, // not used post-insert
      minW: DEFAULT_MIN_W,
      minH: DEFAULT_MIN_H,
    };
    setRegistry((prev) => ({ ...prev, [id]: newBundle }));
    setRoot(splitLeafInsert(root, target.bubbleId, 'right', id, DEFAULT_MIN_W, DEFAULT_MIN_H, 0.5));
  }

  // === Render ===
  const rendered = root ? renderBSP(root) : null;
  const corners = root ? findCorners(root) : [];

  const resolvedById = useMemo(() => {
    const m: Record<string, BubbleInstance> = {};
    for (const [id, b] of Object.entries(registry)) {
      if (b.instance) m[id] = { ...b.instance, props: resolveSeedTokens(b.instance.props, seeds) };
    }
    return m;
  }, [registry, seeds]);

  return (
    <div
      ref={containerRef}
      class={`bsp-workspace${lifted ? ' is-lifting' : ''}`}
      style={{ position: 'fixed', inset: 0, padding: 0, background: 'var(--bg)' }}
    >
      {rendered === null && (
        <div style={{ padding: 24, color: 'var(--ink-faint)' }}>
          BSP layout failed to construct.
        </div>
      )}

      {/* Leaves */}
      {rendered?.leaves.map((leaf) => {
        const b = registry[leaf.bubbleId];
        if (!b) return null;
        const left = (leaf.region.col / grid.cols) * 100;
        const top = (leaf.region.row / grid.rows) * 100;
        const width = (leaf.region.w / grid.cols) * 100;
        const height = (leaf.region.h / grid.rows) * 100;
        const isPlaceholder = b.instance?.type === 'placeholder';
        const baseClass = b.kind === 'cell' ? 'cell' : 'bubble';
        const phClass = isPlaceholder ? ' bubble--placeholder' : '';
        const isHidden = lifted?.bubbleId === leaf.bubbleId;

        const style: JSX.CSSProperties = {
          position: 'absolute',
          left: `calc(${left}% + 4px)`,
          top: `calc(${top}% + 4px)`,
          width: `calc(${width}% - 8px)`,
          height: `calc(${height}% - 8px)`,
          transition: isWallDragging
            ? 'none'
            : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1), width 240ms cubic-bezier(0.2, 0.8, 0.2, 1), height 240ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms',
          overflow: 'hidden',
          opacity: isHidden ? 0 : 1,
          touchAction: 'none',
        };

        const handlers = {
          onPointerDown: (e: PointerEvent) =>
            onBubblePointerDown(e, leaf, e.currentTarget as HTMLElement),
          onPointerMove: onBubblePointerMove,
          onPointerUp: onBubblePointerUp,
          onPointerCancel: onBubblePointerUp,
        };

        if (b.kind === 'cell' && b.cellRef) {
          return (
            <div key={leaf.bubbleId} class={`${baseClass}${phClass}`} style={style} {...handlers}>
              <Cell cell={b.cellRef} workspace={workspace} seeds={seeds} />
            </div>
          );
        }
        const inst = resolvedById[leaf.bubbleId];
        if (!inst) return null;
        const Comp = getPrimitiveComponent(inst.type);
        const extraProps = inst.type === 'llm-chat'
          ? {
              onDismissMini: (miniId: string) => dismissMini(leaf.bubbleId, miniId),
              onMessagesChange: (messages: unknown[]) => updateChatMessages(leaf.bubbleId, messages),
            }
          : {};
        return (
          <div key={leaf.bubbleId} class={`${baseClass}${phClass}`} style={style} {...handlers}>
            <Comp instance={inst} seeds={seeds} {...extraProps} />
          </div>
        );
      })}

      {/* Splitter walls */}
      {rendered?.splits.map((s) => (
        <SplitterHandle
          key={s.id}
          split={s}
          gridCols={grid.cols}
          gridRows={grid.rows}
          isDragging={isWallDragging}
          onPointerDown={(e) => onSplitterDown(e, s)}
          onPointerMove={(e) => onSplitterMove(e, s)}
          onPointerUp={onSplitterUp}
        />
      ))}

      {/* Corner handles */}
      {corners.map((c, i) => (
        <CornerHandle
          key={`${c.hSplitId}-${c.vSplitId}-${i}`}
          corner={c}
          gridCols={grid.cols}
          gridRows={grid.rows}
          isDragging={isWallDragging}
          onPointerDown={(e) => onCornerDown(e, c)}
          onPointerMove={(e) => onCornerMove(e, c)}
          onPointerUp={onCornerUp}
        />
      ))}

      {/* Ghost bubble (during lift) */}
      {lifted && (() => {
        const b = registry[lifted.bubbleId];
        if (!b) return null;
        if (b.kind === 'cell' && b.cellRef) {
          return (
            <div
              key="ghost"
              class="cell bubble--ghost"
              style={{
                position: 'fixed',
                left: lifted.pointerX - lifted.offsetX,
                top: lifted.pointerY - lifted.offsetY,
                width: lifted.ghostW,
                height: lifted.ghostH,
                pointerEvents: 'none',
                zIndex: 200,
                transform: 'scale(1.04)',
                opacity: 0.92,
                boxShadow: 'var(--shadow-2)',
                transition: 'none',
              }}
            >
              <Cell cell={b.cellRef} workspace={workspace} seeds={seeds} />
            </div>
          );
        }
        const inst = resolvedById[lifted.bubbleId];
        if (!inst) return null;
        const Comp = getPrimitiveComponent(inst.type);
        return (
          <div
            key="ghost"
            class="bubble bubble--ghost"
            style={{
              position: 'fixed',
              left: lifted.pointerX - lifted.offsetX,
              top: lifted.pointerY - lifted.offsetY,
              width: lifted.ghostW,
              height: lifted.ghostH,
              pointerEvents: 'none',
              zIndex: 200,
              transform: 'scale(1.04)',
              opacity: 0.92,
              boxShadow: 'var(--shadow-2)',
              transition: 'none',
            }}
          >
            <Comp instance={inst} seeds={seeds} />
          </div>
        );
      })()}

      {/* Edge drop zones (visible during lift) — segmented per bubble that touches each edge */}
      {lifted && rendered && (
        <>
          {rendered.leaves
            .filter((l) => l.region.row === 0)
            .map((l) => (
              <div
                key={`et-${l.bubbleId}`}
                class="bsp-edge bsp-edge--top"
                style={{
                  left: `calc(${(l.region.col / grid.cols) * 100}% + 3px)`,
                  width: `calc(${(l.region.w / grid.cols) * 100}% - 6px)`,
                }}
              />
            ))}
          {rendered.leaves
            .filter((l) => l.region.row + l.region.h === grid.rows)
            .map((l) => (
              <div
                key={`eb-${l.bubbleId}`}
                class="bsp-edge bsp-edge--bottom"
                style={{
                  left: `calc(${(l.region.col / grid.cols) * 100}% + 3px)`,
                  width: `calc(${(l.region.w / grid.cols) * 100}% - 6px)`,
                }}
              />
            ))}
          {rendered.leaves
            .filter((l) => l.region.col === 0)
            .map((l) => (
              <div
                key={`el-${l.bubbleId}`}
                class="bsp-edge bsp-edge--left"
                style={{
                  top: `calc(${(l.region.row / grid.rows) * 100}% + 3px)`,
                  height: `calc(${(l.region.h / grid.rows) * 100}% - 6px)`,
                }}
              />
            ))}
          {rendered.leaves
            .filter((l) => l.region.col + l.region.w === grid.cols)
            .map((l) => (
              <div
                key={`er-${l.bubbleId}`}
                class="bsp-edge bsp-edge--right"
                style={{
                  top: `calc(${(l.region.row / grid.rows) * 100}% + 3px)`,
                  height: `calc(${(l.region.h / grid.rows) * 100}% - 6px)`,
                }}
              />
            ))}
        </>
      )}

      {/* Vault — tap a placeholder to assign it a real bubble type */}
      {vaultOpen && (
        <div class="attach-menu-backdrop" onClick={() => setVaultOpen(null)}>
          <div class="vault" onClick={(e) => e.stopPropagation()}>
            <div class="vault__hdr">
              <strong>Vault</strong>
              <div class="vault__sub">pick what this empty slot becomes</div>
            </div>
            <div class="vault__grid">
              {VAULT_ITEMS.map((it) => (
                <button key={it.type} class="vault__item" onClick={() => pickFromVault(it.type, it.label)}>
                  <span class="vault__glyph">{it.glyph}</span>
                  <span class="vault__lbl">{it.label}</span>
                  <span class="vault__desc">{it.desc}</span>
                </button>
              ))}
            </div>
            <button class="attach-menu__cancel" onClick={() => setVaultOpen(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Attach-to-chat menu (modal) */}
      {attachMenu && (
        <div class="attach-menu-backdrop" onClick={cancelAttach}>
          <div class="attach-menu" onClick={(e) => e.stopPropagation()}>
            <div class="attach-menu__hdr">
              <strong>{attachMenu.sourceTitle}</strong> → <em>{attachMenu.chatTitle}</em>
              <div class="attach-menu__sub">What should I do with this?</div>
            </div>
            <button class="attach-menu__opt" onClick={() => commitAttach('deep')}>
              <span class="attach-menu__glyph">📖</span>
              <span class="attach-menu__lbl">Read deeply</span>
              <span class="attach-menu__desc">full content in active context · ready for open-book questions</span>
            </button>
            <button class="attach-menu__opt" onClick={() => commitAttach('summary')}>
              <span class="attach-menu__glyph">📝</span>
              <span class="attach-menu__lbl">Scan + summarize</span>
              <span class="attach-menu__desc">commit a summary to memory · dismiss the original</span>
            </button>
            <button class="attach-menu__opt" onClick={() => commitAttach('reference')}>
              <span class="attach-menu__glyph">🔗</span>
              <span class="attach-menu__lbl">Reference only</span>
              <span class="attach-menu__desc">keep available · don't actively read</span>
            </button>
            <button class="attach-menu__opt" onClick={() => commitAttach('edit')}>
              <span class="attach-menu__glyph">✏️</span>
              <span class="attach-menu__lbl">Editable</span>
              <span class="attach-menu__desc">I have write access · I'll modify this</span>
            </button>
            <button class="attach-menu__cancel" onClick={cancelAttach}>Cancel</button>
          </div>
        </div>
      )}

      {/* Summon button */}
      <button
        class="bsp-summon"
        onClick={summonPlaceholder}
        title="Summon empty bubble"
        aria-label="Summon empty bubble"
      >
        +
      </button>
    </div>
  );
}

interface VaultItem {
  type: BubblePrimitiveType;
  label: string;
  glyph: string;
  desc: string;
}

const VAULT_ITEMS: VaultItem[] = [
  { type: 'markdown', label: 'Markdown notes', glyph: '📄', desc: 'free-text notes, agendas, plans' },
  { type: 'spreadsheet', label: 'Spreadsheet', glyph: '📊', desc: 'tabular data; exportable to Excel' },
  { type: 'email-thread', label: 'Email thread', glyph: '✉️', desc: 'discussion thread + drafting' },
  { type: 'faq-block', label: 'FAQ / reference', glyph: '📚', desc: 'expandable Q&A reference' },
  { type: 'blueprint-tree', label: 'Phased blueprint', glyph: '🗂', desc: 'phased checklist with status pills' },
  { type: 'dashboard-numbers', label: 'Metrics', glyph: '📈', desc: 'numbers + trends, resize-aware' },
  { type: 'meeting-tracker', label: 'Meeting tracker', glyph: '📅', desc: 'past + planned meetings, summaries' },
  { type: 'glidepath-chart', label: 'Glidepath', glyph: '🎯', desc: 'goal vs. current with target line' },
];

function initialRegistry(workspace: WorkspaceConfig, placements: Record<string, GridPlacement>): Record<string, BubbleBundle> {
  const m: Record<string, BubbleBundle> = {};
  for (const cell of workspace.cells) {
    const p = placements[cell.id];
    if (!p) continue;
    m[cell.id] = {
      kind: 'cell',
      cellRef: cell,
      instance: null,
      placement: p,
      minW: CELL_MIN_W,
      minH: CELL_MIN_H,
    };
  }
  for (const b of workspace.standalones) {
    const p = placements[b.id];
    if (!p) continue;
    m[b.id] = {
      kind: 'standalone',
      cellRef: null,
      instance: b,
      placement: p,
      minW: DEFAULT_MIN_W,
      minH: DEFAULT_MIN_H,
    };
  }
  return m;
}

interface SplitterProps {
  split: RenderedSplit;
  gridCols: number;
  gridRows: number;
  isDragging: boolean;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
}

function SplitterHandle({ split, gridCols, gridRows, isDragging, onPointerDown, onPointerMove, onPointerUp }: SplitterProps): JSX.Element {
  const horizontal = split.orientation === 'h';
  const transition = isDragging ? 'none' : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1)';
  const style: JSX.CSSProperties = horizontal
    ? {
        position: 'absolute',
        left: `${(split.lineCol1 / gridCols) * 100}%`,
        width: `${((split.lineCol2 - split.lineCol1) / gridCols) * 100}%`,
        top: `calc(${(split.splitAt / gridRows) * 100}% - 8px)`,
        height: 16,
        cursor: 'row-resize',
        touchAction: 'none',
        zIndex: 50,
        transition,
      }
    : {
        position: 'absolute',
        top: `${(split.lineRow1 / gridRows) * 100}%`,
        height: `${((split.lineRow2 - split.lineRow1) / gridRows) * 100}%`,
        left: `calc(${(split.splitAt / gridCols) * 100}% - 8px)`,
        width: 16,
        cursor: 'col-resize',
        touchAction: 'none',
        zIndex: 50,
        transition,
      };
  return (
    <div
      class={`bsp-splitter bsp-splitter--${split.orientation}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}

interface CornerProps {
  corner: BSPCorner;
  gridCols: number;
  gridRows: number;
  isDragging: boolean;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
}

function CornerHandle({ corner, gridCols, gridRows, isDragging, onPointerDown, onPointerMove, onPointerUp }: CornerProps): JSX.Element {
  const transition = isDragging ? 'none' : 'left 240ms cubic-bezier(0.2, 0.8, 0.2, 1), top 240ms cubic-bezier(0.2, 0.8, 0.2, 1)';
  const style: JSX.CSSProperties = {
    position: 'absolute',
    left: `calc(${(corner.col / gridCols) * 100}% - 14px)`,
    top: `calc(${(corner.row / gridRows) * 100}% - 14px)`,
    width: 28,
    height: 28,
    cursor: 'move',
    touchAction: 'none',
    zIndex: 60,
    borderRadius: '50%',
    transition,
  };
  return (
    <div
      class="bsp-corner"
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}
