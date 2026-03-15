import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Check, ChevronDown, Sparkles, Palette, Code, Users } from 'lucide-react';
import { MetaTags } from '@/components/seo/meta-tags';
import type { CartItem } from '@/hooks/use-cart';

interface CartContext {
  addItem: (item: Omit<CartItem, 'id'>) => void;
  openCart: () => void;
}

const builderPlans = [
  {
    name: 'Starter',
    slug: 'starter',
    monthly: 4.99,
    icon: Sparkles,
    sites: 1,
    pages: 5,
    features: [
      '1 Website',
      '5 Pages',
      'AI Page Generator',
      'Drag-and-Drop Editor',
      'Professional Templates',
      'SEO Tools',
      'Contact Forms',
      'Free SSL',
    ],
    popular: false,
  },
  {
    name: 'Business',
    slug: 'pro',
    monthly: 14.99,
    icon: Palette,
    sites: 3,
    pages: 20,
    features: [
      '3 Websites',
      'Unlimited Pages',
      'AI Page Generator',
      'Drag-and-Drop Editor',
      'Professional Templates',
      'SEO Tools',
      'Contact Forms',
      'Free SSL',
      'Custom Domain',
      'Analytics Dashboard',
      'Custom Code Injection',
      'E-Commerce Store',
    ],
    popular: true,
  },
  {
    name: 'Professional',
    slug: 'pro',
    monthly: 29.99,
    icon: Code,
    sites: 10,
    pages: 50,
    features: [
      '10 Websites',
      'Unlimited Pages',
      'AI Page Generator',
      'Drag-and-Drop Editor',
      'Professional Templates',
      'SEO Tools',
      'Contact Forms',
      'Free SSL',
      'Custom Domain',
      'Analytics Dashboard',
      'Custom Code Injection',
      'E-Commerce Store',
      'Priority Support',
    ],
    popular: false,
  },
  {
    name: 'Agency',
    slug: 'agency',
    monthly: 79.99,
    icon: Users,
    sites: 50,
    pages: 100,
    features: [
      '50 Websites',
      'Unlimited Pages',
      'AI Page Generator',
      'Drag-and-Drop Editor',
      'Professional Templates',
      'SEO Tools',
      'Contact Forms',
      'Free SSL',
      'Custom Domain',
      'Analytics Dashboard',
      'Custom Code Injection',
      'E-Commerce Store',
      'White-Label Branding',
      'Client Management',
      'Priority Support',
    ],
    popular: false,
    badge: 'NEW',
  },
];

const comparisonFeatures = [
  { feature: 'Websites', starter: '1', business: '3', professional: '10', agency: '50' },
  { feature: 'Pages per Site', starter: '5', business: 'Unlimited', professional: 'Unlimited', agency: 'Unlimited' },
  { feature: 'AI Page Generator', starter: true, business: true, professional: true, agency: true },
  { feature: 'Drag-and-Drop Editor', starter: true, business: true, professional: true, agency: true },
  { feature: 'Templates', starter: true, business: true, professional: true, agency: true },
  { feature: 'SEO Tools', starter: true, business: true, professional: true, agency: true },
  { feature: 'Contact Forms', starter: true, business: true, professional: true, agency: true },
  { feature: 'Custom Domain', starter: false, business: true, professional: true, agency: true },
  { feature: 'Analytics', starter: false, business: true, professional: true, agency: true },
  { feature: 'Custom Code', starter: false, business: true, professional: true, agency: true },
  { feature: 'E-Commerce', starter: false, business: true, professional: true, agency: true },
  { feature: 'White-Label', starter: false, business: false, professional: false, agency: true },
  { feature: 'Client Management', starter: false, business: false, professional: false, agency: true },
];

const faqs = [
  {
    q: 'Do I need coding experience to use the website builder?',
    a: 'Not at all. Our drag-and-drop editor and AI page generator let you build professional websites without writing a single line of code. Business plans and above also support custom code injection for developers who want more control.',
  },
  {
    q: 'How does the AI page generator work?',
    a: 'Describe the page you want in plain language and our AI builds it for you — layout, copy, images, and styling. You can then refine everything with the visual editor. It works with any template or from a blank page.',
  },
  {
    q: 'Can I connect my own domain?',
    a: 'Yes. Business, Professional, and Agency plans support custom domains. If your domain is registered with hostsblue, we configure DNS automatically. For external domains, we provide simple CNAME instructions.',
  },
  {
    q: 'Can I sell products with the website builder?',
    a: 'Yes. Business plans and above include a full e-commerce store manager with product listings, inventory tracking, and payment processing through swipesblue.',
  },
  {
    q: 'What is white-label branding?',
    a: 'Agency plans let you remove all hostsblue branding from your sites and the editor, so you can present the builder as your own product to clients. Perfect for agencies and freelancers.',
  },
  {
    q: 'Can I upgrade or downgrade later?',
    a: 'Yes. You can change your plan at any time from your dashboard. Upgrades take effect immediately. Downgrades apply at your next billing cycle, and you keep access to all features until then.',
  },
];

