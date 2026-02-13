var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditLogs: () => auditLogs,
  cartSessions: () => cartSessions,
  customers: () => customers,
  customersRelations: () => customersRelations,
  dnsRecords: () => dnsRecords,
  dnsRecordsRelations: () => dnsRecordsRelations,
  domainContacts: () => domainContacts,
  domainContactsRelations: () => domainContactsRelations,
  domainStatusEnum: () => domainStatusEnum,
  domains: () => domains,
  domainsRelations: () => domainsRelations,
  hostingAccounts: () => hostingAccounts,
  hostingAccountsRelations: () => hostingAccountsRelations,
  hostingPlans: () => hostingPlans,
  hostingPlansRelations: () => hostingPlansRelations,
  hostingStatusEnum: () => hostingStatusEnum,
  orderItemTypeEnum: () => orderItemTypeEnum,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orderStatusEnum: () => orderStatusEnum,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  paymentStatusEnum: () => paymentStatusEnum,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  tldCategoryEnum: () => tldCategoryEnum,
  tldPricing: () => tldPricing,
  webhookEvents: () => webhookEvents
});
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  uuid as pgUuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var domainStatusEnum = pgEnum("domain_status", [
  "pending",
  // Awaiting payment
  "active",
  // Registered and active
  "expired",
  // Registration expired
  "suspended",
  // Suspended for violation
  "pending_transfer",
  // Transfer in progress
  "pending_renewal",
  // Renewal in progress
  "grace_period"
  // Grace period after expiry
]);
var hostingStatusEnum = pgEnum("hosting_status", [
  "pending",
  // Awaiting payment
  "provisioning",
  // Site being created
  "active",
  // Site live
  "suspended",
  // Payment issue or violation
  "cancelled",
  // Cancelled by user
  "expired"
  // Subscription expired
]);
var orderStatusEnum = pgEnum("order_status", [
  "draft",
  // Cart items, not submitted
  "pending_payment",
  // Awaiting payment
  "payment_received",
  // Payment confirmed, processing
  "processing",
  // Fulfilling with partners
  "completed",
  // All items provisioned
  "partial_failure",
  // Some items failed
  "failed",
  // All items failed
  "cancelled",
  // Cancelled by user
  "refunded"
  // Refunded
]);
var paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "disputed"
]);
var orderItemTypeEnum = pgEnum("order_item_type", [
  "domain_registration",
  "domain_transfer",
  "domain_renewal",
  "hosting_plan",
  "hosting_addon",
  "privacy_protection",
  "email_service"
]);
var tldCategoryEnum = pgEnum("tld_category", [
  "generic",
  // .com, .net, .org
  "country",
  // .us, .uk, .ca
  "premium",
  // Premium TLDs
  "new",
  // New gTLDs
  "special"
  // Special purpose
]);
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  uuid: pgUuid("uuid").defaultRandom().notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  // Profile
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  companyName: varchar("company_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  // Default contact info for domain registrations
  address1: varchar("address1", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  countryCode: varchar("country_code", { length: 2 }).default("US"),
  // Billing
  defaultPaymentMethodId: integer("default_payment_method_id"),
  // Account status
  isActive: boolean("is_active").default(true).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at")
}, (table) => ({
  emailIdx: index("customers_email_idx").on(table.email),
  uuidIdx: uniqueIndex("customers_uuid_idx").on(table.uuid)
}));
var customersRelations = relations(customers, ({ many }) => ({
  domains: many(domains),
  hostingAccounts: many(hostingAccounts),
  orders: many(orders),
  contacts: many(domainContacts)
}));
var domainContacts = pgTable("domain_contacts", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  // Contact type
  contactType: varchar("contact_type", { length: 20 }).notNull(),
  // owner, admin, tech, billing
  // Contact details
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  fax: varchar("fax", { length: 50 }),
  // Address
  address1: varchar("address1", { length: 255 }).notNull(),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  // Privacy
  isPrivate: boolean("is_private").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
  customerIdx: index("domain_contacts_customer_idx").on(table.customerId)
}));
var domainContactsRelations = relations(domainContacts, ({ one }) => ({
  customer: one(customers, {
    fields: [domainContacts.customerId],
    references: [customers.id]
  })
}));
var tldPricing = pgTable("tld_pricing", {
  id: serial("id").primaryKey(),
  tld: varchar("tld", { length: 20 }).notNull().unique(),
  // .com, .net, etc
  category: tldCategoryEnum("category").default("generic").notNull(),
  // Pricing (in cents for precision)
  registrationPrice: integer("registration_price").notNull(),
  // HostsBlue retail price
  renewalPrice: integer("renewal_price").notNull(),
  transferPrice: integer("transfer_price").notNull(),
  restorePrice: integer("restore_price"),
  // Redemption fee
  // Cost from OpenSRS
  costPrice: integer("cost_price").notNull(),
  // Domain settings
  minRegistrationYears: integer("min_registration_years").default(1).notNull(),
  maxRegistrationYears: integer("max_registration_years").default(10).notNull(),
  requiresEppCode: boolean("requires_epp_code").default(true).notNull(),
  supportsPrivacy: boolean("supports_privacy").default(true).notNull(),
  privacyPrice: integer("privacy_price").default(0),
  // Features
  supportsDnssec: boolean("supports_dnssec").default(true).notNull(),
  supportsIdn: boolean("supports_idn").default(false).notNull(),
  // Grace periods (in days)
  addGracePeriodDays: integer("add_grace_period_days").default(5),
  renewGracePeriodDays: integer("renew_grace_period_days").default(30),
  autoRenewGracePeriodDays: integer("auto_renew_grace_period_days").default(30),
  redemptionGracePeriodDays: integer("redemption_grace_period_days").default(30),
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  // Metadata
  description: text("description"),
  requirements: jsonb("requirements").default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
  tldIdx: uniqueIndex("tld_pricing_tld_idx").on(table.tld),
  categoryIdx: index("tld_pricing_category_idx").on(table.category)
}));
var domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  uuid: pgUuid("uuid").defaultRandom().notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  // Domain info
  domainName: varchar("domain_name", { length: 253 }).notNull(),
  tld: varchar("tld", { length: 20 }).notNull(),
  // Status
  status: domainStatusEnum("status").default("pending").notNull(),
  // Registration details
  registrationDate: timestamp("registration_date"),
  expiryDate: timestamp("expiry_date"),
  registrationPeriodYears: integer("registration_period_years").default(1),
  // Auto-renewal
  autoRenew: boolean("auto_renew").default(true).notNull(),
  autoRenewAttempts: integer("auto_renew_attempts").default(0),
  lastAutoRenewAttempt: timestamp("last_auto_renew_attempt"),
  // WHOIS Privacy
  privacyEnabled: boolean("privacy_enabled").default(false).notNull(),
  privacyExpiryDate: timestamp("privacy_expiry_date"),
  // Contact references
  ownerContactId: integer("owner_contact_id").references(() => domainContacts.id),
  adminContactId: integer("admin_contact_id").references(() => domainContacts.id),
  techContactId: integer("tech_contact_id").references(() => domainContacts.id),
  billingContactId: integer("billing_contact_id").references(() => domainContacts.id),
  // Nameservers
  nameservers: jsonb("nameservers").default([]),
  useHostsBlueNameservers: boolean("use_hostsblue_nameservers").default(true).notNull(),
  // DNS Zone (if using our nameservers)
  dnsZoneId: integer("dns_zone_id"),
  // External references
  openrsOrderId: varchar("openrs_order_id", { length: 100 }),
  openrsDomainId: varchar("openrs_domain_id", { length: 100 }),
  // Transfer specific
  isTransfer: boolean("is_transfer").default(false).notNull(),
  transferAuthCode: varchar("transfer_auth_code", { length: 100 }),
  transferStatus: varchar("transfer_status", { length: 50 }),
  previousRegistrar: varchar("previous_registrar", { length: 100 }),
  // EPP codes
  eppCode: varchar("epp_code", { length: 100 }),
  eppCodeRequestedAt: timestamp("epp_code_requested_at"),
  // Lock status
  transferLock: boolean("transfer_lock").default(true).notNull(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at")
  // Soft delete
}, (table) => ({
  customerIdx: index("domains_customer_idx").on(table.customerId),
  domainIdx: uniqueIndex("domains_domain_idx").on(table.domainName),
  statusIdx: index("domains_status_idx").on(table.status),
  expiryIdx: index("domains_expiry_idx").on(table.expiryDate),
  openrsIdx: index("domains_openrs_idx").on(table.openrsDomainId)
}));
var domainsRelations = relations(domains, ({ one, many }) => ({
  customer: one(customers, {
    fields: [domains.customerId],
    references: [customers.id]
  }),
  ownerContact: one(domainContacts, {
    fields: [domains.ownerContactId],
    references: [domainContacts.id]
  }),
  orderItems: many(orderItems),
  dnsRecords: many(dnsRecords)
}));
var dnsRecords = pgTable("dns_records", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").references(() => domains.id).notNull(),
  // Record data
  type: varchar("type", { length: 10 }).notNull(),
  // A, AAAA, CNAME, MX, TXT, NS, SRV, CAA
  name: varchar("name", { length: 255 }).notNull(),
  // @, www, subdomain
  content: text("content").notNull(),
  ttl: integer("ttl").default(3600).notNull(),
  priority: integer("priority"),
  // For MX, SRV
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  // External sync
  syncedToOpenrs: boolean("synced_to_openrs").default(false).notNull(),
  lastSyncAt: timestamp("last_sync_at"),
  syncError: text("sync_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
  domainIdx: index("dns_records_domain_idx").on(table.domainId),
  typeIdx: index("dns_records_type_idx").on(table.type)
}));
var dnsRecordsRelations = relations(dnsRecords, ({ one }) => ({
  domain: one(domains, {
    fields: [dnsRecords.domainId],
    references: [domains.id]
  })
}));
var hostingPlans = pgTable("hosting_plans", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  // Tier
  tier: varchar("tier", { length: 20 }).notNull(),
  // starter, pro, business, enterprise
  sortOrder: integer("sort_order").default(0),
  // Pricing (monthly, in cents)
  monthlyPrice: integer("monthly_price").notNull(),
  yearlyPrice: integer("yearly_price").notNull(),
  // Usually 10 months
  setupFee: integer("setup_fee").default(0),
  // Cost from WPMUDEV
  monthlyCost: integer("monthly_cost").notNull(),
  // Features
  features: jsonb("features").default({}).notNull(),
  // {
  //   storageGB: 10,
  //   bandwidthGB: 100,
  //   sites: 1,
  //   visitors: 25000,
  //   ssl: true,
  //   cdn: true,
  //   backups: "daily",
  //   staging: false,
  //   whiteLabel: false,
  //   support: "email"
  // }
  // WPMUDEV plan reference
  wpmudevPlanId: varchar("wpmudev_plan_id", { length: 50 }),
  // Limits
  maxSites: integer("max_sites").default(1),
  maxStorageGB: integer("max_storage_gb"),
  maxVisitors: integer("max_visitors"),
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
  slugIdx: uniqueIndex("hosting_plans_slug_idx").on(table.slug),
  tierIdx: index("hosting_plans_tier_idx").on(table.tier)
}));
var hostingPlansRelations = relations(hostingPlans, ({ many }) => ({
  accounts: many(hostingAccounts)
}));
var hostingAccounts = pgTable("hosting_accounts", {
  id: serial("id").primaryKey(),
  uuid: pgUuid("uuid").defaultRandom().notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  planId: integer("plan_id").references(() => hostingPlans.id).notNull(),
  // Site info
  siteName: varchar("site_name", { length: 100 }).notNull(),
  primaryDomain: varchar("primary_domain", { length: 253 }),
  // Status
  status: hostingStatusEnum("status").default("pending").notNull(),
  // Subscription
  billingCycle: varchar("billing_cycle", { length: 10 }).default("monthly").notNull(),
  // monthly, yearly
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  autoRenew: boolean("auto_renew").default(true).notNull(),
  // WPMUDEV integration
  wpmudevSiteId: varchar("wpmudev_site_id", { length: 100 }),
  wpmudevBlogId: integer("wpmudev_blog_id"),
  wpmudevHostingId: varchar("wpmudev_hosting_id", { length: 100 }),
  // Access credentials (encrypted)
  wpAdminUsername: varchar("wp_admin_username", { length: 100 }),
  wpAdminPasswordEncrypted: text("wp_admin_password_encrypted"),
  sftpUsername: varchar("sftp_username", { length: 100 }),
  sftpHost: varchar("sftp_host", { length: 255 }),
  // SSL
  sslStatus: varchar("ssl_status", { length: 20 }).default("pending"),
  // pending, active, expired, error
  sslCertificateId: varchar("ssl_certificate_id", { length: 100 }),
  sslExpiryDate: timestamp("ssl_expiry_date"),
  // Stats (updated periodically)
  storageUsedMB: integer("storage_used_mb").default(0),
  bandwidthUsedMB: integer("bandwidth_used_mb").default(0),
  lastStatsUpdate: timestamp("last_stats_update"),
  // Backup settings
  backupFrequency: varchar("backup_frequency", { length: 20 }).default("daily"),
  lastBackupAt: timestamp("last_backup_at"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at")
}, (table) => ({
  customerIdx: index("hosting_customer_idx").on(table.customerId),
  planIdx: index("hosting_plan_idx").on(table.planId),
  statusIdx: index("hosting_status_idx").on(table.status),
  wpmudevIdx: index("hosting_wpmudev_idx").on(table.wpmudevSiteId),
  domainIdx: index("hosting_domain_idx").on(table.primaryDomain)
}));
var hostingAccountsRelations = relations(hostingAccounts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [hostingAccounts.customerId],
    references: [customers.id]
  }),
  plan: one(hostingPlans, {
    fields: [hostingAccounts.planId],
    references: [hostingPlans.id]
  }),
  orderItems: many(orderItems)
}));
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  uuid: pgUuid("uuid").defaultRandom().notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  // Order info
  orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
  status: orderStatusEnum("status").default("draft").notNull(),
  // Pricing
  subtotal: integer("subtotal").notNull(),
  // in cents
  discountAmount: integer("discount_amount").default(0),
  taxAmount: integer("tax_amount").default(0),
  total: integer("total").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  // Promotions
  couponCode: varchar("coupon_code", { length: 50 }),
  // Payment
  paymentStatus: paymentStatusEnum("payment_status"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  // swipesblue, stripe, etc
  paymentReference: varchar("payment_reference", { length: 255 }),
  // External payment ID
  paidAt: timestamp("paid_at"),
  // Billing address snapshot
  billingEmail: varchar("billing_email", { length: 255 }),
  billingName: varchar("billing_name", { length: 255 }),
  billingAddress: jsonb("billing_address"),
  // Notes
  customerNote: text("customer_note"),
  adminNote: text("admin_note"),
  // IP Address for fraud detection
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  completedAt: timestamp("completed_at")
}, (table) => ({
  customerIdx: index("orders_customer_idx").on(table.customerId),
  statusIdx: index("orders_status_idx").on(table.status),
  orderNumberIdx: uniqueIndex("orders_number_idx").on(table.orderNumber),
  paymentIdx: index("orders_payment_idx").on(table.paymentReference),
  createdIdx: index("orders_created_idx").on(table.createdAt)
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id]
  }),
  items: many(orderItems),
  payments: many(payments)
}));
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  // Item type
  itemType: orderItemTypeEnum("item_type").notNull(),
  // Reference to provisioned item
  domainId: integer("domain_id").references(() => domains.id),
  hostingAccountId: integer("hosting_account_id").references(() => hostingAccounts.id),
  // Description
  description: varchar("description", { length: 255 }).notNull(),
  // Term
  termMonths: integer("term_months").default(12),
  // Pricing
  unitPrice: integer("unit_price").notNull(),
  // in cents
  quantity: integer("quantity").default(1).notNull(),
  totalPrice: integer("total_price").notNull(),
  // Configuration
  configuration: jsonb("configuration").default({}),
  // Domain name, plan slug, etc
  // Fulfillment
  status: varchar("fulfillment_status", { length: 20 }).default("pending").notNull(),
  // pending, processing, completed, failed
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0),
  // External references
  externalReference: varchar("external_reference", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  fulfilledAt: timestamp("fulfilled_at")
}, (table) => ({
  orderIdx: index("order_items_order_idx").on(table.orderId),
  domainIdx: index("order_items_domain_idx").on(table.domainId),
  hostingIdx: index("order_items_hosting_idx").on(table.hostingAccountId),
  statusIdx: index("order_items_status_idx").on(table.status)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  domain: one(domains, {
    fields: [orderItems.domainId],
    references: [domains.id]
  }),
  hostingAccount: one(hostingAccounts, {
    fields: [orderItems.hostingAccountId],
    references: [hostingAccounts.id]
  })
}));
var payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  uuid: pgUuid("uuid").defaultRandom().notNull().unique(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  // Payment details
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  // Gateway
  gateway: varchar("gateway", { length: 50 }).default("swipesblue").notNull(),
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }),
  gatewayResponse: jsonb("gateway_response"),
  // Payment method
  paymentMethodType: varchar("payment_method_type", { length: 50 }),
  // card, bank_transfer, etc
  paymentMethodLast4: varchar("payment_method_last4", { length: 4 }),
  paymentMethodBrand: varchar("payment_method_brand", { length: 50 }),
  // visa, mastercard
  // Refund info
  refundedAmount: integer("refunded_amount").default(0),
  refundReason: text("refund_reason"),
  refundedAt: timestamp("refunded_at"),
  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  failedAt: timestamp("failed_at"),
  failureReason: text("failure_reason")
}, (table) => ({
  orderIdx: index("payments_order_idx").on(table.orderId),
  customerIdx: index("payments_customer_idx").on(table.customerId),
  gatewayIdx: index("payments_gateway_idx").on(table.gatewayTransactionId),
  statusIdx: index("payments_status_idx").on(table.status),
  createdIdx: index("payments_created_idx").on(table.createdAt)
}));
var paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id]
  }),
  customer: one(customers, {
    fields: [payments.customerId],
    references: [customers.id]
  })
}));
var auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  // Who
  customerId: integer("customer_id").references(() => customers.id),
  adminId: integer("admin_id"),
  // If admin action
  // What
  action: varchar("action", { length: 100 }).notNull(),
  // domain.register, hosting.provision, etc
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  // domain, hosting, order, customer
  entityId: varchar("entity_id", { length: 100 }),
  // UUID or ID
  // Details
  description: text("description"),
  metadata: jsonb("metadata").default({}),
  // Change tracking
  previousValues: jsonb("previous_values"),
  newValues: jsonb("new_values"),
  // Request context
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  customerIdx: index("audit_customer_idx").on(table.customerId),
  actionIdx: index("audit_action_idx").on(table.action),
  entityIdx: index("audit_entity_idx").on(table.entityType, table.entityId),
  createdIdx: index("audit_created_idx").on(table.createdAt)
}));
var webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  uuid: pgUuid("uuid").defaultRandom().notNull().unique(),
  // Source
  source: varchar("source", { length: 50 }).notNull(),
  // swipesblue, opensrs, wpmudev
  eventType: varchar("event_type", { length: 100 }).notNull(),
  // Payload
  payload: jsonb("payload").notNull(),
  headers: jsonb("headers"),
  // Processing
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  // pending, processing, completed, failed, retrying
  // Delivery tracking
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  retryCount: integer("retry_count").default(0),
  lastError: text("last_error"),
  // Idempotency
  idempotencyKey: varchar("idempotency_key", { length: 255 })
}, (table) => ({
  sourceIdx: index("webhook_source_idx").on(table.source),
  statusIdx: index("webhook_status_idx").on(table.status),
  idempotencyIdx: uniqueIndex("webhook_idempotency_idx").on(table.idempotencyKey),
  createdIdx: index("webhook_created_idx").on(table.receivedAt)
}));
var cartSessions = pgTable("cart_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  // Cart items
  items: jsonb("items").default([]).notNull(),
  // Totals (calculated)
  subtotal: integer("subtotal").default(0),
  total: integer("total").default(0),
  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
}, (table) => ({
  sessionIdx: uniqueIndex("cart_session_idx").on(table.sessionId),
  customerIdx: index("cart_customer_idx").on(table.customerId)
}));

