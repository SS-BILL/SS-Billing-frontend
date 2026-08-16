'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from './Logo';

const LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
] as const;

/**
 * Marketing header.
 *
 * The previous version dropped its links entirely below the md breakpoint
 * with no menu button to replace them, so on a phone the site had no
 * navigation at all — only the logo and a CTA. This adds the disclosure that
 * was missing.
 */
export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  /* Lock the page behind the panel, and make sure resizing up to desktop
     doesn't leave the body stuck with overflow hidden. */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-sticky border-b border-line/60 bg-surface-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-content-muted transition-colors duration-fast hover:bg-surface-raised hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/subscriber"
            className="hidden h-11 items-center rounded-md px-3 text-sm font-medium text-content-muted transition-colors duration-fast hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            My subscriptions
          </Link>
          <Link
            href="/merchant"
            className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-on-primary transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          >
            Open dashboard
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-content-muted transition-colors duration-fast hover:bg-surface-raised hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {isOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        hidden={!isOpen}
        className={cn(
          'border-t border-line bg-surface-base md:hidden',
          isOpen && 'animate-fade-up',
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col p-3">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex h-12 items-center rounded-md px-3 text-sm font-medium text-content-secondary hover:bg-surface-raised hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/subscriber"
            onClick={() => setIsOpen(false)}
            className="flex h-12 items-center rounded-md px-3 text-sm font-medium text-content-secondary hover:bg-surface-raised hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            My subscriptions
          </Link>
        </nav>
      </div>
    </header>
  );
}
