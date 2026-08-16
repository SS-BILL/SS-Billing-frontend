'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../components/ui/Button';

/**
 * Route-level error boundary.
 *
 * Without this file a render error anywhere in the tree falls through to
 * Next's default error page — which in production is an unstyled "Application
 * error: a client-side exception has occurred" with no way back into the app.
 * On a billing dashboard that is where the user's session ends.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* Where an error reporter would be wired. Deliberately not console.error:
       the digest is what correlates this render with the server log, and the
       stack is already in the browser's own console. */
  }, [error]);

  return (
    <main
      id="main"
      className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center"
    >
      <div
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full border border-danger/25 bg-danger/12"
      >
        <AlertCircle className="h-6 w-6 text-danger" />
      </div>

      <h1 className="mt-5 text-xl font-semibold text-content-primary">Something broke</h1>
      <p className="mt-2 max-w-prose text-sm text-content-muted">
        This screen failed to render. Your subscriptions and any scheduled charges are
        unaffected — this is a display fault, not a billing one.
      </p>

      {error.digest && (
        <p className="mt-4 rounded-md border border-line bg-surface-raised px-3 py-2 font-mono text-xs text-content-muted">
          Reference: {error.digest}
        </p>
      )}

      <Button className="mt-7" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
