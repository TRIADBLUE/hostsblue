export interface BuilderPlanLimits {
  maxSites: number;
  maxPagesPerSite: number;
  features: string[];
  customCode: boolean;
  customDomain: boolean;
  analytics: boolean;
  whiteLabel: boolean;
  ecommerce: boolean;
  clientManagement: boolean;
}

export const BUILDER_PLANS: Record<string, BuilderPlanLimits> = {
  starter: {
    maxSites: 1,
    maxPagesPerSite: 5,
    features: ['templates', 'seo', 'forms'],
    customCode: false,
    customDomain: false,
    analytics: false,
    whiteLabel: false,
    ecommerce: false,
    clientManagement: false,
  },
  pro: {
    maxSites: 5,
    maxPagesPerSite: 20,
    features: ['templates', 'seo', 'forms', 'custom-code', 'analytics', 'custom-domain'],
    customCode: true,
    customDomain: true,
    analytics: true,
    whiteLabel: false,
    ecommerce: true,
    clientManagement: false,
  },
  agency: {
    maxSites: 50,
    maxPagesPerSite: 100,
    features: ['templates', 'seo', 'forms', 'custom-code', 'analytics', 'custom-domain', 'white-label', 'ecommerce', 'client-management'],
    customCode: true,
    customDomain: true,
    analytics: true,
    whiteLabel: true,
    ecommerce: true,
    clientManagement: true,
  },
};

export type BuilderPlanName = keyof typeof BUILDER_PLANS;

export function getPlanLimits(plan: string): BuilderPlanLimits {
  return BUILDER_PLANS[plan] || BUILDER_PLANS.starter;
}
