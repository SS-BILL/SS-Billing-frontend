import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

const FIGURES = [
  { value: '$0.00001', label: 'Median network fee' },
  { value: '~5s', label: 'Settlement time' },
  { value: '0%', label: 'Platform cut' },
] as const;

/**
 * Landing hero.
 *
 * Rewritten around a claim a merchant can evaluate. The previous version led
 * with "The billing layer for decentralized apps" over a purple gradient —
 * a category label, not a reason to keep reading — and sat above four
 * invented metrics ($2.4M volume, 1,280 plans, 99.98% uptime) presented as
 * live figures on a product that has not launched.
 *
 * The figures here are properties of the Stellar network and the contract's
 * design, which are true today and checkable, rather than fabricated traction.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      {/* Single restrained wash. The old hero stacked three radial gradients
          plus a fixed dot-grid overlay across the entire page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,hsl(var(--primary)/0.10),transparent)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs font-medium text-content-muted"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
          Running on Stellar Soroban
        </Reveal>

        <h1
          className="reveal reveal-visible font-display mt-6 text-4xl leading-[1.05] text-content-primary sm:text-6xl"
        >
          Recurring payments that
          <br />
          <span className="italic text-primary">collect themselves</span>
        </h1>

        <Reveal delay={60} className="mx-auto mt-5 max-w-prose text-base text-content-secondary"
        >
          Your subscriber signs once. After that a smart contract charges them on
          schedule — no card processor, no chargebacks, no billing cron of your
          own to keep alive at 3am.
        </Reveal>

        <Reveal delay={120} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/merchant"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-on-primary transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base sm:w-auto"
          >
            Open merchant dashboard
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <Link
            href="/subscriber"
            className="inline-flex h-12 w-full items-center justify-center rounded-md border border-line-strong px-6 text-sm font-medium text-content-secondary transition-colors duration-fast hover:border-primary/50 hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base sm:w-auto"
          >
            Manage my subscriptions
          </Link>
        </Reveal>

        <dl
          className="reveal reveal-visible mx-auto mt-14 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3"
        >
          {FIGURES.map(({ value, label }) => (
            <div key={label} className="bg-surface-raised px-4 py-5 text-center">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="tabular block text-xl font-semibold text-content-primary">
                  {value}
                </span>
                <span aria-hidden className="mt-1 block text-xs text-content-muted">
                  {label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
