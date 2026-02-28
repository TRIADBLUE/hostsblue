import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { panelApi } from '@/lib/api';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const filterTabs = [
  { label: 'All', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending Payment', value: 'pending_payment' },
  { label: 'Processing', value: 'processing' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-[#10B981] text-white',
  pending_payment: 'bg-[#FFD700] text-[#09080E]',
  processing: 'bg-[#3B82F6] text-white',
  failed: 'bg-[#DC2626] text-white',
  refunded: 'bg-gray-200 text-[#4B5563]',
};

function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function PanelOrdersPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['panel-orders', activeTab, page],
    queryFn: () =>
      panelApi.getOrders({
        status: activeTab || undefined,
        page,
        limit,
      }),
  });

  const orders = data?.orders || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const markCompleteMutation = useMutation({
    mutationFn: (id: number) => panelApi.updateOrder(id, { status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel-orders'] });
    },
  });

  const refundMutation = useMutation({
    mutationFn: ({ id, amount, reason }: { id: number; amount: number; reason?: string }) =>
      panelApi.refundOrder(id, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel-orders'] });
      setRefundReason('');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Orders</h1>
        <p className="text-[#4B5563]">
          View and manage customer orders{total > 0 && ` \u2014 ${total} total`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-1 inline-flex gap-1 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-[7px] text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-[#064A6C] text-white'
                : 'text-[#4B5563] hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && (
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-6 py-3 font-medium w-8"></th>
                  <th className="px-6 py-3 font-medium">Order #</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#4B5563]">
                      No orders found.
                    </td>
                  </tr>
                )}
                {orders.map((order: any) => (
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
                      <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-3 text-sm text-[#09080E]">
                        <div>
                          {order.customerName || order.customerEmail || '--'}
                          {order.customerName && order.customerEmail && (
                            <span className="block text-xs text-[#4B5563]">
                              {order.customerEmail}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-[#09080E]">
                        {formatCents(order.total, order.currency)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status] || 'bg-gray-200 text-[#4B5563]'
                          }`}
                        >
                          {formatStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#4B5563]">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                    {expandedRow === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-[#F9FAFB]">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Order Info */}
                            <div>
                              <h4 className="text-sm font-semibold text-[#09080E] mb-3">
                                Order Details
                              </h4>
                              <div className="space-y-1 text-sm text-[#4B5563]">
                                <p>
                                  Order Number:{' '}
                                  <span className="font-mono text-[#09080E]">
                                    {order.orderNumber}
                                  </span>
                                </p>
                                <p>
                                  Total:{' '}
                                  <span className="font-medium text-[#09080E]">
                                    {formatCents(order.total, order.currency)}
                                  </span>
                                </p>
                                <p>
                                  Payment Status:{' '}
                                  <span className="font-medium">
                                    {formatStatusLabel(order.paymentStatus || order.status)}
                                  </span>
                                </p>
                                <p>Date: {formatDate(order.createdAt)}</p>
                                {order.customerId && (
                                  <p>
                                    Customer:{' '}
                                    <Link
                                      to={`/panel/customers/${order.customerId}`}
                                      className="text-[#064A6C] hover:underline"
                                    >
                                      {order.customerName || order.customerEmail}
                                    </Link>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div>
                              <h4 className="text-sm font-semibold text-[#09080E] mb-3">
                                Actions
                              </h4>
                              <div className="space-y-3">
                                <div className="flex gap-2 flex-wrap">
                                  {(order.status === 'pending_payment' ||
                                    order.status === 'processing') && (
                                    <button
                                      onClick={() => markCompleteMutation.mutate(order.id)}
                                      disabled={markCompleteMutation.isPending}
                                      className="bg-[#064A6C] hover:bg-[#053C58] text-white text-xs font-medium px-3 py-1.5 rounded-[7px] flex items-center gap-1 transition-colors disabled:opacity-50"
                                    >
                                      {markCompleteMutation.isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      )}
                                      Mark Complete
                                    </button>
                                  )}
                                  {order.status !== 'refunded' && order.status !== 'failed' && (
                                    <button
                                      onClick={() =>
                                        refundMutation.mutate({
                                          id: order.id,
                                          amount: order.total,
                                          reason: refundReason || undefined,
                                        })
                                      }
                                      disabled={refundMutation.isPending}
                                      className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#4B5563] text-xs font-medium px-3 py-1.5 rounded-[7px] flex items-center gap-1 transition-colors disabled:opacity-50"
                                    >
                                      {refundMutation.isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <RotateCcw className="w-3.5 h-3.5" />
                                      )}
                                      Issue Refund
                                    </button>
                                  )}
                                </div>
                                {order.status !== 'refunded' && order.status !== 'failed' && (
                                  <input
                                    type="text"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    placeholder="Refund reason (optional)"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-[7px] text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent"
                                  />
                                )}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
              <p className="text-sm text-[#4B5563]">
                Page {page} of {totalPages} ({total} orders)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-[7px] border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-[7px] border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
