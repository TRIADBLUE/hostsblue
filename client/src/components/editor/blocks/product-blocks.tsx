import { ShoppingBag, Package } from 'lucide-react';

interface ProductGridBlockEditorProps {
  data: any;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

export function ProductGridBlockEditor({ data, isActive }: ProductGridBlockEditorProps) {
  const cols = data.columns || 3;
  return (
    <div className={`p-6 ${isActive ? 'ring-2 ring-[#064A6C]' : ''}`}>
      {data.heading && <h2 className="text-xl font-bold text-center mb-4">{data.heading}</h2>}
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: Math.min(cols, data.maxProducts || 3) }).map((_, i) => (
          <div key={i} className="border border-dashed border-gray-300 rounded-[7px] p-4 text-center">
            <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Product {i + 1}</p>
            {data.showPrice && <p className="text-xs text-gray-300 mt-1">$0.00</p>}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">Products load dynamically from your store</p>
    </div>
  );
}

interface ProductDetailBlockEditorProps {
  data: any;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

export function ProductDetailBlockEditor({ data, isActive }: ProductDetailBlockEditorProps) {
  return (
    <div className={`p-6 ${isActive ? 'ring-2 ring-[#064A6C]' : ''}`}>
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-dashed border-gray-300 rounded-[7px] aspect-square flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-300" />
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="h-10 bg-[#064A6C]/10 rounded-[7px] w-40 flex items-center justify-center">
            <span className="text-xs text-[#064A6C] font-medium">Add to Cart</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">
        {data.productSlug ? `Product: ${data.productSlug}` : 'Set product slug in properties'}
      </p>
    </div>
  );
}
