import { useQuery } from '@tanstack/react-query';
import { orderApi, dashboardApi } from '@/lib/api';
import { CreditCard, Loader2, ExternalLink, Receipt, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BillingPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders,
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">{status}</span>;
      case 'pending_payment':
      case 'processing':
        return <span className="badge badge-warning">{status.replace('_', ' ')}</span>;
      case 'failed':
      case 'cancelled':
        return <span className="badge badge-error">{status}</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const totalSpent = orders?.reduce((sum: number, o: any) => o.status === 'completed' ? sum + (o.total || 0) : sum, 0) || 0;
  const pendingOrders = orders?.filter((o: any) => o.status === 'pending_payment') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-500">Manage your payments, subscriptions, and invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#064A6C]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Estimate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${((stats?.monthlySpendEstimate || 0) / 100).toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-1">Active services</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#064A6C]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">${(totalSpent / 100).toFixed(2)}</p>
          <p className="text-gray-500 text-sm mt-1">Across {orders?.filter((o: any) => o.status === 'completed').length || 0} completed orders</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#064A6C]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          </div>
          <p className="text-gray-500 text-sm">Payments are processed securely via SwipesBlue at checkout.</p>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingOrders.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-[7px] p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Payments</h2>
          <div className="space-y-3">
            {pendingOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-yellow-200 rounded-[7px]">
                <div>
                  <span className="text-gray-900 font-mono font-medium">{order.orderNumber}</span>
                  <p className="text-sm text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} — {order.items?.length || 0} item(s)</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-900 font-semibold">${(order.total / 100).toFixed(2)}</span>
                  <Link
                    to={`/checkout?order=${order.uuid}`}
                    className="bg-[#064A6C] hover:bg-[#053A55] text-white text-sm font-medium px-4 py-2 rounded-[7px] transition-colors"
                  >
                    Pay Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <Link to="/dashboard/orders" className="text-[#064A6C] text-sm hover:text-[#053A55]">
            View All Orders
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 pt-1 font-medium text-gray-500 text-sm">Order #</th>
                  <th className="pb-3 pt-1 font-medium text-gray-500 text-sm">Date</th>
                  <th className="pb-3 pt-1 font-medium text-gray-500 text-sm">Items</th>
                  <th className="pb-3 pt-1 font-medium text-gray-500 text-sm">Amount</th>
                  <th className="pb-3 pt-1 font-medium text-gray-500 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-4">
                      <span className="text-gray-900 font-mono text-sm">{order.orderNumber}</span>
                    </td>
                    <td className="py-4 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-600 text-sm">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="py-4 text-gray-900 text-sm font-medium">
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
