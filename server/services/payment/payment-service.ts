/**
 * Payment Service — Factory / Router
 * Routes payment calls to the active provider (SwipesBlue or Stripe).
 * Reads ACTIVE_PAYMENT_PROVIDER env var (default: swipesblue).
 */

import type { PaymentProvider } from './payment-provider.js';
import { SwipesBlueProvider } from './swipesblue-provider.js';
import { StripeProvider } from './stripe-provider.js';

export type PaymentProviderName = 'swipesblue' | 'stripe';

const providers: Record<PaymentProviderName, () => PaymentProvider> = {
  swipesblue: () => new SwipesBlueProvider(),
  stripe: () => new StripeProvider(),
};

let cachedProvider: PaymentProvider | null = null;
let cachedProviderName: PaymentProviderName | null = null;

export function getActiveProviderName(): PaymentProviderName {
  const env = (process.env.ACTIVE_PAYMENT_PROVIDER || 'swipesblue').toLowerCase();
  if (env === 'stripe' || env === 'swipesblue') return env;
  return 'swipesblue';
}

export function getPaymentProvider(name?: PaymentProviderName): PaymentProvider {
  const providerName = name || getActiveProviderName();

  // Return cached instance if same provider
  if (cachedProvider && cachedProviderName === providerName) {
    return cachedProvider;
  }

  const factory = providers[providerName];
  if (!factory) {
    throw new Error(`Unknown payment provider: ${providerName}`);
  }

  cachedProvider = factory();
  cachedProviderName = providerName;
  return cachedProvider;
}

/**
 * Get a provider by name without caching (for webhook verification, where both
 * providers might receive webhooks).
 */
export function getProviderByName(name: PaymentProviderName): PaymentProvider {
  const factory = providers[name];
  if (!factory) throw new Error(`Unknown payment provider: ${name}`);
  return factory();
}

export { PaymentProvider } from './payment-provider.js';
