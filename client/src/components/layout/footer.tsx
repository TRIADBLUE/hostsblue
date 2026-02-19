import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#F9FAFB] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-end gap-2 mb-3">
              <img src="/HostsBlue_Logo_Image_Trans.png" alt="" className="h-6 w-auto" style={{ filter: 'drop-shadow(0.5px 0.5px 0px #09080E)' }} />
              <span className="text-[20px] leading-none">
                <span style={{ fontFamily: "'Archivo Semi Expanded', sans-serif", fontWeight: 700, color: '#008060' }}>hosts</span>
                <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blue</span>
              </span>
            </Link>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Domains, hosting, email, and security — everything your business needs online.
            </p>
          </div>

          {/* Products */}
          <div>
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
          <div>
            <h3 className="text-[#09080E] font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/support" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Help Center</Link></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">System Status</a></li>
              <li><Link to="/pricing" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[#09080E] font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">About hostsblue</Link></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Careers</a></li>
              <li><a href="#" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Press</a></li>
              <li><a href="mailto:support@hostsblue.com" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Contact</a></li>
              <li><Link to="/panel/login" className="text-[#4B5563] hover:text-[#064A6C] transition-colors">Panel Login</Link></li>
            </ul>
          </div>

          {/* TRIADBLUE Ecosystem */}
          <div>
            <h3 className="text-sm mb-4">
              <span style={{ fontWeight: 700, color: '#1844A6', letterSpacing: '0.05em' }}>TRIADBLUE</span>
              <span className="text-[#09080E] font-semibold"> Ecosystem</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://hostsblue.com" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <img src="/HostsBlue_Logo_Image_Trans.png" alt="" className="h-5 w-auto" />
                  <span>
                    <span style={{ fontFamily: "'Archivo Semi Expanded', sans-serif", fontWeight: 700, color: '#008060' }}>hosts</span>
                    <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blue</span>
                    <span style={{ fontFamily: "'Archivo Semi Expanded', sans-serif", fontWeight: 700, color: '#008060' }}>.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://swipesblue.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <img src="/swipesblue_favicon_wbg.png" alt="" className="h-5 w-auto" />
                  <span>
                    <span style={{ fontWeight: 700, color: '#374151' }}>swipes</span>
                    <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blue</span>
                    <span style={{ fontWeight: 700, color: '#374151' }}>.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://businessblueprint.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <img src="/businessblueprint_icon.png" alt="" className="h-5 w-auto" />
                  <span>
                    <span style={{ fontWeight: 700, color: '#FF6B00' }}>business</span>
                    <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blueprint</span>
                    <span style={{ fontWeight: 700, color: '#FF6B00' }}>.io</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <img src="/scansblue_favicon.png" alt="" className="h-5 w-auto" />
                  <span>
                    <span style={{ fontWeight: 700, color: '#A00028' }}>scans</span>
                    <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blue</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="my-8 border-[#E5E7EB]" style={{ opacity: 0.6 }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B5563]">
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

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-[#4B5563]">
            <p className="flex items-center gap-1 flex-wrap">
              &copy; 2026{' '}
              <span>
                <span style={{ fontFamily: "'Archivo Semi Expanded', sans-serif", fontWeight: 700, color: '#008060' }}>hosts</span>
                <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blue</span>
              </span>
              . A <span style={{ fontWeight: 700, color: '#1844A6', letterSpacing: '0.05em' }}>TRIADBLUE</span> Company.
            </p>
            <span className="hidden sm:inline text-[#E5E7EB]">|</span>
            <p>Secure payments by{' '}
              <span style={{ fontWeight: 700, color: '#374151' }}>swipes</span>
              <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, color: '#0000FF' }}>blue</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