// server/routes.ts
import { eq as eq2, and as and2, desc, sql, inArray } from "drizzle-orm";

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var tokenCache = /* @__PURE__ */ new Map();
var privateKey;
var publicKey;
try {
  if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
    privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
    publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");
  } else {
    console.warn("JWT keys not configured, using development fallback");
    privateKey = "dev-private-key";
    publicKey = "dev-private-key";
  }
} catch (error) {
  console.error("Failed to load JWT keys:", error);
  throw new Error("JWT configuration error");
}
function generateTokens(payload) {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: process.env.NODE_ENV === "production" ? "RS256" : "HS256",
    expiresIn: "15m",
    issuer: process.env.JWT_ISSUER || "hostsblue.com",
    audience: process.env.JWT_AUDIENCE || "hostsblue.com"
  });
  const refreshToken = jwt.sign(
    { userId: payload.userId, type: "refresh" },
    privateKey,
    {
      algorithm: process.env.NODE_ENV === "production" ? "RS256" : "HS256",
      expiresIn: "7d",
      issuer: process.env.JWT_ISSUER || "hostsblue.com"
    }
  );
  return {
    accessToken,
    refreshToken,
    expiresIn: 900
    // 15 minutes in seconds
  };
}
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: [process.env.NODE_ENV === "production" ? "RS256" : "HS256"],
      issuer: process.env.JWT_ISSUER || "hostsblue.com",
      audience: process.env.JWT_AUDIENCE || "hostsblue.com"
    });
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      error: "Access token required",
      code: "TOKEN_MISSING"
    });
    return;
  }
  try {
    const cached = tokenCache.get(token);
    if (cached && cached.exp > Date.now() / 1e3) {
      req.user = cached.payload;
      next();
      return;
    }
    const decoded = verifyToken(token);
    tokenCache.set(token, {
      payload: decoded,
      exp: decoded.exp
    });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: "Invalid or expired token",
      code: "TOKEN_INVALID"
    });
  }
}
function requireAuth(req, res, next) {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: "Authentication required",
      code: "AUTH_REQUIRED"
    });
    return;
  }
  next();
}
setInterval(() => {
  const now = Date.now() / 1e3;
  for (const [token, data] of tokenCache.entries()) {
    if (data.exp < now) {
      tokenCache.delete(token);
    }
  }
}, 6e4);

