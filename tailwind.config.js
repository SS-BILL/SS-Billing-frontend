/** @type {import('tailwindcss').Config} */

/**
 * Every colour resolves to a CSS custom property defined in globals.css.
 * The <alpha-value> placeholder lets Tailwind's opacity modifiers work on
 * token colours, so `bg-primary/12` stays possible without a second token.
 */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: token('surface-base'),
          base: token('surface-base'),
          sunken: token('surface-sunken'),
          raised: token('surface-raised'),
          overlay: token('surface-overlay'),
        },
        content: {
          DEFAULT: token('text-secondary'),
          primary: token('text-primary'),
          secondary: token('text-secondary'),
          muted: token('text-muted'),
          subtle: token('text-subtle'),
        },
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
        },
        'on-primary': token('on-primary'),
        accent: token('accent'),
        success: token('success'),
        warning: token('warning'),
        danger: token('danger'),
        info: token('info'),
        line: {
          DEFAULT: token('border'),
          strong: token('border-strong'),
        },
        ring: token('ring'),
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
      },

      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },

      zIndex: {
        raised: 'var(--z-raised)',
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },

      /* A 12/14/16/18/20/24/30/36/48/60/72 ramp. Body never drops below 14px,
         and 16px is the mobile input floor that stops iOS auto-zoom. */
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
      },

      maxWidth: {
        /* ~68 characters at base size — the readable measure for body copy. */
        prose: '34rem',
      },

      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },

      animation: {
        'fade-up': 'fade-up var(--duration-slow) var(--ease-out) both',
        shimmer: 'shimmer 1.8s infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
