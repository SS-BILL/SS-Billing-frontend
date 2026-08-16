import Link from 'next/link';
import { cn } from '../../lib/cn';

/**
 * The wordmark.
 *
 * The mark is a receipt/ledger glyph rather than the generic lightning bolt
 * the old header used — this product is recurring billing, and a bolt says
 * "fast" about something whose actual promise is "reliable".
 */
export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        className,
      )}
      aria-label="SS-Billing — home"
    >
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-primary/12"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4 text-primary" fill="none" aria-hidden>
          {/* Ledger sheet with a torn base — a receipt. */}
          <path
            d="M3.5 1.5h9v12l-1.8-1.2-1.8 1.2-1.8-1.2-1.8 1.2L3.5 13.5z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M6 5h4M6 7.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-sm font-semibold tracking-tight text-content-primary">
        SS<span className="text-primary">·</span>Billing
      </span>
    </Link>
  );
}
