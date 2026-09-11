import React from 'react';
import type { Category } from '../../types';

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
      className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
    >
      {/* "All Questions" Pill */}
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategoryId === null}
        onClick={() => onSelectCategory(null)}
        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all shrink-0 border ${
          selectedCategoryId === null
            ? 'bg-crimson-600 border-crimson-600 text-white font-semibold shadow-2xs'
            : 'bg-white dark:bg-[#0c1424] border-zinc-200/80 dark:border-navy-900 text-zinc-600 dark:text-zinc-400 hover:border-crimson-200 dark:hover:border-navy-700 hover:text-zinc-950 dark:hover:text-zinc-200'
        }`}
      >
        <span>All Questions</span>
        <span
          className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
            selectedCategoryId === null
              ? 'bg-crimson-700 text-white'
              : 'bg-zinc-100 dark:bg-navy-900 text-zinc-500 dark:text-zinc-400'
          }`}
        >
          {total}
        </span>
      </button>

      {/* 6 Official Category Pills */}
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        const count = categoryCounts?.[category.id] ?? category.poolCount;

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(category.id)}
            className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all shrink-0 border ${
              isSelected
                ? 'bg-navy-700 border-navy-700 text-white font-semibold shadow-2xs'
                : 'bg-white dark:bg-[#0c1424] border-zinc-200/80 dark:border-navy-900 text-zinc-600 dark:text-zinc-400 hover:border-navy-500/40 dark:hover:border-navy-700 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            <span className="font-mono text-[11px] opacity-60">0{category.id}</span>
            <span>{category.name}</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                isSelected
                  ? 'bg-navy-800 text-white'
                  : 'bg-zinc-100 dark:bg-navy-900 text-zinc-500 dark:text-zinc-400'
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
