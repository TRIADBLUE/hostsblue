/**
 * AI Credits Service — billing engine for pay-as-you-go AI usage
 * Handles credit balances, usage tracking, auto-top-up, spending limits
 */

import { eq, and, desc, sql, gte } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../shared/schema.js';

// ============================================================================
// MODEL PRICING (per 1K tokens, in cents)
// ============================================================================

export interface ModelPricing {
  provider: string;
  model: string;
  inputPer1k: number;   // cents per 1K input tokens
  outputPer1k: number;  // cents per 1K output tokens
  margin: number;       // multiplier (e.g. 1.3 = 30% markup)
}

export const MODEL_PRICING: ModelPricing[] = [
  // DeepSeek
  { provider: 'deepseek', model: 'deepseek-chat', inputPer1k: 0.014, outputPer1k: 0.028, margin: 1.4 },
  { provider: 'deepseek', model: 'deepseek-reasoner', inputPer1k: 0.055, outputPer1k: 0.219, margin: 1.4 },
  // OpenAI
  { provider: 'openai', model: 'gpt-4o', inputPer1k: 0.25, outputPer1k: 1.0, margin: 1.3 },
  { provider: 'openai', model: 'gpt-4o-mini', inputPer1k: 0.015, outputPer1k: 0.06, margin: 1.3 },
  { provider: 'openai', model: 'gpt-4.1', inputPer1k: 0.20, outputPer1k: 0.80, margin: 1.3 },
  { provider: 'openai', model: 'gpt-4.1-mini', inputPer1k: 0.04, outputPer1k: 0.16, margin: 1.3 },
  { provider: 'openai', model: 'gpt-4.1-nano', inputPer1k: 0.01, outputPer1k: 0.04, margin: 1.3 },
  // Anthropic
  { provider: 'anthropic', model: 'claude-sonnet-4-20250514', inputPer1k: 0.30, outputPer1k: 1.50, margin: 1.3 },
  { provider: 'anthropic', model: 'claude-haiku-3-20250601', inputPer1k: 0.025, outputPer1k: 0.125, margin: 1.3 },
  // Groq
  { provider: 'groq', model: 'llama-3.3-70b-versatile', inputPer1k: 0.059, outputPer1k: 0.079, margin: 1.5 },
  // Gemini
  { provider: 'gemini', model: 'gemini-2.0-flash', inputPer1k: 0.01, outputPer1k: 0.04, margin: 1.5 },
  { provider: 'gemini', model: 'gemini-2.5-pro', inputPer1k: 0.125, outputPer1k: 0.50, margin: 1.3 },
  { provider: 'gemini', model: 'gemini-2.5-flash', inputPer1k: 0.015, outputPer1k: 0.06, margin: 1.4 },
];

// ============================================================================
// AVAILABLE MODELS (for dropdowns)
// ============================================================================

export interface AvailableModel {
  id: string;
  label: string;
  recommended?: boolean;
}

export interface ProviderModels {
  provider: string;
  label: string;
  models: AvailableModel[];
}

export const AVAILABLE_MODELS: ProviderModels[] = [
  {
    provider: 'deepseek', label: 'DeepSeek',
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek Chat', recommended: true },
      { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner' },
    ],
  },
  {
    provider: 'openai', label: 'OpenAI',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o', recommended: true },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { id: 'gpt-4.1', label: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { id: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
    ],
  },
  {
    provider: 'anthropic', label: 'Anthropic (Claude)',
    models: [
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4', recommended: true },
      { id: 'claude-haiku-3-20250601', label: 'Claude Haiku 3' },
    ],
  },
  {
    provider: 'groq', label: 'Groq',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', recommended: true },
    ],
  },
  {
    provider: 'gemini', label: 'Google Gemini',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', recommended: true },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    ],
  },
];

// ============================================================================
// COST CALCULATION RESULT
// ============================================================================

export interface CostBreakdown {
  inputCostCents: number;
  outputCostCents: number;
  totalCostCents: number;
  marginCents: number;
  baseCostCents: number;
}

// ============================================================================
// AI CREDITS SERVICE
// ============================================================================

