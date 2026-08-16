import { Eye, Lock, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Reveal } from './Reveal';

const CAPABILITIES = [
  {
    icon: Lock,
    title: 'Non-custodial',
    body: 'Funds move from subscriber to merchant. The protocol never holds a balance, so there is nothing to freeze and nothing to lose.',
  },
  {
    icon: Eye,
    title: 'Auditable by anyone',
    body: 'Every charge is a ledger entry. Your subscribers can verify what they were billed without asking you for a receipt.',
  },
  {
    icon: RefreshCw,
    title: 'Retries and grace periods',
    body: 'A failed charge enters a grace period and retries on a schedule you set, instead of silently dropping the subscription.',
  },
  {
    icon: ShieldCheck,
    title: 'Permissionless collection',
    body: 'Anyone can call process_payment; the contract decides whether a charge is actually due. Your keeper going down delays revenue, it does not lose it.',
  },
] as const;

/**
 * Platform section.
 *
 * The previous bento grid filled its cards with mock product screenshots —
 * a fake subscription list, three invented "recent payments" of $29/$9/$199 —
 * which showed what the UI looks like rather than saying what the product
 * does. This states the four properties that actually distinguish it, in the
 * terms a merchant evaluates.
 */
export function Features() {
  return (
    <section id="platform" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl text-content-primary sm:text-4xl">
            What you get that a card processor cannot give you
          </h2>
          <p className="mt-4 max-w-prose text-content-secondary">
            Subscription billing is mostly a trust problem: the subscriber trusts you
            to charge the right amount, and you trust a processor to actually collect.
            Both assumptions move on-chain here.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Lead card: the authorisation model, which is the thing everything
              else follows from. */}
          <Reveal className="md:col-span-2">
            <Surface tone="accent" padding="lg" className="relative overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.12),transparent_70%)]"
              />
              <div className="relative max-w-xl">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/12">
                  <Wallet aria-hidden className="h-4 w-4 text-primary" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-content-primary">
                  One signature, then it runs unattended
                </h3>
                <p className="mt-2 text-content-secondary">
                  The subscriber authorises the contract once from their wallet. Every
                  cycle after that settles without them present and without you holding
                  a payment credential — because there is no credential to hold.
                </p>
              </div>
            </Surface>
          </Reveal>

          {CAPABILITIES.map(({ icon: Icon, title, body }, index) => (
            <Reveal key={title} delay={index * 60}>
              <Surface padding="lg" className="h-full">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface-overlay">
                  <Icon aria-hidden className="h-4 w-4 text-content-secondary" />
                </span>
                <h3 className="mt-4 font-semibold text-content-primary">{title}</h3>
                <p className="mt-2 text-sm text-content-secondary">{body}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
