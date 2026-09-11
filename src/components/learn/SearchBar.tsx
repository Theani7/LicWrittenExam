import React from 'react';
import { Search, X, Bookmark, TrafficCone, Image as ImageIcon, Layers } from 'lucide-react';

export type QuickFilter = 'all' | 'bookmarked' | 'signs' | 'images';

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: QuickFilter;
  onFilterChange: (filter: QuickFilter) => void;
  bookmarkedCount?: number;
  signsCount?: number;
  imagesCount?: number;
  totalCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  bookmarkedCount = 0,
  signsCount = 0,
  imagesCount = 0,
  totalCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search questions by text or number (e.g. 'speed', 'sign', 'Q12')..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium mr-1 text-xs shrink-0">
          Filter:
        </span>

        {/* All Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 border ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All</span>
          {typeof totalCount === 'number' && (
            <span
              className={`px-1 py-0.2 rounded text-[11px] ${
                activeFilter === 'all'
                  ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {totalCount}
            </span>
          )}
        </button>

        {/* Bookmarked Only Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('bookmarked')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 border ${
            activeFilter === 'bookmarked'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Bookmarked</span>
          <span
            className={`px-1 py-0.2 rounded text-[11px] font-semibold ${
              activeFilter === 'bookmarked'
                ? 'bg-white/25 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {bookmarkedCount}
          </span>
        </button>

        {/* Traffic Signs Only Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('signs')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 border ${
            activeFilter === 'signs'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <TrafficCone className="w-3.5 h-3.5" />
          <span>Traffic Signs</span>
          {signsCount > 0 && (
            <span
              className={`px-1 py-0.2 rounded text-[11px] font-semibold ${
                activeFilter === 'signs'
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {signsCount}
            </span>
          )}
        </button>

        {/* With Images Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('images')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 border ${
            activeFilter === 'images'
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>With Images</span>
          {imagesCount > 0 && (
            <span
              className={`px-1 py-0.2 rounded text-[11px] font-semibold ${
                activeFilter === 'images'
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {imagesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
