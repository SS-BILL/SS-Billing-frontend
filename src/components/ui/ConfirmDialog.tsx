'use client';

import { AlertTriangle } from 'lucide-react';
import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm control as destructive and warns in the body. */
  destructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Confirmation step for irreversible actions.
 *
 * Cancelling a subscription tears down an on-chain authorisation: the
 * subscriber has to re-sign with their wallet to start again, so a misclick
 * costs them a wallet round-trip, not an undo. It was wired directly to a
 * single click with no confirmation.
 *
 * Implements the dialog pattern properly rather than approximating it — the
 * half-built version of this is what makes keyboard users unable to escape a
 * modal:
 *   - focus moves into the dialog on open and returns to the trigger on close
 *   - Tab cycles within the dialog instead of walking the page behind it
 *   - Escape and the backdrop both dismiss
 *   - the page behind is inert to scroll and hidden from assistive tech
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Keep it',
  destructive = false,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  /* Never dismiss out from under an in-flight request — the user would be
     left unsure whether the cancellation actually went through. */
  const requestClose = useCallback(() => {
    if (!isPending) onCancel();
  }, [isPending, onCancel]);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;

    /* Focus the dialog itself, not the confirm button: landing on the
       destructive action means a stray Enter completes it. */
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open, requestClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-end justify-center p-4 sm:items-center">
      {/* Scrim: strong enough to isolate the dialog from the dashboard behind it. */}
      <div
        aria-hidden
        onClick={requestClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-up"
      />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-lg border border-line-strong bg-surface-overlay p-6 shadow-lg outline-none animate-fade-up"
      >
        <div className="flex gap-4">
          {destructive && (
            <div
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-danger/25 bg-danger/12"
            >
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
          )}
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-content-primary">
              {title}
            </h2>
            <p id={descriptionId} className="mt-2 text-sm text-content-secondary">
              {description}
            </p>
          </div>
        </div>

        {/* Confirm sits last so the safe choice is the first thing reached. */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={requestClose} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isPending}
            loadingText="Working…"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
