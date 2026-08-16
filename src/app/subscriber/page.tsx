'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../../lib/api';
import { useWallet } from '../../store/wallet.store';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AppHeader } from '../../components/layout/AppHeader';

export default function SubscriberDashboard() {
  const { address } = useWallet();
  const qc = useQueryClient();

  const { data: subs = [] } = useQuery({
    queryKey: ['subscriptions', address],
    queryFn: () => subscriptionApi.list(address!),
    enabled: !!address,
  });

  const pause = useMutation({
    mutationFn: (id: string) => subscriptionApi.pause(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
  const resume = useMutation({
    mutationFn: (id: string) => subscriptionApi.resume(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
  const cancel = useMutation({
    mutationFn: (id: string) => subscriptionApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });

  if (!address) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <p className="text-gray-400">Connect your wallet to view your subscriptions.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-8">My Subscriptions</h1>
        <div className="space-y-4">
          {subs.map((sub: any) => (
            <div key={sub.id} className="glass p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{sub.plan?.name ?? 'Unknown Plan'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Next billing: {sub.nextBillingAt ? new Date(sub.nextBillingAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <StatusBadge status={sub.status} />
              </div>
              <div className="flex gap-2 mt-4">
                {sub.status === 'active' && (
                  <button
                    onClick={() => pause.mutate(sub.id)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                  >
                    Pause
                  </button>
                )}
                {sub.status === 'paused' && (
                  <button
                    onClick={() => resume.mutate(sub.id)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                  >
                    Resume
                  </button>
                )}
                {sub.status !== 'cancelled' && (
                  <button
                    onClick={() => cancel.mutate(sub.id)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
          {subs.length === 0 && (
            <div className="glass p-10 text-center text-gray-500">No active subscriptions.</div>
          )}
        </div>
      </div>
    </>
  );
}
