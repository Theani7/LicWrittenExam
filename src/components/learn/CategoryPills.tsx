import React from 'react';
import type { Category } from '../../types';
import { getCategoryTheme } from '../../utils/categoryColors';

export interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  categoryCounts?: Record<number, number>;
  totalQuestionsCount?: number;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
  totalQuestionsCount,
}) => {
  const total =
    totalQuestionsCount ??
    categories.reduce((acc, cat) => acc + (categoryCounts?.[cat.id] ?? cat.poolCount), 0);

  return (
    <div
      role="tablist"
      aria-label="Category filters"
      className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
    >
      {/* "All Questions" Pill */}
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategoryId === null}
        onClick={() => onSelectCategory(null)}
        className={`group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 border ${
          selectedCategoryId === null
            ? 'bg-crimson-600 border-crimson-600 text-white shadow-md shadow-crimson-600/25'
            : 'bg-white dark:bg-[#0c1424] border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 hover:border-crimson-400 hover:bg-crimson-50/50 dark:hover:bg-crimson-950/20'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-crimson-500 ring-2 ring-crimson-300 dark:ring-crimson-800" />
        <span>All Questions</span>
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
            selectedCategoryId === null
              ? 'bg-crimson-700 text-white'
              : 'bg-zinc-100 dark:bg-navy-900 text-zinc-600 dark:text-zinc-400'
          }`}
        >
          {total}
        </span>
      </button>

      {/* 6 Official Category Pills */}
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        const count = categoryCounts?.[category.id] ?? category.poolCount;
        const theme = getCategoryTheme(category.id);

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(category.id)}
            className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 border ${
              isSelected
                ? theme.pillActive
                : `${theme.pillBg} ${theme.pillBorder} ${theme.pillText}`
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${theme.dotBg} ${
                isSelected ? 'ring-2 ring-white/60' : ''
              }`}
            />
            <span className="font-mono text-xs opacity-75">0{category.id}</span>
            <span>{category.name}</span>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                isSelected ? theme.countActive : theme.countInactive
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
