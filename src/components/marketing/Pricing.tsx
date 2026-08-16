import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Surface } from '../ui/Surface';
import { Reveal } from './Reveal';

/**
 * The protocol itself charges nothing, so the honest presentation is a
 * comparison of what each route costs rather than three invented tiers with
 * an invented "most popular" badge.
 *
 * The Stripe figure is its published standard rate; the Stellar figure is the
 * network's base fee. Both are stated as of the date below so the claim
 * carries its own expiry rather than quietly going stale.
 */
const RATES_AS_OF = 'August 2026';

const COLUMNS = [
  {
    name: 'SS-Billing',
    price: 'Network fee only',
    detail: '~$0.00001 per charge',
    emphasis: true,
    points: [
      { label: 'No percentage of revenue', included: true },
      { label: 'No fixed per-transaction fee', included: true },
      { label: 'Settles in ~5 seconds', included: true },
      { label: 'Chargebacks', included: false },
      { label: 'Card payments', included: false },
    ],
  },
  {
    name: 'Card processor',
    price: '2.9% + $0.30',
    detail: 'Standard published rate',
    emphasis: false,
    points: [
      { label: 'No percentage of revenue', included: false },
      { label: 'No fixed per-transaction fee', included: false },
      { label: 'Settles in ~5 seconds', included: false },
      { label: 'Chargebacks', included: true },
      { label: 'Card payments', included: true },
    ],
  },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl text-content-primary sm:text-4xl">
            The protocol takes nothing
          </h2>
          <p className="mt-4 max-w-prose text-content-secondary">
            There is no plan to choose and no account to upgrade. You pay the Stellar
            network fee per charge, which is a fraction of a cent. Here is how that
            compares with the alternative, including where cards are genuinely better.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COLUMNS.map((column, index) => (
            <Reveal key={column.name} delay={index * 60}>
              <Surface
                tone={column.emphasis ? 'accent' : 'raised'}
                padding="lg"
                className="flex h-full flex-col"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-content-muted">
                  {column.name}
                </h3>
                <p
                  className={cn(
                    'tabular mt-3 text-2xl font-semibold',
                    column.emphasis ? 'text-primary' : 'text-content-primary',
                  )}
                >
                  {column.price}
                </p>
                <p className="mt-1 text-sm text-content-muted">{column.detail}</p>

                <ul className="mt-6 space-y-2.5">
                  {column.points.map((point) => (
                    <li key={point.label} className="flex items-start gap-2.5 text-sm">
                      {/* Icon and label both change, so the distinction never
                          rests on colour alone. */}
                      {point.included ? (
                        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-content-subtle" />
                      )}
                      <span
                        className={
                          point.included ? 'text-content-secondary' : 'text-content-muted'
                        }
                      >
                        <span className="sr-only">
                          {point.included ? 'Included: ' : 'Not available: '}
                        </span>
                        {point.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {column.emphasis && (
                  <Link
                    href="/merchant"
                    className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-on-primary transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
                  >
                    Create your first plan
                  </Link>
                )}
              </Surface>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4 text-xs text-content-muted">
          Rates as published, {RATES_AS_OF}. Network fees vary with Stellar congestion.
        </Reveal>
      </div>
    </section>
  );
}
