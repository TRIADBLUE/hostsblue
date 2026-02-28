/**
 * SwipesBlue Payment Provider
 * Wraps the existing SwipesBluePayment class to conform to PaymentProvider interface.
 */

import { SwipesBluePayment } from '../swipesblue-payment.js';
import type {
  PaymentProvider,
  PaymentSessionData,
  RefundData,
  PaymentStatus,
  RefundResult,
  CustomerData,
  SubscriptionData,
} from './payment-provider.js';

export class SwipesBlueProvider implements PaymentProvider {
  readonly name = 'swipesblue';
  private client: SwipesBluePayment;

  constructor() {
    this.client = new SwipesBluePayment();
  }

  async createPaymentSession(data: PaymentSessionData, idempotencyKey?: string): Promise<string> {
    return this.client.createPaymentSession(data, idempotencyKey);
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.client.getPaymentStatus(paymentId);
  }

  async processRefund(data: RefundData): Promise<RefundResult> {
    return this.client.processRefund(data);
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    return this.client.verifyWebhookSignature(payload, signature);
  }

  async createCustomer(data: CustomerData): Promise<any> {
    return this.client.createCustomer(data);
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<any> {
    return this.client.attachPaymentMethod(customerId, paymentMethodId);
  }

  async createSubscription(data: SubscriptionData): Promise<any> {
    return this.client.createSubscription(data);
  }

  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true): Promise<any> {
    return this.client.cancelSubscription(subscriptionId, atPeriodEnd);
  }

  async getInvoice(invoiceId: string): Promise<any> {
    return this.client.getInvoice(invoiceId);
  }
}
