import React, { useState, useMemo, useCallback } from 'react';
import {
  List,
  Layers,
  Search,
  Bookmark,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { Question, Category, OptionKey } from '../../types';
import { useQuestions } from '../../hooks/useQuestions';
import { useBookmarks } from '../../hooks/useBookmarks';
import CategoryPills from './CategoryPills';
import SearchBar, { type QuickFilter } from './SearchBar';
import QuestionCard from './QuestionCard';
import FlashcardView from './FlashcardView';

export type StudyMode = 'list' | 'flashcard';

export interface LearnViewProps {
  questions?: Question[];
  categories?: Category[];
}

const PAGE_SIZE = 25;

export const LearnView: React.FC<LearnViewProps> = ({
  questions: propQuestions,
  categories: propCategories,
}) => {
  const hookData = useQuestions({ enabled: !propQuestions });
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const questions = propQuestions ?? hookData.questions;
  const categories = propCategories ?? hookData.categories;
  const loading = propQuestions ? false : hookData.loading;
  const error = propQuestions ? null : hookData.error;

  // View state
  const [studyMode, setStudyMode] = useState<StudyMode>('list');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Session answer tracker for study session stats
  const [sessionAnswers, setSessionAnswers] = useState<
    Record<number, { selected: OptionKey; correct: boolean }>
  >({});

  const handleAnswerSelected = useCallback(
    (questionId: number, optionKey: OptionKey, isCorrect: boolean) => {
      setSessionAnswers((prev) => ({
        ...prev,
        [questionId]: { selected: optionKey, correct: isCorrect },
      }));
    },
    []
  );

  // Category mapping for quick lookups
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Category questions counts
  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    categories.forEach((c) => (counts[c.id] = 0));
    questions.forEach((q) => {
      counts[q.categoryId] = (counts[q.categoryId] || 0) + 1;
    });
    return counts;
  }, [categories, questions]);

  // Quick filter counts
  const quickFilterCounts = useMemo(() => {
    let signs = 0;
    let images = 0;
    let bookmarked = 0;

    questions.forEach((q) => {
      if (q.categoryId === 6 || q.image) signs++;
      if (q.image) images++;
      if (isBookmarked(q.id)) bookmarked++;
    });

    return { signs, images, bookmarked };
  }, [questions, isBookmarked]);

  // Filter questions according to Category, Quick Filter, and Search Query
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Category filter
      if (selectedCategoryId !== null && q.categoryId !== selectedCategoryId) {
        return false;
      }

      // 2. Quick filter
      if (activeFilter === 'bookmarked' && !isBookmarked(q.id)) {
        return false;
      }
      if (activeFilter === 'signs' && q.categoryId !== 6 && !q.image) {
        return false;
      }
      if (activeFilter === 'images' && !q.image) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();

        // Check ID matches (e.g. "12", "Q12", "Q 12")
        const idQuery = query.replace(/^q\s*/i, '');
        if (idQuery && q.id.toString() === idQuery) {
          return true;
        }

        // Check question text
        if (q.question.toLowerCase().includes(query)) {
          return true;
        }

        // Check options text
        const optionMatch = q.options.some((opt) =>
          opt.text.toLowerCase().includes(query)
        );
        if (optionMatch) {
          return true;
        }

        return false;
      }

      return true;
    });
  }, [questions, selectedCategoryId, activeFilter, searchQuery, isBookmarked]);

  // Reset to page 1 whenever filters change
  const handleSelectCategory = useCallback((catId: number | null) => {
    setSelectedCategoryId(catId);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((filter: QuickFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setSearchQuery('');
    setActiveFilter('all');
    setCurrentPage(1);
  }, []);

  // Pagination for List View
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedQuestions = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, safeCurrentPage]);

  // Answered stats calculation
  const totalAnsweredCount = Object.keys(sessionAnswers).length;
  const correctCount = Object.values(sessionAnswers).filter((a) => a.correct).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading questions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-base font-semibold text-red-800 dark:text-red-300">
          Failed to load study questions
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar: Title, Stats, and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Learn Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Study official Nepal Category A &amp; K questions by category, search, or flashcard drill.
          </p>
        </div>

        {/* List vs Flashcard Mode Toggle */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStudyMode('list')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              studyMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            type="button"
            onClick={() => setStudyMode('flashcard')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              studyMode === 'flashcard'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryPills
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
        totalQuestionsCount={questions.length}
      />

      {/* Search and Quick Filters */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        bookmarkedCount={quickFilterCounts.bookmarked}
        signsCount={quickFilterCounts.signs}
        imagesCount={quickFilterCounts.images}
        totalCount={questions.length}
      />

      {/* Stats Summary Bar */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex-wrap">
        <div className="flex items-center gap-3">
          <span>
            Matched:{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {filteredQuestions.length}
            </strong>{' '}
            of {questions.length}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {bookmarks.length}
            </strong>{' '}
            saved
          </span>
        </div>

        {totalAnsweredCount > 0 && (
          <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>
              Session:{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {totalAnsweredCount}
              </strong>{' '}
              answered ({correctCount} correct)
            </span>
          </div>
        )}
      </div>

      {/* View Content: List View vs Flashcard View */}
      {studyMode === 'flashcard' ? (
        <FlashcardView
          questions={filteredQuestions}
          categories={categories}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
        />
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No questions match your search
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try clearing your search term or selecting another category filter.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <>
              {/* Question Cards List */}
              <div className="space-y-4">
                {paginatedQuestions.map((q) => (
                  <QuestionCard
                    key={`q-${q.id}`}
                    question={q}
                    categoryName={categoryMap.get(q.categoryId)}
                    isBookmarked={isBookmarked(q.id)}
                    onToggleBookmark={toggleBookmark}
                    onAnswerSelected={handleAnswerSelected}
                  />
                ))}
              </div>

              {/* Clean Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(safeCurrentPage * PAGE_SIZE, filteredQuestions.length)} of{' '}
                    {filteredQuestions.length} questions
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                        let pageNum = idx + 1;
                        if (totalPages > 5) {
                          if (safeCurrentPage > 3) {
                            pageNum = safeCurrentPage - 3 + idx;
                            if (pageNum + (4 - idx) > totalPages) {
                              pageNum = totalPages - 4 + idx;
                            }
                          }
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                              safeCurrentPage === pageNum
                                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/25'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Next page"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnView;
