import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Globe, Server, Mail, Shield, Palette, Cloud, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { MetaTags } from '@/components/seo/meta-tags';

type UseCase = 'blog' | 'business' | 'store' | 'app' | null;
type TrafficLevel = 'low' | 'medium' | 'high' | null;
type Budget = 'starter' | 'mid' | 'premium' | null;

interface Recommendation {
  product: string;
  plan: string;
  price: string;
  reason: string;
  link: string;
}

function getRecommendation(useCase: UseCase, traffic: TrafficLevel, budget: Budget): Recommendation | null {
  if (!useCase || !traffic || !budget) return null;

  if (useCase === 'blog' || useCase === 'business') {
    if (budget === 'starter') {
      return { product: 'BuilderBlue\u00B2', plan: 'Starter', price: '$4.99/mo', reason: 'Build a professional site with AI — no coding needed.', link: '/website-builder/plans' };
    }
    if (traffic === 'low') {
      return { product: 'BuilderBlue\u00B2', plan: 'Business', price: '$14.99/mo', reason: 'Custom domain, analytics, and unlimited pages for growing businesses.', link: '/website-builder/plans' };
    }
    return { product: 'WordPress Hosting', plan: 'Growth', price: '$24.99/mo', reason: 'Full WordPress flexibility with staging, CDN, and priority support.', link: '/hosting' };
  }

  if (useCase === 'store') {
    if (budget === 'starter') {
      return { product: 'BuilderBlue\u00B2', plan: 'Business', price: '$14.99/mo', reason: 'Built-in e-commerce store manager with payment processing.', link: '/website-builder/plans' };
    }
    return { product: 'WordPress Hosting', plan: 'Business', price: '$49.99/mo', reason: 'Full WooCommerce hosting with dedicated IP and 200 GB storage.', link: '/hosting' };
  }

  if (useCase === 'app') {
    if (budget === 'starter') {
      return { product: 'Cloud VPS', plan: 'Developer', price: '$12/mo', reason: 'Full root access with 1 vCPU and 2 GB RAM to get started.', link: '/hosting/vps' };
    }
    if (traffic === 'high') {
      return { product: 'Cloud VPS', plan: 'Scale', price: '$59/mo', reason: '4 vCPU, 8 GB RAM, and 5 TB transfer for production workloads.', link: '/hosting/vps' };
    }
    return { product: 'Cloud VPS', plan: 'Startup', price: '$29/mo', reason: '2 vCPU, 4 GB RAM with daily backups and 10 datacenter options.', link: '/hosting/vps' };
  }

  return null;
}

