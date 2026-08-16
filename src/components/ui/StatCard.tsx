import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Skeleton } from './Skeleton';
import { Surface } from './Surface';

interface StatCardProps {
  label: string;
  value: string | number;
  /** Secondary context under the figure — a comparison, a period, a count. */
  sub?: string;
  icon?: LucideIcon;
  /** Period-over-period movement. Direction is shown by arrow, not colour alone. */
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  /**
   * Whether an increase is good. Churn going up is bad; revenue going up is
   * good — the arrow direction alone can't say which, so the caller declares it.
   */
  trendPolarity?: 'positive' | 'inverse';
  isLoading?: boolean;
  /** Promotes the single most important figure in a row. */
  emphasis?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  trendPolarity = 'positive',
  isLoading = false,
  emphasis = false,
  className,
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === 'up' ? ArrowUpRight : trend?.direction === 'down' ? ArrowDownRight : Minus;

  const isGood =
    trend?.direction === 'flat'
      ? null
      : trendPolarity === 'inverse'
        ? trend?.direction === 'down'
        : trend?.direction === 'up';

  return (
    <Surface
      tone={emphasis ? 'accent' : 'raised'}
      padding="md"
      className={cn('flex flex-col justify-between gap-3', className)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-content-muted">{label}</p>
        {Icon && (
          <Icon
            aria-hidden
            className={cn('h-4 w-4 shrink-0', emphasis ? 'text-primary' : 'text-content-subtle')}
          />
        )}
      </div>

      <div>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p
            className={cn(
              /* tabular figures keep a row of stat cards aligned and stop the
                 number jittering as it updates */
              'tabular font-semibold text-content-primary',
              emphasis ? 'text-3xl' : 'text-2xl',
            )}
          >
            {value}
          </p>
        )}

        <div className="mt-1.5 flex items-center gap-2 min-h-[1.125rem]">
          {trend && !isLoading && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium tabular',
                isGood === null && 'text-content-muted',
                isGood === true && 'text-success',
                isGood === false && 'text-danger',
              )}
            >
              <TrendIcon aria-hidden className="h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          {sub && !isLoading && <span className="text-xs text-content-muted">{sub}</span>}
        </div>
      </div>
    </Surface>
  );
}
