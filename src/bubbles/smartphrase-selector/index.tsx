// SmartPhrase selector (Track 4c). Lists the active clinical module's
// `smartphrases[]` registry grouped by delivery status (Ship-ready =
// confirmed / Active in Epic; Future = drafted, activatable next cycle).
// Each phrase expands to its full HPI-compatible text with copy-to-clipboard
// — drop-in ready to paste as an Epic SmartPhrase body. Bracketed [fields]
// are Epic fill-ins and pass through verbatim.
//
// Spawn paths: the green-zone "View all SmartPhrases" affordance in the
// checklist bubble, the clinical-tools card, or a smartphrase_note pill's
// "see all". Reads the workspace-scoped module focus, so it tracks whichever
// module is open.

import { useEffect, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import type { BubbleInstance, ModuleData, ModuleSmartPhrase } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { userModulesSignal } from '../../data/userModules';
import clinicalModulesSeed from '../../data/seed/clinical-modules.json';

const SEED_MODULES: ModuleData[] = (
  ((clinicalModulesSeed as { clinical?: { modules?: ModuleData[] } }).clinical?.modules) ?? []
);

interface SmartphraseSelectorProps {
  initialPhraseId?: string; // optional: open focused on a specific trigger
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId?: string;
  selfBubbleId?: string;
}

export function SmartphraseSelector({ instance, workspaceId = 'clinical-modules' }: Props): JSX.Element {
  const props = (instance.props as unknown as SmartphraseSelectorProps) ?? {};

  const focus = moduleFocusSignal(workspaceId).value;
  const allModules: ModuleData[] = [...SEED_MODULES, ...userModulesSignal.value];
  const activeModule = focus.mode === 'module'
    ? allModules.find((m) => m.module_id === focus.moduleId) ?? null
    : null;

  const phrases = activeModule?.smartphrases ?? [];
  const confirmed = phrases.filter((p) => p.status === 'confirmed');
  const future = phrases.filter((p) => p.status === 'future');

  const [openId, setOpenId] = useState<string | null>(props.initialPhraseId ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reset open state when the module changes out from under us.
  const moduleKey = activeModule?.module_id ?? null;
  useEffect(() => { setOpenId(props.initialPhraseId ?? null); }, [moduleKey]);

  async function copy(p: ModuleSmartPhrase): Promise<void> {
    if (!p.text) return;
    try {
      await navigator.clipboard.writeText(p.text);
      setCopiedId(p.id);
      window.setTimeout(() => setCopiedId((c) => (c === p.id ? null : c)), 1100);
    } catch {
      /* clipboard denied */
    }
  }

  return (
    <div class="smartphrase-selector" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>SmartPhrases</span>
        {activeModule && (
          <span style={{ marginLeft: 8, fontSize: 10.5, opacity: 0.6 }}>
            {activeModule.default_title.split(' — ')[0]} · {phrases.length}
          </span>
        )}
      </div>

      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 14px' }}>
        {!activeModule && (
          <EmptyState message="Open a clinical module to see its documentation SmartPhrases." />
        )}
        {activeModule && phrases.length === 0 && (
          <EmptyState message={`No SmartPhrases defined for ${activeModule.default_title.split(' — ')[0]} yet.`} />
        )}

        {confirmed.length > 0 && (
          <Section label="Ship-ready" hint="Active in Epic — drop-in ready">
            {confirmed.map((p) => (
              <PhraseCard
                key={p.id} phrase={p}
                open={openId === p.id} onToggle={() => setOpenId((o) => (o === p.id ? null : p.id))}
                copied={copiedId === p.id} onCopy={() => copy(p)}
              />
            ))}
          </Section>
        )}

        {future.length > 0 && (
          <Section label="Future" hint="Drafted — activate per build cycle" marginTop={confirmed.length > 0}>
            {future.map((p) => (
              <PhraseCard
                key={p.id} phrase={p}
                open={openId === p.id} onToggle={() => setOpenId((o) => (o === p.id ? null : p.id))}
                copied={copiedId === p.id} onCopy={() => copy(p)}
              />
            ))}
          </Section>
        )}

        {phrases.length > 0 && (
          <div style={{ fontSize: 10, opacity: 0.55, lineHeight: 1.5, marginTop: 14 }}>
            Bracketed <code>[fields]</code> are Epic fill-ins — paste the text as the SmartPhrase body and complete them at sign time.
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }): JSX.Element {
  return <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5, padding: '12px 4px' }}>{message}</div>;
}

function Section({ label, hint, marginTop, children }: {
  label: string; hint: string; marginTop?: boolean; children: ComponentChildren;
}): JSX.Element {
  return (
    <div style={{ marginTop: marginTop ? 16 : 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '0 0 8px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.6 }}>{label}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>{hint}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function PhraseCard({ phrase, open, onToggle, copied, onCopy }: {
  phrase: ModuleSmartPhrase; open: boolean; onToggle: () => void; copied: boolean; onCopy: () => void;
}): JSX.Element {
  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderLeft: '3px solid var(--type-color)',
        borderRadius: 4,
        background: 'rgba(255,255,255,0.55)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        aria-expanded={open}
        style={{
          width: '100%', textAlign: 'left', border: 'none', background: 'transparent',
          cursor: 'pointer', font: 'inherit', color: 'inherit', padding: '9px 12px',
          display: 'flex', flexDirection: 'column', gap: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <code style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--type-color)' }}>{phrase.id}</code>
          {phrase.anchor && phrase.anchor !== 'green-zone' && (
            <span style={{ fontSize: 9.5, opacity: 0.55, padding: '1px 6px', background: 'rgba(0,0,0,0.06)', borderRadius: 999 }}>{phrase.anchor}</span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>▾</span>
        </div>
        {phrase.decision_point && (
          <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>{phrase.decision_point}</div>
        )}
      </button>
      {open && phrase.text && (
        <div style={{ padding: '0 12px 12px' }}>
          <div
            style={{
              padding: '10px 12px', fontSize: 11.5, lineHeight: 1.5,
              background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 5, whiteSpace: 'pre-wrap', maxHeight: '34vh', overflowY: 'auto',
              userSelect: 'text',
            }}
          >
            {phrase.text}
          </div>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onCopy(); }}
            style={{
              marginTop: 8, border: '1.5px solid var(--type-color)',
              background: copied ? 'var(--type-color)' : 'transparent', color: copied ? '#fff' : 'inherit',
              padding: '6px 12px', borderRadius: 4, cursor: 'pointer', font: 'inherit', fontSize: 11.5, fontWeight: 600,
            }}
          >
            {copied ? 'Copied' : 'Copy SmartPhrase'}
          </button>
        </div>
      )}
    </div>
  );
}
