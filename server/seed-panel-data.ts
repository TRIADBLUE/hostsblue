/**
 * Seed script for admin panel data
 * Inserts platform settings and email templates
 *
 * Run: npx tsx server/seed-panel-data.ts
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema.js';

const { Pool } = pg;

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Seeding panel data...\n');

  // ========================================================================
  // PLATFORM SETTINGS
  // ========================================================================

  const settings = [
    // General
    { key: 'site_name', value: 'hostsblue', section: 'general' },
    { key: 'support_email', value: 'support@hostsblue.com', section: 'general' },
    { key: 'billing_email', value: 'billing@hostsblue.com', section: 'general' },
    { key: 'default_currency', value: 'USD', section: 'general' },
    { key: 'tax_rate', value: '0', section: 'general' },

    // API Keys
    { key: 'opensrs_api_key', value: 'test_opensrs_key_placeholder', section: 'api_keys' },
    { key: 'opensrs_reseller_username', value: 'hostsblue', section: 'api_keys' },
    { key: 'opensrs_environment', value: 'test', section: 'api_keys' },
    { key: 'wpmudev_api_key', value: 'test_wpmudev_key_placeholder', section: 'api_keys' },
    { key: 'stripe_publishable_key', value: 'pk_test_placeholder', section: 'api_keys' },
    { key: 'stripe_secret_key', value: 'sk_test_placeholder', section: 'api_keys' },
    { key: 'swipesblue_api_key', value: 'test_swipesblue_key_placeholder', section: 'api_keys' },

    // Email (SMTP)
    { key: 'smtp_host', value: 'smtp.hostsblue.com', section: 'email' },
    { key: 'smtp_port', value: '587', section: 'email' },
    { key: 'smtp_user', value: 'noreply@hostsblue.com', section: 'email' },
    { key: 'smtp_password', value: 'smtp_password_placeholder', section: 'email' },
    { key: 'smtp_from_name', value: 'hostsblue', section: 'email' },
    { key: 'smtp_from_email', value: 'noreply@hostsblue.com', section: 'email' },

    // Billing
    { key: 'billing_company_name', value: 'TRIADBLUE LLC', section: 'billing' },
    { key: 'billing_address', value: '123 Main St, Suite 100', section: 'billing' },
    { key: 'billing_city', value: 'Austin', section: 'billing' },
    { key: 'billing_state', value: 'TX', section: 'billing' },
    { key: 'billing_zip', value: '78701', section: 'billing' },
    { key: 'billing_country', value: 'US', section: 'billing' },
    { key: 'invoice_prefix', value: 'HB-', section: 'billing' },
  ];

  let settingsInserted = 0;
  for (const s of settings) {
    try {
      await db.insert(schema.platformSettings).values(s).onConflictDoNothing();
      settingsInserted++;
    } catch {
      // Already exists
    }
  }
  console.log(`Platform settings: ${settingsInserted} inserted`);

  // ========================================================================
  // EMAIL TEMPLATES
  // ========================================================================

  const templates = [
    {
      slug: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to hostsblue!',
      body: `Hi {{firstName}},\n\nWelcome to hostsblue! Your account has been created successfully.\n\nYou can log in at: {{loginUrl}}\n\nIf you have any questions, our support team is here to help.\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'loginUrl'],
      isRequired: true,
    },
    {
      slug: 'order-confirmation',
      name: 'Order Confirmation',
      subject: 'Order #{{orderNumber}} Confirmed',
      body: `Hi {{firstName}},\n\nYour order #{{orderNumber}} has been confirmed.\n\nOrder Total: {{orderTotal}}\nPayment Method: {{paymentMethod}}\n\nOrder Details:\n{{orderItems}}\n\nYou can view your order at: {{orderUrl}}\n\nThank you for choosing hostsblue!\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'orderNumber', 'orderTotal', 'paymentMethod', 'orderItems', 'orderUrl'],
      isRequired: true,
    },
    {
      slug: 'domain-registered',
      name: 'Domain Registration',
      subject: 'Domain {{domainName}} Registered Successfully',
      body: `Hi {{firstName}},\n\nGreat news! Your domain {{domainName}} has been registered successfully.\n\nRegistration Date: {{registrationDate}}\nExpiry Date: {{expiryDate}}\nNameservers: {{nameservers}}\n\nManage your domain at: {{domainUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'domainName', 'registrationDate', 'expiryDate', 'nameservers', 'domainUrl'],
      isRequired: false,
    },
    {
      slug: 'domain-expiring',
      name: 'Domain Expiring Soon',
      subject: 'Action Required: {{domainName}} expires in {{daysLeft}} days',
      body: `Hi {{firstName}},\n\nYour domain {{domainName}} is expiring on {{expiryDate}} ({{daysLeft}} days from now).\n\nTo avoid losing your domain, please renew it before the expiry date.\n\nRenew now: {{renewUrl}}\n\nIf auto-renew is enabled, we'll attempt to renew it automatically.\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'domainName', 'expiryDate', 'daysLeft', 'renewUrl'],
      isRequired: false,
    },
    {
      slug: 'hosting-provisioned',
      name: 'Hosting Account Ready',
      subject: 'Your hosting account is ready!',
      body: `Hi {{firstName}},\n\nYour hosting account has been set up and is ready to use.\n\nSite Name: {{siteName}}\nDomain: {{domain}}\nPlan: {{planName}}\n\nAccess your hosting dashboard: {{dashboardUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'siteName', 'domain', 'planName', 'dashboardUrl'],
      isRequired: false,
    },
    {
      slug: 'password-reset',
      name: 'Password Reset',
      subject: 'Reset Your hostsblue Password',
      body: `Hi {{firstName}},\n\nWe received a request to reset your password. Click the link below to set a new password:\n\n{{resetUrl}}\n\nThis link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'resetUrl'],
      isRequired: true,
    },
    {
      slug: 'payment-failed',
      name: 'Payment Failed',
      subject: 'Payment Failed for Order #{{orderNumber}}',
      body: `Hi {{firstName}},\n\nWe were unable to process your payment for order #{{orderNumber}}.\n\nAmount: {{amount}}\nReason: {{reason}}\n\nPlease update your payment method to avoid service interruption: {{billingUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'orderNumber', 'amount', 'reason', 'billingUrl'],
      isRequired: false,
    },
    {
      slug: 'ticket-created',
      name: 'Support Ticket Created',
      subject: 'Ticket #{{ticketId}}: {{subject}}',
      body: `Hi {{firstName}},\n\nYour support ticket has been created.\n\nTicket ID: #{{ticketId}}\nSubject: {{subject}}\nPriority: {{priority}}\n\nOur team will respond as soon as possible. You can track your ticket at: {{ticketUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'ticketId', 'subject', 'priority', 'ticketUrl'],
      isRequired: false,
    },
    {
      slug: 'ticket-reply',
      name: 'Support Ticket Reply',
      subject: 'Re: Ticket #{{ticketId}}: {{subject}}',
      body: `Hi {{firstName}},\n\nThere's a new reply on your support ticket #{{ticketId}}.\n\n---\n{{replyBody}}\n---\n\nView the full conversation: {{ticketUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'ticketId', 'subject', 'replyBody', 'ticketUrl'],
      isRequired: false,
    },
    {
      slug: 'invoice',
      name: 'Invoice',
      subject: 'Invoice {{invoiceNumber}} from hostsblue',
      body: `Hi {{firstName}},\n\nPlease find your invoice details below.\n\nInvoice #: {{invoiceNumber}}\nDate: {{invoiceDate}}\nDue Date: {{dueDate}}\nTotal: {{total}}\n\nItems:\n{{lineItems}}\n\nView and pay online: {{invoiceUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'invoiceNumber', 'invoiceDate', 'dueDate', 'total', 'lineItems', 'invoiceUrl'],
      isRequired: false,
    },
    {
      slug: 'ssl-expiring',
      name: 'SSL Certificate Expiring',
      subject: 'SSL Certificate for {{domainName}} expires in {{daysLeft}} days',
      body: `Hi {{firstName}},\n\nThe SSL certificate for {{domainName}} will expire on {{expiryDate}}.\n\nPlease renew your certificate to avoid security warnings on your website.\n\nRenew now: {{renewUrl}}\n\nBest regards,\nThe hostsblue Team`,
      variables: ['firstName', 'domainName', 'expiryDate', 'daysLeft', 'renewUrl'],
      isRequired: false,
    },
  ];

  let templatesInserted = 0;
  for (const t of templates) {
    try {
      await db.insert(schema.emailTemplates).values({
        ...t,
        variables: t.variables,
      }).onConflictDoNothing();
      templatesInserted++;
    } catch {
      // Already exists
    }
  }
  console.log(`Email templates: ${templatesInserted} inserted`);

  console.log('\nPanel seed complete!');
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
