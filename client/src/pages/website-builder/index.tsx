import { Link } from 'react-router-dom';
import { Palette, Layers, Zap, Globe, CheckCircle, Shield, Headphones, TrendingUp } from 'lucide-react';

export function WebsiteBuilderPage() {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      popular: false,
      features: [
        '1 website',
        '5 pages',
        'Basic templates',
        'Mobile responsive',
        'Free SSL',
      ],
    },
    {
      name: 'Pro',
      price: '$19.99',
      popular: true,
      features: [
        '5 websites',
        'Unlimited pages',
        'Premium templates',
        'Mobile responsive',
        'Free SSL',
        'Custom forms',
        'SEO tools',
      ],
    },
    {
      name: 'Business',
      price: '$29.99',
      popular: false,
      features: [
        'Unlimited websites',
        'Unlimited pages',
        'All templates',
        'Mobile responsive',
        'Free SSL',
        'Custom forms',
        'SEO tools',
        'E-commerce',
        'Priority support',
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-300 mb-4">
            Coming Soon
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Builder</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Build beautiful, responsive websites without any coding. Drag-and-drop simplicity with professional results — launch your online presence in minutes.
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything You Need to Build</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Palette, title: 'Drag & Drop', desc: 'Visual builder with intuitive controls' },
            { icon: Layers, title: 'Professional Templates', desc: 'Stunning templates for every industry' },
            { icon: Zap, title: 'Fast Loading', desc: 'Optimized for speed and performance' },
            { icon: Globe, title: 'Custom Domain', desc: 'Connect your own domain name' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-[7px] p-6 text-center">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-[#064A6C]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="section-divider" />

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-[7px] p-6 flex flex-col ${
                plan.popular
                  ? 'border-2 border-[#064A6C] shadow-md relative'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#064A6C] text-white">
                  Most Popular
                </span>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#064A6C] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`block text-center font-medium px-6 py-3 rounded-[7px] transition-colors ${
                  plan.popular
                    ? 'bg-[#064A6C] hover:bg-[#053C58] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      <hr className="section-divider" />

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Choose Our Website Builder</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: Shield,
              title: 'Secure & Reliable',
              desc: 'Enterprise-grade security with free SSL certificates, daily backups, and 99.9% uptime guarantee to keep your site safe and always online.',
            },
            {
              icon: TrendingUp,
              title: 'Built for Growth',
              desc: 'SEO tools, analytics integration, and scalable infrastructure ensure your website grows alongside your business without missing a beat.',
            },
            {
              icon: Headphones,
              title: 'Expert Support',
              desc: 'Our dedicated support team is available around the clock to help you build, launch, and maintain your perfect website.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-[7px] p-6 text-center">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-[#064A6C]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Build Your Website?</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Sign up today and be the first to know when our Website Builder launches. No commitment required.
          </p>
          <Link
            to="/register"
            className="bg-[#064A6C] hover:bg-[#053C58] text-white font-medium px-8 py-3 rounded-[7px] transition-colors inline-flex items-center gap-2"
          >
            Get Notified When Available
          </Link>
        </div>
      </div>
    </div>
  );
}
