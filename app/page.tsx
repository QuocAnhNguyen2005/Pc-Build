'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Product, Category } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { CategorySidebar } from '@/app/components/CategorySidebar';
import { ProductGrid } from '@/app/components/ProductGrid';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and filter logic
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch categories in parallel
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('id,name').order('name'),
        selectedCat
          ? supabase
              .from('products')
              .select('id,name,brand,price,specs,category_id')
              .eq('category_id', selectedCat)
              .order('created_at', { ascending: false })
          : supabase
              .from('products')
              .select('id,name,brand,price,specs,category_id')
              .order('created_at', { ascending: false }),
      ]);

      if (categoriesRes.error) {
        throw new Error(`Failed to load categories: ${categoriesRes.error.message}`);
      }

      if (productsRes.error) {
        throw new Error(`Failed to load products: ${productsRes.error.message}`);
      }

      setCategories(categoriesRes.data || []);
      setProducts((productsRes.data as Product[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCat]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCat(catId);
  };

  const categoryName = selectedCat
    ? categories.find((c) => c.id === selectedCat)?.name
    : 'Tất cả sản phẩm';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CategorySidebar
        categories={categories}
        selectedCat={selectedCat}
        onSelectCategory={handleSelectCategory}
        loading={loading}
      />

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{categoryName}</h1>
          <div className="text-right">
            <p className="text-gray-500 font-medium">
              Tìm thấy {products.length} linh kiện
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Lỗi</p>
            <p>{error}</p>
            <button
              onClick={() => fetchData()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Thử lại
            </button>
          </div>
        )}

        <ProductGrid products={products} loading={loading} loadingCount={6} />
      </main>
    </div>
  );
}