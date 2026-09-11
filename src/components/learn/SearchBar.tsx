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
  const chips: { id: QuickFilter; label: string; icon: React.FC<{ className?: string }>; count?: number; activeClass: string }[] = [
    { id: 'all', label: 'All', icon: Layers, count: totalCount, activeClass: 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white' },
    { id: 'bookmarked', label: 'Bookmarked', icon: Bookmark, count: bookmarkedCount, activeClass: 'bg-crimson-600 text-white border-crimson-600 shadow-glow-crimson' },
    { id: 'signs', label: 'Traffic Signs', icon: TrafficCone, count: signsCount, activeClass: 'bg-navy-700 text-white border-navy-700 shadow-glow-navy' },
    { id: 'images', label: 'Diagrams', icon: ImageIcon, count: imagesCount, activeClass: 'bg-navy-700 text-white border-navy-700 shadow-glow-navy' },
  ];

  return (
    <div className="space-y-2.5 sm:space-y-3">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 transition-colors group-focus-within:bg-crimson-600 group-focus-within:text-white dark:bg-white/10">
            <Search className="h-4 w-4" />
          </span>
        </div>
        <input
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search questions, topics, Q12…"
          aria-label="Search questions"
          className="min-h-[52px] w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-[60px] pr-11 text-base font-medium text-zinc-900 shadow-card outline-none transition-all placeholder:text-zinc-400 focus:border-crimson-500 focus:ring-4 focus:ring-crimson-600/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500 sm:pl-[68px] sm:pr-12 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-2.5 flex items-center gap-2">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition active:scale-95 dark:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[10px] font-bold text-zinc-400 sm:block dark:border-white/10 dark:bg-white/5">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      <div className="no-scrollbar app-scroll -mx-3 flex snap-x items-center gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
        {chips.map((chip) => {
          const Icon = chip.icon;
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onFilterChange(chip.id)}
              aria-pressed={isActive}
              className={`inline-flex min-h-[40px] shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-all active:scale-[0.97] ${
                isActive
                  ? chip.activeClass
                  : 'border-zinc-200 bg-white text-zinc-600 shadow-card dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{chip.label}</span>
              {!!chip.count && (
                <span
                  className={`rounded-full px-1.5 py-px font-mono text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white dark:bg-black/10' : 'bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300'
                  }`}
                >
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
