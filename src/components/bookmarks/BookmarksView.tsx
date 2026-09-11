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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-900/50">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No Bookmarked Questions Yet
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            Bookmark tricky or important questions during your study or practice tests to review and practice them together anytime.
          </p>
          {onExploreQuestions && (
            <button
              type="button"
              onClick={onExploreQuestions}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Questions in Learn Mode</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Bookmarked Questions
            </h1>
            <span
              data-testid="bookmarks-count-badge"
              className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            >
              {bookmarkedQuestions.length} saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review questions you saved for focused revision before your official test.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={handlePractice}
            disabled={bookmarkedQuestions.length === 0}
            data-testid="practice-bookmarks-btn"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice Bookmarks</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            data-testid="clear-all-bookmarks-btn"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium rounded-xl transition-colors"
            title="Clear all bookmarks"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search within bookmarked questions (e.g. helmet, speed, question #)..."
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search results summary when filtering */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Found {filteredQuestions.length} of {bookmarkedQuestions.length} bookmarks
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* List of bookmarked questions */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            No bookmarked questions match your search &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowClearModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3
                id="clear-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Clear All Bookmarks?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Are you sure you want to remove all {bookmarkedQuestions.length} saved bookmarks?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                data-testid="confirm-clear-bookmarks"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
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
