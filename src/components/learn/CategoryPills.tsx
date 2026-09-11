import React from 'react';
import {
  Layers,
  Car,
  Scale,
  Wrench,
  Leaf,
  AlertTriangle,
  TrafficCone,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '../../types';

export interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  categoryCounts?: Record<number, number>;
  totalQuestionsCount?: number;
}

const CATEGORY_ICONS: Record<number, LucideIcon> = {
  1: Car,
  2: Scale,
  3: Wrench,
  4: Leaf,
  5: AlertTriangle,
  6: TrafficCone,
};

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
        className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0 border ${
          selectedCategoryId === null
            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/25'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }`}
      >
        <Layers
          className={`w-4 h-4 transition-colors ${
            selectedCategoryId === null
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
          }`}
        />
        <span>All Questions</span>
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
            selectedCategoryId === null
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {total}
        </span>
      </button>

      {/* 6 Official Category Pills */}
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.id] || Layers;
        const isSelected = selectedCategoryId === category.id;
        const count = categoryCounts?.[category.id] ?? category.poolCount;

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(category.id)}
            className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0 border ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                isSelected
                  ? 'text-white'
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
              }`}
            />
            <span>{category.name}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
