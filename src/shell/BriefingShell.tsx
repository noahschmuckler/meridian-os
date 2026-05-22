import type { JSX } from 'preact';
import BriefingApp from '../apps/briefing/BriefingApp';
import { BackToLauncherChevron } from './Launcher';

export function BriefingShell(): JSX.Element {
  return (
    <div class="briefing-shell">
      <BackToLauncherChevron variant="on-light" />
      <BriefingApp />
    </div>
  );
}
