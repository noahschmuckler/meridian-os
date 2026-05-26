// Clinical module checklist primitive — green band, the "main page."
//
// Owns the "Back to modules" affordance (returns the workspace to gallery
// mode, where topic bubbles host the module list). Renders landing intro,
// the 4-item decision-gate checklist, then the footer (green-zone label +
// smartphrase chip, context strip, footer note). Tapping a row sets
// workspace focus to that item's faq_ref and asks the host to grow the
// FAQ bubble to ~60% of its parent split.

import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { BubbleInstance, GlossaryEntry, ModuleData } from '../../types';
import type { SeedDict } from '../../data/seedResolver';
import { moduleFocusSignal } from '../../data/moduleFocus';
import { userModulesSignal } from '../../data/userModules';
import { ModuleRow } from '../clinical-module-shared/row';
import { stripRefMarkers } from '../../lib/refMarkers';
import { decorateGlossaryText, getMergedGlossary } from '../../lib/glossary';
import { decorateConsultMentionsHtml } from '../../lib/consultDecorator';
import glossarySeedRaw from '../../data/seed/glossary.json';
import { FontSizeControls } from '../../shell/FontSizeControls';

const GLOBAL_GLOSSARY: GlossaryEntry[] = (
  (glossarySeedRaw as { glossary?: { global?: GlossaryEntry[] } }).glossary?.global ?? []
);

interface ClinicalModuleChecklistProps {
  modules?: ModuleData[];
}

interface Props {
  instance: BubbleInstance;
  seeds: SeedDict;
  workspaceId: string;
  selfBubbleId?: string;
  onRequestSiblingFocus?: (targetBubbleId: string, targetShare: number) => void;
}

