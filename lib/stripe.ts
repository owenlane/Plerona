import 'server-only';
import Stripe from 'stripe';

/**
 * Lazily-instantiated Stripe client.
 *
 * Returns `null` when STRIPE_SECRET_KEY is not set so the site still builds,
 * deploys, and demonstrates the full checkout flow in preview environments.
 * Once the key is added, real payments turn on with no code change.
 */
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}

export const isStripeConfigured = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);
