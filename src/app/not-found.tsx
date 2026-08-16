import Link from 'next/link';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="tabular font-display text-5xl text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold text-content-primary">
          That page does not exist
        </h1>
        <p className="mt-2 text-sm text-content-muted">
          The link may be out of date. Both dashboards are reachable below.
        </p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/merchant"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-on-primary transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          >
            Merchant dashboard
          </Link>
          <Link
            href="/subscriber"
            className="inline-flex h-11 items-center justify-center rounded-md border border-line-strong px-5 text-sm font-medium text-content-secondary transition-colors duration-fast hover:border-primary/50 hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          >
            My subscriptions
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
