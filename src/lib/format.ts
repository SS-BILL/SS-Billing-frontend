/**
 * Formatting for on-chain values.
 *
 * Everything the contract returns is a stringified integer in stroops
 * (1 unit = 10,000,000 stroops, Stellar's fixed 7-decimal representation).
 * These helpers are the only place that conversion happens — the UI had it
 * inlined as `Number(x) / 1e7` in five different components, each rendering a
 * different number of decimal places.
 */

/** Stellar represents all amounts as integers with 7 implied decimals. */
const STROOPS_PER_UNIT = 10_000_000n;
const DECIMALS = 7;

/**
 * Convert a stroop integer to a decimal number.
 *
 * Parsed as BigInt rather than with `Number(x) / 1e7`: a stroop value is an
 * i64 on-chain, and anything above ~900 million units exceeds
 * Number.MAX_SAFE_INTEGER, where plain division silently returns a wrong
 * amount. Splitting into whole and fractional parts before converting keeps
 * the result exact across the full contract range.
 */
export function stroopsToNumber(stroops: string | number | bigint | null | undefined): number {
  if (stroops === null || stroops === undefined || stroops === '') return 0;

  try {
    const raw = BigInt(typeof stroops === 'number' ? Math.trunc(stroops) : stroops);
    const negative = raw < 0n;
    const abs = negative ? -raw : raw;

    const whole = abs / STROOPS_PER_UNIT;
    const fraction = abs % STROOPS_PER_UNIT;
    const value = Number(whole) + Number(fraction) / Number(STROOPS_PER_UNIT);

    return negative ? -value : value;
  } catch {
    // A malformed value must not take the dashboard down with it.
    return 0;
  }
}

/**
 * Format a stroop amount as a currency-style figure.
 *
 * Trailing zeros are trimmed but at least two decimals are kept, so a column
 * of amounts stays visually aligned instead of ragged (29.00 / 9.50 / 199.00).
 */
export function formatAmount(
  stroops: string | number | bigint | null | undefined,
  options: { maximumFractionDigits?: number } = {},
): string {
  const value = stroopsToNumber(stroops);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: options.maximumFractionDigits ?? DECIMALS,
  }).format(value);
}

/** Format a stroop amount with its token symbol, e.g. "29.00 USDC". */
export function formatTokenAmount(
  stroops: string | number | bigint | null | undefined,
  token?: string | null,
): string {
  const amount = formatAmount(stroops, { maximumFractionDigits: 2 });
  return token ? `${amount} ${token}` : amount;
}

/**
 * Compact form for headline figures: 1.2M, 48.3K.
 * Used for stat tiles where the exact figure is available on hover/detail.
 */
export function formatCompact(stroops: string | number | bigint | null | undefined): string {
  const value = stroopsToNumber(stroops);
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Percentage with one decimal, e.g. "3.4%". */
export function formatPercent(value: string | number | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  if (!Number.isFinite(n)) return '0.0%';
  return `${n.toFixed(1)}%`;
}

/**
 * Render a billing interval in seconds as a human phrase.
 *
 * The dashboard previously printed `interval / 86400` and appended "d", so a
 * monthly plan read "30d" — technically true, but not how anyone describes a
 * subscription.
 */
export function formatInterval(seconds: string | number | null | undefined): string {
  const total = typeof seconds === 'string' ? parseInt(seconds, 10) : (seconds ?? 0);
  if (!Number.isFinite(total) || total <= 0) return '—';

  const days = Math.round(total / 86_400);

  if (days === 1) return 'daily';
  if (days === 7) return 'weekly';
  if (days === 14) return 'fortnightly';
  if (days >= 28 && days <= 31) return 'monthly';
  if (days >= 89 && days <= 92) return 'quarterly';
  if (days >= 364 && days <= 366) return 'yearly';

  if (days >= 1) return `every ${days} days`;

  const hours = Math.round(total / 3_600);
  if (hours >= 1) return `every ${hours}h`;
  return `every ${total}s`;
}

/** Absolute date, e.g. "15 Aug 2026". */
export function formatDate(value: string | number | Date | null | undefined): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Short date for chart axes, e.g. "15 Aug". */
export function formatDateShort(value: string | number | Date | null | undefined): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
}

/**
 * Relative time, e.g. "in 3 days" / "2 hours ago".
 *
 * Billing dates are the thing a subscriber actually wants to know, and
 * "in 3 days" answers that faster than a calendar date does.
 */
export function formatRelative(value: string | number | Date | null | undefined): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(deltaSeconds);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (abs < 60) return rtf.format(deltaSeconds, 'second');
  if (abs < 3_600) return rtf.format(Math.round(deltaSeconds / 60), 'minute');
  if (abs < 86_400) return rtf.format(Math.round(deltaSeconds / 3_600), 'hour');
  if (abs < 2_592_000) return rtf.format(Math.round(deltaSeconds / 86_400), 'day');
  if (abs < 31_536_000) return rtf.format(Math.round(deltaSeconds / 2_592_000), 'month');
  return rtf.format(Math.round(deltaSeconds / 31_536_000), 'year');
}

/**
 * Truncate a Stellar address for display: GABC…7XYZ.
 *
 * Keeps enough of both ends to verify against a wallet, which is what people
 * actually check. The full value belongs in a title/copy affordance.
 */
export function truncateAddress(address: string | null | undefined, visible = 4): string {
  if (!address) return '—';
  if (address.length <= visible * 2 + 1) return address;
  return `${address.slice(0, visible + 2)}…${address.slice(-visible)}`;
}
