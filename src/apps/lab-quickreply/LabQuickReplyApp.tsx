import type { JSX } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import './lab-quickreply.css';

// =============================================================================
// Lab QuickReply — guided wording aid for lab-result portal messages.
// Port of ~/incoming_noah/labmessenger.js (Dr. Freiberg's workflow):
//   1. Pick how the labs look (sets reassurance wrapper; gates serious path).
//   2. First real fork: does the patient already have an appointment scheduled?
//   3. If not: clinician picks an interval from their real ladder.
//      A quiet education hint sits next to the choices (older/sicker patients
//      often return sooner) — education, NOT a computed recommendation.
//   Serious results trigger a phone-call guardrail instead of a message.
//   Every instruction is patient-owned ("return in six months"). The tool never
//   promises office action on the patient's behalf; the clinician directs staff
//   separately on the back end.
//
// Port notes (vs. the source .js):
//  - Tailwind utility classes → semantic class names in lab-quickreply.css
//  - lucide-react icons → inline SVGs (no dep)
//  - window.storage (Claude Artifacts) → localStorage with meridian-os
//    namespace key (meridian-os.labQuickReply.provider.v1)
//  - Preact `class=` attr (not React `className=`)
//  - Storage hydration runs synchronously since localStorage is sync
// =============================================================================

interface LookOption {
  id: 'stable' | 'mild' | 'moderate' | 'serious';
  label: string;
  desc: string;
  tone: 'calm' | 'attention' | 'stop';
}

const LOOKS: LookOption[] = [
  { id: 'stable', label: 'Stable', desc: 'normal, at goal, or unchanged', tone: 'calm' },
  { id: 'mild', label: 'Mildly abnormal', desc: 'slightly off but not concerning', tone: 'calm' },
  { id: 'moderate', label: 'Moderately abnormal', desc: 'needs attention, not urgent', tone: 'attention' },
  { id: 'serious', label: 'Serious / urgent', desc: 'phone call, not a portal message', tone: 'stop' },
];

const OPENERS: Record<string, string> = {
  stable: 'Your results are stable.',
  mild: 'Your results are stable overall, with a couple of values minimally outside the usual range but nothing that concerns me.',
  moderate: 'I have reviewed your results. There is something that needs a closer look, though it is not an emergency.',
};

interface IntervalOption {
  id: string;
  label: string;
  instruction: string;
  group: 'routine' | 'sooner';
}

const INTERVALS: IntervalOption[] = [
  { id: '6mo', label: '6 months', instruction: 'Please return in six months for a recheck.', group: 'routine' },
  { id: '3mo', label: '3 months', instruction: 'Please return in three months for a recheck.', group: 'routine' },
  { id: 'annual', label: 'At annual visit', instruction: 'We will recheck at your annual visit.', group: 'routine' },
  { id: '6wk', label: '6 weeks', instruction: 'Please return in about six weeks for a recheck.', group: 'sooner' },
  { id: '1mo', label: 'Within 1 month', instruction: 'Please schedule a visit within the next month.', group: 'sooner' },
  { id: '2wk', label: 'Within 2 weeks', instruction: 'Please schedule a visit within the next two weeks.', group: 'sooner' },
  { id: '1wk', label: 'Within 1 week', instruction: 'Please schedule a visit within the next week.', group: 'sooner' },
];

const INTERVAL_GROUPS: Array<{ id: 'routine' | 'sooner'; label: string }> = [
  { id: 'routine', label: 'Routine recheck' },
  { id: 'sooner', label: 'Sooner' },
];

type SignoffStyle = 'first' | 'warm' | 'doctor' | 'none';

const SIGNOFF_OPTIONS: Array<{ id: SignoffStyle; label: string }> = [
  { id: 'first', label: '— Scott' },
  { id: 'warm', label: 'Take care, Scott' },
  { id: 'doctor', label: '— Dr. Freiberg' },
  { id: 'none', label: 'No sign-off' },
];

const STORAGE_KEY = 'meridian-os.labQuickReply.provider.v1';

interface PersistedProvider {
  providerName: string;
  providerLastName: string;
  signoffStyle: SignoffStyle;
}

