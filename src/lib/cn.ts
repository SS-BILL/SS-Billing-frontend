import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * earlier ones in the same group.
 *
 * Without twMerge, `cn('p-4', 'p-6')` emits both and the winner depends on
 * stylesheet order rather than call order — which is how a variant prop ends
 * up unable to override its own base styles.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
