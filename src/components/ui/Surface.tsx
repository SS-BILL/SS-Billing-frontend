import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

const surface = cva('rounded-lg transition-colors duration-normal ease-out', {
  variants: {
    tone: {
      /* The default card. One border, one background — no backdrop blur.
         The old .glass class stacked a 20px blur on every card, which costs a
         compositor layer each and buys nothing over an opaque background on a
         dark ground. */
      raised: 'bg-surface-raised border border-line',
      sunken: 'bg-surface-sunken border border-line',
      overlay: 'bg-surface-overlay border border-line-strong shadow-lg',
      /* Used sparingly — for the one card per view that should lead. */
      accent: 'bg-surface-raised border border-primary/25 shadow-md',
      bare: '',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6 sm:p-8',
    },
    interactive: {
      true: [
        'cursor-pointer',
        'hover:border-line-strong hover:bg-surface-overlay',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
      ],
    },
  },
  defaultVariants: {
    tone: 'raised',
    padding: 'md',
  },
});

export interface SurfaceProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof surface> {
  /** Render as a semantic element — section, article, li — instead of a div. */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * The single card container for the app.
 *
 * Replaces the ad-hoc `.glass` / `.glass-hover` pair, which hardcoded a
 * 20px radius and a purple hover glow into every surface regardless of
 * context, and could not be rendered as anything but a div.
 */
export function Surface({
  as: Component = 'div',
  tone,
  padding,
  interactive,
  className,
  children,
  ...rest
}: SurfaceProps) {
  return (
    <Component className={cn(surface({ tone, padding, interactive }), className)} {...rest}>
      {children}
    </Component>
  );
}

/** Section heading + optional action, with consistent spacing below. */
export function SurfaceHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-content-primary">{title}</h2>
        {description && <p className="text-xs text-content-muted mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
