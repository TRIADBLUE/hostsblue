import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeApi } from '@/lib/api';
import { ArrowLeft, Loader2, Plus, Package, ShoppingCart, Settings, Trash2, X, DollarSign } from 'lucide-react';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function ProductModal({ uuid, product, onClose }: { uuid: string; product?: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product ? String(product.price / 100) : '');
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice ? String(product.compareAtPrice / 100) : '');
  const [inventory, setInventory] = useState(product?.inventory !== null ? String(product.inventory) : '');

  const createMutation = useMutation({
    mutationFn: (data: any) => product
      ? storeApi.updateProduct(uuid, product.uuid, data)
      : storeApi.createProduct(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store', 'products', uuid] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      description,
      price: Math.round(parseFloat(price) * 100),
      compareAtPrice: compareAtPrice ? Math.round(parseFloat(compareAtPrice) * 100) : null,
      inventory: inventory ? parseInt(inventory) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[7px] max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C] resize-vertical" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required
                className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare at ($)</label>
              <input type="number" step="0.01" min="0" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]" placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
            <input type="number" min="0" value={inventory} onChange={e => setInventory(e.target.value)}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]" placeholder="Leave empty for unlimited" />
          </div>
          <button type="submit" disabled={createMutation.isPending}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function StoreManagerPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [editProduct, setEditProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['store', 'products', uuid],
    queryFn: () => storeApi.getProducts(uuid!),
    enabled: !!uuid,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['store', 'orders', uuid],
    queryFn: () => storeApi.getOrders(uuid!),
    enabled: !!uuid && tab === 'orders',
  });

  const { data: settings } = useQuery({
    queryKey: ['store', 'settings', uuid],
    queryFn: () => storeApi.getSettings(uuid!),
    enabled: !!uuid,
  });

  const deleteMutation = useMutation({
    mutationFn: (productUuid: string) => storeApi.deleteProduct(uuid!, productUuid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['store', 'products', uuid] }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderUuid, status }: { orderUuid: string; status: string }) => storeApi.updateOrderStatus(uuid!, orderUuid, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['store', 'orders', uuid] }),
  });

  if (!uuid) return <p className="text-gray-500">No project UUID</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/website-builder" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Manager</h1>
            <p className="text-gray-500">Manage your e-commerce store</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-[7px] p-0.5 w-fit">
        {(['products', 'orders', 'settings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-[5px] transition-colors capitalize ${tab === t ? 'bg-white shadow-sm text-[#064A6C]' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditProduct(null); setShowProductModal(true); }}
              className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" /></div>
          ) : !products || products.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-[7px] text-center py-12">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products yet</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-[7px] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Inventory</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{p.inventory ?? '∞'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditProduct(p); setShowProductModal(true); }}
                            className="text-xs text-[#064A6C] hover:underline">Edit</button>
                          <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(p.uuid); }}
                            className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" /></div>
          ) : !orders || orders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-[7px] text-center py-12">
              <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-[7px] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{o.customerEmail}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <select value={o.status} onChange={e => updateOrderMutation.mutate({ orderUuid: o.uuid, status: e.target.value })}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#064A6C]">
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="bg-white border border-gray-200 rounded-[7px] p-6 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Store Settings</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Currency</label>
              <p className="text-gray-500">{settings?.currency || 'USD'}</p>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Tax Rate</label>
              <p className="text-gray-500">{settings?.taxRate || '0'}%</p>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Payments</label>
              <p className="text-gray-500">{settings?.paymentEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <ProductModal uuid={uuid} product={editProduct} onClose={() => { setShowProductModal(false); setEditProduct(null); }} />
      )}
    </div>
  );
}
