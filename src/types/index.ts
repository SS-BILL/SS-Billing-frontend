/**
 * Domain types mirroring the API responses.
 *
 * The dashboards typed every record as `any` and reached into fields directly,
 * so a renamed or missing field surfaced as `undefined` rendered into the DOM
 * rather than as a type error at build time.
 *
 * Monetary fields are `string` on purpose: the API sends stroop integers as
 * strings to survive JSON without precision loss, and they stay strings until
 * they reach the formatters in lib/format.
 */

/** The lifecycle states a subscription can be in, as emitted by the contract. */
export const SUBSCRIPTION_STATUSES = [
  'active',
  'paused',
  'cancelled',
  'grace_period',
  'failed',
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

/** Narrowing guard for a status arriving from the network. */
export function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return typeof value === 'string' && SUBSCRIPTION_STATUSES.includes(value as SubscriptionStatus);
}

export interface Plan {
  id: string;
  name: string;
  /** SEP-41 token symbol, e.g. USDC. */
  token: string;
  /** Stroop integer as a string. */
  amount: string;
  /** Billing period in seconds. */
  interval: string | number;
  active: boolean;
  /** Seconds after a failed charge before the subscription is cancelled. */
  gracePeriod?: string | number;
  createdAt?: string;
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  subscriberAddress?: string;
  plan?: Plan | null;
  nextBillingAt?: string | null;
  lastBilledAt?: string | null;
  /** Consecutive failed charge attempts; drives the grace-period messaging. */
  retries?: number;
  createdAt?: string;
}

export interface PaymentLog {
  id: string;
  subscriptionId: string;
  amount: string;
  token?: string;
  success: boolean;
  /** Populated only on failure. */
  error?: string | null;
  txHash?: string | null;
  createdAt: string;
}

export interface MerchantStats {
  /** Monthly recurring revenue, in stroops. */
  mrr: string;
  /** Annual recurring revenue, in stroops. */
  arr: string;
  activeSubscriptions: number;
  /** Percentage, already expressed 0–100. */
  churnRate: string | number;
  totalSubscribers?: number;
  failedPayments?: number;
}

export interface RevenuePoint {
  date: string;
  /** Stroop integer as a string. */
  revenue: string;
}