export function BuilderPlansPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const cart = useOutletContext<CartContext>();

  const getPrice = (monthly: number) => {
    if (billing === 'annual') {
      return (monthly * 0.8).toFixed(2);
    }
    return monthly.toFixed(2);
  };

  const getPriceInCents = (monthly: number) => {
    const price = billing === 'annual' ? monthly * 0.8 : monthly;
    return Math.round(price * 100);
  };

  const addBuilderToCart = (plan: typeof builderPlans[0]) => {
    const termMonths = billing === 'annual' ? 12 : 1;
    cart.addItem({
      type: 'website_builder',
      name: `${plan.name} Builder`,
      description: `BuilderBlue² ${plan.name} — ${plan.sites} site${plan.sites > 1 ? 's' : ''}, ${billing === 'annual' ? 'annual' : 'monthly'} billing`,
      price: getPriceInCents(plan.monthly) * (billing === 'annual' ? 12 : 1),
      termMonths,
      configuration: { planSlug: plan.slug, billing, maxSites: plan.sites },
    });
    cart.openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <MetaTags title="Website Builder Plans" description="AI-powered website builder with drag-and-drop editing, professional templates, and e-commerce. Starting at $4.99/mo." />
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-[800] text-gray-900 mb-4">
          BuilderBlue<sup className="text-xl">²</sup> Plans
        </h1>
        <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
          Build professional websites in minutes with AI-powered generation, drag-and-drop editing, and beautiful templates. No coding required.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2.5 rounded-[7px] font-medium transition-colors ${
              billing === 'monthly'
                ? 'bg-[#064A6C] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2.5 rounded-[7px] font-medium transition-colors ${
              billing === 'annual'
                ? 'bg-[#064A6C] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-[7px]">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {builderPlans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`bg-white rounded-[7px] p-6 flex flex-col relative ${
                plan.popular
                  ? 'border-2 border-[#064A6C] shadow-lg'
                  : 'border border-[#E5E7EB]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FFD700] text-[#09080E] text-xs font-[800] px-4 py-1 rounded-[7px]">
                    POPULAR
                  </span>
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FFD700] text-[#09080E] text-xs font-[800] px-4 py-1 rounded-[7px]">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <Icon className="w-8 h-8 text-[#064A6C] mx-auto mb-3" />
                <h3 className="text-xl font-[800] text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500">
                  {plan.sites} {plan.sites === 1 ? 'site' : 'sites'} &middot; {plan.pages === 5 ? `${plan.pages} pages` : 'unlimited pages'}
                </p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-[800] text-gray-900">
                    ${getPrice(plan.monthly)}
                  </span>
                  <span className="text-gray-500">/mo</span>
                </div>
                {billing === 'annual' && (
                  <p className="text-sm text-gray-400 mt-1">
                    ${(plan.monthly * 0.8 * 12).toFixed(2)} billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#4B5563]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => addBuilderToCart(plan)}
                className={`block w-full text-center font-medium px-6 py-3 rounded-[7px] transition-colors btn-arrow-hover justify-center ${
                  plan.popular
                    ? 'bg-[#064A6C] hover:bg-[#053A55] text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-[#064A6C] hover:text-[#064A6C]'
                }`}
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>

      {/* Try It Free */}
      <section className="bg-white border border-[#E5E7EB] rounded-[7px] p-8 md:p-12 text-center mb-0">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-[#064A6C]" />
          </div>
          <h2 className="text-2xl font-[800] text-gray-900 mb-4">Try It Before You Buy</h2>
          <p className="text-[#4B5563] mb-6">
            Jump into the editor and build a page right now — no account needed. When you're ready to publish, pick a plan and connect your domain.
          </p>
          <Link
            to="/try/editor"
            className="bg-[#064A6C] hover:bg-[#053A55] text-white font-medium px-8 py-3 rounded-[7px] transition-colors btn-arrow-hover inline-flex items-center"
          >
            Open the Editor
          </Link>
        </div>
      </section>

      {/* Features Comparison Table */}
      <hr className="section-divider" />

      <section>
        <h2 className="text-2xl font-[800] text-gray-900 text-center mb-8">
          Features Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-4 px-4 text-sm font-[800] text-gray-900">Feature</th>
                <th className="text-center py-4 px-4 text-sm font-[800] text-gray-900">Starter</th>
                <th className="text-center py-4 px-4 text-sm font-[800] text-[#064A6C]">Business</th>
                <th className="text-center py-4 px-4 text-sm font-[800] text-gray-900">Professional</th>
                <th className="text-center py-4 px-4 text-sm font-[800] text-gray-900">Agency</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row) => (
                <tr key={row.feature} className="border-b border-[#E5E7EB]">
                  <td className="py-3 px-4 text-sm text-[#4B5563]">{row.feature}</td>
                  {(['starter', 'business', 'professional', 'agency'] as const).map((plan) => (
                    <td key={plan} className="text-center py-3 px-4">
                      {typeof row[plan] === 'boolean' ? (
                        row[plan] ? (
                          <Check className="w-4 h-4 text-[#10B981] mx-auto" />
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )
                      ) : (
                        <span className="text-sm text-gray-900 font-medium">{row[plan]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <hr className="section-divider" />

      <section>
        <h2 className="text-2xl font-[800] text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5">
                  <p className="text-[#4B5563] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
