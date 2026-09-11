import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Play,
  Trash2,
  Search,
  X,
  BookOpen,
  AlertTriangle,
  Sparkles,
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

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  const bookmarkedQuestions = useMemo(() => {
    const set = new Set(bookmarks);
    return questions.filter((q) => set.has(q.id));
  }, [questions, bookmarks]);

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookmarkedQuestions;
    return bookmarkedQuestions.filter((q) => {
      if (q.id.toString() === query) return true;
      if (q.question.toLowerCase().includes(query)) return true;
      return q.options.some((opt) => opt.text.toLowerCase().includes(query));
    });
  }, [bookmarkedQuestions, searchQuery]);

  const handlePractice = () => {
    if (onPracticeBookmarks && bookmarkedQuestions.length > 0) onPracticeBookmarks(bookmarkedQuestions);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="card-premium relative overflow-hidden p-10 text-center sm:p-12">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-crimson-600 via-amber-400 to-navy-700" />
          <div className="bg-dot-grid-faint absolute inset-0 opacity-60" />
          <div className="relative space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-crimson-600 to-rose-500 text-white shadow-glow-crimson">
              <Bookmark className="h-7 w-7 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">No Bookmarked Questions Yet</h2>
              <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-zinc-500">
                Bookmark tricky or important questions during your study sessions to drill and review them together anytime.
              </p>
            </div>
            {onExploreQuestions && (
              <button type="button" onClick={onExploreQuestions} className="btn-primary">
                <BookOpen className="h-4 w-4" /> Explore Questions in Learn Mode
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 pb-12 sm:px-6">
      <section className="card-premium relative mt-6 overflow-hidden p-6 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-navy-800 via-crimson-600 to-amber-400" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight">Bookmarked Questions</h1>
              <span data-testid="bookmarks-count-badge" className="inline-flex items-center gap-1 rounded-full bg-crimson-600 px-3 py-1 font-mono text-[12px] font-bold text-white shadow-glow-crimson">
                <Sparkles className="h-3 w-3" /> {bookmarkedQuestions.length} saved
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">Your personal hit-list for the final revision sprint.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePractice} disabled={bookmarkedQuestions.length === 0} data-testid="practice-bookmarks-btn" className="btn-navy flex-1 sm:flex-none disabled:opacity-50">
              <Play className="h-4 w-4 fill-current" /> Practice all
            </button>
            <button type="button" onClick={() => setShowClearModal(true)} disabled={bookmarkedQuestions.length === 0} data-testid="clear-all-bookmarks-btn" title="Clear all bookmarks"
              className="btn-ghost !px-3.5">
              <Trash2 className="h-4 w-4" /><span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </section>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search within bookmarked questions..."
          className="input-premium !pl-11 !pr-11 !py-3.5"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/10">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="flex items-center justify-between px-1 font-mono text-[12px] font-bold text-zinc-500">
          <span>
            Found {filteredQuestions.length} of {bookmarkedQuestions.length} bookmarks
          </span>
          <button type="button" onClick={() => setSearchQuery('')} className="text-crimson-600 hover:underline">CLEAR</button>
        </div>
      )}

      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} categoryName={categoryMap.get(q.categoryId)} isBookmarked={true} onToggleBookmark={toggleBookmark} />
          ))}
        </div>
      ) : (
        <div className="card-premium p-10 text-center">
          <p className="text-sm text-zinc-500">No bookmarked questions match your search &quot;{searchQuery}&quot;.</p>
          <button type="button" onClick={() => setSearchQuery('')} className="mt-2 font-mono text-[12px] font-bold text-crimson-600 hover:underline">Clear search filter</button>
        </div>
      )}

      {showClearModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="clear-modal-title" className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setShowClearModal(false); }}>
          <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-float dark:border-white/10 dark:bg-ink-900 animate-scale-in">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-50 text-crimson-600 ring-1 ring-crimson-200 dark:bg-crimson-950/40"><AlertTriangle className="h-5 w-5" /></span>
            <h3 id="clear-modal-title" className="mt-3 font-extrabold tracking-tight">Clear All Bookmarks?</h3>
            <p className="mt-1 text-sm text-zinc-500">Remove all {bookmarkedQuestions.length} saved bookmarks? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowClearModal(false)} className="btn-ghost">Cancel</button>
              <button type="button" onClick={() => { clearBookmarks(); setShowClearModal(false); }} data-testid="confirm-clear-bookmarks" className="rounded-xl bg-crimson-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-crimson-700">Yes, clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
