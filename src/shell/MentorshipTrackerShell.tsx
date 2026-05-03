import type { JSX } from 'preact';
import MentorshipTrackerApp from '../apps/mentorship-tracker/MentorshipTrackerApp';
import { BackToLauncherChevron } from './Launcher';

export function MentorshipTrackerShell(): JSX.Element {
  return (
    <div class="mentorship-tracker-shell">
      <BackToLauncherChevron variant="on-dark" />
      <MentorshipTrackerApp />
    </div>
  );
}