// server/services/openrs-integration.ts
var OPENRS_API_URL = process.env.OPENRS_API_URL || "https://admin.test.hostedemail.com/api";
var OPENRS_API_KEY = process.env.OPENRS_API_KEY || "";
var OPENRS_USERNAME = process.env.OPENRS_USERNAME || "";
var OpenSRSIntegration = class {
  apiUrl;
  apiKey;
  username;
  constructor() {
    this.apiUrl = OPENRS_API_URL;
    this.apiKey = OPENRS_API_KEY;
    this.username = OPENRS_USERNAME;
    if (!this.apiKey || !this.username) {
      console.warn("OpenSRS credentials not configured - using mock mode");
    }
  }
  /**
   * Make authenticated request to OpenSRS API
   */
  async apiRequest(action, params = {}) {
    const payload = {
      action,
      credentials: {
        username: this.username,
        api_key: this.apiKey
      },
      ...params
    };
    try {
      if (!this.apiKey || this.apiKey === "your_opensrs_api_key") {
        return this.mockResponse(action, params);
      }
      const response = await fetch(`${this.apiUrl}/domains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-OpenSRS-Username": this.username,
          "X-OpenSRS-Signature": this.generateSignature(action, params)
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenSRS API error: ${error}`);
      }
      return await response.json();
    } catch (error) {
      console.error("OpenSRS API request failed:", error);
      throw error;
    }
  }
  /**
   * Generate API signature for OpenSRS authentication
   */
  generateSignature(action, params) {
    const timestamp2 = Math.floor(Date.now() / 1e3);
    const signature = `${this.username}:${this.apiKey}:${action}:${timestamp2}`;
    return `mock-signature-${timestamp2}`;
  }
  /**
   * Check domain availability
   */
  async checkAvailability(domain, tlds) {
    const results = [];
    try {
      const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split(".")[0];
      const searchTlds2 = tlds.length > 0 ? tlds : [".com"];
      const response = await this.apiRequest("lookup", {
        domains: searchTlds2.map((tld) => `${cleanDomain}${tld}`)
      });
      if (response.results) {
        for (const result of response.results) {
          results.push({
            domain: result.domain,
            tld: result.tld,
            available: result.available,
            premium: result.premium || false,
            reason: result.reason
          });
        }
      }
      return results;
    } catch (error) {
      console.error("Domain availability check failed:", error);
      return searchTlds.map((tld) => ({
        domain: `${domain}${tld}`,
        tld,
        available: Math.random() > 0.5
        // Random for mock
      }));
    }
  }
  /**
   * Register a new domain
   */
  async registerDomain(data) {
    const params = {
      domain: data.domain,
      period: data.period,
      contacts: data.contacts,
      nameservers: data.nameservers || [
        "ns1.hostsblue.com",
        "ns2.hostsblue.com"
      ],
      privacy: data.privacy || false
    };
    const response = await this.apiRequest("register", params);
    return {
      success: response.success,
      orderId: response.order_id,
      domainId: response.domain_id,
      expiryDate: response.expiry_date,
      message: response.message
    };
  }
  /**
   * Transfer a domain
   */
  async transferDomain(domain, authCode, contacts) {
    const response = await this.apiRequest("transfer", {
      domain,
      auth_code: authCode,
      contacts
    });
    return {
      success: response.success,
      transferId: response.transfer_id,
      status: response.status,
      message: response.message
    };
  }
  /**
   * Renew a domain
   */
  async renewDomain(domain, years) {
    const response = await this.apiRequest("renew", {
      domain,
      period: years
    });
    return {
      success: response.success,
      orderId: response.order_id,
      newExpiryDate: response.expiry_date
    };
  }
  /**
   * Get domain info
   */
  async getDomainInfo(domain) {
    const response = await this.apiRequest("get", {
      domain,
      type: "all"
    });
    return {
      domain: response.domain,
      status: response.status,
      expiryDate: response.expiry_date,
      nameservers: response.nameservers,
      contacts: response.contacts,
      privacy: response.privacy_enabled,
      locked: response.transfer_lock
    };
  }
  /**
   * Update nameservers
   */
  async updateNameservers(domain, nameservers) {
    const response = await this.apiRequest("update_nameservers", {
      domain,
      nameservers
    });
    return {
      success: response.success,
      nameservers: response.nameservers
    };
  }
  /**
   * Get/Request EPP code
   */
  async getEppCode(domain) {
    const response = await this.apiRequest("get_epp", {
      domain
    });
    return response.epp_code;
  }
  /**
   * Toggle transfer lock
   */
  async setTransferLock(domain, locked) {
    const response = await this.apiRequest("set_lock", {
      domain,
      locked
    });
    return {
      success: response.success,
      locked: response.locked
    };
  }
  /**
   * Toggle WHOIS privacy
   */
  async setPrivacy(domain, enabled) {
    const response = await this.apiRequest("set_privacy", {
      domain,
      enabled
    });
    return {
      success: response.success,
      privacy: response.privacy_enabled
    };
  }
  /**
   * Update DNS records (if using OpenSRS nameservers)
   */
  async updateDnsRecords(domain, records) {
    const response = await this.apiRequest("update_dns", {
      domain,
      records
    });
    return {
      success: response.success,
      records: response.records
    };
  }
  /**
   * Get DNS records
   */
  async getDnsRecords(domain) {
    const response = await this.apiRequest("get_dns", {
      domain
    });
    return response.records || [];
  }
  /**
   * Mock response for development
   */
  mockResponse(action, params) {
    console.log(`[OpenSRS Mock] ${action}`, params);
    const mocks = {
      lookup: {
        results: params.domains?.map((d) => ({
          domain: d,
          tld: d.includes(".") ? "." + d.split(".").pop() : ".com",
          available: Math.random() > 0.7
        }))
      },
      register: {
        success: true,
        order_id: `mock-order-${Date.now()}`,
        domain_id: `mock-domain-${Date.now()}`,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(),
        message: "Domain registered successfully"
      },
      transfer: {
        success: true,
        transfer_id: `mock-transfer-${Date.now()}`,
        status: "pending",
        message: "Transfer initiated"
      },
      renew: {
        success: true,
        order_id: `mock-order-${Date.now()}`,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString()
      },
      get: {
        domain: params.domain,
        status: "active",
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(),
        nameservers: ["ns1.hostsblue.com", "ns2.hostsblue.com"],
        privacy_enabled: false,
        transfer_lock: true
      },
      update_nameservers: {
        success: true,
        nameservers: params.nameservers
      },
      get_epp: {
        epp_code: `MOCK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      }
    };
    return mocks[action] || { success: true };
  }
};

// server/services/wpmudev-integration.ts
var WPMUDEV_API_URL = process.env.WPMUDEV_API_URL || "https://premium.wpmudev.org/api";
var WPMUDEV_API_KEY = process.env.WPMUDEV_API_KEY || "";
var WPMUDevIntegration = class {
  apiUrl;
  apiKey;
  constructor() {
    this.apiUrl = WPMUDEV_API_URL;
    this.apiKey = WPMUDEV_API_KEY;
    if (!this.apiKey) {
      console.warn("WPMUDEV API key not configured - using mock mode");
    }
  }
  /**
   * Make authenticated request to WPMUDEV API
   */
  async apiRequest(endpoint, method = "GET", body) {
    const url = `${this.apiUrl}${endpoint}`;
    if (!this.apiKey || this.apiKey === "your_wpmudev_api_key") {
      return this.mockResponse(endpoint, method, body);
    }
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        ...body && { body: JSON.stringify(body) }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WPMUDEV API error: ${response.status} - ${error}`);
      }
      return await response.json();
    } catch (error) {
      console.error("WPMUDEV API request failed:", error);
      throw error;
    }
  }
  /**
   * Get available hosting plans
   */
  async getPlans() {
    const response = await this.apiRequest("/hosting/v1/plans");
    return response.plans || [];
  }
  /**
   * Provision a new WordPress site
   */
  async provisionSite(data) {
    const payload = {
      name: data.siteName,
      domain: data.domain,
      plan_id: data.planId,
      admin_email: data.adminEmail,
      admin_username: data.adminUsername || this.generateUsername(data.adminEmail),
      admin_password: data.adminPassword || this.generatePassword(),
      ...data.options
    };
    const response = await this.apiRequest("/hosting/v1/sites", "POST", payload);
    return {
      success: true,
      siteId: response.id,
      blogId: response.blog_id,
      hostingId: response.hosting_id,
      domain: response.domain,
      sftp: {
        host: response.sftp?.host,
        username: response.sftp?.username,
        port: response.sftp?.port || 22
      },
      wpAdmin: {
        url: `https://${response.domain}/wp-admin`,
        username: payload.admin_username,
        password: payload.admin_password
      },
      tempUrl: response.temp_url
    };
  }
  /**
   * Get site details
   */
  async getSite(siteId) {
    const response = await this.apiRequest(`/hosting/v1/sites/${siteId}`);
    return {
      id: response.id,
      blogId: response.blog_id,
      name: response.name,
      domain: response.domain,
      status: response.status,
      plan: response.plan,
      createdAt: response.created_at,
      sftp: response.sftp,
      stats: response.stats
    };
  }
  /**
   * Update site settings
   */
  async updateSite(siteId, updates) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}`,
      "PUT",
      updates
    );
    return {
      success: true,
      site: response
    };
  }
  /**
   * Delete a site
   */
  async deleteSite(siteId) {
    await this.apiRequest(`/hosting/v1/sites/${siteId}`, "DELETE");
    return {
      success: true,
      message: "Site deleted successfully"
    };
  }
  /**
   * Get site stats
   */
  async getSiteStats(siteId) {
    const response = await this.apiRequest(`/hosting/v1/sites/${siteId}/stats`);
    return {
      storageUsed: response.storage_used || 0,
      bandwidthUsed: response.bandwidth_used || 0,
      visitors: response.visitors || 0,
      lastBackup: response.last_backup ? new Date(response.last_backup) : /* @__PURE__ */ new Date()
    };
  }
  /**
   * Request SSL certificate
   */
  async provisionSSL(siteId, domain) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/ssl`,
      "POST",
      { domain }
    );
    return {
      success: true,
      certificateId: response.certificate_id,
      status: response.status,
      expiresAt: response.expires_at
    };
  }
  /**
   * Get SSL status
   */
  async getSSLStatus(siteId) {
    const response = await this.apiRequest(`/hosting/v1/sites/${siteId}/ssl`);
    return {
      active: response.active,
      certificateId: response.certificate_id,
      domain: response.domain,
      issuedAt: response.issued_at,
      expiresAt: response.expires_at,
      issuer: response.issuer
    };
  }
  /**
   * Create a backup
   */
  async createBackup(siteId) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/backups`,
      "POST"
    );
    return {
      success: true,
      backupId: response.id,
      status: response.status,
      createdAt: response.created_at
    };
  }
  /**
   * List backups
   */
  async listBackups(siteId) {
    const response = await this.apiRequest(`/hosting/v1/sites/${siteId}/backups`);
    return response.backups || [];
  }
  /**
   * Restore from backup
   */
  async restoreBackup(siteId, backupId) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/backups/${backupId}/restore`,
      "POST"
    );
    return {
      success: true,
      restoreId: response.restore_id,
      status: response.status
    };
  }
  /**
   * Get SFTP credentials
   */
  async getSftpCredentials(siteId) {
    const response = await this.apiRequest(`/hosting/v1/sites/${siteId}/sftp`);
    return {
      host: response.host,
      port: response.port || 22,
      username: response.username,
      password: response.password
    };
  }
  /**
   * Reset SFTP password
   */
  async resetSftpPassword(siteId) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/sftp/reset`,
      "POST"
    );
    return {
      success: true,
      username: response.username,
      password: response.password
    };
  }
  /**
   * Get database credentials
   */
  async getDatabaseCredentials(siteId) {
    const response = await this.apiRequest(`/hosting/v1/sites/${siteId}/database`);
    return {
      host: response.host,
      port: response.port || 3306,
      database: response.database,
      username: response.username,
      password: response.password
    };
  }
  /**
   * Clear cache
   */
  async clearCache(siteId) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/cache`,
      "DELETE"
    );
    return {
      success: true,
      message: response.message
    };
  }
  /**
   * Toggle staging mode
   */
  async toggleStaging(siteId, enable) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/staging`,
      enable ? "POST" : "DELETE",
      enable ? {} : void 0
    );
    return {
      success: true,
      enabled: enable,
      stagingUrl: response.staging_url
    };
  }
  /**
   * Sync staging to production
   */
  async syncStagingToProduction(siteId) {
    const response = await this.apiRequest(
      `/hosting/v1/sites/${siteId}/staging/sync`,
      "POST",
      { direction: "to_production" }
    );
    return {
      success: true,
      syncId: response.sync_id,
      status: response.status
    };
  }
  /**
   * Generate a random username
   */
  generateUsername(email) {
    const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const random = Math.random().toString(36).substring(2, 6);
    return `${base}_${random}`;
  }
  /**
   * Generate a secure random password
   */
  generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  /**
   * Mock response for development
   */
  mockResponse(endpoint, method, body) {
    console.log(`[WPMUDEV Mock] ${method} ${endpoint}`, body);
    const mockSiteId = `mock-site-${Date.now()}`;
    const mockBlogId = Math.floor(Math.random() * 1e6);
    const mockHostingId = `mock-hosting-${Date.now()}`;
    if (endpoint === "/hosting/v1/plans") {
      return {
        plans: [
          {
            id: "starter",
            name: "Starter",
            price: 999,
            storage: 5,
            bandwidth: 25e3
          },
          {
            id: "pro",
            name: "Pro",
            price: 2499,
            storage: 20,
            bandwidth: 1e5
          }
        ]
      };
    }
    if (endpoint.includes("/sites") && method === "POST") {
      return {
        id: mockSiteId,
        blog_id: mockBlogId,
        hosting_id: mockHostingId,
        name: body?.name,
        domain: body?.domain || `${mockSiteId}.temp.hostsblue.com`,
        status: "provisioning",
        temp_url: `https://${mockSiteId}.temp.hostsblue.com`,
        sftp: {
          host: `sftp.hostsblue.com`,
          username: `user_${mockBlogId}`,
          port: 22
        }
      };
    }
    if (endpoint.includes("/sites/") && method === "GET") {
      return {
        id: mockSiteId,
        blog_id: mockBlogId,
        name: "My WordPress Site",
        domain: "example.com",
        status: "active",
        plan: { id: "pro", name: "Pro" },
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        sftp: {
          host: "sftp.hostsblue.com",
          username: `user_${mockBlogId}`,
          port: 22
        },
        stats: {
          storage_used: 1024,
          bandwidth_used: 5120
        }
      };
    }
    if (endpoint.includes("/ssl") && method === "POST") {
      return {
        certificate_id: `cert-${Date.now()}`,
        status: "provisioning",
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1e3).toISOString()
      };
    }
    if (endpoint.includes("/backups") && method === "POST") {
      return {
        id: `backup-${Date.now()}`,
        status: "in_progress",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return { success: true };
  }
};

