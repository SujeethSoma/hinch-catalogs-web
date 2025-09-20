"use client";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
}: CategoryTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const count = categoryCounts[category] || 0;
          const isSelected = category === selectedCategory;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${isSelected
                  ? 'bg-[#FF7A1A] text-white'
                  : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {category} <span className="ml-1 opacity-75">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
