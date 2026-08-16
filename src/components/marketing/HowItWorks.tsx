import { Reveal } from './Reveal';

const STEPS = [
  {
    title: 'Register your treasury',
    body: 'Connect the wallet that should receive revenue. It becomes the merchant identity the contract pays out to.',
  },
  {
    title: 'Define a plan',
    body: 'Amount, SEP-41 token, interval, grace period. The plan lives on-chain, so its terms cannot be changed behind a subscriber’s back.',
  },
  {
    title: 'Subscribers authorise once',
    body: 'They approve the plan in Freighter. That single signature is the whole of their involvement.',
  },
  {
    title: 'Charges settle on schedule',
    body: 'When a cycle comes due, process_payment moves the tokens straight to your treasury and writes the receipt to the ledger.',
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-line bg-surface-sunken px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-display text-3xl text-content-primary sm:text-4xl">
            Four steps, then it is someone else’s problem
          </h2>
        </Reveal>

        {/* An ordered list, because the order is the content. The previous
            version was a div grid with the numbers painted on as decoration,
            so nothing conveyed sequence to a screen reader. */}
        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, body }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 60}
              className="flex flex-col bg-surface-raised p-6"
            >
              <span
                aria-hidden
                className="tabular text-xs font-semibold text-primary"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-semibold text-content-primary">{title}</h3>
              <p className="mt-2 text-sm text-content-secondary">{body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
