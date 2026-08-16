'use client';

import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';

/**
 * Tracks the OS reduced-motion setting.
 *
 * The CSS media query in globals.css neutralises CSS animations, but
 * framer-motion animates inline styles via JS and is completely unaffected by
 * it. Every motion component on the landing page therefore has to consult
 * this directly — otherwise "reduce motion" silently does nothing for the
 * majority of the page's movement.
 *
 * Starts false and resolves in an effect so server and client markup match on
 * first paint.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}

/**
 * Entrance for a section as it scrolls into view.
 *
 * Under reduced motion the element still appears — it just arrives without
 * travel. Returning `undefined` variants instead would leave content stuck at
 * opacity 0 for exactly the users who asked for less movement.
 */
export function fadeUp(prefersReduced: boolean, distance = 12): Variants {
  return {
    hidden: { opacity: 0, y: prefersReduced ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };
}

/** Container that reveals its children in sequence. */
export function stagger(prefersReduced: boolean, step = 0.06): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReduced ? 0 : step },
    },
  };
}

/** Shared viewport config: animate once, slightly before fully in view. */
export const viewportOnce = { once: true, margin: '-80px' } as const;
