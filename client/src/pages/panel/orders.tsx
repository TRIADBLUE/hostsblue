import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, RotateCcw, Send } from 'lucide-react';

const filterTabs = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];

interface OrderItem {
  name: string;
  qty: number;
  price: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  items: string;
  total: string;
  paymentStatus: string;
  orderStatus: string;
  date: string;
  lineItems: OrderItem[];
  paymentMethod: string;
  transactionId: string;
}

const orders: Order[] = [
  {
    id: 'ORD-4821', customer: 'Sarah Mitchell', email: 'sarah@mitchelldesign.com', items: 'hostsblue.io, Starter Hosting', total: '$142.88', paymentStatus: 'Paid', orderStatus: 'Completed', date: 'Feb 19, 2026',
    lineItems: [{ name: 'Domain Registration - hostsblue.io', qty: 1, price: '$34.99' }, { name: 'Starter Hosting - Annual', qty: 1, price: '$95.89' }, { name: 'SSL DV Certificate', qty: 1, price: '$12.00' }],
    paymentMethod: 'Visa ending 4242', transactionId: 'txn_1Q8x9KLm4R2v3B',
  },
  {
    id: 'ORD-4820', customer: 'James Chen', email: 'james@chentech.io', items: 'SSL Wildcard Certificate', total: '$199.99', paymentStatus: 'Paid', orderStatus: 'Completed', date: 'Feb 19, 2026',
    lineItems: [{ name: 'SSL Wildcard Certificate - Annual', qty: 1, price: '$199.99' }],
    paymentMethod: 'Mastercard ending 8371', transactionId: 'txn_1Q8w7JKn5S3u4C',
  },
  {
    id: 'ORD-4819', customer: 'Emily Rodriguez', email: 'emily@brightpixel.co', items: 'techvault.com, Business Hosting', total: '$287.40', paymentStatus: 'Pending', orderStatus: 'Pending', date: 'Feb 18, 2026',
    lineItems: [{ name: 'Domain Registration - techvault.com', qty: 1, price: '$14.99' }, { name: 'Business Hosting - Annual', qty: 1, price: '$239.88' }, { name: 'Email Pro Plan x2', qty: 2, price: '$16.27' }],
    paymentMethod: 'PayPal', transactionId: 'pp_pending_82jk4',
  },
  {
    id: 'ORD-4818', customer: 'Michael Okonkwo', email: 'michael@lagosdigital.ng', items: 'Email Pro Plan x5', total: '$59.95', paymentStatus: 'Paid', orderStatus: 'Completed', date: 'Feb 18, 2026',
    lineItems: [{ name: 'Email Pro Plan - Monthly', qty: 5, price: '$59.95' }],
    paymentMethod: 'Visa ending 1923', transactionId: 'txn_1Q8v6HLo6T4w5D',
  },
  {
    id: 'ORD-4817', customer: 'Priya Sharma', email: 'priya@greenleafstudio.com', items: 'greenleafstudio.com', total: '$14.99', paymentStatus: 'Paid', orderStatus: 'Completed', date: 'Feb 17, 2026',
    lineItems: [{ name: 'Domain Renewal - greenleafstudio.com', qty: 1, price: '$14.99' }],
    paymentMethod: 'Visa ending 5567', transactionId: 'txn_1Q8u5GLp7U5x6E',
  },
  {
    id: 'ORD-4816', customer: 'David Kim', email: 'david@kimstartups.com', items: 'Website Builder Business', total: '$192.00', paymentStatus: 'Failed', orderStatus: 'Failed', date: 'Feb 17, 2026',
    lineItems: [{ name: 'Website Builder Business Plan - Annual', qty: 1, price: '$192.00' }],
    paymentMethod: 'Amex ending 0045', transactionId: 'txn_failed_9xk32',
  },
  {
    id: 'ORD-4815', customer: 'Laura Bennett', email: 'laura@bennettlaw.com', items: 'Domain Transfer, SSL DV', total: '$84.98', paymentStatus: 'Paid', orderStatus: 'Completed', date: 'Feb 16, 2026',
    lineItems: [{ name: 'Domain Transfer - bennettlaw.com', qty: 1, price: '$11.99' }, { name: 'SSL DV Certificate - Annual', qty: 1, price: '$49.99' }, { name: 'Privacy Protection', qty: 1, price: '$9.99' }, { name: 'DNS Management', qty: 1, price: '$13.01' }],
    paymentMethod: 'Mastercard ending 7744', transactionId: 'txn_1Q8t4FLq8V6y7F',
  },
  {
    id: 'ORD-4814', customer: 'Carlos Mendez', email: 'carlos@mendezgroup.mx', items: 'Enterprise Hosting Upgrade', total: '$449.00', paymentStatus: 'Pending', orderStatus: 'Pending', date: 'Feb 16, 2026',
    lineItems: [{ name: 'Enterprise Hosting Upgrade - Annual', qty: 1, price: '$449.00' }],
    paymentMethod: 'Wire Transfer', transactionId: 'wire_pending_mx442',
  },
  {
    id: 'ORD-4813', customer: 'Aisha Patel', email: 'aisha@creativeflow.design', items: 'Starter Hosting Refund', total: '$7.99', paymentStatus: 'Refunded', orderStatus: 'Refunded', date: 'Feb 15, 2026',
    lineItems: [{ name: 'Starter Hosting - Monthly (Refund)', qty: 1, price: '-$7.99' }],
    paymentMethod: 'Visa ending 3321', transactionId: 'txn_refund_4dk29',
  },
  {
    id: 'ORD-4812', customer: 'Thomas Wright', email: 'tom@wrightphoto.com', items: 'Business Hosting, Email Pro x3', total: '$60.96', paymentStatus: 'Paid', orderStatus: 'Completed', date: 'Feb 14, 2026',
    lineItems: [{ name: 'Business Hosting - Monthly', qty: 1, price: '$24.99' }, { name: 'Email Pro Plan - Monthly', qty: 3, price: '$35.97' }],
    paymentMethod: 'Visa ending 6612', transactionId: 'txn_1Q8r2DLs0X8a9H',
  },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-[#10B981] text-white',
  Paid: 'bg-[#10B981] text-white',
  Pending: 'bg-[#FFD700] text-[#09080E]',
  Failed: 'bg-[#DC2626] text-white',
  Refunded: 'bg-gray-200 text-[#4B5563]',
};

export function PanelOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (activeTab === 'All') return true;
    return o.orderStatus === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Orders</h1>
        <p className="text-[#4B5563]">View and manage customer orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-1 inline-flex gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-[7px] text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#064A6C] text-white'
                : 'text-[#4B5563] hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium w-8"></th>
                <th className="px-6 py-3 font-medium">Order #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
                  >
                    <td className="px-6 py-3">
                      {expandedRow === order.id ? (
                        <ChevronUp className="w-4 h-4 text-[#4B5563]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#4B5563]" />
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{order.id}</td>
                    <td className="px-6 py-3 text-sm text-[#09080E]">{order.customer}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563] max-w-[200px] truncate">{order.items}</td>
                    <td className="px-6 py-3 text-sm font-medium text-[#09080E]">{order.total}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{order.date}</td>
                  </tr>
                  {expandedRow === order.id && (
                    <tr key={`${order.id}-detail`} className="bg-[#F9FAFB]">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Line Items */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#09080E] mb-3">Line Items</h4>
                            <div className="space-y-2">
                              {order.lineItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-[#4B5563]">
                                    {item.name} {item.qty > 1 && <span className="text-xs text-gray-400">x{item.qty}</span>}
                                  </span>
                                  <span className="font-medium text-[#09080E]">{item.price}</span>
                                </div>
                              ))}
                              <div className="border-t border-[#E5E7EB] pt-2 flex justify-between text-sm font-semibold text-[#09080E]">
                                <span>Total</span>
                                <span>{order.total}</span>
                              </div>
                            </div>
                          </div>
                          {/* Payment Info & Actions */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#09080E] mb-3">Payment Info</h4>
                            <div className="space-y-1 text-sm text-[#4B5563] mb-4">
                              <p>Method: {order.paymentMethod}</p>
                              <p>Transaction: <span className="font-mono text-xs">{order.transactionId}</span></p>
                              <p>Customer: {order.email}</p>
                            </div>
                            <div className="flex gap-2">
                              {order.orderStatus === 'Pending' && (
                                <button className="bg-[#064A6C] hover:bg-[#053A55] text-white text-xs font-medium px-3 py-1.5 rounded-[7px] flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                                </button>
                              )}
                              {order.orderStatus !== 'Refunded' && (
                                <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#4B5563] text-xs font-medium px-3 py-1.5 rounded-[7px] flex items-center gap-1">
                                  <RotateCcw className="w-3.5 h-3.5" /> Issue Refund
                                </button>
                              )}
                              <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#4B5563] text-xs font-medium px-3 py-1.5 rounded-[7px] flex items-center gap-1">
                                <Send className="w-3.5 h-3.5" /> Resend Confirmation
                              </button>
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
