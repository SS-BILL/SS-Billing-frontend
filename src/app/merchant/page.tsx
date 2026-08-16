'use client';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, planApi } from '../../lib/api';
import { useWallet } from '../../store/wallet.store';
import { StatCard } from '../../components/ui/StatCard';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { Navbar } from '../../components/layout/Navbar';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function MerchantDashboard() {
  const { address } = useWallet();

  const { data: stats } = useQuery({
    queryKey: ['merchant-stats', address],
    queryFn: () => analyticsApi.stats(address!),
    enabled: !!address,
  });

  const { data: revenue = [] } = useQuery({
    queryKey: ['merchant-revenue', address],
    queryFn: () => analyticsApi.revenue(address!),
    enabled: !!address,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['plans', address],
    queryFn: () => planApi.list(address!),
    enabled: !!address,
  });

  if (!address) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <p className="text-gray-400">Connect your wallet to view the merchant dashboard.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-8">Merchant Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="MRR" value={`$${Number(stats?.mrr ?? 0) / 1e7}`} emphasis />
          <StatCard label="ARR" value={`$${Number(stats?.arr ?? 0) / 1e7}`} />
          <StatCard label="Active Subs" value={stats?.activeSubscriptions ?? '—'} />
          <StatCard label="Churn Rate" value={`${stats?.churnRate ?? '0'}%`} />
        </div>

        <div className="mb-8">
          <RevenueChart data={revenue} />
        </div>

        <div className="glass p-5">
          <h2 className="font-semibold mb-4">Plans</h2>
          <div className="space-y-3">
            {plans.map((plan: any) => (
              <div key={plan.id} className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-xs text-gray-500">{plan.token}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{Number(plan.amount) / 1e7} / {Number(plan.interval) / 86400}d</span>
                  <StatusBadge status={plan.active ? 'active' : 'cancelled'} />
                </div>
              </div>
            ))}
            {plans.length === 0 && <p className="text-gray-500 text-sm">No plans yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
