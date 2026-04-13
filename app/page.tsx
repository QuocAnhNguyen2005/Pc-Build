'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: Product | null }>({
    cpu: null,
    mainboard: null,
    gpu: null,
    ram: null,
    psu: null,
    ssd: null,
  });

  // Create a category lookup map for O(1) access instead of O(n) find
  const categoryMap = useMemo(() => {
    return new Map(categories.map(cat => [cat.id, cat]));
  }, [categories]);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error: categError } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');

        if (categError) throw categError;
        setCategories(data || []);
      } catch (err: any) {
        console.error('Error fetching categories:', err.message);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category and CPU compatibility
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select('id, name, brand, price, specs, category_id');

      // Filter by selected category if one is chosen
      if (selectedCat) {
        query = query.eq('category_id', selectedCat);

        // Get current category using optimized lookup
        const currentCategory = categoryMap.get(selectedCat);
        
        // Extract CPU socket once for type safety
        const cpuSocket = selectedParts.cpu?.specs?.socket;

        // Apply compatibility logic: filter mainboards by CPU socket
        if (currentCategory?.slug === 'mainboard' && cpuSocket) {
          query = query.contains('specs', { socket: cpuSocket });
        }
      }

      const { data, error: prodError } = await query.order('created_at', { 
        ascending: false 
      });

      if (prodError) throw prodError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, categoryMap, selectedParts.cpu?.id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSelectCategory = useCallback((catId: string | null) => {
    setSelectedCat(catId);
  }, []);

  // Memoize category name to avoid recalculation on every render
  const categoryName = useMemo(() => {
    if (!selectedCat) return 'Tất cả sản phẩm';
    return categoryMap.get(selectedCat)?.name ?? 'Tất cả sản phẩm';
  }, [selectedCat, categoryMap]);

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
              onClick={() => fetchProducts()}
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