import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, ChevronDown, Shield, Zap, Server, Globe, HardDrive, Terminal, Clock, Lock } from 'lucide-react';
import { MetaTags } from '@/components/seo/meta-tags';
import { CLOUD_HOSTING_PLANS, DATACENTERS, OS_IMAGES } from '../../../../shared/hosting-plans';
import type { CartItem } from '@/hooks/use-cart';

interface CartContext {
  addItem: (item: Omit<CartItem, 'id'>) => void;
  openCart: () => void;
}

const plans = Object.entries(CLOUD_HOSTING_PLANS).map(([slug, plan]) => ({
  slug,
  ...plan,
  popular: slug === 'cloud-startup',
}));

const faqs = [
  {
    q: 'What is Cloud VPS hosting?',
    a: 'Cloud VPS (Virtual Private Server) gives you dedicated resources on a virtual machine with full root access. Unlike shared hosting, your server is isolated with guaranteed CPU, RAM, and storage — giving you the performance and control of a dedicated server at a fraction of the cost.',
  },
  {
    q: 'Do I get root access?',
    a: 'Yes. All VPS plans include full root/SSH access. You have complete control over your server, including the ability to install any software, configure services, and manage security settings.',
  },
  {
    q: 'Can I upgrade my VPS later?',
    a: 'Absolutely. You can upgrade your plan at any time from your dashboard. Upgrades take effect within minutes with minimal downtime. You can also add extra storage or bandwidth as needed.',
  },
  {
    q: 'What operating systems are available?',
    a: 'We offer Ubuntu 22.04 LTS, Ubuntu 24.04 LTS, Debian 12, CentOS Stream 9, Rocky Linux 9, and AlmaLinux 9. All images are pre-configured with security updates and SSH access.',
  },
  {
    q: 'How fast is deployment?',
    a: 'Your VPS is provisioned instantly. Most servers are fully online and accessible via SSH within 60 seconds of placing your order. No waiting for manual setup.',
  },
  {
    q: 'What is the uptime guarantee?',
    a: 'All VPS plans include a 99.95% uptime SLA backed by enterprise-grade infrastructure across 10 global datacenters. If we fail to meet this guarantee, you receive service credits.',
  },
];

// Group datacenters by region
const regions = DATACENTERS.reduce((acc, dc) => {
  if (!acc[dc.region]) acc[dc.region] = [];
  acc[dc.region].push(dc);
  return acc;
}, {} as Record<string, typeof DATACENTERS[number][]>);

export function VpsHostingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const cart = useOutletContext<CartContext>();

  const getPrice = (monthlyPriceCents: number) => {
    const monthly = monthlyPriceCents / 100;
    if (billing === 'annual') {
      return (monthly * 0.8).toFixed(2);
    }
    return monthly.toFixed(2);
  };

  const addVpsToCart = (plan: typeof plans[0]) => {
    const pricePerMonth = billing === 'annual' ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;
    const termMonths = billing === 'annual' ? 12 : 1;
    cart.addItem({
      type: 'hosting_plan',
      name: `${plan.name} Cloud VPS`,
      description: `${plan.name} Cloud VPS — ${plan.features.slice(0, 3).join(', ')} — ${billing === 'annual' ? 'annual' : 'monthly'} billing`,
      price: pricePerMonth * (billing === 'annual' ? 12 : 1),
      termMonths,
      configuration: { planSlug: plan.slug, billing },
    });
    cart.openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <MetaTags
        title="Cloud VPS Hosting"
        description="High-performance Cloud VPS with full root access, SSD storage, and 10 global datacenters. Deploy instantly with Ubuntu, Debian, CentOS, and more. Starting at $12/mo."
      />

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-[800] text-gray-900 mb-4">
          Cloud VPS Hosting
        </h1>
        <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
          Full root access, SSD-powered virtual servers deployed in seconds across 10 global datacenters. Scale your infrastructure with guaranteed resources and 99.95% uptime.
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
        {plans.map((plan) => (
          <div
            key={plan.slug}
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

            <div className="text-center mb-6">
              <h3 className="text-xl font-[800] text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-[800] text-gray-900">
                  ${getPrice(plan.monthlyPrice)}
                </span>
                <span className="text-gray-500">/mo</span>
              </div>
              {billing === 'annual' && (
                <p className="text-sm text-gray-400 mt-1">
                  ${((plan.monthlyPrice / 100) * 0.8 * 12).toFixed(2)} billed annually
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
              onClick={() => addVpsToCart(plan)}
              className={`block w-full text-center font-medium px-6 py-3 rounded-[7px] transition-colors btn-arrow-hover justify-center ${
                plan.popular
                  ? 'bg-[#064A6C] hover:bg-[#053A55] text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-[#064A6C] hover:text-[#064A6C]'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* Datacenters */}
      <hr className="section-divider" />

      <section>
        <h2 className="text-2xl font-[800] text-gray-900 text-center mb-2">
          10 Global Datacenters
        </h2>
        <p className="text-[#4B5563] text-center mb-8 max-w-xl mx-auto">
          Deploy your server close to your users for the lowest latency. All locations feature enterprise-grade networking and redundant power.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {Object.entries(regions).map(([region, dcs]) => (
            <div key={region} className="bg-white border border-[#E5E7EB] rounded-[7px] p-5">
              <p className="text-xs font-[800] text-[#064A6C] uppercase tracking-wider mb-3">{region}</p>
              <ul className="space-y-2">
                {dcs.map((dc) => (
                  <li key={dc.id} className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-700">{dc.name}</span>
                    <span className="text-[10px] text-gray-400 ml-auto font-mono">{dc.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* OS Selection */}
      <hr className="section-divider" />

      <section>
        <h2 className="text-2xl font-[800] text-gray-900 text-center mb-2">
          Choose Your Operating System
        </h2>
        <p className="text-[#4B5563] text-center mb-8 max-w-xl mx-auto">
          All images are pre-configured with security updates and ready for immediate SSH access.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {OS_IMAGES.map((os) => (
            <div key={os.id} className="bg-white border border-[#E5E7EB] rounded-[7px] p-4 text-center hover:border-[#064A6C] hover:shadow-sm transition-all">
              <Terminal className="w-6 h-6 text-[#064A6C] mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">{os.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Plans Include */}
      <hr className="section-divider" />

      <section>
        <h2 className="text-2xl font-[800] text-gray-900 text-center mb-8">
          All Plans Include
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Terminal, title: 'Root / SSH Access', desc: 'Full administrator control over your server.' },
            { icon: Lock, title: 'Free SSL', desc: 'Free SSL certificates for all your domains.' },
            { icon: Server, title: 'KVM Virtualization', desc: 'True hardware virtualization for guaranteed resources.' },
            { icon: HardDrive, title: 'SSD Storage', desc: 'NVMe SSD drives for blazing-fast disk I/O.' },
            { icon: Shield, title: '99.95% SLA', desc: 'Enterprise uptime guarantee with service credits.' },
            { icon: Zap, title: 'Instant Deploy', desc: 'Your server is online within 60 seconds.' },
            { icon: Clock, title: 'Daily Backups', desc: 'Automatic daily snapshots with easy restore.' },
            { icon: Globe, title: '10 Datacenters', desc: 'Deploy close to your users worldwide.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-[#E5E7EB] rounded-[7px] p-5">
              <div className="w-10 h-10 rounded-[7px] bg-[#064A6C]/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#064A6C]" />
              </div>
              <h3 className="font-[800] text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
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