export class AiCreditsService {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Get or create credit balance for a customer
   */
  async getBalance(customerId: number): Promise<schema.AiCreditBalance> {
    let balance = await this.db.query.aiCreditBalances.findFirst({
      where: eq(schema.aiCreditBalances.customerId, customerId),
    });

    if (!balance) {
      const [created] = await this.db.insert(schema.aiCreditBalances).values({
        customerId,
      }).returning();
      balance = created;
    }

    return balance;
  }

  /**
   * Calculate cost for a given model and token usage
   */
  calculateCost(modelName: string, inputTokens: number, outputTokens: number): CostBreakdown {
    const pricing = MODEL_PRICING.find(p => p.model === modelName);

    // Fallback: if model not found, use a default rate
    const inputPer1k = pricing?.inputPer1k ?? 0.10;
    const outputPer1k = pricing?.outputPer1k ?? 0.30;
    const margin = pricing?.margin ?? 1.3;

    const baseInputCost = (inputTokens / 1000) * inputPer1k;
    const baseOutputCost = (outputTokens / 1000) * outputPer1k;
    const baseCost = baseInputCost + baseOutputCost;

    const totalCost = baseCost * margin;
    const marginAmount = totalCost - baseCost;

    // Round up to nearest cent (minimum 1 cent if any tokens used)
    const inputCostCents = Math.ceil((inputTokens / 1000) * inputPer1k * margin);
    const outputCostCents = Math.ceil((outputTokens / 1000) * outputPer1k * margin);
    const totalCostCents = Math.max(inputCostCents + outputCostCents, inputTokens + outputTokens > 0 ? 1 : 0);

    return {
      inputCostCents,
      outputCostCents,
      totalCostCents,
      marginCents: Math.ceil(marginAmount),
      baseCostCents: Math.ceil(baseCost),
    };
  }

  /**
   * Check if customer can afford estimated cost
   */
  async canAfford(customerId: number, estimatedCostCents: number): Promise<{ allowed: boolean; reason?: string }> {
    const balance = await this.getBalance(customerId);

    // Check spending limit
    if (balance.spendingLimitCents !== null) {
      await this.resetPeriodIfNeeded(customerId);
      const updatedBalance = await this.getBalance(customerId);
      if (updatedBalance.currentPeriodUsageCents + estimatedCostCents > updatedBalance.spendingLimitCents!) {
        return { allowed: false, reason: `Spending limit reached ($${(updatedBalance.spendingLimitCents! / 100).toFixed(2)} ${updatedBalance.spendingLimitPeriod}). Adjust in Billing settings.` };
      }
    }

    if (balance.balanceCents < estimatedCostCents) {
      return { allowed: false, reason: `Insufficient credits. Balance: $${(balance.balanceCents / 100).toFixed(2)}, estimated cost: $${(estimatedCostCents / 100).toFixed(2)}. Add credits in Billing.` };
    }

    return { allowed: true };
  }

