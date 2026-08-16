'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, CreditCard, Package, TrendingUp, Users } from 'lucide-react';
import { analyticsApi, planApi } from '../../lib/api';
import { formatAmount, formatInterval, formatPercent, formatTokenAmount } from '../../lib/format';
import { useWallet } from '../../store/wallet.store';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { AppHeader } from '../../components/layout/AppHeader';
import { SkipLink } from '../../components/layout/SkipLink';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Surface, SurfaceHeader } from '../../components/ui/Surface';
import { ConnectGate } from '../../components/wallet/ConnectGate';

export default function MerchantDashboard() {
  const { address } = useWallet();

  const statsQuery = useQuery({
    queryKey: ['merchant-stats', address],
    queryFn: () => analyticsApi.stats(address!),
    enabled: !!address,
  });

  const revenueQuery = useQuery({
    queryKey: ['merchant-revenue', address],
    queryFn: () => analyticsApi.revenue(address!),
    enabled: !!address,
  });

  const plansQuery = useQuery({
    queryKey: ['plans', address],
    queryFn: () => planApi.list(address!),
    enabled: !!address,
  });

  if (!address) {
    return (
      <>
        <SkipLink />
        <AppHeader />
        <main id="main" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <ConnectGate
            title="Connect your wallet"
            description="Your merchant dashboard is derived from the treasury address that owns your plans. Connect the wallet you registered with to see revenue and subscribers."
          />
        </main>
      </>
    );
  }

  const stats = statsQuery.data;
  const plans = plansQuery.data ?? [];

  return (
    <>
      <SkipLink />
      <AppHeader />

      <main id="main" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-1 py-8">
          <h1 className="text-2xl font-semibold text-content-primary">Merchant</h1>
          <p className="text-sm text-content-muted">
            Revenue and subscriber activity for the connected treasury.
          </p>
        </div>

        {/* ── Key figures ─────────────────────────────────────────────── */}
        <section aria-labelledby="figures-heading">
          <h2 id="figures-heading" className="sr-only">
            Key figures
          </h2>

          {statsQuery.isError ? (
            <Surface padding="none">
              <ErrorState
                error={statsQuery.error}
                onRetry={() => void statsQuery.refetch()}
                isRetrying={statsQuery.isFetching}
                title="Could not load your figures"
              />
            </Surface>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="MRR"
                value={formatAmount(stats?.mrr, { maximumFractionDigits: 2 })}
                sub="Monthly recurring"
                icon={TrendingUp}
                isLoading={statsQuery.isPending}
                emphasis
              />
              <StatCard
                label="ARR"
                value={formatAmount(stats?.arr, { maximumFractionDigits: 2 })}
                sub="Annualised"
                icon={Activity}
                isLoading={statsQuery.isPending}
              />
              <StatCard
                label="Active subscriptions"
                value={stats?.activeSubscriptions ?? 0}
                icon={Users}
                isLoading={statsQuery.isPending}
              />
              <StatCard
                label="Churn rate"
                value={formatPercent(stats?.churnRate)}
                sub="Last 30 days"
                icon={CreditCard}
                /* Churn rising is bad — the arrow can't say that on its own. */
                trendPolarity="inverse"
                isLoading={statsQuery.isPending}
              />
            </div>
          )}
        </section>

        {/* ── Revenue ─────────────────────────────────────────────────── */}
        <section aria-labelledby="revenue-heading" className="mt-6">
          <h2 id="revenue-heading" className="sr-only">
            Revenue over time
          </h2>
          <RevenueChart
            data={revenueQuery.data ?? []}
            isLoading={revenueQuery.isPending}
            isError={revenueQuery.isError}
            error={revenueQuery.error}
            onRetry={() => void revenueQuery.refetch()}
          />
        </section>

        {/* ── Plans ───────────────────────────────────────────────────── */}
        <section aria-labelledby="plans-heading" className="mt-6">
          <Surface padding="none">
            <div className="p-5 pb-0">
              <SurfaceHeader
                title={<span id="plans-heading">Plans</span>}
                description={
                  plansQuery.isPending
                    ? undefined
                    : `${plans.length} ${plans.length === 1 ? 'plan' : 'plans'} on this treasury`
                }
              />
            </div>

            {plansQuery.isPending && (
              <div className="space-y-px p-5 pt-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            )}

            {plansQuery.isError && (
              <ErrorState
                error={plansQuery.error}
                onRetry={() => void plansQuery.refetch()}
                isRetrying={plansQuery.isFetching}
                title="Could not load your plans"
              />
            )}

            {!plansQuery.isPending && !plansQuery.isError && plans.length === 0 && (
              <EmptyState
                icon={Package}
                title="No plans yet"
                description="A plan defines what you charge, in which token, and how often. Create one to start accepting subscriptions."
              />
            )}

            {!plansQuery.isPending && !plansQuery.isError && plans.length > 0 && (
              /* A real table: the data is tabular, and a screen reader can
                 navigate it by column and row. The previous markup was nested
                 divs, which announces as an undifferentiated run of text. */
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                  <caption className="sr-only">
                    Subscription plans, with price, billing interval and status
                  </caption>
                  <thead>
                    <tr className="border-y border-line text-left">
                      <th scope="col" className="px-5 py-2.5 text-xs font-medium text-content-muted">
                        Plan
                      </th>
                      <th scope="col" className="px-5 py-2.5 text-xs font-medium text-content-muted">
                        Price
                      </th>
                      <th scope="col" className="px-5 py-2.5 text-xs font-medium text-content-muted">
                        Billing
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-2.5 text-right text-xs font-medium text-content-muted"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr
                        key={plan.id}
                        className="border-b border-line last:border-0 transition-colors duration-fast hover:bg-surface-overlay/60"
                      >
                        <th
                          scope="row"
                          className="px-5 py-3.5 text-left font-medium text-content-primary"
                        >
                          {plan.name}
                        </th>
                        <td className="tabular px-5 py-3.5 text-content-secondary">
                          {formatTokenAmount(plan.amount, plan.token)}
                        </td>
                        <td className="px-5 py-3.5 text-content-muted">
                          {formatInterval(plan.interval)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <StatusBadge status={plan.active ? 'active' : 'cancelled'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Surface>
        </section>
      </main>
    </>
  );
}