// server/services/swipesblue-payment.ts
var SWIPESBLUE_API_URL = process.env.SWIPESBLUE_API_URL || "https://api.swipesblue.com/v1";
var SWIPESBLUE_API_KEY = process.env.SWIPESBLUE_API_KEY || "";
var SWIPESBLUE_WEBHOOK_SECRET = process.env.SWIPESBLUE_WEBHOOK_SECRET || "";
var SwipesBluePayment = class {
  apiUrl;
  apiKey;
  webhookSecret;
  constructor() {
    this.apiUrl = SWIPESBLUE_API_URL;
    this.apiKey = SWIPESBLUE_API_KEY;
    this.webhookSecret = SWIPESBLUE_WEBHOOK_SECRET;
    if (!this.apiKey) {
      console.warn("SwipesBlue API key not configured - using mock mode");
    }
  }
  /**
   * Create a payment session/checkout
   */
  async createPaymentSession(data) {
    const payload = {
      amount: data.amount,
      currency: data.currency.toLowerCase(),
      reference: data.orderNumber,
      metadata: {
        order_id: data.orderId,
        order_number: data.orderNumber,
        ...data.metadata
      },
      customer: {
        email: data.customerEmail
      },
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      webhook_url: data.webhookUrl
    };
    try {
      if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
        console.log("[SwipesBlue Mock] Creating payment session:", payload);
        return `${process.env.CLIENT_URL}/checkout/mock?order=${data.orderNumber}&mock=true`;
      }
      const response = await fetch(`${this.apiUrl}/checkout/sessions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`SwipesBlue API error: ${error}`);
      }
      const result = await response.json();
      return result.checkout_url;
    } catch (error) {
      console.error("Failed to create payment session:", error);
      throw error;
    }
  }
  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: paymentId,
        status: "completed",
        amount: 0,
        currency: "usd",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`);
    }
    return await response.json();
  }
  /**
   * Process a refund
   */
  async processRefund(data) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: `refund-${Date.now()}`,
        payment_id: data.paymentId,
        amount: data.amount,
        status: "completed",
        reason: data.reason,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const response = await fetch(`${this.apiUrl}/refunds`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment_id: data.paymentId,
        amount: data.amount,
        reason: data.reason
      })
    });
    if (!response.ok) {
      throw new Error(`Refund failed: ${response.statusText}`);
    }
    return await response.json();
  }
  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret || this.webhookSecret === "your_webhook_secret") {
      return true;
    }
    try {
      const crypto = __require("crypto");
      const expectedSignature = crypto.createHmac("sha256", this.webhookSecret).update(JSON.stringify(payload)).digest("hex");
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return false;
    }
  }
  /**
   * Create a customer in SwipesBlue
   */
  async createCustomer(data) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: `cus-${Date.now()}`,
        email: data.email,
        name: data.name,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const response = await fetch(`${this.apiUrl}/customers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }
    return await response.json();
  }
  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(customerId, paymentMethodId) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: paymentMethodId,
        customer: customerId,
        type: "card"
      };
    }
    const response = await fetch(
      `${this.apiUrl}/customers/${customerId}/payment_methods`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          payment_method: paymentMethodId
        })
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to attach payment method: ${response.statusText}`);
    }
    return await response.json();
  }
  /**
   * Create subscription (for recurring billing)
   */
  async createSubscription(data) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: `sub-${Date.now()}`,
        customer: data.customerId,
        status: "active",
        items: data.items,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const response = await fetch(`${this.apiUrl}/subscriptions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer: data.customerId,
        items: data.items.map((item) => ({
          price: item.priceId,
          quantity: item.quantity || 1
        })),
        metadata: data.metadata
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to create subscription: ${response.statusText}`);
    }
    return await response.json();
  }
  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, atPeriodEnd = true) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: subscriptionId,
        status: atPeriodEnd ? "active" : "cancelled",
        cancel_at_period_end: atPeriodEnd
      };
    }
    const response = await fetch(
      `${this.apiUrl}/subscriptions/${subscriptionId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cancel_at_period_end: atPeriodEnd
        })
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to cancel subscription: ${response.statusText}`);
    }
    return await response.json();
  }
  /**
   * Get invoice for order
   */
  async getInvoice(invoiceId) {
    if (!this.apiKey || this.apiKey === "your_swipesblue_api_key") {
      return {
        id: invoiceId,
        amount_due: 0,
        amount_paid: 0,
        status: "paid",
        lines: []
      };
    }
    const response = await fetch(`${this.apiUrl}/invoices/${invoiceId}`, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to get invoice: ${response.statusText}`);
    }
    return await response.json();
  }
};

// server/services/order-orchestration.ts
import { eq } from "drizzle-orm";
var OrderOrchestrator = class {
  db;
  openSRS;
  wpmudev;
  constructor(db2, openSRS, wpmudev) {
    this.db = db2;
    this.openSRS = openSRS;
    this.wpmudev = wpmudev;
  }
  /**
   * Handle successful payment webhook
   * This is the main orchestration flow
   */
  async handlePaymentSuccess(orderId, paymentData) {
    const numericOrderId = typeof orderId === "string" ? parseInt(orderId) : orderId;
    console.log(`[Orchestrator] Processing payment success for order ${orderId}`);
    await this.db.transaction(async (tx) => {
      const order = await tx.query.orders.findFirst({
        where: eq(orders.id, numericOrderId),
        with: {
          items: true,
          customer: true
        }
      });
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      if (order.status === "completed") {
        console.log(`[Orchestrator] Order ${orderId} already completed`);
        return;
      }
      await tx.update(orders).set({
        status: "processing",
        paymentStatus: "completed",
        paidAt: /* @__PURE__ */ new Date(),
        paymentReference: paymentData.payment_id || paymentData.id,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(orders.id, numericOrderId));
      await tx.insert(payments).values({
        orderId: numericOrderId,
        customerId: order.customerId,
        amount: order.total,
        currency: order.currency,
        status: "completed",
        gateway: "swipesblue",
        gatewayTransactionId: paymentData.payment_id || paymentData.id,
        gatewayResponse: paymentData,
        processedAt: /* @__PURE__ */ new Date()
      });
      const results = await Promise.allSettled(
        order.items.map((item) => this.processOrderItem(tx, item, order.customer))
      );
      const failures = results.map((r, i) => ({ result: r, item: order.items[i] })).filter(({ result }) => result.status === "rejected");
      if (failures.length > 0) {
        console.error(`[Orchestrator] Some items failed for order ${orderId}:`, failures);
        await tx.update(orders).set({
          status: failures.length === order.items.length ? "failed" : "partial_failure",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(orders.id, numericOrderId));
        for (const { item, result } of failures) {
          await tx.insert(auditLogs).values({
            customerId: order.customerId,
            action: "order_item.failed",
            entityType: "order_item",
            entityId: String(item.id),
            description: `Order item ${item.id} failed to provision`,
            metadata: {
              orderId: numericOrderId,
              error: result.status === "rejected" ? result.reason : null
            }
          });
        }
      } else {
        await tx.update(orders).set({
          status: "completed",
          completedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(orders.id, numericOrderId));
        this.sendOrderConfirmation(order);
      }
      await tx.insert(auditLogs).values({
        customerId: order.customerId,
        action: "order.payment_success",
        entityType: "order",
        entityId: String(order.id),
        description: `Payment received and order processed`,
        metadata: {
          amount: order.total,
          paymentId: paymentData.payment_id || paymentData.id,
          failures: failures.length
        }
      });
    });
    console.log(`[Orchestrator] Completed processing order ${orderId}`);
  }
  /**
   * Process a single order item
   */
  async processOrderItem(tx, item, customer) {
    console.log(`[Orchestrator] Processing item ${item.id} (${item.itemType})`);
    await tx.update(orderItems).set({ status: "processing", updatedAt: /* @__PURE__ */ new Date() }).where(eq(orderItems.id, item.id));
    try {
      let result;
      switch (item.itemType) {
        case "domain_registration":
          result = await this.provisionDomain(tx, item, customer);
          break;
        case "domain_transfer":
          result = await this.initiateDomainTransfer(tx, item, customer);
          break;
        case "hosting_plan":
          result = await this.provisionHosting(tx, item, customer);
          break;
        case "privacy_protection":
          result = await this.enablePrivacy(tx, item);
          break;
        default:
          throw new Error(`Unknown item type: ${item.itemType}`);
      }
      await tx.update(orderItems).set({
        status: "completed",
        fulfilledAt: /* @__PURE__ */ new Date(),
        externalReference: result?.externalId
      }).where(eq(orderItems.id, item.id));
      return { success: true, data: result };
    } catch (error) {
      console.error(`[Orchestrator] Failed to process item ${item.id}:`, error);
      await tx.update(orderItems).set({
        status: "failed",
        errorMessage: error.message,
        retryCount: item.retryCount + 1
      }).where(eq(orderItems.id, item.id));
      throw error;
    }
  }
  /**
   * Provision a new domain registration
   */
  async provisionDomain(tx, item, customer) {
    const config = item.configuration;
    const domainName = `${config.domain}${config.tld}`;
    let contact = await tx.query.domainContacts.findFirst({
      where: eq(domainContacts.customerId, customer.id)
    });
    if (!contact) {
      const [newContact] = await tx.insert(domainContacts).values({
        customerId: customer.id,
        contactType: "owner",
        firstName: customer.firstName || "Unknown",
        lastName: customer.lastName || "User",
        companyName: customer.companyName,
        email: customer.email,
        phone: customer.phone || "+1.5555555555",
        address1: customer.address1 || "123 Main St",
        city: customer.city || "New York",
        state: customer.state || "NY",
        postalCode: customer.postalCode || "10001",
        countryCode: customer.countryCode || "US"
      }).returning();
      contact = newContact;
    }
    const registrationResult = await this.openSRS.registerDomain({
      domain: domainName,
      period: Math.ceil(item.termMonths / 12),
      contacts: {
        owner: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          organization: contact.companyName || void 0,
          email: contact.email,
          phone: contact.phone,
          address1: contact.address1,
          address2: contact.address2 || void 0,
          city: contact.city,
          state: contact.state,
          postalCode: contact.postalCode,
          country: contact.countryCode
        }
      },
      nameservers: ["ns1.hostsblue.com", "ns2.hostsblue.com"],
      privacy: config.privacy || false
    });
    if (!registrationResult.success) {
      throw new Error(`Domain registration failed: ${registrationResult.message}`);
    }
    const [domain] = await tx.insert(domains).values({
      customerId: customer.id,
      domainName,
      tld: config.tld,
      status: "active",
      registrationDate: /* @__PURE__ */ new Date(),
      expiryDate: new Date(Date.now() + item.termMonths * 30 * 24 * 60 * 60 * 1e3),
      registrationPeriodYears: Math.ceil(item.termMonths / 12),
      autoRenew: true,
      privacyEnabled: config.privacy || false,
      ownerContactId: contact.id,
      nameservers: ["ns1.hostsblue.com", "ns2.hostsblue.com"],
      useHostsBlueNameservers: true,
      openrsOrderId: registrationResult.orderId,
      openrsDomainId: registrationResult.domainId
    }).returning();
    await tx.update(orderItems).set({ domainId: domain.id }).where(eq(orderItems.id, item.id));
    return {
      externalId: registrationResult.domainId,
      domainId: domain.id
    };
  }
  /**
   * Initiate domain transfer
   */
  async initiateDomainTransfer(tx, item, customer) {
    const config = item.configuration;
    const domainName = `${config.domain}${config.tld}`;
    const contact = await tx.query.domainContacts.findFirst({
      where: eq(domainContacts.customerId, customer.id)
    });
    if (!contact) {
      throw new Error("Domain contact required for transfer");
    }
    const transferResult = await this.openSRS.transferDomain(
      domainName,
      config.authCode,
      {
        owner: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          organization: contact.companyName || void 0,
          email: contact.email,
          phone: contact.phone,
          address1: contact.address1,
          city: contact.city,
          state: contact.state,
          postalCode: contact.postalCode,
          country: contact.countryCode
        }
      }
    );
    if (!transferResult.success) {
      throw new Error(`Domain transfer failed: ${transferResult.message}`);
    }
    const [domain] = await tx.insert(domains).values({
      customerId: customer.id,
      domainName,
      tld: config.tld,
      status: "pending_transfer",
      isTransfer: true,
      transferAuthCode: config.authCode,
      transferStatus: transferResult.status,
      autoRenew: true,
      ownerContactId: contact.id,
      openrsOrderId: transferResult.transferId
    }).returning();
    await tx.update(orderItems).set({ domainId: domain.id }).where(eq(orderItems.id, item.id));
    return {
      externalId: transferResult.transferId,
      domainId: domain.id
    };
  }
  /**
   * Provision WordPress hosting
   */
  async provisionHosting(tx, item, customer) {
    const config = item.configuration;
    const plan = await tx.query.hostingPlans.findFirst({
      where: eq(hostingPlans.id, config.planId)
    });
    if (!plan) {
      throw new Error("Hosting plan not found");
    }
    const [hosting] = await tx.insert(hostingAccounts).values({
      customerId: customer.id,
      planId: plan.id,
      siteName: config.siteName || `${customer.firstName}'s Site`,
      primaryDomain: config.domain || null,
      status: "provisioning",
      billingCycle: item.termMonths >= 12 ? "yearly" : "monthly",
      subscriptionStartDate: /* @__PURE__ */ new Date(),
      subscriptionEndDate: new Date(Date.now() + item.termMonths * 30 * 24 * 60 * 60 * 1e3),
      autoRenew: true
    }).returning();
    const provisionResult = await this.wpmudev.provisionSite({
      siteName: hosting.siteName,
      domain: config.domain || `${hosting.uuid}.temp.hostsblue.com`,
      planId: plan.wpmudevPlanId || plan.slug,
      adminEmail: customer.email,
      options: {
        ssl: true,
        ...config.options
      }
    });
    await tx.update(hostingAccounts).set({
      status: "active",
      wpmudevSiteId: provisionResult.siteId,
      wpmudevBlogId: provisionResult.blogId,
      wpmudevHostingId: provisionResult.hostingId,
      wpAdminUsername: provisionResult.wpAdmin.username,
      wpAdminPasswordEncrypted: provisionResult.wpAdmin.password,
      // Should be encrypted
      sftpUsername: provisionResult.sftp.username,
      sftpHost: provisionResult.sftp.host,
      primaryDomain: provisionResult.domain
    }).where(eq(hostingAccounts.id, hosting.id));
    await tx.update(orderItems).set({ hostingAccountId: hosting.id }).where(eq(orderItems.id, item.id));
    return {
      externalId: provisionResult.siteId,
      hostingId: hosting.id
    };
  }
  /**
   * Enable WHOIS privacy for a domain
   */
  async enablePrivacy(tx, item) {
    return { success: true };
  }
  /**
   * Handle payment failure webhook
   */
  async handlePaymentFailure(orderId, paymentData) {
    const numericOrderId = typeof orderId === "string" ? parseInt(orderId) : orderId;
    console.log(`[Orchestrator] Processing payment failure for order ${orderId}`);
    await this.db.transaction(async (tx) => {
      await tx.update(orders).set({
        status: "failed",
        paymentStatus: "failed",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(orders.id, numericOrderId));
      const order = await tx.query.orders.findFirst({
        where: eq(orders.id, numericOrderId)
      });
      if (order) {
        await tx.insert(payments).values({
          orderId: numericOrderId,
          customerId: order.customerId,
          amount: order.total,
          currency: order.currency,
          status: "failed",
          gateway: "swipesblue",
          gatewayResponse: paymentData,
          failedAt: /* @__PURE__ */ new Date(),
          failureReason: paymentData.failure_message || "Payment declined"
        });
        await tx.insert(auditLogs).values({
          customerId: order.customerId,
          action: "order.payment_failed",
          entityType: "order",
          entityId: String(order.id),
          description: "Payment failed",
          metadata: {
            reason: paymentData.failure_message || "Unknown"
          }
        });
      }
    });
  }
  /**
   * Handle payment refund webhook
   */
  async handlePaymentRefund(orderId, refundData) {
    const numericOrderId = typeof orderId === "string" ? parseInt(orderId) : orderId;
    console.log(`[Orchestrator] Processing refund for order ${orderId}`);
    await this.db.transaction(async (tx) => {
      const order = await tx.query.orders.findFirst({
        where: eq(orders.id, numericOrderId),
        with: {
          items: true
        }
      });
      if (!order)
        return;
      await tx.update(orders).set({
        status: "refunded",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(orders.id, numericOrderId));
      await tx.update(payments).set({
        status: "refunded",
        refundedAmount: refundData.amount,
        refundReason: refundData.reason,
        refundedAt: /* @__PURE__ */ new Date()
      }).where(eq(payments.orderId, numericOrderId));
      await tx.insert(auditLogs).values({
        customerId: order.customerId,
        action: "order.refunded",
        entityType: "order",
        entityId: String(order.id),
        description: "Order refunded",
        metadata: {
          amount: refundData.amount,
          reason: refundData.reason
        }
      });
    });
  }
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order) {
    console.log(`[Orchestrator] Would send confirmation email for order ${order.id}`);
  }
  /**
   * Retry failed order items
   */
  async retryFailedItems(orderId) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: true,
        customer: true
      }
    });
    if (!order) {
      throw new Error("Order not found");
    }
    const failedItems = order.items.filter(
      (item) => item.status === "failed" && item.retryCount < 3
    );
    if (failedItems.length === 0) {
      console.log(`[Orchestrator] No failed items to retry for order ${orderId}`);
      return;
    }
    console.log(`[Orchestrator] Retrying ${failedItems.length} items for order ${orderId}`);
    await this.db.transaction(async (tx) => {
      for (const item of failedItems) {
        try {
          await this.processOrderItem(tx, item, order.customer);
        } catch (error) {
          console.error(`[Orchestrator] Retry failed for item ${item.id}:`, error);
        }
      }
      const updatedOrder = await tx.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: { items: true }
      });
      const allCompleted = updatedOrder?.items.every(
        (item) => item.status === "completed"
      );
      if (allCompleted) {
        await tx.update(orders).set({
          status: "completed",
          completedAt: /* @__PURE__ */ new Date()
        }).where(eq(orders.id, orderId));
      }
    });
  }
};

