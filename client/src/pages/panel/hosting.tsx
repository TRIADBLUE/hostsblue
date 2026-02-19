import { useState } from 'react';
import { Filter, MoreHorizontal, ArrowUpCircle, Ban, RotateCcw, FileText } from 'lucide-react';

const planFilters = ['All Plans', 'Starter', 'Business', 'Enterprise'];
const statusFilters = ['All', 'Active', 'Suspended', 'Cancelled'];

interface HostingAccount {
  id: number;
  domain: string;
  customer: string;
  plan: string;
  storageUsed: number;
  storageTotal: number;
  status: 'Active' | 'Suspended' | 'Cancelled';
}

const accounts: HostingAccount[] = [
  { id: 1, domain: 'mitchelldesign.com', customer: 'Sarah Mitchell', plan: 'Business', storageUsed: 12.4, storageTotal: 50, status: 'Active' },
  { id: 2, domain: 'chentech.io', customer: 'James Chen', plan: 'Enterprise', storageUsed: 68.2, storageTotal: 200, status: 'Active' },
  { id: 3, domain: 'brightpixel.co', customer: 'Emily Rodriguez', plan: 'Business', storageUsed: 23.7, storageTotal: 50, status: 'Active' },
  { id: 4, domain: 'lagosdigital.ng', customer: 'Michael Okonkwo', plan: 'Starter', storageUsed: 3.2, storageTotal: 10, status: 'Active' },
  { id: 5, domain: 'greenleafstudio.com', customer: 'Priya Sharma', plan: 'Business', storageUsed: 41.8, storageTotal: 50, status: 'Active' },
  { id: 6, domain: 'kimstartups.com', customer: 'David Kim', plan: 'Enterprise', storageUsed: 95.1, storageTotal: 200, status: 'Suspended' },
  { id: 7, domain: 'bennettlaw.com', customer: 'Laura Bennett', plan: 'Business', storageUsed: 8.9, storageTotal: 50, status: 'Active' },
  { id: 8, domain: 'mendezgroup.mx', customer: 'Carlos Mendez', plan: 'Enterprise', storageUsed: 142.5, storageTotal: 200, status: 'Active' },
  { id: 9, domain: 'wrightphoto.com', customer: 'Thomas Wright', plan: 'Business', storageUsed: 38.6, storageTotal: 50, status: 'Active' },
  { id: 10, domain: 'tanakamedia.jp', customer: 'Robert Tanaka', plan: 'Business', storageUsed: 27.3, storageTotal: 50, status: 'Active' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-[#10B981] text-white',
  Suspended: 'bg-[#FFD700] text-[#09080E]',
  Cancelled: 'bg-[#DC2626] text-white',
};

export function PanelHostingPage() {
  const [activePlan, setActivePlan] = useState('All Plans');
  const [activeStatus, setActiveStatus] = useState('All');
  const [openActions, setOpenActions] = useState<number | null>(null);

  const filtered = accounts.filter((a) => {
    const matchesPlan = activePlan === 'All Plans' || a.plan === activePlan;
    const matchesStatus = activeStatus === 'All' || a.status === activeStatus;
    return matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Hosting</h1>
        <p className="text-[#4B5563]">Manage all customer hosting accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          <span className="text-sm text-[#4B5563] mr-1">Plan:</span>
          {planFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActivePlan(filter)}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                activePlan === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          <span className="text-sm text-[#4B5563] mr-1">Status:</span>
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveStatus(filter)}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                activeStatus === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Hosting Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium min-w-[200px]">Storage</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((account) => {
                const pct = Math.round((account.storageUsed / account.storageTotal) * 100);
                const barColor = pct > 80 ? 'bg-[#DC2626]' : pct > 60 ? 'bg-[#FFD700]' : 'bg-[#10B981]';
                return (
                  <tr key={account.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{account.domain}</td>
                    <td className="px-6 py-3 text-sm text-[#09080E]">{account.customer}</td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1844A6]">
                        {account.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#4B5563] whitespace-nowrap">
                          {account.storageUsed} / {account.storageTotal} GB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[account.status]}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 relative">
                      <button
                        onClick={() => setOpenActions(openActions === account.id ? null : account.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                      </button>
                      {openActions === account.id && (
                        <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-44">
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4" /> Upgrade
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <Ban className="w-4 h-4" /> Suspend
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" /> Restart
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> View Logs
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
