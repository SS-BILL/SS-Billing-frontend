import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  PauseCircle,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { isSubscriptionStatus, type SubscriptionStatus } from '../../types';

interface StatusMeta {
  label: string;
  icon: LucideIcon;
  className: string;
  /** Spelled out for screen readers, which shouldn't have to infer from colour. */
  description: string;
}

/**
 * Every status carries an icon as well as a colour.
 *
 * The previous badge encoded state purely as colour — green/yellow/red text
 * on a tinted pill. Roughly 1 in 12 men cannot reliably separate the red and
 * green variants, and neither survives a greyscale print or a screenshot in a
 * support ticket. The icon makes the state readable without colour at all.
 */
const STATUS_META: Record<SubscriptionStatus, StatusMeta> = {
  active: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-success/12 text-success border-success/25',
    description: 'Active — billing on schedule',
  },
  paused: {
    label: 'Paused',
    icon: PauseCircle,
    className: 'bg-info/12 text-info border-info/25',
    description: 'Paused — no charges until resumed',
  },
  grace_period: {
    label: 'Grace period',
    icon: AlertTriangle,
    className: 'bg-warning/12 text-warning border-warning/25',
    description: 'In grace period — a charge failed and will be retried',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-danger/12 text-danger border-danger/25',
    description: 'Failed — the last charge could not be collected',
  },
  cancelled: {
    label: 'Cancelled',
    icon: CircleSlash,
    className: 'bg-surface-overlay text-content-muted border-line-strong',
    description: 'Cancelled — no further charges',
  },
};

const UNKNOWN: StatusMeta = {
  label: 'Unknown',
  icon: CircleSlash,
  className: 'bg-surface-overlay text-content-muted border-line-strong',
  description: 'Unknown status',
};

export function StatusBadge({
  status,
  className,
}: {
  status: string | null | undefined;
  className?: string;
}) {
  /* A status the UI doesn't recognise renders as Unknown rather than as a
     raw enum string with no styling — the old version passed anything
     through, underscores and all. */
  const meta = isSubscriptionStatus(status) ? STATUS_META[status] : UNKNOWN;
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
        'text-xs font-medium whitespace-nowrap',
        meta.className,
        className,
      )}
    >
      <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
      <span className="sr-only">{meta.description}</span>
      <span aria-hidden>{meta.label}</span>
    </span>
  );
}
