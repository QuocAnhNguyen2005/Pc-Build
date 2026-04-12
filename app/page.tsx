import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/app/components/ProductCard';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { EmptyState } from '@/app/components/EmptyState';

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id,name,brand,price,specs')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <main className="p-10">
        <ErrorMessage message={`Lỗi lấy dữ liệu: ${error.message}`} />
      </main>
    );
  }

  if (!products?.length) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">Danh sách linh kiện PC</h1>
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Danh sách linh kiện PC</h1>
        <p className="text-gray-600">Tổng cộng: {products.length} sản phẩm</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}