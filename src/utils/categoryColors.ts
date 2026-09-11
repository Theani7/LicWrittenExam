export interface CategoryTheme {
  id: number;
  name: string;
  dotBg: string;
  badge: string;
  pillBorder: string;
  pillBg: string;
  pillText: string;
  pillActive: string;
  countInactive: string;
  countActive: string;
  accentBar: string;
}

export const CATEGORY_THEMES: Record<number, CategoryTheme> = {
  1: {
    id: 1,
    name: 'Vehicle Operation',
    dotBg: 'bg-blue-500',
    badge: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    pillBorder: 'border-blue-200 dark:border-blue-900/60',
    pillBg: 'bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/40',
    pillText: 'text-blue-800 dark:text-blue-200',
    pillActive: 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25',
    countInactive: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200',
    countActive: 'bg-blue-700 text-white',
    accentBar: 'from-blue-600 to-indigo-600',
  },
  2: {
    id: 2,
    name: 'Vehicle Laws',
    dotBg: 'bg-crimson-500',
    badge: 'bg-crimson-50 dark:bg-crimson-950/70 text-crimson-700 dark:text-crimson-300 border-crimson-200 dark:border-crimson-800',
    pillBorder: 'border-rose-200 dark:border-crimson-900/60',
    pillBg: 'bg-crimson-50/60 dark:bg-crimson-950/30 hover:bg-crimson-100/70 dark:hover:bg-crimson-900/40',
    pillText: 'text-crimson-800 dark:text-crimson-200',
    pillActive: 'bg-crimson-600 border-crimson-600 text-white shadow-md shadow-crimson-500/25',
    countInactive: 'bg-crimson-100 dark:bg-crimson-900/50 text-crimson-700 dark:text-crimson-200',
    countActive: 'bg-crimson-700 text-white',
    accentBar: 'from-crimson-600 to-rose-600',
  },
  3: {
    id: 3,
    name: 'Technical & Mechanical',
    dotBg: 'bg-emerald-500',
    badge: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    pillBorder: 'border-emerald-200 dark:border-emerald-900/60',
    pillBg: 'bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40',
    pillText: 'text-emerald-800 dark:text-emerald-200',
    pillActive: 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/25',
    countInactive: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-200',
    countActive: 'bg-emerald-700 text-white',
    accentBar: 'from-emerald-500 to-teal-600',
  },
  4: {
    id: 4,
    name: 'Environmental Pollution',
    dotBg: 'bg-amber-500',
    badge: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    pillBorder: 'border-amber-200 dark:border-amber-900/60',
    pillBg: 'bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40',
    pillText: 'text-amber-900 dark:text-amber-200',
    pillActive: 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-500/25',
    countInactive: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200',
    countActive: 'bg-amber-700 text-white',
    accentBar: 'from-amber-500 to-yellow-500',
  },
  5: {
    id: 5,
    name: 'Accident Awareness',
    dotBg: 'bg-purple-500',
    badge: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    pillBorder: 'border-purple-200 dark:border-purple-900/60',
    pillBg: 'bg-purple-50/60 dark:bg-purple-950/30 hover:bg-purple-100/70 dark:hover:bg-purple-900/40',
    pillText: 'text-purple-800 dark:text-purple-200',
    pillActive: 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/25',
    countInactive: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200',
    countActive: 'bg-purple-700 text-white',
    accentBar: 'from-purple-600 to-indigo-600',
  },
  6: {
    id: 6,
    name: 'Traffic Signs',
    dotBg: 'bg-cyan-500',
    badge: 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    pillBorder: 'border-cyan-200 dark:border-cyan-900/60',
    pillBg: 'bg-cyan-50/60 dark:bg-cyan-950/30 hover:bg-cyan-100/70 dark:hover:bg-cyan-900/40',
    pillText: 'text-cyan-900 dark:text-cyan-200',
    pillActive: 'bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-500/25',
    countInactive: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200',
    countActive: 'bg-cyan-700 text-white',
    accentBar: 'from-cyan-500 to-blue-600',
  },
};

export const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  id: 0,
  name: 'General',
  dotBg: 'bg-navy-600',
  badge: 'bg-navy-50 dark:bg-navy-950/70 text-navy-700 dark:text-navy-300 border-navy-200 dark:border-navy-800',
  pillBorder: 'border-zinc-200 dark:border-navy-900',
  pillBg: 'bg-white dark:bg-[#0c1424] hover:bg-zinc-50 dark:hover:bg-navy-900',
  pillText: 'text-zinc-700 dark:text-zinc-300',
  pillActive: 'bg-navy-700 border-navy-700 text-white shadow-md shadow-navy-700/25',
  countInactive: 'bg-zinc-100 dark:bg-navy-900 text-zinc-600 dark:text-zinc-400',
  countActive: 'bg-navy-800 text-white',
  accentBar: 'from-navy-700 to-blue-600',
};

export function getCategoryTheme(categoryId?: number | null): CategoryTheme {
  if (!categoryId) return DEFAULT_CATEGORY_THEME;
  return CATEGORY_THEMES[categoryId] || DEFAULT_CATEGORY_THEME;
}
