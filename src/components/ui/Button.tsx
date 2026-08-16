import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

const button = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium rounded-md cursor-pointer select-none',
    'transition-[background-color,border-color,color,box-shadow,transform]',
    'duration-fast ease-out',
    /* Focus is handled here rather than left to the global rule so the ring
       sits correctly against each variant's own background. */
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
    /* Disabled must look disabled AND stop responding — opacity alone still
       leaves a control that appears pressable. */
    'disabled:pointer-events-none disabled:opacity-50',
    /* Press feedback, subtle enough not to shift surrounding layout. */
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover shadow-sm',
        secondary:
          'bg-surface-raised text-content-primary border border-line-strong hover:border-primary/50 hover:bg-surface-overlay',
        ghost: 'text-content-muted hover:text-content-primary hover:bg-surface-raised',
        danger:
          'bg-danger/12 text-danger border border-danger/30 hover:bg-danger/20 hover:border-danger/50',
        outline:
          'border border-line-strong text-content-secondary hover:text-content-primary hover:border-primary/50',
      },
      size: {
        /* Every size clears the 44px touch minimum except `sm`, which is
           reserved for desktop-density table rows where the row itself is the
           larger target. */
        sm: 'h-8 px-3 text-xs rounded-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  /** Shows a spinner, disables interaction, and announces busy state. */
  isLoading?: boolean;
  /** Replaces the label while loading, so the control explains itself. */
  loadingText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    fullWidth,
    isLoading = false,
    loadingText,
    leadingIcon,
    trailingIcon,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      /* Disabled while in flight: the pause/cancel mutations were previously
         re-firable mid-request, which queues duplicate billing calls. */
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(button({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {isLoading ? (
        <Loader2 aria-hidden className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        leadingIcon
      )}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && trailingIcon}
    </button>
  );
});
