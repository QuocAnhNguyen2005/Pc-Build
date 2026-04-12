import { supabase } from '@/lib/supabase';

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return (
      <main className="p-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Lỗi lấy dữ liệu: {error.message}
        </div>
      </main>
    );
  }

  if (!products?.length) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">Danh sách linh kiện PC</h1>
        <p className="text-gray-500">Không có sản phẩm nào.</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Danh sách linh kiện PC</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-600">{item.name}</h2>
            <p className="text-gray-500">Hãng: {item.brand}</p>
            <p className="text-red-500 font-bold mt-2">
              Giá: {priceFormatter.format(item.price)}
            </p>

            {item.specs && (
              <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                {item.specs.socket && <p>Socket: {item.specs.socket}</p>}
                {item.specs.cores && <p>Nhân: {item.specs.cores}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}