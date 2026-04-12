import { supabase } from '@/lib/supabase'; // Đảm bảo đường dẫn đúng với file bạn vừa tạo

export default async function Home() {
  // Lấy dữ liệu từ bảng products
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) return <div>Lỗi lấy dữ liệu: {error.message}</div>;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Danh sách linh kiện PC</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold text-blue-600">{item.name}</h2>
            <p className="text-gray-500">Hãng: {item.brand}</p>
            <p className="text-red-500 font-bold mt-2">
              Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
            </p>
            
            {/* Hiển thị specs từ cột JSONB */}
            <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-2 rounded">
              <p>Socket: {item.specs.socket}</p>
              {item.specs.cores && <p>Nhân: {item.specs.cores}</p>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}