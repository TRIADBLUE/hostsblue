/**
 * Plan Enforcement — checks builder subscription limits
 */

import { eq, and, sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../shared/schema.js';
import { getPlanLimits, type BuilderPlanLimits } from '../../shared/builder-plans.js';

interface PlanInfo {
  plan: string;
  limits: BuilderPlanLimits;
}

export class PlanEnforcement {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  async getCustomerPlan(customerId: number): Promise<PlanInfo> {
    const sub = await this.db.query.builderSubscriptions.findFirst({
      where: eq(schema.builderSubscriptions.customerId, customerId),
    });
    const plan = sub?.plan || 'starter';
    return { plan, limits: getPlanLimits(plan) };
  }

  async checkSiteLimit(customerId: number): Promise<{ allowed: boolean; reason?: string }> {
    const { limits } = await this.getCustomerPlan(customerId);
    const projects = await this.db.query.websiteProjects.findMany({
      where: and(
        eq(schema.websiteProjects.customerId, customerId),
        sql`${schema.websiteProjects.deletedAt} IS NULL`,
      ),
    });

    if (projects.length >= limits.maxSites) {
      return { allowed: false, reason: `You have reached the limit of ${limits.maxSites} site(s) on your current plan. Please upgrade to create more.` };
    }
    return { allowed: true };
  }

  async checkPageLimit(customerId: number, projectId: number): Promise<{ allowed: boolean; reason?: string }> {
    const { limits } = await this.getCustomerPlan(customerId);
    const pages = await this.db.query.websitePages.findMany({
      where: eq(schema.websitePages.projectId, projectId),
    });

    if (pages.length >= limits.maxPagesPerSite) {
      return { allowed: false, reason: `You have reached the limit of ${limits.maxPagesPerSite} page(s) per site on your current plan. Please upgrade to add more.` };
    }
    return { allowed: true };
  }

  async checkFeatureGate(customerId: number, feature: string): Promise<{ allowed: boolean; reason?: string }> {
    const { limits } = await this.getCustomerPlan(customerId);
    if (!limits.features.includes(feature)) {
      return { allowed: false, reason: `The "${feature}" feature is not available on your current plan. Please upgrade to access it.` };
    }
    return { allowed: true };
  }
}
