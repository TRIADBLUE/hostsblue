import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Mar', year: '2025', value: 32400 },
  { month: 'Apr', year: '2025', value: 35100 },
  { month: 'May', year: '2025', value: 33800 },
  { month: 'Jun', year: '2025', value: 37200 },
  { month: 'Jul', year: '2025', value: 39500 },
  { month: 'Aug', year: '2025', value: 38100 },
  { month: 'Sep', year: '2025', value: 40800 },
  { month: 'Oct', year: '2025', value: 42300 },
  { month: 'Nov', year: '2025', value: 41600 },
  { month: 'Dec', year: '2025', value: 44900 },
  { month: 'Jan', year: '2026', value: 45800 },
  { month: 'Feb', year: '2026', value: 47250 },
];

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

const serviceBreakdown = [
  { service: 'Hosting', amount: 21800, pct: 46.1, color: 'bg-[#064A6C]' },
  { service: 'Domains', amount: 11300, pct: 23.9, color: 'bg-[#1844A6]' },
  { service: 'Email', amount: 6700, pct: 14.2, color: 'bg-[#10B981]' },
  { service: 'SSL', amount: 4950, pct: 10.5, color: 'bg-[#FFD700]' },
  { service: 'Builder', amount: 2500, pct: 5.3, color: 'bg-purple-500' },
];

const recentTransactions = [
  { id: 'TXN-9847', customer: 'Sarah Mitchell', description: 'Starter Hosting + Domain', amount: '$142.88', date: 'Feb 19, 2026', type: 'Payment' },
  { id: 'TXN-9846', customer: 'James Chen', description: 'SSL Wildcard Certificate', amount: '$199.99', date: 'Feb 19, 2026', type: 'Payment' },
  { id: 'TXN-9845', customer: 'Emily Rodriguez', description: 'Business Hosting + Domain', amount: '$287.40', date: 'Feb 18, 2026', type: 'Payment' },
  { id: 'TXN-9844', customer: 'Michael Okonkwo', description: 'Email Pro Plan x5', amount: '$59.95', date: 'Feb 18, 2026', type: 'Payment' },
  { id: 'TXN-9843', customer: 'Aisha Patel', description: 'Starter Hosting Refund', amount: '-$7.99', date: 'Feb 15, 2026', type: 'Refund' },
  { id: 'TXN-9842', customer: 'Laura Bennett', description: 'Domain Transfer + SSL DV', amount: '$84.98', date: 'Feb 16, 2026', type: 'Payment' },
  { id: 'TXN-9841', customer: 'Thomas Wright', description: 'Business Hosting Monthly', amount: '$24.99', date: 'Feb 14, 2026', type: 'Payment' },
  { id: 'TXN-9840', customer: 'Priya Sharma', description: 'Domain Renewal', amount: '$14.99', date: 'Feb 13, 2026', type: 'Payment' },
];

export function PanelRevenuePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Revenue</h1>
        <p className="text-[#4B5563]">Financial overview and analytics</p>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#064A6C]" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#10B981]">+3.2%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#09080E]">$47,250</h3>
          <p className="text-sm text-[#4B5563]">Monthly Recurring Revenue</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#10B981]">+18.3%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#09080E]">$567K</h3>
          <p className="text-sm text-[#4B5563]">Annual Run Rate</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[#DC2626]" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#09080E]">2.3%</h3>
          <p className="text-sm text-[#4B5563]">Churn Rate</p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
        <h2 className="text-lg font-semibold text-[#09080E] mb-6">Monthly Revenue (Last 12 Months)</h2>
        <div className="flex items-end gap-2 h-64">
          {monthlyRevenue.map((m, i) => {
            const heightPct = (m.value / maxRevenue) * 100;
            const isCurrent = i === monthlyRevenue.length - 1;
            return (
              <div key={`${m.month}-${m.year}`} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-[#09080E]">
                  ${(m.value / 1000).toFixed(1)}k
                </span>
                <div className="w-full flex justify-center">
                  <div
                    className={`w-full max-w-[40px] rounded-t-md transition-all ${
                      isCurrent ? 'bg-[#064A6C]' : 'bg-teal-200 hover:bg-teal-300'
                    }`}
                    style={{ height: `${heightPct * 2}px` }}
                  />
                </div>
                <span className={`text-xs ${isCurrent ? 'font-bold text-[#064A6C]' : 'text-[#4B5563]'}`}>
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Service */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
        <h2 className="text-lg font-semibold text-[#09080E] mb-6">Revenue by Service</h2>
        <div className="space-y-4">
          {serviceBreakdown.map((s) => (
            <div key={s.service} className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#09080E] w-20">{s.service}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="text-sm text-[#4B5563] w-24 text-right">
                ${s.amount.toLocaleString()} ({s.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
        <h2 className="text-lg font-semibold text-[#09080E] mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB]">
                <th className="pb-3 font-medium">Transaction</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-sm font-medium text-[#064A6C]">{txn.id}</td>
                  <td className="py-3 text-sm text-[#09080E]">{txn.customer}</td>
                  <td className="py-3 text-sm text-[#4B5563]">{txn.description}</td>
                  <td className={`py-3 text-sm font-medium ${txn.type === 'Refund' ? 'text-[#DC2626]' : 'text-[#09080E]'}`}>
                    {txn.amount}
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      txn.type === 'Payment' ? 'bg-[#10B981] text-white' : 'bg-red-100 text-[#DC2626]'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-[#4B5563]">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
