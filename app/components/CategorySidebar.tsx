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
  return (
    <aside className="w-64 bg-white border-r p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Linh kiện</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            disabled={loading}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              !selectedCat
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            Tất cả sản phẩm
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onSelectCategory(cat.id)}
              disabled={loading}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedCat === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
