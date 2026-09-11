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
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          Loading question pool...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-crimson-50 dark:bg-crimson-950/30 border border-crimson-200 dark:border-crimson-900/60 rounded-lg text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-crimson-600 mx-auto" />
        <h3 className="text-sm font-semibold text-crimson-900 dark:text-crimson-200">
          Failed to load study questions
        </h3>
        <p className="text-xs text-crimson-700 dark:text-crimson-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* Top Bar: Title, Stats, and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-navy-900/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Learn Mode
            </h2>
            <span className="font-mono text-xs font-bold text-crimson-700 dark:text-crimson-400 bg-crimson-50 dark:bg-crimson-950/70 px-2 py-0.5 rounded border border-crimson-200 dark:border-crimson-900">
              500 POOL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            Official Nepal Department of Transport Management (DoTM) examination question bank.
          </p>
        </div>

        {/* List vs Flashcard Mode Toggle */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-navy-950 rounded-lg border border-zinc-200 dark:border-navy-900 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStudyMode('list')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
              studyMode === 'list'
                ? 'bg-white dark:bg-navy-900 text-zinc-950 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            type="button"
            onClick={() => setStudyMode('flashcard')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
              studyMode === 'flashcard'
                ? 'bg-white dark:bg-navy-900 text-zinc-950 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
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
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 bg-white dark:bg-[#0c1424] px-4 py-3 rounded-xl border border-zinc-200 dark:border-navy-900 flex-wrap shadow-xs">
        <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>
              MATCHED: <strong className="font-extrabold text-blue-900 dark:text-blue-100">{filteredQuestions.length}</strong> / {questions.length}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-crimson-50 dark:bg-crimson-950/60 text-crimson-700 dark:text-crimson-300 border border-crimson-200 dark:border-crimson-900/60 font-semibold">
            <Bookmark className="w-3.5 h-3.5 text-crimson-600 fill-current" />
            <span>
              <strong className="font-extrabold text-crimson-900 dark:text-crimson-100">{bookmarks.length}</strong> SAVED
            </span>
          </span>
        </div>

        {totalAnsweredCount > 0 && (
          <div className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              SESSION: {totalAnsweredCount} ATTEMPTS ({correctCount} CORRECT)
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
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  No questions match your search
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Try clearing your search term or selecting another category.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-navy-700 text-white text-xs font-medium hover:bg-navy-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <>
              {/* Question Cards List */}
              <div className="space-y-3">
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-navy-900/80">
                  <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(safeCurrentPage * PAGE_SIZE, filteredQuestions.length)} of{' '}
                    {filteredQuestions.length}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-navy-900 bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-navy-900 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 font-mono text-xs">
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
                            className={`w-7 h-7 rounded-md text-xs transition-all ${
                              safeCurrentPage === pageNum
                                ? 'bg-crimson-600 text-white font-semibold shadow-2xs'
                                : 'bg-white dark:bg-[#0c1424] border border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-navy-900'
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-navy-900 bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-navy-900 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
