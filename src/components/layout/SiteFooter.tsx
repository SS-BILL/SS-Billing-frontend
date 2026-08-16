import Link from 'next/link';
import { Logo } from './Logo';

const PRODUCT = [
  { href: '/merchant', label: 'Merchant dashboard' },
  { href: '/subscriber', label: 'My subscriptions' },
  { href: '#pricing', label: 'Pricing' },
] as const;

const RESOURCES = [
  { href: 'https://github.com/SS-BILL/SS-Billing-contract', label: 'Contract source' },
  { href: 'https://github.com/SS-BILL/SS-Billing-backend', label: 'API source' },
  { href: 'https://developers.stellar.org/docs/build/smart-contracts', label: 'Soroban docs' },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-content-muted">
            Subscription billing enforced by Soroban smart contracts on Stellar.
          </p>
        </div>

        <nav aria-labelledby="footer-product">
          <h2 id="footer-product" className="text-xs font-semibold uppercase tracking-wide text-content-primary">
            Product
          </h2>
          <ul className="mt-3 space-y-2">
            {PRODUCT.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-sm text-sm text-content-muted transition-colors duration-fast hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-resources">
          <h2 id="footer-resources" className="text-xs font-semibold uppercase tracking-wide text-content-primary">
            Resources
          </h2>
          <ul className="mt-3 space-y-2">
            {RESOURCES.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  /* noopener is the security-relevant half: without it the
                     opened page can reach back through window.opener. */
                  rel="noopener noreferrer"
                  className="rounded-sm text-sm text-content-muted transition-colors duration-fast hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-2 border-t border-line pt-6 text-xs text-content-muted sm:flex-row sm:items-center sm:justify-between">
        <p>MIT licensed. No warranty — audit the contract before moving real value.</p>
        <p>Testnet deployment. Not yet audited.</p>
      </div>
    </footer>
  );
}
