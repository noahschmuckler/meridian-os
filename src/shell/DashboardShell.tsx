import type { JSX } from 'preact';
import DashboardApp from '../apps/dashboard/DashboardApp';
import { BackToLauncherChevron } from './Launcher';

export function DashboardShell(): JSX.Element {
  return (
    <div class="dashboard-shell">
      <BackToLauncherChevron variant="on-light" />
      <DashboardApp />
    </div>
  );
}