function loadProvider(): PersistedProvider {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedProvider>;
      return {
        providerName: parsed.providerName ?? '',
        providerLastName: parsed.providerLastName ?? '',
        signoffStyle: (parsed.signoffStyle as SignoffStyle) ?? 'first',
      };
    }
  } catch {
    /* corrupt JSON or storage disabled — fall through to default */
  }
  return { providerName: '', providerLastName: '', signoffStyle: 'first' };
}

function applyName(text: string, name: string): string {
  const n = (name || '').trim().split(/\s+/)[0] || '';
  const greeting = n ? `Hi ${n},\n\n` : `Hi there,\n\n`;
  return greeting + text;
}

function applySignoff(text: string, providerName: string, providerLast: string, style: SignoffStyle): string {
  const first = (providerName || '').trim().replace(/^(dr|doctor)\.?\s+/i, '');
  const last = (providerLast || '').trim().replace(/^(dr|doctor)\.?\s+/i, '');
  if (style === 'first' && first) return `${text}\n\n— ${first}`;
  if (style === 'doctor' && last) return `${text}\n\n— Dr. ${last}`;
  if (style === 'warm' && first) return `${text}\n\nTake care,\n${first}`;
  return text;
}

export default function LabQuickReplyApp(): JSX.Element {
  // Provider settings persist across sessions.
  const initialProvider = loadProvider();
  const [providerName, setProviderName] = useState(initialProvider.providerName);
  const [providerLast, setProviderLast] = useState(initialProvider.providerLastName);
  const [signoffStyle, setSignoffStyle] = useState<SignoffStyle>(initialProvider.signoffStyle);
  const [showSettings, setShowSettings] = useState(false);

  // Per-message state (resets via reset()).
  const [patientName, setPatientName] = useState('');
  const [looks, setLooks] = useState<LookOption['id'] | null>(null);
  const [hasScheduled, setHasScheduled] = useState<boolean | null>(null);
  const [intervalId, setIntervalId] = useState<string | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);

  // Write-through on any provider settings change.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ providerName, providerLastName: providerLast, signoffStyle }),
      );
    } catch {
      /* storage disabled — fail silently */
    }
  }, [providerName, providerLast, signoffStyle]);

  const isSerious = looks === 'serious';

  const baseText = useMemo(() => {
    if (showCustomize && editedText) return editedText;
    if (!looks || isSerious) return '';
    const opener = OPENERS[looks];
    if (!opener) return '';
    if (hasScheduled === true) {
      return `${opener} Please continue with your already-scheduled appointment.`;
    }
    if (hasScheduled === false && intervalId) {
      const iv = INTERVALS.find((i) => i.id === intervalId);
      if (iv) return `${opener} ${iv.instruction}`;
    }
    return '';
  }, [showCustomize, editedText, looks, isSerious, hasScheduled, intervalId]);

  const finalMessage = useMemo(() => {
    if (!baseText) return '';
    return applySignoff(applyName(baseText, patientName), providerName, providerLast, signoffStyle);
  }, [baseText, patientName, providerName, providerLast, signoffStyle]);

  async function handleCopy(): Promise<void> {
    if (!finalMessage) return;
    try {
      await navigator.clipboard.writeText(finalMessage);
    } catch {
      // Fallback for browsers without async clipboard (older iOS Safari etc.)
      const ta = document.createElement('textarea');
      ta.value = finalMessage;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  function reset(): void {
    setLooks(null);
    setHasScheduled(null);
    setIntervalId(null);
    setShowCustomize(false);
    setEditedText('');
    setPatientName('');
  }

  function startCustomize(): void {
    setShowCustomize(true);
    setEditedText(baseText);
  }

  const showIntervalPicker = looks && !isSerious && hasScheduled === false;
  const messageReady = Boolean(finalMessage) && !isSerious;

  // Sign-off option labels swap in the live first/last so the chooser previews
  // the actual rendered sign-off. Falls back to "Scott"/"Freiberg" sample names
  // so the buttons read coherently before the user enters their own.
  const previewFirst = providerName.trim() || 'Scott';
  const previewLast = providerLast.trim() || 'Freiberg';
  const signoffPreviews: Record<SignoffStyle, string> = {
    first: `— ${previewFirst}`,
    warm: `Take care, ${previewFirst}`,
    doctor: `— Dr. ${previewLast}`,
    none: 'No sign-off',
  };

  return (
    <div class="lab-quickreply">
      <div class="lab-quickreply__page">
        <header class="lab-quickreply__header">
          <div>
            <div class="lab-quickreply__eyebrow">Optum NY/NJ Primary Care</div>
            <h1 class="lab-quickreply__title">Lab QuickReply</h1>
            <p class="lab-quickreply__tagline">
              Three quick choices. A clean message. Paste into MyChart.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            class="lab-quickreply__setup-btn"
          >
            <IconSettings />
            <span class="lab-quickreply__setup-label">Setup</span>
          </button>
        </header>

        {showSettings && (
          <div class="lab-quickreply__settings">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              class="lab-quickreply__settings-close"
              aria-label="Close settings"
            >
              <IconX />
            </button>
            <h2 class="lab-quickreply__settings-title">Your name and sign-off</h2>
            <p class="lab-quickreply__settings-sub">Set once. Added to every message automatically.</p>
            <div class="lab-quickreply__settings-grid">
              <div>
                <label class="lab-quickreply__field-label">First name</label>
                <input
                  type="text"
                  value={providerName}
                  onInput={(e) => setProviderName((e.currentTarget as HTMLInputElement).value)}
                  placeholder="Scott"
                  class="lab-quickreply__input"
                />
              </div>
              <div>
                <label class="lab-quickreply__field-label">Last name</label>
                <input
                  type="text"
                  value={providerLast}
                  onInput={(e) => setProviderLast((e.currentTarget as HTMLInputElement).value)}
                  placeholder="Freiberg"
                  class="lab-quickreply__input"
                />
              </div>
            </div>
            <label class="lab-quickreply__field-label">How to sign</label>
            <div class="lab-quickreply__signoff-row">
              {SIGNOFF_OPTIONS.map((opt) => {
                const active = signoffStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSignoffStyle(opt.id)}
                    class={`lab-quickreply__signoff-btn${active ? ' is-active' : ''}`}
                  >
                    {signoffPreviews[opt.id]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div class="lab-quickreply__field">
          <label class="lab-quickreply__patient-label">
            Patient's first name <span class="lab-quickreply__optional">(optional)</span>
          </label>
          <input
            type="text"
            value={patientName}
            onInput={(e) => setPatientName((e.currentTarget as HTMLInputElement).value)}
            placeholder='Leave blank for "Hi there"'
            class="lab-quickreply__input"
          />
        </div>

        <div class="lab-quickreply__step">
          <div class="lab-quickreply__step-head">
            <span class="lab-quickreply__step-num">1</span>
            <h2 class="lab-quickreply__step-title">How do the labs look?</h2>
          </div>
          <div class="lab-quickreply__looks">
            {LOOKS.map((l) => {
              const active = looks === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setLooks(l.id);
                    setShowCustomize(false);
                    setEditedText('');
                  }}
                  class={`lab-quickreply__look${active ? ` is-active tone-${l.tone}` : ''}`}
                >
                  <div class="lab-quickreply__look-label">{l.label}</div>
                  <div class={`lab-quickreply__look-desc${active ? ' is-active' : ''}`}>{l.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {isSerious && (
          <div class="lab-quickreply__stop">
            <div class="lab-quickreply__stop-icon">
              <IconPhone />
            </div>
            <div class="lab-quickreply__stop-body">
              <h3 class="lab-quickreply__stop-title">This is a phone call, not a portal message.</h3>
              <p class="lab-quickreply__stop-text">
                Serious or urgent results — a critical value, something that needs management today, or news
                that is heavy to receive — should be delivered by phone, by you, directly.
              </p>
              <p class="lab-quickreply__stop-sub">
                After you speak with the patient, you can send a brief portal note documenting the call. This
                tool does not compose the delivery message for serious results, on purpose.
              </p>
            </div>
          </div>
        )}

        {looks && !isSerious && (
          <div class="lab-quickreply__step">
            <div class="lab-quickreply__step-head">
              <span class="lab-quickreply__step-num">2</span>
              <h2 class="lab-quickreply__step-title">
                Does the patient already have an appointment scheduled?
              </h2>
            </div>
            <div class="lab-quickreply__yesno">
              <button
                type="button"
                onClick={() => {
                  setHasScheduled(true);
                  setIntervalId(null);
                  setShowCustomize(false);
                  setEditedText('');
                }}
                class={`lab-quickreply__yesno-btn${hasScheduled === true ? ' is-active' : ''}`}
              >
                Yes — use that visit
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasScheduled(false);
                  setShowCustomize(false);
                  setEditedText('');
                }}
                class={`lab-quickreply__yesno-btn${hasScheduled === false ? ' is-active' : ''}`}
              >
                No — set a return interval
              </button>
            </div>
          </div>
        )}

        {showIntervalPicker && (
          <div class="lab-quickreply__step">
            <div class="lab-quickreply__step-head">
              <span class="lab-quickreply__step-num">3</span>
              <h2 class="lab-quickreply__step-title">When should they return?</h2>
            </div>

            <div class="lab-quickreply__hint">
              <p>
                <span class="lab-quickreply__hint-strong">A note, not a recommendation:</span>{' '}
                older, frailer, or poorly-controlled patients often return sooner than their labs alone would
                suggest. Your judgment picks the interval.
              </p>
            </div>

            {INTERVAL_GROUPS.map((group) => (
              <div key={group.id} class="lab-quickreply__interval-group">
                <div class="lab-quickreply__interval-label">{group.label}</div>
                <div class="lab-quickreply__interval-row">
                  {INTERVALS.filter((i) => i.group === group.id).map((iv) => (
                    <button
                      key={iv.id}
                      type="button"
                      onClick={() => {
                        setIntervalId(iv.id);
                        setShowCustomize(false);
                        setEditedText('');
                      }}
                      class={`lab-quickreply__interval-btn${intervalId === iv.id ? ' is-active' : ''}`}
                    >
                      {iv.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {messageReady && (
          <div class="lab-quickreply__sticky">
            <div class="lab-quickreply__preview">
              <div class="lab-quickreply__preview-head">
                <span class="lab-quickreply__preview-title">Your message</span>
                {!showCustomize && (
                  <button type="button" onClick={startCustomize} class="lab-quickreply__edit-btn">
                    <IconPencil />
                    Edit wording
                  </button>
                )}
              </div>
              <div class="lab-quickreply__preview-body">
                {showCustomize ? (
                  <textarea
                    value={editedText}
                    onInput={(e) => setEditedText((e.currentTarget as HTMLTextAreaElement).value)}
                    rows={5}
                    autoFocus
                    class="lab-quickreply__textarea"
                  />
                ) : (
                  <div class="lab-quickreply__message">{finalMessage}</div>
                )}
              </div>
              <div class="lab-quickreply__preview-actions">
                <button type="button" onClick={handleCopy} class="lab-quickreply__copy-btn">
                  {copied ? (
                    <>
                      <IconCheck />
                      Copied — paste into MyChart
                    </>
                  ) : (
                    <>
                      <IconCopy />
                      Copy message
                    </>
                  )}
                </button>
                {showCustomize && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomize(false);
                      setEditedText('');
                    }}
                    class="lab-quickreply__doneedit-btn"
                  >
                    Done editing
                  </button>
                )}
                <button type="button" onClick={reset} class="lab-quickreply__reset-btn">
                  <IconArrowLeft />
                  Start over
                </button>
              </div>
            </div>
          </div>
        )}

        <p class="lab-quickreply__disclaimer">
          This is a wording aid, not clinical decision support. You are responsible for the final message and
          the clinical decision behind it.
        </p>
      </div>
    </div>
  );
}

// ---------- Inline icons (replaces lucide-react) -----------------------------
// All icons share the same lucide visual language: 24×24, stroke-only,
// stroke-width 2, round caps + joins. currentColor lets each call site set
// the color via CSS. Sized via the parent's font-size + the icon's class.

function IconCopy(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconCheck(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconSettings(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconX(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function IconPhone(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconPencil(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconArrowLeft(): JSX.Element {
  return (
    <svg class="lab-quickreply__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
