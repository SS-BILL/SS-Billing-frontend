import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Shown when a query succeeds and returns nothing.
 *
 * The dashboards printed "No plans yet." and "No active subscriptions." in
 * muted grey and stopped there — a dead end that tells the user what is
 * missing but not what to do about it. An empty state is the one screen every
 * new user is guaranteed to see, so it carries the next action.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'px-6 py-12 sm:py-16',
        className,
      )}
    >
      {Icon && (
        <div
          aria-hidden
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-overlay"
        >
          <Icon className="h-5 w-5 text-content-muted" />
        </div>
      )}
      <p className="text-sm font-semibold text-content-primary">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-prose text-sm text-content-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
