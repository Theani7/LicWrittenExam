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
    <div className="space-y-2.5">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          <Search className="w-5 h-5 text-navy-700 dark:text-navy-300" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search questions by keyword, topic or number (e.g., 'speed', 'sign', 'Q12')..."
          className="w-full pl-11 pr-10 py-3 rounded-lg border border-zinc-300 dark:border-navy-800 bg-white dark:bg-[#0c1424] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-navy-600 dark:focus:ring-crimson-600 focus:border-transparent transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
        {/* All Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
            activeFilter === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-2xs'
              : 'bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-900 hover:bg-zinc-50 dark:hover:bg-navy-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All</span>
          {typeof totalCount === 'number' && (
            <span
              className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${
                activeFilter === 'all'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-navy-900 text-zinc-600 dark:text-zinc-400'
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
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
            activeFilter === 'bookmarked'
              ? 'bg-crimson-600 text-white border-crimson-600 shadow-2xs'
              : 'bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-900 hover:bg-zinc-50 dark:hover:bg-navy-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Bookmarked</span>
          {bookmarkedCount > 0 && (
            <span
              className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${
                activeFilter === 'bookmarked'
                  ? 'bg-crimson-700 text-white'
                  : 'bg-crimson-100 dark:bg-crimson-950 text-crimson-700 dark:text-crimson-300'
              }`}
            >
              {bookmarkedCount}
            </span>
          )}
        </button>

        {/* Traffic Signs Only Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('signs')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
            activeFilter === 'signs'
              ? 'bg-navy-700 text-white border-navy-700 shadow-2xs'
              : 'bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-900 hover:bg-zinc-50 dark:hover:bg-navy-900'
          }`}
        >
          <TrafficCone className="w-3.5 h-3.5" />
          <span>Traffic Signs</span>
          {signsCount > 0 && (
            <span
              className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${
                activeFilter === 'signs'
                  ? 'bg-navy-800 text-white'
                  : 'bg-zinc-100 dark:bg-navy-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {signsCount}
            </span>
          )}
        </button>

        {/* With Images / Diagrams Chip */}
        <button
          type="button"
          onClick={() => onFilterChange('images')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
            activeFilter === 'images'
              ? 'bg-navy-700 text-white border-navy-700 shadow-2xs'
              : 'bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-900 hover:bg-zinc-50 dark:hover:bg-navy-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Diagrams</span>
          {imagesCount > 0 && (
            <span
              className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${
                activeFilter === 'images'
                  ? 'bg-navy-800 text-white'
                  : 'bg-zinc-100 dark:bg-navy-900 text-zinc-600 dark:text-zinc-400'
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
