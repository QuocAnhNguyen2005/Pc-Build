import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { formatPriceSimple } from '@/lib/utils';

interface SpecsBadgesProps {
  specs?: Record<string, string | number | undefined>;
}

function SpecsBadges({ specs }: SpecsBadgesProps) {
  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  // Filter out undefined values
  const validSpecs = Object.entries(specs).filter(([, val]) => val !== undefined && val !== null);
  
  if (validSpecs.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex gap-2 overflow-x-auto">
      {validSpecs.map(([key, val]) => (
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
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Không có sản phẩm
        </h3>
        <p className="text-gray-500">Vui lòng chọn danh mục khác hoặc thử lại sau</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="group bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <motion.div
            className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative"
            initial={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-gray-400">
              Hình ảnh {item.brand}
            </span>
          </motion.div>
          <motion.h2
            className="text-lg font-bold text-gray-800 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            {item.name}
          </motion.h2>
          <motion.p
            className="text-sm text-gray-400 mb-3 uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + index * 0.05 }}
          >
            {item.brand}
          </motion.p>

          <motion.div
            className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <span className="text-xl font-black text-blue-600">
              {formatPriceSimple(item.price)}đ
            </span>
            {onSelectProduct ? (
              <Link href="/builder">
                <motion.button
                  onClick={() => onSelectProduct(item)}
                  whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition"
                >
                  ✓ Chọn
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition"
              >
                Chọn
              </motion.button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 + index * 0.05 }}
          >
            <SpecsBadges specs={item.specs} />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
