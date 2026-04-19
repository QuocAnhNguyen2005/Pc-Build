'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { Product, Category } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { CategorySidebar } from '@/app/components/CategorySidebar';
import { ProductGrid } from '@/app/components/ProductGrid';
import { ProductFilters } from '@/app/components/ProductFilters';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: Product | null }>({
    cpu: null,
    mainboard: null,
    gpu: null,
    ram: null,
    psu: null,
    ssd1: null,
    ssd2: null,
    hdd: null,
    case: null,
    cooling: null,
    monitor: null,
    wifi_modem: null,
    keyboard: null,
    chair: null,
    table: null,
    monitor_arm: null,
  });
  const [selectedCount, setSelectedCount] = useState(0);

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
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching categories:', message);
      }
    };

    fetchCategories();
  }, []);

  // Load selected parts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('selectedParts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedParts(parsed);
        const count = Object.values(parsed).filter(p => p !== null).length;
        setSelectedCount(count);
      }
    } catch (err) {
      console.error('Error loading selected parts:', err);
    }
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, categoryMap, selectedParts.cpu?.specs?.socket]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Initialize filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSelectCategory = useCallback((catId: string | null) => {
    setSelectedCat(catId);
  }, []);

  // Memoize slug to part mapping
  const slugToPart = useMemo(() => ({
    'cpu': 'cpu',
    'mainboard': 'mainboard',
    'gpu': 'gpu',
    'ram': 'ram',
    'psu': 'psu',
    'ssd': 'ssd1',
    'hdd': 'hdd',
    'case': 'case',
    'cooling': 'cooling',
    'monitor': 'monitor',
    'wifi-modem': 'wifi_modem',
    'keyboard': 'keyboard',
    'chair': 'chair',
    'table': 'table',
    'monitor-arm': 'monitor_arm',
  } as const), []);

  const handleSelectProduct = useCallback((product: Product) => {
    try {
      const currentCategory = categoryMap.get(product.category_id || '');
      const partKey = currentCategory?.slug ? slugToPart[currentCategory.slug as keyof typeof slugToPart] : null;

      if (partKey) {
        const updated = {
          ...selectedParts,
          [partKey]: product,
        };
        setSelectedParts(updated);
        localStorage.setItem('selectedParts', JSON.stringify(updated));
        
        const count = Object.values(updated).filter(p => p !== null).length;
        setSelectedCount(count);
      }
    } catch (err) {
      console.error('Error selecting product:', err);
    }
  }, [selectedParts, categoryMap, slugToPart]);

  // Memoize category name to avoid recalculation on every render
  const categoryName = useMemo(() => {
    if (!selectedCat) return 'Tất cả sản phẩm';
    return categoryMap.get(selectedCat)?.name ?? 'Tất cả sản phẩm';
  }, [selectedCat, categoryMap]);

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CategorySidebar
        categories={categories}
        selectedCat={selectedCat}
        onSelectCategory={handleSelectCategory}
        loading={loading}
      />

      <main className="flex-1 p-10">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{categoryName}</h1>
            <motion.p
              className="text-gray-500 font-medium mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Tìm thấy {filteredProducts.length} linh kiện
            </motion.p>
          </div>
          <Link href="/builder">
            <motion.button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(22, 163, 74, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              🛒 Xem Builder ({selectedCount}/16)
            </motion.button>
          </Link>
        </motion.div>

        {/* Product Filters */}
        <AnimatePresence>
          {!loading && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductFilters 
                products={products}
                onFiltersChange={setFilteredProducts}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold">Lỗi</p>
              <p>{error}</p>
              <motion.button
                onClick={() => fetchProducts()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 text-sm underline hover:no-underline transition"
              >
                Thử lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ProductGrid 
            products={filteredProducts} 
            loading={loading} 
            loadingCount={6}
            onSelectProduct={handleSelectProduct}
          />
        </motion.div>
      </main>
    </motion.div>
  );
}