export function PricingPage() {
  const [useCase, setUseCase] = useState<UseCase>(null);
  const [traffic, setTraffic] = useState<TrafficLevel>(null);
  const [budget, setBudget] = useState<Budget>(null);

  const recommendation = getRecommendation(useCase, traffic, budget);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <MetaTags title="Pricing" description="Simple, transparent pricing for domains, hosting, email, SSL, and website builder. No hidden fees or surprise renewals." />
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-[800] text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
          Everything you need to build and grow your online presence. No hidden fees, no surprise renewals at inflated rates.
        </p>
      </div>

      {/* Guided Plan Selector */}
      <section className="bg-white border border-[#E5E7EB] rounded-[7px] p-8 md:p-10 mb-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#064A6C]" />
          </div>
          <div>
            <h2 className="text-xl font-[800] text-gray-900">Not sure which plan is right?</h2>
            <p className="text-sm text-[#4B5563]">Answer three quick questions and we'll recommend the best fit.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Question 1: Use case */}
          <div>
            <p className="text-sm font-[800] text-gray-900 mb-3">What are you building?</p>
            <div className="space-y-2">
              {([
                { value: 'blog' as UseCase, label: 'Blog or portfolio' },
                { value: 'business' as UseCase, label: 'Business website' },
                { value: 'store' as UseCase, label: 'Online store' },
                { value: 'app' as UseCase, label: 'Web app or API' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setUseCase(opt.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-[7px] text-sm transition-colors ${
                    useCase === opt.value
                      ? 'bg-[#064A6C] text-white font-medium'
                      : 'bg-gray-50 text-[#4B5563] hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Traffic */}
          <div>
            <p className="text-sm font-[800] text-gray-900 mb-3">Expected monthly traffic?</p>
            <div className="space-y-2">
              {([
                { value: 'low' as TrafficLevel, label: 'Under 10K visitors' },
                { value: 'medium' as TrafficLevel, label: '10K–100K visitors' },
                { value: 'high' as TrafficLevel, label: 'Over 100K visitors' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTraffic(opt.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-[7px] text-sm transition-colors ${
                    traffic === opt.value
                      ? 'bg-[#064A6C] text-white font-medium'
                      : 'bg-gray-50 text-[#4B5563] hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Budget */}
          <div>
            <p className="text-sm font-[800] text-gray-900 mb-3">Monthly budget?</p>
            <div className="space-y-2">
              {([
                { value: 'starter' as Budget, label: 'Under $15/mo' },
                { value: 'mid' as Budget, label: '$15–$50/mo' },
                { value: 'premium' as Budget, label: '$50+/mo' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-[7px] text-sm transition-colors ${
                    budget === opt.value
                      ? 'bg-[#064A6C] text-white font-medium'
                      : 'bg-gray-50 text-[#4B5563] hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        {recommendation && (
          <div className="bg-[#064A6C]/5 border border-[#064A6C]/20 rounded-[7px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-[#064A6C] font-[800] mb-1">We recommend</p>
              <p className="text-xl font-[800] text-gray-900">
                {recommendation.product} — {recommendation.plan} <span className="text-[#064A6C]">{recommendation.price}</span>
              </p>
              <p className="text-sm text-[#4B5563] mt-1">{recommendation.reason}</p>
            </div>
            <Link
              to={recommendation.link}
              className="bg-[#064A6C] hover:bg-[#053A55] text-white font-medium px-6 py-3 rounded-[7px] transition-colors btn-arrow-hover inline-flex items-center shrink-0"
            >
              View Plan
            </Link>
          </div>
        )}
      </section>

      <hr className="section-divider" />

      {/* Deployment Fork: WordPress vs BuilderBlue² */}
      <section className="mb-0">
        <h2 className="text-2xl font-[800] text-gray-900 text-center mb-3">How Will You Build?</h2>
        <p className="text-[#4B5563] text-center max-w-2xl mx-auto mb-8">
          Choose the path that fits your project. Both include free SSL, custom domains, and 24/7 support.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* WordPress Path */}
          <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-[#064A6C]" />
              </div>
              <h3 className="text-lg font-[800] text-gray-900">WordPress Hosting</h3>
            </div>
            <p className="text-sm text-[#4B5563] mb-6">
              Full WordPress with thousands of plugins, themes, and complete control. Best for complex sites, WooCommerce stores, and developers.
            </p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {['Full WordPress admin', 'WooCommerce support', 'Plugin ecosystem', 'Custom PHP/themes', 'Staging environment', 'Starting at $9.99/mo'].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#4B5563]">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/hosting"
              className="block w-full text-center border border-gray-300 text-gray-700 hover:border-[#064A6C] hover:text-[#064A6C] font-medium px-6 py-3 rounded-[7px] transition-colors btn-arrow-hover justify-center"
            >
              View WordPress Plans
            </Link>
          </div>

          {/* BuilderBlue² Path */}
          <div className="bg-white border-2 border-[#064A6C] rounded-[7px] p-8 flex flex-col relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#FFD700] text-[#09080E] text-xs font-[800] px-4 py-1 rounded-[7px]">
                RECOMMENDED
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#064A6C]" />
              </div>
              <h3 className="text-lg font-[800] text-gray-900">BuilderBlue<sup>²</sup></h3>
            </div>
            <p className="text-sm text-[#4B5563] mb-6">
              AI-powered website builder — describe what you want and watch it build. Drag-and-drop editing, templates, and built-in e-commerce. No coding required.
            </p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {['AI page generator', 'Drag-and-drop editor', 'Professional templates', 'Built-in e-commerce', 'No coding required', 'Starting at $4.99/mo'].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#4B5563]">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/website-builder/plans"
              className="block w-full text-center bg-[#064A6C] hover:bg-[#053A55] text-white font-medium px-6 py-3 rounded-[7px] transition-colors btn-arrow-hover justify-center"
            >
              View BuilderBlue² Plans
            </Link>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Domains */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-2xl font-[800] text-gray-900 mb-2">Domain Registration</h2>
            <p className="text-gray-500 mb-3">Register and manage your perfect domain name with free WHOIS privacy included.</p>
            <p className="text-sm text-[#4B5563] font-medium mb-4">Starting at <span className="text-[#064A6C]">$12.99/yr</span></p>
            <Link to="/domains/search" className="text-[#064A6C] font-medium text-sm btn-arrow-hover">
              Search Domains
            </Link>
          </div>
          <div className="md:w-2/3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: '.com', price: '$12.99/yr' },
                { name: '.net', price: '$14.99/yr' },
                { name: '.org', price: '$12.99/yr' },
                { name: '.io', price: '$39.99/yr' },
                { name: '.co', price: '$29.99/yr' },
                { name: '.dev', price: '$16.99/yr' },
                { name: '.app', price: '$16.99/yr' },
                { name: '.ai', price: '$49.99/yr' },
              ].map((tld) => (
                <div key={tld.name} className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
                  <h3 className="font-[800] text-gray-900">{tld.name}</h3>
                  <p className="text-lg font-[800] text-gray-900">{tld.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Hosting */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-2xl font-[800] text-gray-900 mb-2">WordPress Hosting</h2>
            <p className="text-gray-500 mb-3">Fast, secure WordPress hosting with automatic updates and daily backups.</p>
            <p className="text-sm text-[#4B5563] font-medium mb-4">Starting at <span className="text-[#064A6C]">$9.99/mo</span></p>
            <Link to="/hosting" className="text-[#064A6C] font-medium text-sm btn-arrow-hover">
              View Hosting Plans
            </Link>
          </div>
          <div className="md:w-2/3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Starter', price: '$9.99/mo', desc: '1 site, 10 GB storage' },
                { name: 'Growth', price: '$24.99/mo', desc: '5 sites, 50 GB storage', popular: true },
                { name: 'Business', price: '$49.99/mo', desc: '20 sites, 200 GB storage' },
                { name: 'Enterprise', price: '$99.99/mo', desc: 'Unlimited sites, 500 GB' },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white border rounded-[7px] p-4 ${plan.popular ? 'border-[#064A6C] shadow-sm' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] font-[800] bg-[#FFD700] text-[#09080E] px-2 py-0.5 rounded-[7px]">POPULAR</span>
                    )}
                  </div>
                  <p className="text-lg font-[800] text-gray-900">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Cloud VPS */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-2xl font-[800] text-gray-900 mb-2">Cloud VPS Hosting</h2>
            <p className="text-gray-500 mb-3">High-performance virtual servers with full root access, SSD storage, and 10 global datacenters.</p>
            <p className="text-sm text-[#4B5563] font-medium mb-4">Starting at <span className="text-[#064A6C]">$12/mo</span></p>
            <Link to="/hosting/vps" className="text-[#064A6C] font-medium text-sm btn-arrow-hover">
              View VPS Plans
            </Link>
          </div>
          <div className="md:w-2/3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Developer', price: '$12/mo', desc: '1 vCPU, 2GB RAM, 20GB SSD' },
                { name: 'Startup', price: '$29/mo', desc: '2 vCPU, 4GB RAM, 40GB SSD', popular: true },
                { name: 'Scale', price: '$59/mo', desc: '4 vCPU, 8GB RAM, 80GB SSD' },
                { name: 'Enterprise', price: '$119/mo', desc: '8 vCPU, 16GB RAM, 200GB SSD' },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white border rounded-[7px] p-4 ${plan.popular ? 'border-[#064A6C] shadow-sm' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] font-[800] bg-[#FFD700] text-[#09080E] px-2 py-0.5 rounded-[7px]">POPULAR</span>
                    )}
                  </div>
                  <p className="text-lg font-[800] text-gray-900">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* BuilderBlue² */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-2xl font-[800] text-gray-900 mb-2">BuilderBlue<sup>²</sup></h2>
            <p className="text-gray-500 mb-3">AI-powered website builder with drag-and-drop editing, e-commerce, and professional templates.</p>
            <p className="text-sm text-[#4B5563] font-medium mb-4">Starting at <span className="text-[#064A6C]">$4.99/mo</span></p>
            <Link to="/website-builder/plans" className="text-[#064A6C] font-medium text-sm btn-arrow-hover">
              View Builder Plans
            </Link>
          </div>
          <div className="md:w-2/3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Starter', price: '$4.99/mo', desc: '1 site, 5 pages' },
                { name: 'Business', price: '$14.99/mo', desc: '3 sites, unlimited pages', popular: true },
                { name: 'Professional', price: '$29.99/mo', desc: '10 sites, e-commerce' },
                { name: 'Agency', price: '$79.99/mo', desc: '50 sites, white-label', badge: 'NEW' },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white border rounded-[7px] p-4 ${plan.popular ? 'border-[#064A6C] shadow-sm' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] font-[800] bg-[#FFD700] text-[#09080E] px-2 py-0.5 rounded-[7px]">POPULAR</span>
                    )}
                    {plan.badge === 'NEW' && !plan.popular && (
                      <span className="text-[10px] font-[800] bg-[#FFD700] text-[#09080E] px-2 py-0.5 rounded-[7px]">NEW</span>
                    )}
                  </div>
                  <p className="text-lg font-[800] text-gray-900">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Email */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-2xl font-[800] text-gray-900 mb-2">Email Hosting</h2>
            <p className="text-gray-500 mb-3">Professional email for your domain with spam filtering and mobile sync.</p>
            <p className="text-sm text-[#4B5563] font-medium mb-4">Starting at <span className="text-[#064A6C]">$2.99/mo</span></p>
            <Link to="/email" className="text-[#064A6C] font-medium text-sm btn-arrow-hover">
              View Email Plans
            </Link>
          </div>
          <div className="md:w-2/3">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: 'Starter', price: '$2.99/mo', desc: '1 mailbox, 10 GB' },
                { name: 'Business', price: '$9.99/mo', desc: '5 mailboxes, 25 GB', popular: true },
                { name: 'Enterprise', price: '$24.99/mo', desc: '25 mailboxes, 50 GB' },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white border rounded-[7px] p-4 ${plan.popular ? 'border-[#064A6C] shadow-sm' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] font-[800] bg-[#FFD700] text-[#09080E] px-2 py-0.5 rounded-[7px]">POPULAR</span>
                    )}
                  </div>
                  <p className="text-lg font-[800] text-gray-900">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Security */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <div className="w-12 h-12 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-2xl font-[800] text-gray-900 mb-2">Security</h2>
            <p className="text-gray-500 mb-3">SSL certificates and SiteLock protection to keep your site and visitors safe.</p>
            <p className="text-sm text-[#4B5563] font-medium mb-4">SSL from <span className="text-[#10B981]">FREE</span> &middot; SiteLock from <span className="text-[#064A6C]">$139/yr</span></p>
            <Link to="/security" className="text-[#064A6C] font-medium text-sm btn-arrow-hover">
              View Security Options
            </Link>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm font-[800] text-gray-900 mb-3">SSL Certificates</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { name: 'DV SSL', price: 'Free', desc: 'With hosting' },
                { name: 'OV SSL', price: '$139/yr', desc: 'Business validation' },
                { name: 'EV SSL', price: '$229/yr', desc: 'Extended validation' },
                { name: 'Wildcard', price: '$179/yr', desc: 'All subdomains' },
              ].map((ssl) => (
                <div key={ssl.name} className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
                  <h3 className="font-medium text-gray-900">{ssl.name}</h3>
                  <p className="text-lg font-[800] text-gray-900">{ssl.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{ssl.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm font-[800] text-gray-900 mb-3">SiteLock Security</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: 'Basic', price: '$139/yr', desc: 'Daily scans, trust seal' },
                { name: 'Pro', price: '$219/yr', desc: 'Auto removal, WAF, CDN', popular: true },
                { name: 'Business', price: '$319/yr', desc: 'Full protection, PCI' },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white border rounded-[7px] p-4 ${plan.popular ? 'border-[#064A6C] shadow-sm' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] font-[800] bg-[#FFD700] text-[#09080E] px-2 py-0.5 rounded-[7px]">POPULAR</span>
                    )}
                  </div>
                  <p className="text-lg font-[800] text-gray-900">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Deals */}
      <hr className="section-divider" />

      <section className="py-4">
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-12 text-center">
          <h2 className="text-3xl font-[800] text-gray-900 mb-4">Bundle & Save</h2>
          <p className="text-[#4B5563] max-w-2xl mx-auto mb-8">
            Combine domains, hosting, email, and security for a complete web presence. Create an account to build your custom bundle and save.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            {[
              { name: 'Starter Bundle', includes: 'Domain + Hosting + Email', save: 'Save 10%' },
              { name: 'Business Bundle', includes: 'Domain + Hosting + Email + SSL', save: 'Save 15%' },
              { name: 'Full Stack Bundle', includes: 'Domain + Hosting + Email + Security + Builder', save: 'Save 20%' },
            ].map((bundle) => (
              <div key={bundle.name} className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
                <h3 className="font-[800] text-gray-900 mb-1">{bundle.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{bundle.includes}</p>
                <span className="text-sm font-[800] text-[#10B981]">{bundle.save}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-[#064A6C] hover:bg-[#053A55] text-white font-semibold px-8 py-3 rounded-[7px] transition-all btn-arrow-hover justify-center">
              Create Free Account
            </Link>
            <Link to="/domains/search" className="border border-gray-300 text-gray-700 hover:border-[#064A6C] hover:text-[#064A6C] font-semibold px-8 py-3 rounded-[7px] transition-colors btn-arrow-hover justify-center">
              Start with a Domain
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
