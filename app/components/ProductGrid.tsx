import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatPriceSimple } from '@/lib/utils';

interface SpecsBadgesProps {
  specs?: Record<string, string | number>;
}

function SpecsBadges({ specs }: SpecsBadgesProps) {
  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex gap-2 overflow-x-auto">
      {Object.entries(specs).map(([key, val]) => (
        <span
          key={key}
          className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap uppercase font-bold"
        >
          {key}: {val}
        </span>
      ))}
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  loadingCount?: number;
  onSelectProduct?: (product: Product) => void;
}

export function ProductGrid({
  products,
  loading,
  loadingCount = 6,
  onSelectProduct,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: loadingCount }).map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Không có sản phẩm
        </h3>
        <p className="text-gray-500">Vui lòng chọn danh mục khác hoặc thử lại sau</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((item) => (
        <div
          key={item.id}
          className="group bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            <span className="text-gray-400 group-hover:scale-110 transition-transform">
              Hình ảnh {item.brand}
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h2>
          <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
            {item.brand}
          </p>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
            <span className="text-xl font-black text-blue-600">
              {formatPriceSimple(item.price)}đ
            </span>
            {onSelectProduct ? (
              <Link href="/builder">
                <button 
                  onClick={() => onSelectProduct(item)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition"
                >
                  ✓ Chọn
                </button>
              </Link>
            ) : (
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition">
                Chọn
              </button>
            )}
          </div>

          <SpecsBadges specs={item.specs} />
        </div>
      ))}
    </div>
  );
}
