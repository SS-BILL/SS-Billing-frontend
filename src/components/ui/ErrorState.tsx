import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

/**
 * Turn an unknown thrown value into something a user can act on.
 *
 * Axios rejections are the common case here; the raw `message` for those is
 * "Request failed with status code 401", which tells a merchant nothing about
 * what to do next.
 */
export function toErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong.';

  const status =
    typeof error === 'object' && error !== null && 'response' in error
      ? (error as { response?: { status?: number } }).response?.status
      : undefined;

  if (status === 401 || status === 403) {
    return 'Your session has expired. Reconnect your wallet to continue.';
  }
  if (status === 404) {
    return 'We could not find that record. It may have been removed.';
  }
  if (status === 429) {
    return 'Too many requests. Wait a moment and try again.';
  }
  if (typeof status === 'number' && status >= 500) {
    return 'The billing service is not responding. This is on our side — try again shortly.';
  }

  const isNetwork =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ERR_NETWORK';

  if (isNetwork) {
    return 'Could not reach the billing service. Check your connection and try again.';
  }

  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong.';
}

/**
 * Failure state with a recovery path.
 *
 * Both dashboards discarded query errors entirely — `useQuery` was destructured
 * for `data` only, so a 500 rendered as a permanently empty page with no
 * indication anything had failed.
 */
export function ErrorState({
  error,
  onRetry,
  isRetrying = false,
  title = 'Could not load this data',
  className,
}: {
  error?: unknown;
  onRetry?: () => void;
  isRetrying?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <div
      /* role=alert so the failure is announced rather than silently painted. */
      role="alert"
      className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
    >
      <div
        aria-hidden
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-danger/25 bg-danger/12"
      >
        <AlertCircle className="h-5 w-5 text-danger" />
      </div>
      <p className="text-sm font-semibold text-content-primary">{title}</p>
      <p className="mt-1.5 max-w-prose text-sm text-content-muted">{toErrorMessage(error)}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={onRetry}
          isLoading={isRetrying}
          loadingText="Retrying…"
          leadingIcon={<RefreshCw aria-hidden className="h-3.5 w-3.5" />}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
