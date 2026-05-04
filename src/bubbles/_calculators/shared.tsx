// Shared building blocks for the Track-4a calculator bubbles
// (GAD-7 / PHQ-9 / AUDIT-C / CIWA-Ar / COWS). Each calculator is a tight
// column of `ScaleRow` items + a `ResultBanner` + a `VerifyFooter`, wrapped
// in `CalcShell` (chrome row with title + reset button, scrollable body).
//
// Pattern is intentionally identical to PreventCalculator's chrome / footer
// shape so the five new calculators read as the same kind of object on the
// canvas (yellow stripe, reset button, verify-link footer). The only thing
// that diverges per-calculator is the items + scoring + tier classifier.
//
// `ScaleRow` supports non-uniform option scales (COWS items use 0/1/2/4 or
// 0/1/3/5 etc.) by passing each option's value + visible label + an optional
// detail tooltip. Active option fills with the bubble's --type-color.

import type { ComponentChildren, JSX } from 'preact';

export interface ScaleOption {
  value: number;
  label: string;
  detail?: string;
}

interface ScaleRowProps {
  index: number;
  label: string;
  description?: string;
  value: number | null;
  options: ScaleOption[];
  onChange: (v: number) => void;
}

export function ScaleRow({
  index,
  label,
  description,
  value,
  options,
  onChange,
}: ScaleRowProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '8px 0 6px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ fontSize: 12, lineHeight: 1.35 }}>
        <span style={{ fontWeight: 600, opacity: 0.55, marginRight: 6 }}>{index}.</span>
        {label}
      </div>
      {description && (
        <div style={{ fontSize: 10.5, opacity: 0.6, lineHeight: 1.35 }}>{description}</div>
      )}
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          gap: 0,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.15)',
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              title={opt.detail ?? `${opt.value}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
              }}
              style={{
                font: 'inherit',
                fontSize: 12,
                padding: '3px 9px',
                border: 'none',
                borderRight: '1px solid rgba(0,0,0,0.10)',
                background: active ? 'var(--type-color)' : 'rgba(255,255,255,0.6)',
                color: active ? '#1a1a1a' : 'inherit',
                cursor: 'pointer',
                minWidth: 28,
                fontWeight: active ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface Tier {
  label: string;
  color: string;
  detail: string;
}

interface ResultBannerProps {
  score: number;
  scoreSuffix?: string;
  tier: Tier | null;
  partial?: boolean;
  partialMessage?: string;
  notes?: ComponentChildren;
}

export function ResultBanner({
  score,
  scoreSuffix,
  tier,
  partial,
  partialMessage,
  notes,
}: ResultBannerProps): JSX.Element {
  const color = tier?.color ?? '#888';
  return (
    <div
      style={{
        marginTop: 14,
        padding: '12px 14px',
        borderRadius: 8,
        background: 'rgba(0,0,0,0.04)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>
          {score}
          {scoreSuffix && (
            <span style={{ fontSize: 14, fontWeight: 500, opacity: 0.55 }}>{scoreSuffix}</span>
          )}
        </span>
        {tier && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {tier.label}
          </span>
        )}
      </div>
      {tier && (
        <div style={{ fontSize: 11.5, lineHeight: 1.4, opacity: 0.85, marginTop: 6 }}>
          {tier.detail}
        </div>
      )}
      {partial && (
        <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 6, fontStyle: 'italic' }}>
          {partialMessage ?? 'Partial — answer all items for the validated total.'}
        </div>
      )}
      {notes}
    </div>
  );
}

interface VerifyFooterProps {
  url: string;
  label: string;
  blurb?: string;
}

export function VerifyFooter({ url, label, blurb }: VerifyFooterProps): JSX.Element {
  return (
    <div
      style={{
        marginTop: 10,
        padding: '8px 10px',
        fontSize: 10.5,
        lineHeight: 1.4,
        background: 'rgba(244, 192, 32, 0.18)',
        border: '1px solid rgba(244, 192, 32, 0.5)',
        borderRadius: 4,
      }}
    >
      <strong>Reference scoring.</strong> {blurb ?? 'Verify against the validated instrument.'}
      {' '}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        {label}
      </a>
      .
    </div>
  );
}

interface CalcShellProps {
  title: string;
  subtitle?: string;
  onReset: () => void;
  rightChrome?: ComponentChildren;
  children: ComponentChildren;
}

export function CalcShell({
  title,
  subtitle,
  onReset,
  rightChrome,
  children,
}: CalcShellProps): JSX.Element {
  return (
    <div class="cm-bubble" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div class="bubble__chrome">
        <span class="bubble__title" style={{ color: 'var(--type-color)' }}>{title}</span>
        {subtitle && (
          <span style={{ marginLeft: 8, fontSize: 10.5, opacity: 0.6 }}>{subtitle}</span>
        )}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          {rightChrome}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title="Reset"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 11,
              opacity: 0.65,
            }}
          >
            reset
          </button>
        </span>
      </div>
      <div class="bubble__body" style={{ flex: 1, overflow: 'auto', padding: '10px 14px 12px' }}>
        {children}
      </div>
    </div>
  );
}

interface IntroProps {
  children: ComponentChildren;
}

export function Intro({ children }: IntroProps): JSX.Element {
  return (
    <div style={{ fontSize: 11, lineHeight: 1.45, opacity: 0.75, margin: '0 0 4px' }}>
      {children}
    </div>
  );
}

interface SegmentToggleProps<T extends string> {
  label?: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}

export function SegmentToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentToggleProps<T>): JSX.Element {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 3,
        fontSize: 11,
        opacity: 0.85,
      }}
    >
      {label && <span style={{ fontWeight: 600 }}>{label}</span>}
      <div
        style={{
          display: 'inline-flex',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.15)',
        }}
      >
        {options.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.key);
              }}
              style={{
                flex: 1,
                font: 'inherit',
                fontSize: 12,
                padding: '4px 12px',
                border: 'none',
                background: active ? 'var(--type-color)' : 'rgba(255,255,255,0.6)',
                color: active ? '#1a1a1a' : 'inherit',
                cursor: 'pointer',
                fontWeight: active ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Standard Likert 0..3 used by GAD-7 + PHQ-9.
export const PSYCH_LIKERT: ScaleOption[] = [
  { value: 0, label: '0', detail: 'Not at all' },
  { value: 1, label: '1', detail: 'Several days' },
  { value: 2, label: '2', detail: 'More than half the days' },
  { value: 3, label: '3', detail: 'Nearly every day' },
];
