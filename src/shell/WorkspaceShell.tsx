import type { JSX } from 'preact';
import type { WorkspaceConfig } from '../types';
import { BspWorkspace } from './BspWorkspace';
import type { SeedDict } from '../data/seedResolver';

interface WorkspaceShellProps {
  workspace: WorkspaceConfig;
  seeds: SeedDict;
  onBackToHome: () => void;
}

export function WorkspaceShell({ workspace, seeds, onBackToHome }: WorkspaceShellProps): JSX.Element {
  return (
    <>
      <BspWorkspace workspace={workspace} seeds={seeds} />
      <button
        onClick={onBackToHome}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 200,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          fontSize: 12,
        }}
      >
        ← Home · {workspace.title}
      </button>
    </>
  );
}
