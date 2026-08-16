'use client';

import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatAmount, formatDate, formatDateShort, stroopsToNumber } from '../../lib/format';
import type { RevenuePoint } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Skeleton } from '../ui/Skeleton';
import { Surface, SurfaceHeader } from '../ui/Surface';

interface RevenueChartProps {
  data: RevenuePoint[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

interface Point {
  label: string;
  fullDate: string;
  revenue: number;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="rounded-md border border-line-strong bg-surface-overlay px-3 py-2 shadow-lg">
      <p className="text-xs text-content-muted">{point.fullDate}</p>
      <p className="tabular mt-0.5 text-sm font-semibold text-content-primary">
        {point.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

/**
 * Revenue over the trailing 30 days.
 *
 * The previous chart rendered its axis frame regardless of state: with no
 * data it drew an empty grid, while loading it drew the same empty grid, and
 * on error it also drew the same empty grid. All three read as "you have no
 * revenue", which for a merchant whose request just failed is actively
 * misleading.
 */
export function RevenueChart({ data, isLoading, isError, error, onRetry }: RevenueChartProps) {
  const points = useMemo<Point[]>(
    () =>
      data.map((d) => ({
        label: formatDateShort(d.date),
        fullDate: formatDate(d.date),
        revenue: stroopsToNumber(d.revenue),
      })),
    [data],
  );

  const total = useMemo(
    () => points.reduce((sum, point) => sum + point.revenue, 0),
    [points],
  );

  return (
    <Surface padding="none">
      <div className="p-5 pb-2">
        <SurfaceHeader
          title="Revenue"
          description="Last 30 days"
          action={
            !isLoading && !isError && points.length > 0 ? (
              <span className="tabular text-sm font-semibold text-content-primary">
                {formatAmount(BigInt(Math.round(total * 10_000_000)))}
              </span>
            ) : undefined
          }
        />
      </div>

      {isLoading && (
        <div className="px-5 pb-5">
          <Skeleton className="h-[220px] w-full rounded-md" />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState error={error} onRetry={onRetry} title="Could not load revenue" />
      )}

      {!isLoading && !isError && points.length === 0 && (
        <EmptyState
          icon={BarChart3}
          title="No revenue yet"
          description="Charges will appear here as your subscriptions bill. The first one lands at the end of a plan's first interval."
        />
      )}

      {!isLoading && !isError && points.length > 0 && (
        <div className="px-2 pb-4">
          {/* The chart is decorative to assistive tech; the table below carries
              the same data in a form a screen reader can actually read. */}
          <div aria-hidden>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Grid sits well below the data in contrast so it guides the
                    eye without competing with the series. */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'hsl(var(--text-muted))', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--text-muted))', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
                  }
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: 'hsl(var(--border-strong))', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenue-fill)"
                  /* Entrance animation is skipped for users who asked for
                     reduced motion — the figures must be readable at once. */
                  isAnimationActive={
                    typeof window !== 'undefined' &&
                    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Accessible equivalent. Visually collapsed, fully readable by
              assistive tech and expandable by anyone who wants the figures. */}
          <details className="mt-2 px-3">
            <summary className="cursor-pointer rounded-sm py-1 text-xs text-content-muted hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              View as table
            </summary>
            <div className="mt-2 max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">
                  Daily revenue for the last 30 days, totalling {total.toFixed(2)}
                </caption>
                <thead className="sticky top-0 bg-surface-raised">
                  <tr>
                    <th scope="col" className="py-1.5 font-medium text-content-muted">
                      Date
                    </th>
                    <th scope="col" className="py-1.5 text-right font-medium text-content-muted">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.fullDate} className="border-t border-line">
                      <th scope="row" className="py-1.5 font-normal text-content-secondary">
                        {point.fullDate}
                      </th>
                      <td className="tabular py-1.5 text-right text-content-secondary">
                        {point.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </Surface>
  );
}
