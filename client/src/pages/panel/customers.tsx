import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  UserX,
  UserCheck,
  KeyRound,
  Mail,
} from 'lucide-react';

const statusFilters = ['All', 'Active', 'Suspended', 'Cancelled'];

interface Customer {
  id: number;
  name: string;
  email: string;
  plan: string;
  domains: number;
  status: 'Active' | 'Suspended' | 'Cancelled';
  joined: string;
  phone: string;
  domainsList: string[];
  hostingAccounts: { domain: string; plan: string; status: string }[];
  billingHistory: { date: string; description: string; amount: string; status: string }[];
}

const customers: Customer[] = [
  {
    id: 1, name: 'Sarah Mitchell', email: 'sarah@mitchelldesign.com', plan: 'Business Hosting', domains: 4, status: 'Active', joined: 'Jan 15, 2024',
    phone: '+1 (555) 234-5678',
    domainsList: ['mitchelldesign.com', 'sarahm.io', 'designstudio.net', 'mitchellphoto.com'],
    hostingAccounts: [{ domain: 'mitchelldesign.com', plan: 'Business', status: 'Active' }, { domain: 'sarahm.io', plan: 'Starter', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }, { date: 'Jan 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }, { date: 'Dec 15, 2025', description: 'Domain Renewal - mitchelldesign.com', amount: '$14.99', status: 'Paid' }],
  },
  {
    id: 2, name: 'James Chen', email: 'james@chentech.io', plan: 'Enterprise Hosting', domains: 7, status: 'Active', joined: 'Mar 22, 2023',
    phone: '+1 (555) 345-6789',
    domainsList: ['chentech.io', 'jameschen.dev', 'cloudnative.app', 'devportfolio.io', 'apistudio.com', 'microservices.dev', 'containerlab.io'],
    hostingAccounts: [{ domain: 'chentech.io', plan: 'Enterprise', status: 'Active' }, { domain: 'cloudnative.app', plan: 'Business', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Enterprise Hosting - Monthly', amount: '$79.99', status: 'Paid' }, { date: 'Jan 15, 2026', description: 'SSL Wildcard Certificate', amount: '$199.99', status: 'Paid' }],
  },
  {
    id: 3, name: 'Emily Rodriguez', email: 'emily@brightpixel.co', plan: 'Business Hosting', domains: 3, status: 'Active', joined: 'Jun 8, 2024',
    phone: '+1 (555) 456-7890',
    domainsList: ['brightpixel.co', 'emilyrod.com', 'techvault.com'],
    hostingAccounts: [{ domain: 'brightpixel.co', plan: 'Business', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }],
  },
  {
    id: 4, name: 'Michael Okonkwo', email: 'michael@lagosdigital.ng', plan: 'Starter Hosting', domains: 2, status: 'Active', joined: 'Sep 14, 2024',
    phone: '+234 812 345 6789',
    domainsList: ['lagosdigital.ng', 'okonkwoconsulting.com'],
    hostingAccounts: [{ domain: 'lagosdigital.ng', plan: 'Starter', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Starter Hosting - Monthly', amount: '$7.99', status: 'Paid' }],
  },
  {
    id: 5, name: 'Priya Sharma', email: 'priya@greenleafstudio.com', plan: 'Business Hosting', domains: 5, status: 'Active', joined: 'Nov 3, 2023',
    phone: '+91 98765 43210',
    domainsList: ['greenleafstudio.com', 'priyasharma.in', 'ecofriendly.shop', 'sustainableliving.org', 'greenstyle.co'],
    hostingAccounts: [{ domain: 'greenleafstudio.com', plan: 'Business', status: 'Active' }, { domain: 'ecofriendly.shop', plan: 'Starter', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }, { date: 'Jan 20, 2026', description: 'Domain Registration - greenstyle.co', amount: '$12.99', status: 'Paid' }],
  },
  {
    id: 6, name: 'David Kim', email: 'david@kimstartups.com', plan: 'Enterprise Hosting', domains: 6, status: 'Suspended', joined: 'Apr 19, 2023',
    phone: '+1 (555) 567-8901',
    domainsList: ['kimstartups.com', 'launchpad.io', 'mvpfactory.dev', 'startupmetrics.co', 'fundingtracker.app', 'pitchdeck.io'],
    hostingAccounts: [{ domain: 'kimstartups.com', plan: 'Enterprise', status: 'Suspended' }],
    billingHistory: [{ date: 'Jan 1, 2026', description: 'Enterprise Hosting - Monthly', amount: '$79.99', status: 'Overdue' }, { date: 'Dec 1, 2025', description: 'Enterprise Hosting - Monthly', amount: '$79.99', status: 'Overdue' }],
  },
  {
    id: 7, name: 'Laura Bennett', email: 'laura@bennettlaw.com', plan: 'Business Hosting', domains: 2, status: 'Active', joined: 'Jul 30, 2024',
    phone: '+1 (555) 678-9012',
    domainsList: ['bennettlaw.com', 'laurabennettesq.com'],
    hostingAccounts: [{ domain: 'bennettlaw.com', plan: 'Business', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }],
  },
  {
    id: 8, name: 'Carlos Mendez', email: 'carlos@mendezgroup.mx', plan: 'Enterprise Hosting', domains: 8, status: 'Active', joined: 'Feb 12, 2023',
    phone: '+52 55 1234 5678',
    domainsList: ['mendezgroup.mx', 'carlosmendez.com', 'exportahub.mx', 'latamtrade.com', 'mendezlogistics.com', 'freightmaster.mx', 'supplychainpro.com', 'mendezfinance.mx'],
    hostingAccounts: [{ domain: 'mendezgroup.mx', plan: 'Enterprise', status: 'Active' }, { domain: 'exportahub.mx', plan: 'Business', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Enterprise Hosting - Monthly', amount: '$79.99', status: 'Paid' }, { date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }],
  },
  {
    id: 9, name: 'Aisha Patel', email: 'aisha@creativeflow.design', plan: 'Starter Hosting', domains: 1, status: 'Cancelled', joined: 'Oct 5, 2024',
    phone: '+44 7700 900123',
    domainsList: ['creativeflow.design'],
    hostingAccounts: [{ domain: 'creativeflow.design', plan: 'Starter', status: 'Cancelled' }],
    billingHistory: [{ date: 'Nov 1, 2025', description: 'Starter Hosting - Monthly', amount: '$7.99', status: 'Refunded' }],
  },
  {
    id: 10, name: 'Thomas Wright', email: 'tom@wrightphoto.com', plan: 'Business Hosting', domains: 3, status: 'Active', joined: 'Aug 17, 2024',
    phone: '+1 (555) 789-0123',
    domainsList: ['wrightphoto.com', 'tomwright.gallery', 'weddingshots.co'],
    hostingAccounts: [{ domain: 'wrightphoto.com', plan: 'Business', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }],
  },
  {
    id: 11, name: 'Nina Volkov', email: 'nina@volkovdesigns.ru', plan: 'Starter Hosting', domains: 2, status: 'Suspended', joined: 'May 20, 2024',
    phone: '+7 495 123 4567',
    domainsList: ['volkovdesigns.ru', 'ninavolkov.com'],
    hostingAccounts: [{ domain: 'volkovdesigns.ru', plan: 'Starter', status: 'Suspended' }],
    billingHistory: [{ date: 'Jan 1, 2026', description: 'Starter Hosting - Monthly', amount: '$7.99', status: 'Overdue' }],
  },
  {
    id: 12, name: 'Robert Tanaka', email: 'robert@tanakamedia.jp', plan: 'Business Hosting', domains: 4, status: 'Active', joined: 'Dec 1, 2023',
    phone: '+81 3 1234 5678',
    domainsList: ['tanakamedia.jp', 'robbtanaka.com', 'tokyocreative.co', 'japanvisuals.com'],
    hostingAccounts: [{ domain: 'tanakamedia.jp', plan: 'Business', status: 'Active' }, { domain: 'tokyocreative.co', plan: 'Starter', status: 'Active' }],
    billingHistory: [{ date: 'Feb 1, 2026', description: 'Business Hosting - Monthly', amount: '$24.99', status: 'Paid' }, { date: 'Feb 1, 2026', description: 'Starter Hosting - Monthly', amount: '$7.99', status: 'Paid' }],
  },
];

const statusColors: Record<string, string> = {
  Active: 'bg-[#10B981] text-white',
  Suspended: 'bg-[#FFD700] text-[#09080E]',
  Cancelled: 'bg-[#DC2626] text-white',
};

const billingStatusColors: Record<string, string> = {
  Paid: 'text-[#10B981]',
  Overdue: 'text-[#DC2626]',
  Refunded: 'text-[#4B5563]',
};

export function PanelCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [openActions, setOpenActions] = useState<number | null>(null);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'All' || c.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#09080E]">Customers</h1>
          <p className="text-[#4B5563]">Manage customer accounts</p>
        </div>
        <button className="bg-[#064A6C] hover:bg-[#053A55] text-white font-medium px-4 py-2.5 rounded-[7px] transition-colors flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-[7px] text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
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
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium w-8"></th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Domains</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <>
                  <tr
                    key={customer.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === customer.id ? null : customer.id)}
                  >
                    <td className="px-6 py-3">
                      {expandedRow === customer.id ? (
                        <ChevronUp className="w-4 h-4 text-[#4B5563]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#4B5563]" />
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-[#09080E]">{customer.name}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{customer.email}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{customer.plan}</td>
                    <td className="px-6 py-3 text-sm text-[#09080E]">{customer.domains}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{customer.joined}</td>
                    <td className="px-6 py-3 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActions(openActions === customer.id ? null : customer.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                      </button>
                      {openActions === customer.id && (
                        <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-48">
                          {customer.status === 'Active' ? (
                            <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                              <UserX className="w-4 h-4" /> Suspend
                            </button>
                          ) : (
                            <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                              <UserCheck className="w-4 h-4" /> Activate
                            </button>
                          )}
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <KeyRound className="w-4 h-4" /> Reset Password
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Send Email
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedRow === customer.id && (
                    <tr key={`${customer.id}-detail`} className="bg-[#F9FAFB]">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Customer Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#09080E] mb-2">Customer Info</h4>
                            <div className="space-y-1 text-sm text-[#4B5563]">
                              <p>Phone: {customer.phone}</p>
                              <p>Email: {customer.email}</p>
                              <p>Joined: {customer.joined}</p>
                              <p>Plan: {customer.plan}</p>
                            </div>
                          </div>
                          {/* Domains */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#09080E] mb-2">Domains ({customer.domainsList.length})</h4>
                            <ul className="space-y-1 text-sm text-[#4B5563]">
                              {customer.domainsList.map((d) => (
                                <li key={d} className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></span>
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Billing History */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#09080E] mb-2">Recent Billing</h4>
                            <div className="space-y-2">
                              {customer.billingHistory.map((b, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <div>
                                    <p className="text-[#09080E]">{b.description}</p>
                                    <p className="text-xs text-[#4B5563]">{b.date}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-[#09080E]">{b.amount}</p>
                                    <p className={`text-xs font-medium ${billingStatusColors[b.status]}`}>{b.status}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
