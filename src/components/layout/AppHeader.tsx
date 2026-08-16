'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt } from 'lucide-react';
import { cn } from '../../lib/cn';
import { WalletButton } from '../wallet/WalletButton';
import { Logo } from './Logo';

const NAV = [
  { href: '/merchant', label: 'Merchant', icon: LayoutDashboard },
  { href: '/subscriber', label: 'Subscriptions', icon: Receipt },
] as const;

/**
 * Header for the authenticated surfaces.
 *
 * Both dashboards previously rendered the marketing navbar — Features,
 * Pricing, How It Works, and a "Launch App" button pointing at the page the
 * user was already on. None of it applied once you were inside the product,
 * and the wallet, the one control the dashboards actually depend on, appeared
 * nowhere.
 *
 * The nav also had no active state, so nothing indicated which of the two
 * dashboards you were looking at.
 */
export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-sticky border-b border-line bg-surface-base/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-6">
          <Logo />

          {/* aria-label distinguishes this from the footer's nav landmark. */}
          <nav aria-label="Dashboard" className="flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  /* aria-current is what conveys "you are here" to a screen
                     reader; the colour and underline alone convey nothing. */
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium',
                    'transition-colors duration-fast ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
                    isActive
                      ? 'text-content-primary'
                      : 'text-content-muted hover:bg-surface-raised hover:text-content-primary',
                  )}
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <WalletButton />
      </div>
    </header>
  );
}
