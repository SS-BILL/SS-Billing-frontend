import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '../components/layout/Providers';

/**
 * Three faces, each with a job:
 *   Instrument Serif — display only. A high-contrast editorial serif reads as
 *     financial-institutional rather than as another web3 grotesque.
 *   Inter — the entire UI. Neutral, excellent at small sizes.
 *   JetBrains Mono — figures, addresses, hashes. Monospaced so amounts line up
 *     in a column and a 56-character Stellar address can be read a character
 *     at a time.
 *
 * The files are vendored under src/fonts and loaded with next/font/local
 * rather than next/font/google. Both self-host the result, but the local
 * variant needs no network at build time, so CI and offline builds are
 * deterministic and can't fail on a Google Fonts fetch.
 *
 * Inter and JetBrains Mono are variable fonts — one file covers the whole
 * weight range instead of one request per weight.
 */

const inter = localFont({
  src: '../fonts/Inter-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
  /* Metric-matched fallback: reserves the right space before the webfont
     lands, so swapping it in doesn't shift layout (CLS). */
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const instrumentSerif = localFont({
  src: [
    { path: '../fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

const jetbrainsMono = localFont({
  src: '../fonts/JetBrainsMono-Variable.woff2',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});

const TITLE = 'SS-Billing — subscription billing on Stellar';
const DESCRIPTION =
  'Your subscriber signs once and a Soroban smart contract collects on schedule. Non-custodial recurring payments with no percentage cut and no card processor.';

export const metadata: Metadata = {
  title: {
    default: TITLE,
    /* Dashboard routes supply their own title and get the product name
       appended, instead of every page sharing one string. */
    template: '%s — SS-Billing',
  },
  description: DESCRIPTION,
  applicationName: 'SS-Billing',
  keywords: [
    'Stellar',
    'Soroban',
    'subscription billing',
    'recurring payments',
    'smart contracts',
    'USDC',
    'SEP-41',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'SS-Billing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* Deliberately not setting maximumScale or userScalable: blocking pinch
     zoom is a WCAG failure, and it is the single most common way a mobile
     viewport tag breaks accessibility. */
  themeColor: '#070b14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
