'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

/**
 * Reveals its children as they scroll into view.
 *
 * Deliberately CSS transitions driven by a class toggle, not a JS animation
 * library. framer-motion drives opacity and transform through the Web
 * Animations API, and the global `prefers-reduced-motion` rule in globals.css
 * (`animation-duration: 0.01ms !important` on `*`) cancels those animations
 * partway through — leaving every revealed element frozen at opacity 0. The
 * entire landing page was blank for reduced-motion users because of it.
 *
 * A CSS transition has the opposite failure mode, which is the safe one: when
 * the duration collapses to near-zero the element lands on its final state
 * immediately. Three independent guarantees keep content from ever being
 * stuck hidden:
 *
 *   1. the reduced-motion media query paints .reveal fully visible outright
 *   2. if IntersectionObserver is unavailable, the element starts visible
 *   3. the observer disconnects after firing, so nothing can re-hide it
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Component = 'div',
}: {
  children: React.ReactNode;
  /** Stagger step in ms, for sequencing siblings. */
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref as never}
      className={cn('reveal', isVisible && 'reveal-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