  /**
   * Atomic credit deduction — returns null if insufficient balance
   */
  async deductCredits(params: {
    customerId: number;
    amountCents: number;
    description: string;
    aiUsageLogId?: number;
    metadata?: Record<string, any>;
  }): Promise<schema.AiCreditTransaction | null> {
    const { customerId, amountCents, description, aiUsageLogId, metadata } = params;

    // Atomic deduction: only succeeds if balance >= amount
    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({
        balanceCents: sql`${schema.aiCreditBalances.balanceCents} - ${amountCents}`,
        totalUsedCents: sql`${schema.aiCreditBalances.totalUsedCents} + ${amountCents}`,
        currentPeriodUsageCents: sql`${schema.aiCreditBalances.currentPeriodUsageCents} + ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(and(
        eq(schema.aiCreditBalances.customerId, customerId),
        sql`${schema.aiCreditBalances.balanceCents} >= ${amountCents}`,
      ))
      .returning();

    if (!updated) return null;

    // Record transaction
    const [tx] = await this.db.insert(schema.aiCreditTransactions).values({
      customerId,
      type: 'ai_usage',
      amountCents: -amountCents,
      balanceAfterCents: updated.balanceCents,
      description,
      aiUsageLogId: aiUsageLogId ?? null,
      metadata: metadata ?? {},
    }).returning();

    return tx;
  }

  /**
   * Add credits after successful payment
   */
  async addCredits(customerId: number, amountCents: number, paymentRef?: string, orderId?: number): Promise<schema.AiCreditTransaction> {
    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({
        balanceCents: sql`${schema.aiCreditBalances.balanceCents} + ${amountCents}`,
        totalPurchasedCents: sql`${schema.aiCreditBalances.totalPurchasedCents} + ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.aiCreditBalances.customerId, customerId))
      .returning();

    // If no balance record exists yet, create one
    if (!updated) {
      await this.db.insert(schema.aiCreditBalances).values({
        customerId,
        balanceCents: amountCents,
        totalPurchasedCents: amountCents,
      });
    }

    const balance = await this.getBalance(customerId);

    const [tx] = await this.db.insert(schema.aiCreditTransactions).values({
      customerId,
      type: 'purchase',
      amountCents,
      balanceAfterCents: balance.balanceCents,
      description: `Credit purchase: $${(amountCents / 100).toFixed(2)}`,
      paymentReference: paymentRef ?? null,
      orderId: orderId ?? null,
      metadata: {},
    }).returning();

    return tx;
  }

