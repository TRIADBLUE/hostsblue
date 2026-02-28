/**
 * Stripe Payment Provider (Stub)
 * Future integration — throws "not configured" errors when called.
 */

import crypto from 'crypto';
import type {
  PaymentProvider,
  PaymentSessionData,
  RefundData,
  PaymentStatus,
  RefundResult,
  CustomerData,
  SubscriptionData,
} from './payment-provider.js';

export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe';

  private assertConfigured(): void {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY to enable.');
    }
  }

  async createPaymentSession(_data: PaymentSessionData, _idempotencyKey?: string): Promise<string> {
    this.assertConfigured();
    // Future: Stripe Checkout Session creation
    throw new Error('Stripe payment sessions not yet implemented');
  }

  async getPaymentStatus(_paymentId: string): Promise<PaymentStatus> {
    this.assertConfigured();
    throw new Error('Stripe payment status not yet implemented');
  }

  async processRefund(_data: RefundData): Promise<RefundResult> {
    this.assertConfigured();
    throw new Error('Stripe refunds not yet implemented');
  }

  verifyWebhookSignature(_payload: any, _signature: string): boolean {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return false;
    // Future: stripe.webhooks.constructEvent()
    return false;
  }

  async createCustomer(_data: CustomerData): Promise<any> {
    this.assertConfigured();
    throw new Error('Stripe customer creation not yet implemented');
  }

  async attachPaymentMethod(_customerId: string, _paymentMethodId: string): Promise<any> {
    this.assertConfigured();
    throw new Error('Stripe payment method attachment not yet implemented');
  }

  async createSubscription(_data: SubscriptionData): Promise<any> {
    this.assertConfigured();
    throw new Error('Stripe subscriptions not yet implemented');
  }

  async cancelSubscription(_subscriptionId: string, _atPeriodEnd?: boolean): Promise<any> {
    this.assertConfigured();
    throw new Error('Stripe subscription cancellation not yet implemented');
  }

  async getInvoice(_invoiceId: string): Promise<any> {
    this.assertConfigured();
    throw new Error('Stripe invoice retrieval not yet implemented');
  }
}
