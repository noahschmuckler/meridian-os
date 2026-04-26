import type { JSX } from 'preact';
import type { ChatProps } from '../types';

export function ChatBubble({ props }: { props: ChatProps }): JSX.Element {
  return (
    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink-faint)' }}>
        chat · {props.defaultPersona ?? 'default'}
      </div>
      <div style={{ marginTop: 4, fontSize: 13 }}>
        {props.greeting ?? 'how can I help?'}
      </div>
    </div>
  );
}