  /**
   * Refund credits
   */
  async refundCredits(customerId: number, amountCents: number, reason: string): Promise<schema.AiCreditTransaction> {
    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({
        balanceCents: sql`${schema.aiCreditBalances.balanceCents} + ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.aiCreditBalances.customerId, customerId))
      .returning();

    const balanceAfter = updated?.balanceCents ?? amountCents;

    const [tx] = await this.db.insert(schema.aiCreditTransactions).values({
      customerId,
      type: 'refund',
      amountCents,
      balanceAfterCents: balanceAfter,
      description: `Refund: ${reason}`,
      metadata: {},
    }).returning();

    return tx;
  }

  /**
   * Check and trigger auto-top-up if below threshold
   */
  async checkAutoTopup(customerId: number): Promise<boolean> {
    const balance = await this.getBalance(customerId);

    if (!balance.autoTopupEnabled) return false;
    if (balance.balanceCents >= balance.autoTopupThresholdCents) return false;

    // Add credits (actual payment would be triggered via order system)
    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({
        balanceCents: sql`${schema.aiCreditBalances.balanceCents} + ${balance.autoTopupAmountCents}`,
        totalPurchasedCents: sql`${schema.aiCreditBalances.totalPurchasedCents} + ${balance.autoTopupAmountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.aiCreditBalances.customerId, customerId))
      .returning();

    if (updated) {
      await this.db.insert(schema.aiCreditTransactions).values({
        customerId,
        type: 'auto_topup',
        amountCents: balance.autoTopupAmountCents,
        balanceAfterCents: updated.balanceCents,
        description: `Auto top-up: $${(balance.autoTopupAmountCents / 100).toFixed(2)}`,
        metadata: { threshold: balance.autoTopupThresholdCents },
      });
    }

    return true;
  }

  /**
   * Update auto-top-up settings
   */
  async updateAutoTopupSettings(customerId: number, settings: {
    enabled: boolean;
    thresholdCents?: number;
    amountCents?: number;
  }): Promise<schema.AiCreditBalance> {
    await this.getBalance(customerId); // ensure exists

    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({
        autoTopupEnabled: settings.enabled,
        ...(settings.thresholdCents !== undefined && { autoTopupThresholdCents: settings.thresholdCents }),
        ...(settings.amountCents !== undefined && { autoTopupAmountCents: settings.amountCents }),
        updatedAt: new Date(),
      })
      .where(eq(schema.aiCreditBalances.customerId, customerId))
      .returning();

    return updated;
  }

  /**
   * Update spending limit
   */
  async updateSpendingLimit(customerId: number, limitCents: number | null, period: string = 'monthly'): Promise<schema.AiCreditBalance> {
    await this.getBalance(customerId); // ensure exists

    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({
        spendingLimitCents: limitCents,
        spendingLimitPeriod: period,
        updatedAt: new Date(),
      })
      .where(eq(schema.aiCreditBalances.customerId, customerId))
      .returning();

    return updated;
  }

  /**
   * Reset period usage if past the reset date
   */
  async resetPeriodIfNeeded(customerId: number): Promise<void> {
    const balance = await this.getBalance(customerId);
    if (!balance.periodResetAt) {
      // Initialize period
      const now = new Date();
      const resetAt = balance.spendingLimitPeriod === 'daily'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        : new Date(now.getFullYear(), now.getMonth() + 1, 1);

      await this.db.update(schema.aiCreditBalances)
        .set({ periodResetAt: resetAt, currentPeriodUsageCents: 0, updatedAt: new Date() })
        .where(eq(schema.aiCreditBalances.customerId, customerId));
      return;
    }

    if (new Date() >= balance.periodResetAt) {
      const now = new Date();
      const nextReset = balance.spendingLimitPeriod === 'daily'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        : new Date(now.getFullYear(), now.getMonth() + 1, 1);

      await this.db.update(schema.aiCreditBalances)
        .set({ periodResetAt: nextReset, currentPeriodUsageCents: 0, updatedAt: new Date() })
        .where(eq(schema.aiCreditBalances.customerId, customerId));
    }
  }

  /**
   * Get paginated transaction history
   */
  async getTransactions(customerId: number, limit: number = 20, offset: number = 0) {
    return this.db.query.aiCreditTransactions.findMany({
      where: eq(schema.aiCreditTransactions.customerId, customerId),
      orderBy: desc(schema.aiCreditTransactions.createdAt),
      limit,
      offset,
    });
  }

  /**
   * Get daily usage aggregation for chart
   */
  async getDailyUsage(customerId: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await this.db.select({
      date: sql<string>`DATE(${schema.aiUsageLogs.createdAt})`.as('date'),
      totalCost: sql<number>`SUM(${schema.aiUsageLogs.totalCostCents})`.as('total_cost'),
      calls: sql<number>`COUNT(*)`.as('calls'),
    })
      .from(schema.aiUsageLogs)
      .where(and(
        eq(schema.aiUsageLogs.customerId, customerId),
        gte(schema.aiUsageLogs.createdAt, since),
      ))
      .groupBy(sql`DATE(${schema.aiUsageLogs.createdAt})`)
      .orderBy(sql`DATE(${schema.aiUsageLogs.createdAt})`);

    return rows;
  }

  /**
   * Get per-model cost breakdown
   */
  async getModelBreakdown(customerId: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await this.db.select({
      provider: schema.aiUsageLogs.provider,
      modelName: schema.aiUsageLogs.modelName,
      totalCost: sql<number>`SUM(${schema.aiUsageLogs.totalCostCents})`.as('total_cost'),
      totalTokens: sql<number>`SUM(${schema.aiUsageLogs.totalTokens})`.as('total_tokens'),
      calls: sql<number>`COUNT(*)`.as('calls'),
    })
      .from(schema.aiUsageLogs)
      .where(and(
        eq(schema.aiUsageLogs.customerId, customerId),
        gte(schema.aiUsageLogs.createdAt, since),
      ))
      .groupBy(schema.aiUsageLogs.provider, schema.aiUsageLogs.modelName)
      .orderBy(sql`SUM(${schema.aiUsageLogs.totalCostCents}) DESC`);

    return rows;
  }

  /**
   * Get model pricing table
   */
  getModelPricing(): ModelPricing[] {
    return MODEL_PRICING;
  }

  /**
   * Get available models grouped by provider
   */
  getAvailableModels(): ProviderModels[] {
    return AVAILABLE_MODELS;
  }

  /**
   * Update billing mode
   */
  async updateBillingMode(customerId: number, mode: 'credits' | 'byok'): Promise<schema.AiCreditBalance> {
    await this.getBalance(customerId); // ensure exists

    const [updated] = await this.db.update(schema.aiCreditBalances)
      .set({ billingMode: mode, updatedAt: new Date() })
      .where(eq(schema.aiCreditBalances.customerId, customerId))
      .returning();

    return updated;
  }
}
