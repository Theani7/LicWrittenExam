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
      className="no-scrollbar app-scroll -mx-3 flex snap-x items-center gap-2 overflow-x-auto px-3 pb-1.5 pt-1 sm:-mx-1 sm:px-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategoryId === null}
        onClick={() => onSelectCategory(null)}
        className={`group inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-[13px] font-bold transition-all active:scale-[0.97] ${
          selectedCategoryId === null
            ? 'border-transparent bg-zinc-900 text-white shadow-card-hover dark:bg-white dark:text-zinc-900'
            : 'border-zinc-200 bg-white text-zinc-700 shadow-card dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
        }`}
      >
        <span className={`flex h-2 w-2 shrink-0 rounded-full ${selectedCategoryId === null ? 'bg-crimson-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
        <span>All Questions</span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
            selectedCategoryId === null
              ? 'bg-white/20 text-white dark:bg-zinc-900/10 dark:text-zinc-900'
              : 'bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300'
          }`}
        >
          {total}
        </span>
      </button>

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
            className={`inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-[13px] font-bold transition-all active:scale-[0.97] ${
              isSelected
                ? `${theme.pillActive} border-transparent`
                : `bg-white shadow-card dark:bg-white/5 ${theme.pillBorder} ${theme.pillText} ${theme.pillBg}`
            }`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${theme.dotBg} ${isSelected ? 'ring-2 ring-white/50' : ''}`} />
            <span className="font-mono text-[11px] opacity-70">0{category.id}</span>
            <span className="max-w-[140px] truncate xs:max-w-[180px] sm:max-w-none">{category.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
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
