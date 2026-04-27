// Shared row component for clinical-module checklist + escalation bubbles.
// Single tap-target row with a marker glyph (numbered square or "!" circle)
// and a statement; highlight + left-stripe when focused.

import type { JSX } from 'preact';

interface ModuleRowProps {
  statement: string;
  marker: string;
  markerShape: 'square' | 'circle';
  accent: string;
  focused: boolean;
  onClick: () => void;
}

export function ModuleRow({ statement, marker, markerShape, accent, focused, onClick }: ModuleRowProps): JSX.Element {
  return (
    <button
      type="button"
      class="cm-row"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr',
        gap: 8,
        alignItems: 'start',
        textAlign: 'left',
        background: focused ? 'rgba(0,0,0,0.04)' : 'transparent',
        border: 'none',
        borderLeft: focused ? `3px solid ${accent}` : '3px solid transparent',
        padding: '6px 8px',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 12.5,
        lineHeight: 1.4,
        opacity: focused ? 1 : 0.9,
        borderRadius: 4,
        transition: 'background 160ms, opacity 160ms, border-color 160ms',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: markerShape === 'circle' ? '50%' : 4,
          border: `1.5px solid ${accent}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          color: accent,
          marginTop: 1,
        }}
      >
        {marker}
      </span>
      <span>{statement}</span>
    </button>
  );
}
