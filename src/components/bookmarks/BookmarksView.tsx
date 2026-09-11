import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Play,
  Trash2,
  Search,
  X,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import type { Question, Category } from '../../types';
import { useBookmarks } from '../../hooks/useBookmarks';
import { QuestionCard } from '../learn/QuestionCard';

export interface BookmarksViewProps {
  questions?: Question[];
  categories?: Category[];
  bookmarks?: number[];
  onToggleBookmark?: (id: number) => void;
  onClearBookmarks?: () => void;
  onPracticeBookmarks?: (bookmarkedQuestions: Question[]) => void;
  onExploreQuestions?: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  questions = [],
  categories = [],
  bookmarks: propBookmarks,
  onToggleBookmark: propToggleBookmark,
  onClearBookmarks: propClearBookmarks,
  onPracticeBookmarks,
  onExploreQuestions,
}) => {
  const hookBookmarks = useBookmarks();

  const bookmarks = propBookmarks ?? hookBookmarks.bookmarks;
  const toggleBookmark = propToggleBookmark ?? hookBookmarks.toggleBookmark;
  const clearBookmarks = propClearBookmarks ?? hookBookmarks.clearBookmarks;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  // Map category IDs to names
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categories]);

  // All bookmarked questions
  const bookmarkedQuestions = useMemo(() => {
    const bookmarkSet = new Set(bookmarks);
    return questions.filter((q) => bookmarkSet.has(q.id));
  }, [questions, bookmarks]);

  // Filtered by search query
  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookmarkedQuestions;

    return bookmarkedQuestions.filter((q) => {
      if (q.id.toString() === query) return true;
      if (q.question.toLowerCase().includes(query)) return true;
      return q.options.some((opt) => opt.text.toLowerCase().includes(query));
    });
  }, [bookmarkedQuestions, searchQuery]);

  const handleConfirmClear = () => {
    clearBookmarks();
    setShowClearModal(false);
  };

  const handlePractice = () => {
    if (onPracticeBookmarks && bookmarkedQuestions.length > 0) {
      onPracticeBookmarks(bookmarkedQuestions);
    }
  };

  // Empty state: no bookmarks saved
  if (bookmarks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-8 sm:p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded bg-crimson-50 dark:bg-crimson-950/40 text-crimson-600 dark:text-crimson-400 flex items-center justify-center mx-auto mb-3 border border-crimson-200/60 dark:border-crimson-900/50">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">
            No Bookmarked Questions Yet
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-5 leading-relaxed">
            Bookmark tricky or important questions during your study sessions to drill and review them together anytime.
          </p>
          {onExploreQuestions && (
            <button
              type="button"
              onClick={onExploreQuestions}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-medium rounded shadow-2xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Questions in Learn Mode</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#0c1424] p-4 rounded-lg border border-zinc-200 dark:border-navy-900 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              Bookmarked Questions
            </h1>
            <span
              data-testid="bookmarks-count-badge"
              className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-crimson-50 dark:bg-crimson-950 text-crimson-700 dark:text-crimson-300 border border-crimson-200 dark:border-crimson-900"
            >
              {bookmarkedQuestions.length} saved
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Review questions you saved for targeted revision before test day.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePractice}
            disabled={bookmarkedQuestions.length === 0}
            data-testid="practice-bookmarks-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-700 hover:bg-navy-800 disabled:opacity-50 text-white text-xs font-medium rounded shadow-2xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Practice Bookmarks</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            disabled={bookmarkedQuestions.length === 0}
            data-testid="clear-all-bookmarks-btn"
            title="Clear all bookmarks"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-50 dark:bg-navy-950 hover:bg-crimson-50 dark:hover:bg-crimson-950/40 text-zinc-600 dark:text-zinc-400 hover:text-crimson-600 border border-zinc-200 dark:border-navy-900 text-xs font-medium rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search within bookmarked questions..."
          className="w-full pl-9 pr-9 py-2 bg-white dark:bg-[#0c1424] border border-zinc-200 dark:border-navy-900 rounded-md text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-navy-700 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search results summary when filtering */}
      {searchQuery && (
        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 dark:text-zinc-400 px-1">
          <span>
            Found {filteredQuestions.length} of {bookmarkedQuestions.length} bookmarks
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-crimson-600 dark:text-crimson-400 hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* List of bookmarked questions */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-3">
          {filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              categoryName={categoryMap.get(q.categoryId)}
              isBookmarked={true}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-8 text-center shadow-2xs">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
            No bookmarked questions match your search &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="font-mono text-xs text-crimson-600 dark:text-crimson-400 hover:underline"
          >
            Clear search filter
          </button>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowClearModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-[#0c1424] border border-zinc-200 dark:border-navy-900 rounded-lg max-w-sm w-full p-5 shadow-xl space-y-3">
            <div className="w-8 h-8 rounded bg-crimson-100 dark:bg-crimson-950/60 text-crimson-600 flex items-center justify-center font-mono">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="clear-modal-title"
                className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight"
              >
                Clear All Bookmarks?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Remove all {bookmarkedQuestions.length} saved bookmarks? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-3 py-1.5 rounded border border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                data-testid="confirm-clear-bookmarks"
                className="px-3 py-1.5 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-medium rounded transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
