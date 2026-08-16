import { cn } from '../../lib/cn';

/**
 * Placeholder block shown while data loads.
 *
 * Both dashboards previously rendered nothing at all until the query
 * resolved — a blank page with a heading, which reads as broken rather than
 * as loading. A skeleton also reserves the space the content will occupy, so
 * arriving data doesn't shift the layout under the user (CLS).
 *
 * aria-hidden because a screen reader should hear the region's busy state,
 * announced once by the container, not a description of grey rectangles.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-sm bg-surface-overlay',
        /* The sweep is a child pseudo-element so the reduced-motion rule in
           globals.css can stop it without hiding the placeholder itself. */
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer',
        'after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent',
        className,
      )}
    />
  );
}

/** Skeleton shaped like a line of text. */
export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

/**
 * Wraps a loading region so assistive tech is told the content is pending
 * and is then told once when it arrives, instead of silently swapping.
 */
export function LoadingRegion({
  isLoading,
  label,
  children,
}: {
  isLoading: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div aria-busy={isLoading} aria-live="polite" aria-label={isLoading ? label : undefined}>
      {children}
    </div>
  );
}
