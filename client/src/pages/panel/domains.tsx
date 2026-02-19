import { useState } from 'react';
import { Search, Filter, MoreHorizontal, RefreshCw, Ban, Lock, Pencil } from 'lucide-react';

const statusFilters = ['All', 'Active', 'Expired', 'Pending Transfer', 'Suspended'];
const tldFilters = ['All TLDs', '.com', '.io', '.net', '.org', '.co', '.dev', '.app', '.shop'];

interface Domain {
  id: number;
  domain: string;
  customer: string;
  status: 'Active' | 'Expired' | 'Pending Transfer' | 'Suspended';
  registered: string;
  expires: string;
  autoRenew: boolean;
  tld: string;
}

const domains: Domain[] = [
  { id: 1, domain: 'mitchelldesign.com', customer: 'Sarah Mitchell', status: 'Active', registered: 'Jan 15, 2024', expires: 'Jan 15, 2027', autoRenew: true, tld: '.com' },
  { id: 2, domain: 'chentech.io', customer: 'James Chen', status: 'Active', registered: 'Mar 22, 2023', expires: 'Mar 22, 2026', autoRenew: true, tld: '.io' },
  { id: 3, domain: 'brightpixel.co', customer: 'Emily Rodriguez', status: 'Active', registered: 'Jun 8, 2024', expires: 'Jun 8, 2026', autoRenew: true, tld: '.co' },
  { id: 4, domain: 'lagosdigital.ng', customer: 'Michael Okonkwo', status: 'Active', registered: 'Sep 14, 2024', expires: 'Sep 14, 2026', autoRenew: false, tld: '.ng' },
  { id: 5, domain: 'greenleafstudio.com', customer: 'Priya Sharma', status: 'Active', registered: 'Nov 3, 2023', expires: 'Nov 3, 2026', autoRenew: true, tld: '.com' },
  { id: 6, domain: 'kimstartups.com', customer: 'David Kim', status: 'Suspended', registered: 'Apr 19, 2023', expires: 'Apr 19, 2026', autoRenew: false, tld: '.com' },
  { id: 7, domain: 'bennettlaw.com', customer: 'Laura Bennett', status: 'Active', registered: 'Jul 30, 2024', expires: 'Jul 30, 2027', autoRenew: true, tld: '.com' },
  { id: 8, domain: 'mendezgroup.mx', customer: 'Carlos Mendez', status: 'Active', registered: 'Feb 12, 2023', expires: 'Feb 12, 2027', autoRenew: true, tld: '.mx' },
  { id: 9, domain: 'creativeflow.design', customer: 'Aisha Patel', status: 'Expired', registered: 'Oct 5, 2024', expires: 'Oct 5, 2025', autoRenew: false, tld: '.design' },
  { id: 10, domain: 'wrightphoto.com', customer: 'Thomas Wright', status: 'Active', registered: 'Aug 17, 2024', expires: 'Aug 17, 2026', autoRenew: true, tld: '.com' },
  { id: 11, domain: 'cloudnative.app', customer: 'James Chen', status: 'Active', registered: 'May 1, 2024', expires: 'May 1, 2026', autoRenew: true, tld: '.app' },
  { id: 12, domain: 'ecofriendly.shop', customer: 'Priya Sharma', status: 'Active', registered: 'Dec 20, 2024', expires: 'Dec 20, 2026', autoRenew: true, tld: '.shop' },
  { id: 13, domain: 'tanakamedia.jp', customer: 'Robert Tanaka', status: 'Active', registered: 'Dec 1, 2023', expires: 'Dec 1, 2026', autoRenew: true, tld: '.jp' },
  { id: 14, domain: 'volkovdesigns.ru', customer: 'Nina Volkov', status: 'Pending Transfer', registered: 'May 20, 2024', expires: 'May 20, 2026', autoRenew: false, tld: '.ru' },
  { id: 15, domain: 'microservices.dev', customer: 'James Chen', status: 'Active', registered: 'Jan 10, 2025', expires: 'Jan 10, 2027', autoRenew: true, tld: '.dev' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-[#10B981] text-white',
  Expired: 'bg-[#DC2626] text-white',
  'Pending Transfer': 'bg-[#FFD700] text-[#09080E]',
  Suspended: 'bg-gray-200 text-[#4B5563]',
};

export function PanelDomainsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTld, setActiveTld] = useState('All TLDs');
  const [autoRenewState, setAutoRenewState] = useState<Record<number, boolean>>(
    Object.fromEntries(domains.map((d) => [d.id, d.autoRenew]))
  );
  const [openActions, setOpenActions] = useState<number | null>(null);

  const filtered = domains.filter((d) => {
    const matchesSearch = d.domain.toLowerCase().includes(searchQuery.toLowerCase()) || d.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'All' || d.status === activeFilter;
    const matchesTld = activeTld === 'All TLDs' || d.tld === activeTld;
    return matchesSearch && matchesStatus && matchesTld;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Domains</h1>
        <p className="text-[#4B5563]">Manage all customer domains</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains or customers..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-[7px] text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={activeTld}
            onChange={(e) => setActiveTld(e.target.value)}
            className="border border-[#E5E7EB] rounded-[7px] px-3 py-2.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent"
          >
            {tldFilters.map((tld) => (
              <option key={tld} value={tld}>{tld}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Registered</th>
                <th className="px-6 py-3 font-medium">Expires</th>
                <th className="px-6 py-3 font-medium">Auto-Renew</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((domain) => (
                <tr key={domain.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{domain.domain}</td>
                  <td className="px-6 py-3 text-sm text-[#09080E]">{domain.customer}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[domain.status]}`}>
                      {domain.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#4B5563]">{domain.registered}</td>
                  <td className="px-6 py-3 text-sm text-[#4B5563]">{domain.expires}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setAutoRenewState((s) => ({ ...s, [domain.id]: !s[domain.id] }))}
                      className="relative"
                    >
                      <div className={`w-10 h-5 rounded-full transition-colors ${autoRenewState[domain.id] ? 'bg-[#064A6C]' : 'bg-gray-200'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoRenewState[domain.id] ? 'translate-x-5' : ''}`} />
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-3 relative">
                    <button
                      onClick={() => setOpenActions(openActions === domain.id ? null : domain.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                    </button>
                    {openActions === domain.id && (
                      <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-44">
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" /> Renew
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <Ban className="w-4 h-4" /> Suspend
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Transfer Lock
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <Pencil className="w-4 h-4" /> Edit DNS
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
