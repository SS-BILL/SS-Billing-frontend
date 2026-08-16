'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, PauseCircle, PlayCircle, Receipt, XCircle } from 'lucide-react';
import { useState } from 'react';
import { subscriptionApi } from '../../lib/api';
import { formatDate, formatRelative, formatTokenAmount } from '../../lib/format';
import { useWallet } from '../../store/wallet.store';
import { AppHeader } from '../../components/layout/AppHeader';
import { SkipLink } from '../../components/layout/SkipLink';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState, toErrorMessage } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Surface } from '../../components/ui/Surface';
import { ConnectGate } from '../../components/wallet/ConnectGate';
import type { Subscription } from '../../types';

export default function SubscriberDashboard() {
  const { address } = useWallet();
  const queryClient = useQueryClient();

  /* Which subscription the confirm dialog is asking about, if any. */
  const [pendingCancel, setPendingCancel] = useState<Subscription | null>(null);
  /* Mutation failures are tracked per row: one subscription failing to pause
     must not blank the others or hide their controls. */
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);

  const subscriptionsQuery = useQuery({
    queryKey: ['subscriptions', address],
    queryFn: () => subscriptionApi.list(address!),
    enabled: !!address,
  });

  function mutationHandlers(onSettled?: () => void) {
    return {
      onMutate: () => setRowError(null),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        onSettled?.();
      },
      onError: (error: unknown, id: string) => {
        setRowError({ id, message: toErrorMessage(error) });
        onSettled?.();
      },
    };
  }

  const pause = useMutation({
    mutationFn: (id: string) => subscriptionApi.pause(id),
    ...mutationHandlers(),
  });

  const resume = useMutation({
    mutationFn: (id: string) => subscriptionApi.resume(id),
    ...mutationHandlers(),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => subscriptionApi.cancel(id),
    ...mutationHandlers(() => setPendingCancel(null)),
  });

  if (!address) {
    return (
      <>
        <SkipLink />
        <AppHeader />
        <main id="main" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <ConnectGate
            title="Connect your wallet"
            description="Your subscriptions are tied to the wallet that authorised them. Connect it to review what you are paying for and manage each one."
          />
        </main>
      </>
    );
  }

  const subscriptions = subscriptionsQuery.data ?? [];

  return (
    <>
      <SkipLink />
      <AppHeader />

      <main id="main" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-1 py-8">
          <h1 className="text-2xl font-semibold text-content-primary">Subscriptions</h1>
          <p className="text-sm text-content-muted">
            Everything the connected wallet is currently authorised to pay.
          </p>
        </div>

        {subscriptionsQuery.isPending && (
          <ul className="space-y-3">
            {[0, 1].map((i) => (
              <li key={i}>
                <Surface>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3.5 w-28" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-sm" />
                    <Skeleton className="h-8 w-20 rounded-sm" />
                  </div>
                </Surface>
              </li>
            ))}
          </ul>
        )}

        {subscriptionsQuery.isError && (
          <Surface padding="none">
            <ErrorState
              error={subscriptionsQuery.error}
              onRetry={() => void subscriptionsQuery.refetch()}
              isRetrying={subscriptionsQuery.isFetching}
              title="Could not load your subscriptions"
            />
          </Surface>
        )}

        {!subscriptionsQuery.isPending &&
          !subscriptionsQuery.isError &&
          subscriptions.length === 0 && (
            <Surface padding="none">
              <EmptyState
                icon={Receipt}
                title="No subscriptions yet"
                description="Once you authorise a plan from a merchant, it appears here and you can pause or cancel it at any time."
              />
            </Surface>
          )}

        {subscriptions.length > 0 && (
          /* A list, marked up as one — the previous version was a stack of
             divs, so assistive tech announced no item count and no
             boundaries between one subscription and the next. */
          <ul className="space-y-3">
            {subscriptions.map((sub) => {
              const isPausing = pause.isPending && pause.variables === sub.id;
              const isResuming = resume.isPending && resume.variables === sub.id;
              const isBusy = isPausing || isResuming;
              const error = rowError?.id === sub.id ? rowError.message : null;

              return (
                <li key={sub.id}>
                  <Surface as="article" aria-labelledby={`sub-${sub.id}-name`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2
                          id={`sub-${sub.id}-name`}
                          className="truncate text-base font-semibold text-content-primary"
                        >
                          {sub.plan?.name ?? 'Unnamed plan'}
                        </h2>
                        {sub.plan && (
                          <p className="tabular mt-0.5 text-sm text-content-secondary">
                            {formatTokenAmount(sub.plan.amount, sub.plan.token)}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>

                    {/* Next charge, stated in the terms a subscriber thinks in.
                        The absolute date stays available on hover and in the
                        datetime attribute. */}
                    {sub.status !== 'cancelled' && sub.nextBillingAt && (
                      <p className="mt-3 text-sm text-content-muted">
                        Next charge{' '}
                        <time
                          dateTime={sub.nextBillingAt}
                          title={formatDate(sub.nextBillingAt)}
                          className="font-medium text-content-secondary"
                        >
                          {formatRelative(sub.nextBillingAt)}
                        </time>
                      </p>
                    )}

                    {sub.status === 'grace_period' && (
                      <p className="mt-3 flex items-start gap-2 rounded-md border border-warning/25 bg-warning/12 px-3 py-2 text-sm text-warning">
                        <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          The last charge could not be collected
                          {typeof sub.retries === 'number' && sub.retries > 0
                            ? ` after ${sub.retries} ${sub.retries === 1 ? 'attempt' : 'attempts'}`
                            : ''}
                          . Top up your token balance — this subscription is
                          cancelled automatically if the grace period runs out.
                        </span>
                      </p>
                    )}

                    {error && (
                      <p
                        role="alert"
                        className="mt-3 rounded-md border border-danger/25 bg-danger/12 px-3 py-2 text-sm text-danger"
                      >
                        {error}
                      </p>
                    )}

                    {sub.status !== 'cancelled' && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {sub.status === 'active' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => pause.mutate(sub.id)}
                            isLoading={isPausing}
                            loadingText="Pausing…"
                            disabled={isBusy}
                            leadingIcon={<PauseCircle aria-hidden className="h-3.5 w-3.5" />}
                          >
                            Pause
                          </Button>
                        )}

                        {sub.status === 'paused' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => resume.mutate(sub.id)}
                            isLoading={isResuming}
                            loadingText="Resuming…"
                            disabled={isBusy}
                            leadingIcon={<PlayCircle aria-hidden className="h-3.5 w-3.5" />}
                          >
                            Resume
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPendingCancel(sub)}
                          disabled={isBusy}
                          className="text-danger hover:bg-danger/12 hover:text-danger"
                          leadingIcon={<XCircle aria-hidden className="h-3.5 w-3.5" />}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Surface>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <ConfirmDialog
        open={pendingCancel !== null}
        destructive
        title="Cancel this subscription?"
        description={`This ends billing for ${
          pendingCancel?.plan?.name ?? 'this plan'
        } and revokes the on-chain authorisation. Starting again means signing a new one in your wallet — it cannot be undone from here.`}
        confirmLabel="Cancel subscription"
        cancelLabel="Keep it"
        isPending={cancel.isPending}
        onConfirm={() => pendingCancel && cancel.mutate(pendingCancel.id)}
        onCancel={() => setPendingCancel(null)}
      />
    </>
  );
}
