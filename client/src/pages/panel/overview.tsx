import { Link } from 'react-router-dom';
import {
  Users,
  Globe,
  Server,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Plus,
  Headphones,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Customers',
    value: '1,247',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#1844A6]',
  },
  {
    label: 'Active Domains',
    value: '3,891',
    change: '+8.2%',
    trend: 'up' as const,
    icon: Globe,
    iconBg: 'bg-teal-50',
    iconColor: 'text-[#064A6C]',
  },
  {
    label: 'Active Hosting',
    value: '892',
    change: '-1.4%',
    trend: 'down' as const,
    icon: Server,
    iconBg: 'bg-green-50',
    iconColor: 'text-[#10B981]',
  },
  {
    label: 'Monthly Revenue',
    value: '$47,250',
    change: '+18.3%',
    trend: 'up' as const,
    icon: DollarSign,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-[#D97706]',
  },
];

const recentOrders = [
  { id: 'ORD-4821', customer: 'Sarah Mitchell', items: 'hostsblue.io, Starter Hosting', total: '$142.88', status: 'Completed', statusColor: 'bg-[#10B981] text-white', date: 'Feb 19, 2026' },
  { id: 'ORD-4820', customer: 'James Chen', items: 'SSL Wildcard Certificate', total: '$199.99', status: 'Completed', statusColor: 'bg-[#10B981] text-white', date: 'Feb 19, 2026' },
  { id: 'ORD-4819', customer: 'Emily Rodriguez', items: 'techvault.com, Business Hosting', total: '$287.40', status: 'Pending', statusColor: 'bg-[#FFD700] text-[#09080E]', date: 'Feb 18, 2026' },
  { id: 'ORD-4818', customer: 'Michael Okonkwo', items: 'Email Pro Plan x5', total: '$59.95', status: 'Completed', statusColor: 'bg-[#10B981] text-white', date: 'Feb 18, 2026' },
  { id: 'ORD-4817', customer: 'Priya Sharma', items: 'greenleafstudio.com', total: '$14.99', status: 'Completed', statusColor: 'bg-[#10B981] text-white', date: 'Feb 17, 2026' },
  { id: 'ORD-4816', customer: 'David Kim', items: 'Website Builder Business', total: '$192.00', status: 'Failed', statusColor: 'bg-[#DC2626] text-white', date: 'Feb 17, 2026' },
  { id: 'ORD-4815', customer: 'Laura Bennett', items: 'Domain Transfer, SSL DV', total: '$84.98', status: 'Completed', statusColor: 'bg-[#10B981] text-white', date: 'Feb 16, 2026' },
  { id: 'ORD-4814', customer: 'Carlos Mendez', items: 'Enterprise Hosting Upgrade', total: '$449.00', status: 'Pending', statusColor: 'bg-[#FFD700] text-[#09080E]', date: 'Feb 16, 2026' },
];

export function PanelOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Overview</h1>
        <p className="text-[#4B5563]">Welcome to the hostsblue admin panel</p>
      </div>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E5E7EB] rounded-[7px] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[#DC2626]" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-[#10B981]' : 'text-[#DC2626]'}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#09080E] mb-1">{stat.value}</h3>
              <p className="text-[#4B5563] text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/panel/customers"
          className="bg-[#064A6C] hover:bg-[#053A55] text-white font-medium px-4 py-2.5 rounded-[7px] transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Link>
        <Link
          to="/panel/orders"
          className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#09080E] font-medium px-4 py-2.5 rounded-[7px] transition-colors flex items-center gap-2 text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Create Order
        </Link>
        <Link
          to="/panel/support"
          className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#09080E] font-medium px-4 py-2.5 rounded-[7px] transition-colors flex items-center gap-2 text-sm"
        >
          <Headphones className="w-4 h-4" />
          View Support Queue
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#064A6C]" />
            </div>
            <h2 className="text-lg font-semibold text-[#09080E]">Recent Orders</h2>
          </div>
          <Link to="/panel/orders" className="text-sm text-[#064A6C] hover:text-[#053A55] font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB]">
                <th className="pb-3 font-medium">Order #</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-sm font-medium text-[#064A6C]">{order.id}</td>
                  <td className="py-3 text-sm text-[#09080E]">{order.customer}</td>
                  <td className="py-3 text-sm text-[#4B5563] max-w-[200px] truncate">{order.items}</td>
                  <td className="py-3 text-sm font-medium text-[#09080E]">{order.total}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-[#4B5563]">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
