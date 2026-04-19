import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCat: string | null;
  onSelectCategory: (catId: string | null) => void;
  loading: boolean;
}

export function CategorySidebar({
  categories,
  selectedCat,
  onSelectCategory,
  loading,
}: CategorySidebarProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.aside
      className="w-64 bg-white border-r p-6 shadow-sm"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Linh kiện
      </motion.h2>
      <motion.ul
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.li variants={itemVariants}>
          <motion.button
            onClick={() => onSelectCategory(null)}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, paddingLeft: '1.25rem' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              !selectedCat
                ? 'bg-blue-600 text-white shadow-md'
                : 'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            Tất cả sản phẩm
          </motion.button>
        </motion.li>
        {categories.map((cat) => (
          <motion.li key={cat.id} variants={itemVariants}>
            <motion.button
              onClick={() => onSelectCategory(cat.id)}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, paddingLeft: '1.25rem' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              animate={selectedCat === cat.id ? { x: 4 } : { x: 0 }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedCat === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {cat.name}
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.aside>
  );
}
