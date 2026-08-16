'use client';

const ITEMS = [
  'Stellar Soroban',
  'SEP-41 tokens',
  'USDC · XLM',
  'Non-custodial',
  'Freighter wallet',
  'On-chain receipts',
] as const;

/**
 * Technology strip.
 *
 * Was a marquee whose items were emoji-prefixed strings — "⚡ Stellar
 * Soroban", "🔒 Non-Custodial" — rendered at #334155 on a near-black ground,
 * roughly 2:1 contrast. Illegible, and emoji render differently on every
 * platform, so the "icons" were inconsistent as well.
 *
 * The scroll is also gone. It moved continuously, could only be paused by
 * hovering, and CSS reduced-motion stopped it mid-sweep leaving items clipped
 * at the container edge. Six items fit on one line at every breakpoint, so
 * the animation was solving a problem that did not exist.
 */
export function TrustBar() {
  return (
    <section
      aria-label="Built with"
      className="border-y border-line px-4 py-5 sm:px-6"
    >
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {ITEMS.map((item) => (
          <li key={item} className="text-xs font-medium tracking-wide text-content-muted">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
