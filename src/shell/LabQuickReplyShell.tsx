import type { JSX } from 'preact';
import LabQuickReplyApp from '../apps/lab-quickreply/LabQuickReplyApp';
import { BackToLauncherChevron } from './Launcher';

// Mirrors BriefingShell / DashboardShell. The chevron sits on a light
// parchment surface, so `variant="on-light"` (Lab QuickReply's header is
// black text on #f5f3ee — `on-light` darkens the chevron for readability).
export function LabQuickReplyShell(): JSX.Element {
  return (
    <div class="lab-quickreply-shell">
      <BackToLauncherChevron variant="on-light" />
      <LabQuickReplyApp />
    </div>
  );
}
