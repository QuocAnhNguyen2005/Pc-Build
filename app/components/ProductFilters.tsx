'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/types';

interface ProductFiltersProps {
  products: Product[];
  onFiltersChange: (filtered: Product[]) => void;
}

type SortType = 'name' | 'price-asc' | 'price-desc' | 'newest';

export function ProductFilters({ products, onFiltersChange }: ProductFiltersProps) {
  const [selectedBrand, setSelectedBrand] = React.useState<string>('');
  const [searchModel, setSearchModel] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<SortType>('newest');
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 100000000]);

  // Get unique brands from products
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();

  // Apply filters and sorting
  React.useEffect(() => {
    let filtered = [...products];

    // Filter by brand (dropdown)
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Enhanced search: search across product name, brand, and specs (case-insensitive)
    if (searchModel) {
      const searchQuery = searchModel.toLowerCase().trim();
      filtered = filtered.filter(p => {
        // Search in product name
        if (p.name.toLowerCase().includes(searchQuery)) {
          return true;
        }
        
        // Search in brand name
        if (p.brand.toLowerCase().includes(searchQuery)) {
          return true;
        }
        
        // Search in product specs
        if (p.specs && typeof p.specs === 'object') {
          return Object.values(p.specs).some(specValue => {
            if (specValue === null || specValue === undefined) {
              return false;
            }
            const specStr = String(specValue).toLowerCase();
            return specStr.includes(searchQuery);
          });
        }
        
        return false;
      });
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
    }

    onFiltersChange(filtered);
  }, [selectedBrand, searchModel, sortBy, products, priceRange, onFiltersChange]);

  const handleReset = () => {
    setSelectedBrand('');
    setSearchModel('');
    setSortBy('newest');
    setPriceRange([0, 100000000]);
  };

  // Get min and max prices for range slider
  const minPrice = Math.min(...products.map(p => p.price || 0));
  const maxPrice = Math.max(...products.map(p => p.price || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6 border border-blue-100"
    >
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Brand Filter */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏢 Hãng sản xuất
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">Tất cả hãng</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </motion.div>

        {/* Model Search */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Tìm kiếm sản phẩm
          </label>
          <input
            type="text"
            placeholder="Tên, hãng, hoặc spec (VD: AMD, Nvidia, socket...)"
            value={searchModel}
            onChange={(e) => setSearchModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tìm kiếm theo tên, hãng sản xuất, hoặc thông số kỹ thuật (case-insensitive)
          </p>
        </motion.div>

        {/* Sort */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="md:col-span-1"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📊 Sắp xếp
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="newest">Mới nhất</option>
            <option value="name">Tên (A-Z)</option>
            <option value="price-asc">Giá (Thấp → Cao)</option>
            <option value="price-desc">Giá (Cao → Thấp)</option>
          </select>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="md:col-span-3 flex items-end gap-2"
        >
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            🔄 Đặt lại
          </button>
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            ⚙️ {showAdvanced ? 'Ẩn' : 'Chi tiết'}
            <motion.span
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Advanced Filters - Expandable Section */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border-t border-blue-200 pt-6 mt-6"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                🎚️ Bộ lọc nâng cao
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range Filter */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    💰 Khoảng giá
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>{Math.round(priceRange[0]).toLocaleString()} đ</span>
                      <span>-</span>
                      <span>{Math.round(priceRange[1]).toLocaleString()} đ</span>
                    </div>
                  </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="md:col-span-3 bg-white rounded-lg p-4 border border-blue-200"
                >
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">💡 Mẹo:</span> Sử dụng các bộ lọc trên để tìm kiếm sản phẩm phù hợp với nhu cầu của bạn. Các filter sẽ tự động làm mới danh sách sản phẩm.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
