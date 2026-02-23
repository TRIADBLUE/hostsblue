import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/api';
import { ShoppingCart, Loader2, ChevronDown, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">View your order history</p>
        </div>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const isExpanded = expandedOrder === order.uuid;
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-[7px] overflow-hidden">
                {/* Order Row */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.uuid)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#064A6C]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-mono font-medium">{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span>{order.items?.length || 0} item(s)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-900 font-semibold">${(order.total / 100).toFixed(2)}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <OrderDetail uuid={order.uuid} order={order} getStatusBadge={getStatusBadge} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[7px] text-center py-16 px-6">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Your order history will appear here</p>
          <Link to="/domains/search" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

function OrderDetail({
  uuid,
  order,
  getStatusBadge,
}: {
  uuid: string;
  order: any;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ['order', uuid],
    queryFn: () => orderApi.getOrder(uuid),
  });

  const data = detail || order;

  return (
    <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
      {isLoading && !detail ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Order Items</h4>
            {data.items && data.items.length > 0 ? (
              <div className="space-y-2">
                {data.items.map((item: any, index: number) => (
                  <div key={item.id || index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-[7px]">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.description || item.type?.replace(/_/g, ' ')}
                      </p>
                      {item.domain && (
                        <p className="text-xs text-gray-500">{item.domain}{item.tld}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                      {item.status && (
                        <span className={`text-xs ${
                          item.status === 'completed' ? 'text-green-600' :
                          item.status === 'pending' ? 'text-yellow-600' :
                          item.status === 'failed' ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No items</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Number</span>
                <span className="text-gray-900 font-mono">{data.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(data.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">{new Date(data.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${((data.subtotal || data.total) / 100).toFixed(2)}</span>
              </div>
              {data.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">${(data.tax / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${(data.total / 100).toFixed(2)}</span>
              </div>
              {data.paymentMethod && (
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Payment</span>
                  <span className="text-gray-900 capitalize">{data.paymentMethod}</span>
                </div>
              )}
              {data.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid</span>
                  <span className="text-gray-900">{new Date(data.paidAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Pay Now for pending orders */}
            {data.status === 'pending_payment' && data.uuid && (
              <Link
                to={`/checkout?order=${data.uuid}`}
                className="block w-full text-center bg-[#064A6C] hover:bg-[#053A55] text-white text-sm font-medium px-4 py-2.5 rounded-[7px] transition-colors mt-4"
              >
                Pay Now
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