// server/routes.ts
import { ZodError, z } from "zod";
var domainSearchSchema = z.object({
  domain: z.string().min(1).max(253)
});
var createOrderSchema = z.object({
  items: z.array(z.object({
    type: z.enum(["domain_registration", "domain_transfer", "hosting_plan", "privacy_protection"]),
    domain: z.string().optional(),
    tld: z.string().optional(),
    planId: z.number().optional(),
    termYears: z.number().min(1).max(10).default(1),
    options: z.record(z.any()).optional()
  })).min(1),
  couponCode: z.string().optional()
});
var successResponse = (data, message) => ({
  success: true,
  data,
  ...message && { message }
});
var errorResponse = (message, code, details) => ({
  success: false,
  error: message,
  ...code && { code },
  ...details && { details }
});
var asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};
function registerRoutes(app2, db2) {
  const openSRS = new OpenSRSIntegration();
  const wpmudev = new WPMUDevIntegration();
  const swipesblue = new SwipesBluePayment();
  const orchestrator = new OrderOrchestrator(db2, openSRS, wpmudev);
  app2.post("/api/v1/auth/register", asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const existing = await db2.query.customers.findFirst({
      where: eq2(customers.email, email)
    });
    if (existing) {
      return res.status(409).json(errorResponse("Email already registered", "EMAIL_EXISTS"));
    }
    const passwordHash = await Bun.password.hash(password, "bcrypt");
    const [customer] = await db2.insert(customers).values({
      email,
      passwordHash,
      firstName,
      lastName
    }).returning();
    const tokens = generateTokens({ userId: customer.id, email: customer.email });
    await db2.insert(auditLogs).values({
      customerId: customer.id,
      action: "customer.register",
      entityType: "customer",
      entityId: String(customer.id),
      description: "Customer registered"
    });
    res.status(201).json(successResponse({
      customer: {
        id: customer.id,
        uuid: customer.uuid,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      },
      tokens
    }, "Registration successful"));
  }));
  app2.post("/api/v1/auth/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const customer = await db2.query.customers.findFirst({
      where: eq2(customers.email, email)
    });
    if (!customer || !customer.isActive) {
      return res.status(401).json(errorResponse("Invalid credentials", "INVALID_CREDENTIALS"));
    }
    const valid = await Bun.password.verify(password, customer.passwordHash);
    if (!valid) {
      return res.status(401).json(errorResponse("Invalid credentials", "INVALID_CREDENTIALS"));
    }
    await db2.update(customers).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq2(customers.id, customer.id));
    const tokens = generateTokens({ userId: customer.id, email: customer.email });
    res.json(successResponse({
      customer: {
        id: customer.id,
        uuid: customer.uuid,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        isAdmin: customer.isAdmin
      },
      tokens
    }));
  }));
  app2.post("/api/v1/auth/refresh", authenticateToken, asyncHandler(async (req, res) => {
    const tokens = generateTokens({ userId: req.user.userId, email: req.user.email });
    res.json(successResponse({ tokens }));
  }));
  app2.get("/api/v1/auth/me", requireAuth, asyncHandler(async (req, res) => {
    const customer = await db2.query.customers.findFirst({
      where: eq2(customers.id, req.user.userId)
    });
    if (!customer) {
      return res.status(404).json(errorResponse("User not found"));
    }
    res.json(successResponse({
      id: customer.id,
      uuid: customer.uuid,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      companyName: customer.companyName,
      phone: customer.phone,
      address1: customer.address1,
      city: customer.city,
      state: customer.state,
      postalCode: customer.postalCode,
      countryCode: customer.countryCode,
      emailVerified: customer.emailVerified
    }));
  }));
  app2.get("/api/v1/domains/search", asyncHandler(async (req, res) => {
    const { domain } = domainSearchSchema.parse(req.query);
    const tlds = await db2.query.tldPricing.findMany({
      where: and2(
        eq2(tldPricing.isActive, true),
        inArray(tldPricing.tld, [".com", ".net", ".org", ".io", ".co"])
      )
    });
    const results = await openSRS.checkAvailability(domain, tlds.map((t) => t.tld));
    res.json(successResponse({
      query: domain,
      results: results.map((r) => ({
        domain: r.domain,
        available: r.available,
        price: r.available ? tlds.find((t) => t.tld === r.tld)?.registrationPrice : null,
        tld: r.tld
      }))
    }));
  }));
  app2.get("/api/v1/domains/tlds", asyncHandler(async (req, res) => {
    const tlds = await db2.query.tldPricing.findMany({
      where: eq2(tldPricing.isActive, true),
      orderBy: [
        desc(tldPricing.isFeatured),
        tldPricing.tld
      ]
    });
    res.json(successResponse(tlds));
  }));
  app2.get("/api/v1/domains", requireAuth, asyncHandler(async (req, res) => {
    const domains2 = await db2.query.domains.findMany({
      where: and2(
        eq2(domains.customerId, req.user.userId),
        sql`${domains.deletedAt} IS NULL`
      ),
      with: {
        ownerContact: true
      },
      orderBy: desc(domains.createdAt)
    });
    res.json(successResponse(domains2));
  }));
  app2.get("/api/v1/domains/:uuid", requireAuth, asyncHandler(async (req, res) => {
    const domain = await db2.query.domains.findFirst({
      where: and2(
        eq2(domains.uuid, req.params.uuid),
        eq2(domains.customerId, req.user.userId),
        sql`${domains.deletedAt} IS NULL`
      ),
      with: {
        ownerContact: true,
        adminContact: true,
        techContact: true,
        billingContact: true,
        dnsRecords: true
      }
    });
    if (!domain) {
      return res.status(404).json(errorResponse("Domain not found"));
    }
    res.json(successResponse(domain));
  }));
  app2.patch("/api/v1/domains/:uuid", requireAuth, asyncHandler(async (req, res) => {
    const { nameservers, privacyEnabled, autoRenew } = req.body;
    const domain = await db2.query.domains.findFirst({
      where: and2(
        eq2(domains.uuid, req.params.uuid),
        eq2(domains.customerId, req.user.userId)
      )
    });
    if (!domain) {
      return res.status(404).json(errorResponse("Domain not found"));
    }
    if (nameservers) {
      await openSRS.updateNameservers(domain.domainName, nameservers);
    }
    const [updated] = await db2.update(domains).set({
      ...nameservers && { nameservers },
      ...privacyEnabled !== void 0 && { privacyEnabled },
      ...autoRenew !== void 0 && { autoRenew },
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(domains.id, domain.id)).returning();
    res.json(successResponse(updated));
  }));
  app2.get("/api/v1/hosting/plans", asyncHandler(async (req, res) => {
    const plans = await db2.query.hostingPlans.findMany({
      where: eq2(hostingPlans.isActive, true),
      orderBy: hostingPlans.sortOrder
    });
    res.json(successResponse(plans));
  }));
  app2.get("/api/v1/hosting/accounts", requireAuth, asyncHandler(async (req, res) => {
    const accounts = await db2.query.hostingAccounts.findMany({
      where: and2(
        eq2(hostingAccounts.customerId, req.user.userId),
        sql`${hostingAccounts.deletedAt} IS NULL`
      ),
      with: {
        plan: true
      },
      orderBy: desc(hostingAccounts.createdAt)
    });
    res.json(successResponse(accounts));
  }));
  app2.get("/api/v1/hosting/accounts/:uuid", requireAuth, asyncHandler(async (req, res) => {
    const account = await db2.query.hostingAccounts.findFirst({
      where: and2(
        eq2(hostingAccounts.uuid, req.params.uuid),
        eq2(hostingAccounts.customerId, req.user.userId),
        sql`${hostingAccounts.deletedAt} IS NULL`
      ),
      with: {
        plan: true
      }
    });
    if (!account) {
      return res.status(404).json(errorResponse("Hosting account not found"));
    }
    res.json(successResponse(account));
  }));
  app2.post("/api/v1/orders", requireAuth, asyncHandler(async (req, res) => {
    const { items, couponCode } = createOrderSchema.parse(req.body);
    let subtotal = 0;
    const orderItems2 = [];
    for (const item of items) {
      let price = 0;
      let description = "";
      let configuration = {};
      if (item.type === "domain_registration" && item.domain && item.tld) {
        const tld = await db2.query.tldPricing.findFirst({
          where: eq2(tldPricing.tld, item.tld)
        });
        if (!tld) {
          return res.status(400).json(errorResponse(`Invalid TLD: ${item.tld}`));
        }
        price = tld.registrationPrice * item.termYears;
        description = `Domain Registration: ${item.domain}${item.tld} (${item.termYears} year${item.termYears > 1 ? "s" : ""})`;
        configuration = { domain: item.domain, tld: item.tld };
      } else if (item.type === "hosting_plan" && item.planId) {
        const plan = await db2.query.hostingPlans.findFirst({
          where: eq2(hostingPlans.id, item.planId)
        });
        if (!plan) {
          return res.status(400).json(errorResponse(`Invalid hosting plan`));
        }
        price = item.termYears >= 12 ? plan.yearlyPrice : plan.monthlyPrice * item.termYears;
        description = `${plan.name} Hosting (${item.termYears} month${item.termYears > 1 ? "s" : ""})`;
        configuration = { planId: plan.id, planSlug: plan.slug };
      }
      subtotal += price;
      orderItems2.push({
        type: item.type,
        description,
        unitPrice: price,
        quantity: 1,
        totalPrice: price,
        termMonths: item.termYears * (item.type === "domain_registration" ? 12 : 1),
        configuration
      });
    }
    let discountAmount = 0;
    const total = subtotal - discountAmount;
    const orderNumber = `HB${Date.now().toString(36).toUpperCase()}`;
    const [order] = await db2.insert(orders).values({
      customerId: req.user.userId,
      orderNumber,
      status: "draft",
      subtotal,
      discountAmount,
      taxAmount: 0,
      total,
      currency: "USD",
      couponCode
    }).returning();
    for (const item of orderItems2) {
      await db2.insert(orderItems).values({
        orderId: order.id,
        ...item
      });
    }
    res.status(201).json(successResponse({
      order: {
        ...order,
        items: orderItems2
      }
    }, "Order created"));
  }));
  app2.get("/api/v1/orders", requireAuth, asyncHandler(async (req, res) => {
    const orders2 = await db2.query.orders.findMany({
      where: eq2(orders.customerId, req.user.userId),
      with: {
        items: true
      },
      orderBy: desc(orders.createdAt)
    });
    res.json(successResponse(orders2));
  }));
  app2.get("/api/v1/orders/:uuid", requireAuth, asyncHandler(async (req, res) => {
    const order = await db2.query.orders.findFirst({
      where: and2(
        eq2(orders.uuid, req.params.uuid),
        eq2(orders.customerId, req.user.userId)
      ),
      with: {
        items: {
          with: {
            domain: true,
            hostingAccount: true
          }
        }
      }
    });
    if (!order) {
      return res.status(404).json(errorResponse("Order not found"));
    }
    res.json(successResponse(order));
  }));
  app2.post("/api/v1/orders/:uuid/checkout", requireAuth, asyncHandler(async (req, res) => {
    const order = await db2.query.orders.findFirst({
      where: and2(
        eq2(orders.uuid, req.params.uuid),
        eq2(orders.customerId, req.user.userId)
      ),
      with: {
        items: true
      }
    });
    if (!order) {
      return res.status(404).json(errorResponse("Order not found"));
    }
    if (order.status !== "draft") {
      return res.status(400).json(errorResponse("Order already processed"));
    }
    await db2.update(orders).set({ status: "pending_payment", submittedAt: /* @__PURE__ */ new Date() }).where(eq2(orders.id, order.id));
    const paymentUrl = await swipesblue.createPaymentSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: order.currency,
      customerEmail: req.user.email,
      successUrl: `${process.env.CLIENT_URL}/checkout/success?order=${order.uuid}`,
      cancelUrl: `${process.env.CLIENT_URL}/checkout/cancel?order=${order.uuid}`,
      webhookUrl: `${process.env.APP_URL}/api/v1/webhooks/payment`
    });
    res.json(successResponse({
      paymentUrl,
      orderId: order.uuid
    }, "Proceed to payment"));
  }));
  app2.post("/api/v1/webhooks/payment", asyncHandler(async (req, res) => {
    const signature = req.headers["x-swipesblue-signature"];
    if (!swipesblue.verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json(errorResponse("Invalid signature"));
    }
    const { event, data } = req.body;
    await db2.insert(webhookEvents).values({
      source: "swipesblue",
      eventType: event,
      payload: data,
      headers: req.headers,
      idempotencyKey: data.idempotency_key
    });
    switch (event) {
      case "payment.success":
        await orchestrator.handlePaymentSuccess(data.orderId, data);
        break;
      case "payment.failed":
        await orchestrator.handlePaymentFailure(data.orderId, data);
        break;
      case "payment.refunded":
        await orchestrator.handlePaymentRefund(data.orderId, data);
        break;
    }
    res.json({ received: true });
  }));
  app2.get("/api/v1/dashboard/stats", requireAuth, asyncHandler(async (req, res) => {
    const domainStats = await db2.select({
      status: domains.status,
      count: sql`count(*)`
    }).from(domains).where(and2(
      eq2(domains.customerId, req.user.userId),
      sql`${domains.deletedAt} IS NULL`
    )).groupBy(domains.status);
    const hostingStats = await db2.select({
      status: hostingAccounts.status,
      count: sql`count(*)`
    }).from(hostingAccounts).where(and2(
      eq2(hostingAccounts.customerId, req.user.userId),
      sql`${hostingAccounts.deletedAt} IS NULL`
    )).groupBy(hostingAccounts.status);
    const recentOrders = await db2.query.orders.findMany({
      where: eq2(orders.customerId, req.user.userId),
      orderBy: desc(orders.createdAt),
      limit: 5
    });
    const expiringDomains = await db2.query.domains.findMany({
      where: and2(
        eq2(domains.customerId, req.user.userId),
        eq2(domains.status, "active"),
        sql`${domains.expiryDate} < NOW() + INTERVAL '30 days'`,
        sql`${domains.deletedAt} IS NULL`
      ),
      orderBy: domains.expiryDate,
      limit: 5
    });
    res.json(successResponse({
      domains: {
        total: domainStats.reduce((acc, s) => acc + Number(s.count), 0),
        byStatus: domainStats,
        expiringSoon: expiringDomains
      },
      hosting: {
        total: hostingStats.reduce((acc, s) => acc + Number(s.count), 0),
        byStatus: hostingStats
      },
      recentOrders
    }));
  }));
  app2.use((err, req, res, next) => {
    if (err instanceof ZodError) {
      return res.status(400).json(errorResponse(
        "Validation error",
        "VALIDATION_ERROR",
        err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message
        }))
      ));
    }
    next(err);
  });
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = process.env.PORT || 5e3;
var NODE_ENV = process.env.NODE_ENV || "development";
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
var db = drizzle(pool, { schema: schema_exports });
var app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
var PgSession = ConnectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  })
);
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://hostsblue.com",
    "https://www.hostsblue.com"
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use((req, res, next) => {
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  console.log(`[${timestamp2}] ${req.method} ${req.path}`);
  next();
});
registerRoutes(app, db);
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0.0"
  });
});
app.get("/test", (req, res) => {
  res.json({ message: "Server is working", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var distPath = path.resolve(process.cwd(), "dist/client");
if (!fs.existsSync(distPath)) {
  distPath = path.resolve(process.cwd(), "public");
  console.log(`[STARTUP] dist/client not found, using public folder instead`);
}
console.log(`[STARTUP] Serving static files from: ${distPath}`);
console.log(`[STARTUP] Directory exists: ${fs.existsSync(distPath)}`);
console.log(`[STARTUP] index.html exists: ${fs.existsSync(path.join(distPath, "index.html"))}`);
app.use(express.static(distPath));
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  fs.readFile(indexPath, "utf8", (err, data) => {
    if (err) {
      console.error(`[ERROR] Failed to read ${indexPath}:`, err.message);
      res.send("<h1>HostsBlue Server Running</h1><p>index.html not found, but server is online.</p>");
    } else {
      res.type("html").send(data);
    }
  });
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const message = NODE_ENV === "production" ? "An unexpected error occurred" : err.message || "Internal server error";
  res.status(err.status || 500).json({
    success: false,
    error: message,
    ...NODE_ENV !== "production" && { stack: err.stack }
  });
});
app.listen(PORT, () => {
  console.log(`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551                                                            \u2551
\u2551   \u{1F310} HostsBlue Server                                      \u2551
\u2551   White-label Domain & Hosting Platform                    \u2551
\u2551                                                            \u2551
\u2551   Environment: ${NODE_ENV.padEnd(43)}\u2551
\u2551   Port: ${String(PORT).padEnd(50)}\u2551
\u2551                                                            \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
  `);
});
var server_default = app;
export {
  db,
  server_default as default
};
