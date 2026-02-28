/**
 * Transactional Email Service
 * Branded HTML email templates sent via Resend.
 */

import { Resend } from 'resend';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@hostsblue.com';
const CLIENT_URL = process.env.CLIENT_URL || 'https://hostsblue.com';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function brandedLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">
        <!-- Header -->
        <tr><td style="background:#064A6C;padding:24px 32px;">
          <span style="font-size:22px;font-weight:800;color:#ffffff;text-decoration:none;">
            <span style="color:#00cc99;">hosts</span><span style="color:#6699ff;">blue</span><span style="color:#00cc99;">.com</span>
          </span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;color:#09080E;font-size:15px;line-height:1.6;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 32px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.5;">
          <p style="margin:0 0 8px;">This email was sent by <a href="${CLIENT_URL}" style="color:#064A6C;text-decoration:none;">hostsblue.com</a></p>
          <p style="margin:0;">Questions? <a href="${CLIENT_URL}/support" style="color:#064A6C;text-decoration:none;">Contact support</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:#064A6C;color:#ffffff;padding:12px 24px;border-radius:7px;text-decoration:none;font-weight:600;font-size:14px;margin:8px 0;">${text}</a>`;
}

export class EmailService {
  private resend: Resend | null;

  constructor() {
    this.resend = getResend();
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      console.log(`[EmailService] Resend not configured — skipping email to ${to}: ${subject}`);
      return;
    }
    try {
      await this.resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    } catch (err) {
      console.error(`[EmailService] Failed to send "${subject}" to ${to}:`, err);
    }
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">Welcome to hostsblue, ${name}!</h2>
      <p>Your account is all set. You can now register domains, launch hosting, deploy cloud servers, and build websites — all from one dashboard.</p>
      ${btn('Go to Dashboard', `${CLIENT_URL}/dashboard`)}
      <p style="margin-top:24px;">Need help getting started? Our support team is here for you.</p>
    `;
    await this.send(to, 'Welcome to hostsblue', brandedLayout('Welcome', body));
  }

  async sendOrderConfirmation(to: string, data: {
    customerName: string;
    orderNumber: string;
    items: Array<{ description: string; total: number }>;
    total: number;
    currency: string;
  }): Promise<void> {
    const itemRows = data.items
      .map(i => `<tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">${i.description}</td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;">$${(i.total / 100).toFixed(2)}</td></tr>`)
      .join('');

    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">Order Confirmed</h2>
      <p>Hi ${data.customerName}, your order <strong>${data.orderNumber}</strong> has been processed successfully.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        <thead><tr style="border-bottom:2px solid #e5e7eb;">
          <th style="text-align:left;padding:8px 0;color:#4b5563;font-size:13px;">Item</th>
          <th style="text-align:right;padding:8px 0;color:#4b5563;font-size:13px;">Amount</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
        <tfoot><tr>
          <td style="padding:12px 0;font-weight:700;">Total</td>
          <td style="padding:12px 0;font-weight:700;text-align:right;">$${(data.total / 100).toFixed(2)} ${data.currency}</td>
        </tr></tfoot>
      </table>
      ${btn('View Order', `${CLIENT_URL}/dashboard/orders`)}
    `;
    await this.send(to, `Order Confirmation — ${data.orderNumber}`, brandedLayout('Order Confirmed', body));
  }

  async sendServerReady(to: string, data: {
    customerName: string;
    serverName: string;
    ipAddress: string;
    plan: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">Your Cloud Server is Ready</h2>
      <p>Hi ${data.customerName}, your server <strong>${data.serverName}</strong> is up and running.</p>
      <table style="margin:16px 0;background:#f9fafb;border-radius:7px;padding:16px;width:100%;">
        <tr><td style="padding:4px 12px;color:#4b5563;font-size:13px;">Server</td><td style="padding:4px 12px;font-weight:600;">${data.serverName}</td></tr>
        <tr><td style="padding:4px 12px;color:#4b5563;font-size:13px;">Plan</td><td style="padding:4px 12px;">${data.plan}</td></tr>
        <tr><td style="padding:4px 12px;color:#4b5563;font-size:13px;">IP Address</td><td style="padding:4px 12px;font-family:monospace;">${data.ipAddress}</td></tr>
      </table>
      ${btn('Manage Server', `${CLIENT_URL}/dashboard/servers`)}
    `;
    await this.send(to, `Server Ready — ${data.serverName}`, brandedLayout('Server Ready', body));
  }

  async sendDomainRegistered(to: string, data: {
    customerName: string;
    domainName: string;
    expiryDate: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">Domain Registered</h2>
      <p>Hi ${data.customerName}, your domain <strong>${data.domainName}</strong> has been registered successfully.</p>
      <p>Expires: <strong>${data.expiryDate}</strong> (auto-renewal is enabled by default)</p>
      ${btn('Manage Domain', `${CLIENT_URL}/dashboard/domains`)}
    `;
    await this.send(to, `Domain Registered — ${data.domainName}`, brandedLayout('Domain Registered', body));
  }

  async sendPasswordReset(to: string, data: {
    customerName: string;
    resetUrl: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">Reset Your Password</h2>
      <p>Hi ${data.customerName}, we received a request to reset your password.</p>
      ${btn('Reset Password', data.resetUrl)}
      <p style="margin-top:16px;color:#6b7280;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `;
    await this.send(to, 'Password Reset — hostsblue', brandedLayout('Password Reset', body));
  }

  async sendPaymentFailed(to: string, data: {
    customerName: string;
    orderNumber: string;
    amount: number;
    currency: string;
    reason: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#DC2626;">Payment Failed</h2>
      <p>Hi ${data.customerName}, the payment of <strong>$${(data.amount / 100).toFixed(2)} ${data.currency}</strong> for order <strong>${data.orderNumber}</strong> was not successful.</p>
      <p>Reason: ${data.reason}</p>
      ${btn('Retry Payment', `${CLIENT_URL}/dashboard/orders`)}
      <p style="margin-top:16px;color:#6b7280;font-size:13px;">If you continue to experience issues, please contact our support team.</p>
    `;
    await this.send(to, `Payment Failed — ${data.orderNumber}`, brandedLayout('Payment Failed', body));
  }

  async sendHostingReady(to: string, data: {
    customerName: string;
    siteName: string;
    domain: string;
    wpAdminUrl: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">Your Hosting is Ready</h2>
      <p>Hi ${data.customerName}, your WordPress site <strong>${data.siteName}</strong> is live!</p>
      <table style="margin:16px 0;background:#f9fafb;border-radius:7px;padding:16px;width:100%;">
        <tr><td style="padding:4px 12px;color:#4b5563;font-size:13px;">Site</td><td style="padding:4px 12px;font-weight:600;">${data.siteName}</td></tr>
        <tr><td style="padding:4px 12px;color:#4b5563;font-size:13px;">Domain</td><td style="padding:4px 12px;">${data.domain}</td></tr>
      </table>
      ${btn('WordPress Admin', data.wpAdminUrl)}
      ${btn('Manage Hosting', `${CLIENT_URL}/dashboard/hosting`)}
    `;
    await this.send(to, `Hosting Ready — ${data.siteName}`, brandedLayout('Hosting Ready', body));
  }

  async sendSSLIssued(to: string, data: {
    customerName: string;
    domainName: string;
    expiryDate: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">SSL Certificate Issued</h2>
      <p>Hi ${data.customerName}, your SSL certificate for <strong>${data.domainName}</strong> has been issued and is active.</p>
      <p>Valid until: <strong>${data.expiryDate}</strong></p>
      ${btn('View SSL', `${CLIENT_URL}/dashboard/ssl`)}
    `;
    await this.send(to, `SSL Issued — ${data.domainName}`, brandedLayout('SSL Issued', body));
  }

  async sendGeneric(to: string, subject: string, heading: string, message: string, ctaText?: string, ctaUrl?: string): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;color:#09080E;">${heading}</h2>
      <p>${message}</p>
      ${ctaText && ctaUrl ? btn(ctaText, ctaUrl) : ''}
    `;
    await this.send(to, subject, brandedLayout(heading, body));
  }
}
