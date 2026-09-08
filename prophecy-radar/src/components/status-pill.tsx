import clsx from 'clsx';
import { ContentStatus } from '@/lib/types';

const STATUS_STYLES: Record<ContentStatus, string> = {
  NEW: 'bg-signal-gold/15 text-signal-gold',
  REVIEWED: 'bg-signal-info/15 text-signal-info',
  DONE: 'bg-signal-done/15 text-signal-done',
  IGNORED: 'bg-ink-faint/15 text-ink-faint'
};

const STATUS_LABEL: Record<ContentStatus, string> = {
  NEW: 'New',
  REVIEWED: 'Reviewed',
  DONE: 'Done',
  IGNORED: 'Ignored'
};

export function StatusPill({ status }: { status: ContentStatus }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_STYLES[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}
