import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Sa-Billing — Decentralized Subscription Billing on Stellar',
  description:
    'Automate recurring payments for your SaaS or membership platform — entirely enforced by Soroban smart contracts on the Stellar network. No intermediaries.',
  keywords: ['Stellar', 'Soroban', 'subscription billing', 'Web3', 'DeFi', 'smart contracts', 'recurring payments'],
  openGraph: {
    title: 'Sa-Billing — Decentralized Subscription Billing',
    description: 'Trustless recurring payments powered by Stellar Soroban smart contracts.',
    type: 'website',
  },
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
