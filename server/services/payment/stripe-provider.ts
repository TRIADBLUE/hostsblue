/**
 * Stripe Payment Provider
 * Full implementation using Stripe Checkout Sessions.
 * Only active when STRIPE_SECRET_KEY is set.
 */

import Stripe from 'stripe';
import type {
  PaymentProvider,
  PaymentSessionData,
  RefundData,
  PaymentStatus,
  RefundResult,
  CustomerData,
  SubscriptionData,
} from './payment-provider.js';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-03-31.basil' as any });
}

export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe';

  private getClient(): Stripe {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY to enable.');
    }
    return stripe;
  }

  async createPaymentSession(data: PaymentSessionData, idempotencyKey?: string): Promise<string> {
    const stripe = this.getClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.customerEmail,
      line_items: [{
        price_data: {
          currency: data.currency.toLowerCase(),
          product_data: {
            name: `Order ${data.orderNumber}`,
            metadata: { orderId: String(data.orderId) },
          },
          unit_amount: data.amount,
        },
        quantity: 1,
      }],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        orderId: String(data.orderId),
        orderNumber: data.orderNumber,
        ...data.metadata,
      },
    }, idempotencyKey ? { idempotencyKey } : undefined);

    return session.url || session.id;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const stripe = this.getClient();

    // paymentId could be a checkout session ID or payment intent ID
    let status: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending';
    let amount = 0;
    let currency = 'usd';
    let createdAt = '';

    if (paymentId.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(paymentId);
      amount = session.amount_total || 0;
      currency = session.currency || 'usd';
      createdAt = new Date(session.created * 1000).toISOString();
      if (session.payment_status === 'paid') status = 'completed';
      else if (session.status === 'expired') status = 'failed';
    } else {
      const intent = await stripe.paymentIntents.retrieve(paymentId);
      amount = intent.amount;
      currency = intent.currency;
      createdAt = new Date(intent.created * 1000).toISOString();
      if (intent.status === 'succeeded') status = 'completed';
      else if (intent.status === 'canceled') status = 'failed';
      else if (intent.status === 'requires_payment_method') status = 'failed';
      if (intent.amount_received < intent.amount && intent.latest_charge) {
        const charge = await stripe.charges.retrieve(intent.latest_charge as string);
        if (charge.refunded) status = 'refunded';
      }
    }

    return { id: paymentId, status, amount, currency, created_at: createdAt };
  }

  async processRefund(data: RefundData): Promise<RefundResult> {
    const stripe = this.getClient();

    const refund = await stripe.refunds.create({
      payment_intent: data.paymentId,
      amount: data.amount,
      reason: (data.reason as Stripe.RefundCreateParams.Reason) || 'requested_by_customer',
    });

    return {
      id: refund.id,
      payment_id: data.paymentId,
      amount: refund.amount,
      status: refund.status || 'succeeded',
      reason: data.reason,
      created_at: new Date(refund.created * 1000).toISOString(),
    };
  }

  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return false;

    try {
      const stripe = this.getClient();
      stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch {
      return false;
    }
  }

  async createCustomer(data: CustomerData): Promise<any> {
    const stripe = this.getClient();

    const customer = await stripe.customers.create({
      email: data.email,
      name: data.name,
      metadata: data.metadata,
    });

    return { id: customer.id, email: customer.email, name: customer.name };
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<any> {
    const stripe = this.getClient();

    const pm = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return { id: pm.id, type: pm.type };
  }

  async createSubscription(data: SubscriptionData): Promise<any> {
    const stripe = this.getClient();

    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
      items: data.items.map(i => ({ price: i.priceId, quantity: i.quantity || 1 })),
      metadata: data.metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null,
    };
  }

  async cancelSubscription(subscriptionId: string, atPeriodEnd = true): Promise<any> {
    const stripe = this.getClient();

    if (atPeriodEnd) {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return { id: subscription.id, cancelAtPeriodEnd: true };
    }

    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return { id: subscription.id, status: subscription.status };
  }

  async getInvoice(invoiceId: string): Promise<any> {
    const stripe = this.getClient();
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return {
      id: invoice.id,
      status: invoice.status,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      hosted_invoice_url: invoice.hosted_invoice_url,
      pdf: invoice.invoice_pdf,
    };
  }
}
