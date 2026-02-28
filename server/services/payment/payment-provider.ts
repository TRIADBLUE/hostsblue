/**
 * Payment Provider Interface
 * All payment providers (SwipesBlue, Stripe, etc.) must implement this interface.
 */

export interface PaymentSessionData {
  orderId: number;
  orderNumber: string;
  amount: number; // in cents
  currency: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  metadata?: Record<string, any>;
}

export interface RefundData {
  paymentId: string;
  amount: number; // in cents
  reason?: string;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  created_at: string;
  [key: string]: any;
}

export interface RefundResult {
  id: string;
  payment_id: string;
  amount: number;
  status: string;
  reason?: string;
  created_at: string;
}

export interface CustomerData {
  email: string;
  name?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionData {
  customerId: string;
  items: Array<{ priceId: string; quantity?: number }>;
  metadata?: Record<string, any>;
}

export interface PaymentProvider {
  readonly name: string;

  createPaymentSession(data: PaymentSessionData, idempotencyKey?: string): Promise<string>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  processRefund(data: RefundData): Promise<RefundResult>;
  verifyWebhookSignature(payload: any, signature: string): boolean;
  createCustomer(data: CustomerData): Promise<any>;
  attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<any>;
  createSubscription(data: SubscriptionData): Promise<any>;
  cancelSubscription(subscriptionId: string, atPeriodEnd?: boolean): Promise<any>;
  getInvoice(invoiceId: string): Promise<any>;
}
