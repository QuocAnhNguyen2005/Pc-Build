'use client';

import React from 'react';
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

  // Get unique brands from products
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();

  // Apply filters and sorting
  React.useEffect(() => {
    let filtered = [...products];

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Filter by model/name
    if (searchModel) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchModel.toLowerCase())
      );
    }

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
  }, [selectedBrand, searchModel, sortBy, products]);

  const handleReset = () => {
    setSelectedBrand('');
    setSearchModel('');
    setSortBy('newest');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏢 Hãng sản xuất
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả hãng</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Model Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Tìm kiếm mô hình
          </label>
          <input
            type="text"
            placeholder="VD: Core i7, Ryzen 5..."
            value={searchModel}
            onChange={(e) => setSearchModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📊 Sắp xếp
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="name">Tên (A-Z)</option>
            <option value="price-asc">Giá (Thấp → Cao)</option>
            <option value="price-desc">Giá (Cao → Thấp)</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
          >
            🔄 Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