export function ClinicalModuleChecklist({ instance, workspaceId, selfBubbleId, onRequestSiblingFocus }: Props): JSX.Element {
  const p = instance.props as unknown as ClinicalModuleChecklistProps;
  const seedModules: ModuleData[] = p.modules ?? [];
  const modules: ModuleData[] = [...seedModules, ...userModulesSignal.value];
  const focus = moduleFocusSignal(workspaceId);

  const selected = modules.find((m) => m.module_id === focus.value.moduleId);
  if (!selected) {
    return (
      <div class="cm-bubble" style={{ padding: 16, color: 'var(--ink-faint)' }}>
        No module selected.
      </div>
    );
  }

  const focusedId = focus.value.focusedItemId;

  function pickRow(faqRef: string): void {
    if (!selected) return;
    focus.value = { mode: 'module', moduleId: selected.module_id, focusedItemId: faqRef };
    onRequestSiblingFocus?.('module-faq', 0.6);
  }

  const [busy, setBusy] = useState<null | 'docx' | 'pptx'>(null);

  function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function exportDocx(): Promise<void> {
    if (!selected || busy) return;
    setBusy('docx');
    try {
      const { generateModuleDocx } = await import('../../lib/generateDocx');
      const blob = await generateModuleDocx(selected);
      downloadBlob(blob, `${selected.module_id}.docx`);
    } catch (err) {
      alert('DOCX export failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(null);
    }
  }

  async function exportPptx(): Promise<void> {
    if (!selected || busy) return;
    setBusy('pptx');
    try {
      const { generateModulePptx } = await import('../../lib/generatePptx');
      const blob = await generateModulePptx(selected);
      downloadBlob(blob, `${selected.module_id}.pptx`);
    } catch (err) {
      alert('PPTX export failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)', fontSize: 12 }}>
          {selected.default_title}
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            title={busy === 'docx' ? 'Generating…' : 'Export as Word document'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); void exportDocx(); }}
            disabled={busy !== null}
            style={{
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'rgba(255,255,255,0.55)',
              cursor: busy ? 'wait' : 'pointer',
              font: 'inherit',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 3,
              opacity: busy && busy !== 'docx' ? 0.5 : 1,
            }}
          >{busy === 'docx' ? '…' : '.docx'}</button>
          <button
            type="button"
            title={busy === 'pptx' ? 'Generating…' : 'Export as PowerPoint deck'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); void exportPptx(); }}
            disabled={busy !== null}
            style={{
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'rgba(255,255,255,0.55)',
              cursor: busy ? 'wait' : 'pointer',
              font: 'inherit',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 3,
              opacity: busy && busy !== 'pptx' ? 0.5 : 1,
            }}
          >{busy === 'pptx' ? '…' : '.pptx'}</button>
          <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 4 }}>
            {selected.checklist.length} checks
          </span>
          {selfBubbleId && <FontSizeControls bubbleId={selfBubbleId} />}
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '8px 12px 12px' }}>
        {(() => {
          const glossary = getMergedGlossary(selected, GLOBAL_GLOSSARY);
          const consults = selected.consults ?? [];
          const intro = decorateConsultMentionsHtml(decorateGlossaryText(stripRefMarkers(selected.landing_intro), glossary), consults);
          const contextHtml = selected.context_strip
            ? decorateConsultMentionsHtml(decorateGlossaryText(stripRefMarkers(selected.context_strip.text), glossary), consults)
            : '';
          const footerHtml = selected.footer_note
            ? decorateConsultMentionsHtml(decorateGlossaryText(stripRefMarkers(selected.footer_note), glossary), consults)
            : '';
          return (
            <>
              <p
                style={{ fontSize: 12, lineHeight: 1.45, opacity: 0.85, margin: '4px 0 12px' }}
                dangerouslySetInnerHTML={{ __html: intro }}
              />
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    fontWeight: 700,
                    color: 'var(--type-color)',
                    marginBottom: 6,
                    paddingLeft: 8,
                    borderLeft: '3px solid var(--type-color)',
                  }}
                >
                  {selected.checklist_section_label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selected.checklist.map((item) => (
                    <ModuleRow
                      key={item.item_id}
                      statement={item.statement}
                      marker={String(item.position)}
                      markerShape="square"
                      accent="var(--type-color)"
                      focused={focusedId === item.faq_ref}
                      onClick={() => pickRow(item.faq_ref)}
                    />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--type-color)', marginBottom: 4 }}>
                  ✓ {selected.green_zone.zone_label}
                  {selected.green_zone.smartphrase && (
                    <GreenZoneSmartphrase module={selected} workspaceId={workspaceId} nearBubbleId={selfBubbleId} />
                  )}
                </div>
                {selected.context_strip && (
                  <div style={{ fontSize: 10.5, lineHeight: 1.4, opacity: 0.75, marginBottom: 6 }}>
                    <strong>{selected.context_strip.label}: </strong>
                    <span dangerouslySetInnerHTML={{ __html: contextHtml }} />
                  </div>
                )}
                {selected.footer_note && (
                  <div
                    style={{ fontSize: 10, lineHeight: 1.35, opacity: 0.55, fontStyle: 'italic' }}
                    dangerouslySetInnerHTML={{ __html: footerHtml }}
                  />
                )}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

// Green-zone SmartPhrase affordance: the continuation phrase trigger as a
// click-to-copy chip (copies the full registry text), plus a "View all
// SmartPhrases" launch that spawns the smartphrase-selector for this module.
function GreenZoneSmartphrase({ module, workspaceId, nearBubbleId }: {
  module: ModuleData; workspaceId: string; nearBubbleId?: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const trigger = module.green_zone.smartphrase;
  const phrase = module.smartphrases?.find((s) => s.id === trigger);

  async function copyPhrase(): Promise<void> {
    if (!phrase?.text) return;
    try {
      await navigator.clipboard.writeText(phrase.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    } catch {
      /* clipboard denied */
    }
  }

  function openSelector(): void {
    window.dispatchEvent(new CustomEvent('meridian:spawn-bubble', {
      detail: {
        workspaceId,
        spec: {
          type: 'smartphrase-selector',
          title: 'SmartPhrases',
          props: { initialPhraseId: trigger },
          nearBubbleId,
        },
      },
    }));
  }

  return (
    <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <button
        type="button"
        title={phrase?.text ? 'Copy SmartPhrase text' : trigger}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); copyPhrase(); }}
        disabled={!phrase?.text}
        style={{
          fontSize: 10, padding: '1px 6px', borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.12)',
          background: copied ? 'var(--type-color)' : 'rgba(0,0,0,0.06)',
          color: copied ? '#fff' : 'inherit',
          cursor: phrase?.text ? 'pointer' : 'default', font: 'inherit', fontFamily: 'monospace',
        }}
      >
        {copied ? 'Copied' : trigger}
      </button>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); openSelector(); }}
        style={{
          fontSize: 10, fontWeight: 600, border: 'none', background: 'transparent',
          color: 'var(--type-color)', cursor: 'pointer', font: 'inherit', padding: 0, opacity: 0.85,
        }}
      >
        All SmartPhrases →
      </button>
    </span>
  );
}
