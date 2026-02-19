import { useState } from 'react';
import { Search, MoreHorizontal, KeyRound, Ban, Trash2, ArrowUpCircle } from 'lucide-react';

interface EmailAccount {
  id: number;
  address: string;
  domain: string;
  customer: string;
  plan: string;
  storageUsed: number;
  storageTotal: number;
  status: 'Active' | 'Suspended' | 'Inactive';
}

const emailAccounts: EmailAccount[] = [
  { id: 1, address: 'sarah@mitchelldesign.com', domain: 'mitchelldesign.com', customer: 'Sarah Mitchell', plan: 'Pro', storageUsed: 4.2, storageTotal: 15, status: 'Active' },
  { id: 2, address: 'james@chentech.io', domain: 'chentech.io', customer: 'James Chen', plan: 'Business', storageUsed: 12.8, storageTotal: 50, status: 'Active' },
  { id: 3, address: 'dev@chentech.io', domain: 'chentech.io', customer: 'James Chen', plan: 'Business', storageUsed: 8.1, storageTotal: 50, status: 'Active' },
  { id: 4, address: 'emily@brightpixel.co', domain: 'brightpixel.co', customer: 'Emily Rodriguez', plan: 'Pro', storageUsed: 6.5, storageTotal: 15, status: 'Active' },
  { id: 5, address: 'info@lagosdigital.ng', domain: 'lagosdigital.ng', customer: 'Michael Okonkwo', plan: 'Starter', storageUsed: 1.3, storageTotal: 5, status: 'Active' },
  { id: 6, address: 'priya@greenleafstudio.com', domain: 'greenleafstudio.com', customer: 'Priya Sharma', plan: 'Pro', storageUsed: 9.7, storageTotal: 15, status: 'Active' },
  { id: 7, address: 'admin@kimstartups.com', domain: 'kimstartups.com', customer: 'David Kim', plan: 'Business', storageUsed: 22.4, storageTotal: 50, status: 'Suspended' },
  { id: 8, address: 'laura@bennettlaw.com', domain: 'bennettlaw.com', customer: 'Laura Bennett', plan: 'Pro', storageUsed: 7.8, storageTotal: 15, status: 'Active' },
  { id: 9, address: 'carlos@mendezgroup.mx', domain: 'mendezgroup.mx', customer: 'Carlos Mendez', plan: 'Business', storageUsed: 31.2, storageTotal: 50, status: 'Active' },
  { id: 10, address: 'tom@wrightphoto.com', domain: 'wrightphoto.com', customer: 'Thomas Wright', plan: 'Pro', storageUsed: 11.6, storageTotal: 15, status: 'Active' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-[#10B981] text-white',
  Suspended: 'bg-[#FFD700] text-[#09080E]',
  Inactive: 'bg-gray-200 text-[#4B5563]',
};

export function PanelEmailPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openActions, setOpenActions] = useState<number | null>(null);

  const filtered = emailAccounts.filter((e) =>
    e.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Email Accounts</h1>
        <p className="text-[#4B5563]">Manage all customer email accounts</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email addresses, domains, or customers..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-[7px] text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Email Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium">Email Address</th>
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium min-w-[180px]">Storage</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((email) => {
                const pct = Math.round((email.storageUsed / email.storageTotal) * 100);
                const barColor = pct > 80 ? 'bg-[#DC2626]' : pct > 60 ? 'bg-[#FFD700]' : 'bg-[#10B981]';
                return (
                  <tr key={email.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{email.address}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{email.domain}</td>
                    <td className="px-6 py-3 text-sm text-[#09080E]">{email.customer}</td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1844A6]">
                        {email.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#4B5563] whitespace-nowrap">
                          {email.storageUsed} / {email.storageTotal} GB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[email.status]}`}>
                        {email.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 relative">
                      <button
                        onClick={() => setOpenActions(openActions === email.id ? null : email.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                      </button>
                      {openActions === email.id && (
                        <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-44">
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <KeyRound className="w-4 h-4" /> Reset Password
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <Ban className="w-4 h-4" /> Suspend
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4" /> Change Plan
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
