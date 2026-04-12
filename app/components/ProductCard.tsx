import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, brand, price, specs } = product;

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-xl font-semibold text-blue-600">{name}</h2>
      <p className="text-gray-500">Hãng: {brand}</p>
      <p className="text-red-500 font-bold mt-2">
        Giá: {formatPrice(price)}
      </p>

      {specs && Object.keys(specs).length > 0 && (
        <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-2 rounded">
          {specs.socket && <p>Socket: {specs.socket}</p>}
          {specs.cores && <p>Nhân: {specs.cores}</p>}
        </div>
      )}
    </div>
  );
}
