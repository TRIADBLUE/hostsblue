import { Link } from 'react-router-dom';
import { Brandsignature } from '@/components/ui/brandsignature';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Products */}
          <div className="lg:border-r lg:border-[#E5E7EB]/60 lg:pr-8">
            <h3 className="text-[#09080E] font-semibold text-sm mb-4">Products</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/domains/search" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Domain Registration</Link></li>
              <li><Link to="/hosting" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">WordPress Hosting</Link></li>
              <li><Link to="/email" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Professional Email</Link></li>
              <li><Link to="/security" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">SSL Certificates</Link></li>
              <li><Link to="/security" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">SiteLock Security</Link></li>
              <li><Link to="/website-builder" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Website Builder</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:border-r lg:border-[#E5E7EB]/60 lg:pr-8">
            <h3 className="text-[#09080E] font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/support" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Help Center</Link></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">System Status</a></li>
              <li><Link to="/pricing" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:border-r lg:border-[#E5E7EB]/60 lg:pr-8">
            <h3 className="text-[#09080E] font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">About</Link></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Careers</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Press</a></li>
              <li><a href="mailto:support@hostsblue.com" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Contact</a></li>
              <li><Link to="/panel/login" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Panel Login</Link></li>
            </ul>
          </div>

          {/* TRIADBLUE.COM Ecosystem */}
          <div>
            {/* TRIADBLUE.COM ECOSYSTEM — always first, always very large */}
            <div className="mb-6">
              <img
                src="/triadblue-ecosystem-logo.png"
                alt="TRIADBLUE.COM ECOSYSTEM"
                style={{ height: 40, objectFit: 'contain' }}
              />
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                Six Platforms. One Ecosystem. Go Blue.
              </p>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '0.5px solid #09080E', marginBottom: '20px' }} />

            {/* All platforms in fixed order — hostsblue is featured (larger) */}
            <div className="space-y-4">

              {/* businessblueprint.io */}
              <div>
                <a href="https://businessblueprint.io" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/bb-header-logo.png"
                    alt="businessblueprint.io"
                    style={{ height: 22, objectFit: 'contain' }}
                  />
                </a>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Get Assessed. Get Prescribed. Get Business.
                </p>
              </div>

              {/* swipesblue.com */}
              <div>
                <a href="https://swipesblue.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/swipesblue_logo_image_and_text_as_url.png"
                    alt="swipesblue.com"
                    style={{ height: 22, objectFit: 'contain' }}
                  />
                </a>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Go Blue. Get Swiped. Get Paid.
                </p>
              </div>

              {/* hostsblue.com — featured (this site) */}
              <div>
                <img
                  src="/hostsblue_logo_image_and_text_as_url.png"
                  alt="hostsblue.com"
                  style={{ height: 32, objectFit: 'contain' }}
                />
                <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                  Go Blue. Get Site. Go Live.
                </p>
              </div>

              {/* scansblue.com */}
              <div>
                <a href="https://scansblue.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/scansblue_logo_image_and_text_as_url.png"
                    alt="scansblue.com"
                    style={{ height: 22, objectFit: 'contain' }}
                  />
                </a>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Go Blue. Get Scanned. Get Scored.
                </p>
              </div>

              {/* BUILDERBLUE².COM */}
              <div>
                <a href="https://builderblue2.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/builderblue2-logo-url.png"
                    alt="BUILDERBLUE².COM"
                    style={{ height: 22, objectFit: 'contain' }}
                  />
                </a>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Go Blue. Get Vibed. Get Ahead.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="my-8 border-[#E5E7EB]" style={{ opacity: 0.6 }} />

        {/* Legal Links — full row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#4B5563] mb-4">
          <a href="#" className="hover:text-[#09080E] transition-colors">Terms of Service</a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="#" className="hover:text-[#09080E] transition-colors">Privacy Policy</a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="#" className="hover:text-[#09080E] transition-colors">Acceptable Use</a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="#" className="hover:text-[#09080E] transition-colors">SLA</a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="#" className="hover:text-[#09080E] transition-colors">Domain Registration Agreement</a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="https://www.icann.org/resources/pages/benefits-2013-09-16-en" target="_blank" rel="noopener noreferrer" className="hover:text-[#09080E] transition-colors">ICANN Registrant Rights</a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="https://www.icann.org/resources/pages/help/dndr/udrp-en" target="_blank" rel="noopener noreferrer" className="hover:text-[#09080E] transition-colors">UDRP Policy</a>
        </div>

        {/* Copyright — full row */}
        <div className="flex flex-wrap items-baseline justify-center gap-2 text-xs text-[#4B5563]">
          <p className="flex items-baseline gap-1 flex-wrap">
            &copy; 2026 <Brandsignature brand="hostsblue" size={12} />
            . A <Brandsignature brand="triadblue" size={12} /> Company.
          </p>
          <span className="text-[#E5E7EB]">|</span>
          <p>Secure payments by <a href="https://swipesblue.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#09080E] transition-colors">swipesblue.com</a></p>
        </div>
      </div>
    </footer>
  );
}
