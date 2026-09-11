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
  BookOpenCheck,
  Timer,
  Trophy,
  ArrowRight,
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

  const [studyMode, setStudyMode] = useState<StudyMode>('list');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    categories.forEach((c) => (counts[c.id] = 0));
    questions.forEach((q) => {
      counts[q.categoryId] = (counts[q.categoryId] || 0) + 1;
    });
    return counts;
  }, [categories, questions]);

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

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedCategoryId !== null && q.categoryId !== selectedCategoryId) return false;
      if (activeFilter === 'bookmarked' && !isBookmarked(q.id)) return false;
      if (activeFilter === 'signs' && q.categoryId !== 6 && !q.image) return false;
      if (activeFilter === 'images' && !q.image) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idQuery = query.replace(/^q\s*/i, '');
        if (idQuery && q.id.toString() === idQuery) return true;
        if (q.question.toLowerCase().includes(query)) return true;
        const optionMatch = q.options.some((opt) => opt.text.toLowerCase().includes(query));
        if (optionMatch) return true;
        return false;
      }
      return true;
    });
  }, [questions, selectedCategoryId, activeFilter, searchQuery, isBookmarked]);

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

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedQuestions = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, safeCurrentPage]);

  const totalAnsweredCount = Object.keys(sessionAnswers).length;
  const correctCount = Object.values(sessionAnswers).filter((a) => a.correct).length;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-premium shimmer h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <div className="card-premium p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-crimson-600" />
          <h3 className="mt-3 font-extrabold">Failed to load study questions</h3>
          <p className="mt-1 text-sm text-zinc-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 pb-4 sm:px-6 sm:pb-12">
      {/* Hero */}
      <section className="relative mt-3 overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-card dark:border-white/10 dark:bg-ink-900 sm:mt-6 sm:rounded-[28px]">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-crimson-600/[0.07] via-transparent to-navy-700/[0.08] dark:from-crimson-600/15 dark:to-blue-600/15" />
          <div className="bg-dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(40rem_16rem_at_20%_0%,black,transparent)]" />
        </div>
        <div className="relative grid gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="chip border-crimson-200 bg-crimson-50 text-crimson-700 dark:border-crimson-900/60 dark:bg-crimson-950/40 dark:text-crimson-300">
                <BookOpenCheck className="h-3.5 w-3.5" /> Learn Mode
              </span>
              <span className="chip border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                OFFICIAL 500Q POOL
              </span>
              {totalAnsweredCount > 0 && (
                <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" /> {totalAnsweredCount} TRIED · {correctCount} CORRECT
                </span>
              )}
            </div>
            <div>
              <h1 className="text-balance text-[22px] font-extrabold leading-[1.15] tracking-tight xs:text-2xl sm:text-[34px] sm:leading-[1.1]">
                Master the DoTM bank, <span className="text-gradient-nepal">one question at a time.</span>
              </h1>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
                Study all 500 official questions across 6 syllabus categories. Tap any option for instant feedback, save tricky ones, or switch to flashcards for rapid recall.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-wrap sm:flex-row sm:items-center">
              <div className="grid grid-cols-2 gap-1 rounded-2xl border border-zinc-200 bg-zinc-100/70 p-1 dark:border-white/10 dark:bg-white/5 sm:inline-flex sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStudyMode('list')}
                  aria-pressed={studyMode === 'list'}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-all active:scale-[0.98] ${
                    studyMode === 'list'
                      ? 'bg-white text-zinc-900 shadow-card dark:bg-white/10 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <List className="h-4 w-4" /> List View
                </button>
                <button
                  type="button"
                  onClick={() => setStudyMode('flashcard')}
                  aria-pressed={studyMode === 'flashcard'}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold transition-all active:scale-[0.98] ${
                    studyMode === 'flashcard'
                      ? 'bg-white text-zinc-900 shadow-card dark:bg-white/10 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <Layers className="h-4 w-4" /> Flashcards
                </button>
              </div>
              <div className="flex items-center gap-4 px-1 font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> MATCHED: {filteredQuestions.length} / {questions.length}</span>
                <span className="hidden items-center gap-1.5 sm:flex"><Bookmark className="h-3 w-3 text-crimson-600" /> {bookmarks.length} SAVED</span>
              </div>
            </div>
          </div>

          {/* Hero stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: BookOpenCheck, value: '500', label: 'Questions', tint: 'from-crimson-600 to-rose-500' },
              { icon: Timer, value: '72s', label: 'Per Q in exam', tint: 'from-navy-700 to-blue-600' },
              { icon: Trophy, value: '60%', label: 'To pass', tint: 'from-amber-500 to-orange-500' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-200/80 bg-white/80 p-2.5 text-center shadow-card backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-3.5">
                <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-white sm:h-9 sm:w-9 ${s.tint}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="font-mono text-lg font-extrabold tracking-tight sm:text-xl">{s.value}</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 sm:text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mt-3 space-y-2.5 sm:mt-5 sm:space-y-3">
        <CategoryPills
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          categoryCounts={categoryCounts}
          totalQuestionsCount={questions.length}
        />
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
      </section>

      {/* Content */}
      <section className="mt-3 sm:mt-5">
        {studyMode === 'flashcard' ? (
          <FlashcardView
            questions={filteredQuestions}
            categories={categories}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="card-premium p-8 text-center sm:p-12">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-white/5">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold">No questions match your search</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
                  Try a different keyword, or clear the category and quick filters.
                </p>
                <button type="button" onClick={handleResetFilters} className="btn-navy mt-5 w-full sm:w-auto">
                  <RotateCcw className="h-4 w-4" /> Reset all filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 px-1 font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  <span className="truncate">SHOWING {(safeCurrentPage - 1) * PAGE_SIZE + 1}–{Math.min(safeCurrentPage * PAGE_SIZE, filteredQuestions.length)} OF {filteredQuestions.length}</span>
                  <span className="hidden shrink-0 sm:inline">PAGE {safeCurrentPage} / {totalPages}</span>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {paginatedQuestions.map((q, idx) => (
                    <div key={`q-${q.id}`} className="animate-fade-up" style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                      <QuestionCard
                        question={q}
                        categoryName={categoryMap.get(q.categoryId)}
                        isBookmarked={isBookmarked(q.id)}
                        onToggleBookmark={toggleBookmark}
                        onAnswerSelected={handleAnswerSelected}
                      />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="card-premium flex flex-col items-stretch justify-between gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
                    <span className="text-center font-mono text-[11px] font-bold text-zinc-500 sm:text-left">
                      PAGE {safeCurrentPage} OF {totalPages}
                    </span>
                    <div className="flex items-center justify-between gap-1.5 sm:justify-center">
                      <button
                        type="button"
                        disabled={safeCurrentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        aria-label="Previous page"
                        className="btn-ghost min-h-[48px] flex-1 !px-3 !py-2 text-[13px] disabled:opacity-40 sm:flex-none"
                      >
                        <ChevronLeft className="h-4 w-4" /> Prev
                      </button>
                      <div className="no-scrollbar flex max-w-[40vw] items-center gap-1 overflow-x-auto xs:max-w-none">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                          let pageNum = idx + 1;
                          if (totalPages > 5 && safeCurrentPage > 3) {
                            pageNum = safeCurrentPage - 3 + idx;
                            if (pageNum + (4 - idx) > totalPages) pageNum = totalPages - 4 + idx;
                          }
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              aria-current={safeCurrentPage === pageNum ? 'page' : undefined}
                              className={`h-11 w-11 shrink-0 rounded-xl font-mono text-[13px] font-bold transition active:scale-95 ${
                                safeCurrentPage === pageNum
                                  ? 'bg-crimson-600 text-white shadow-glow-crimson'
                                  : 'border border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
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
                        className="btn-ghost min-h-[48px] flex-1 !px-3 !py-2 text-[13px] disabled:opacity-40 sm:flex-none"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    {totalPages > 5 && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        className="min-h-[40px] font-mono text-[11px] font-bold text-crimson-600"
                      >
                        LAST <ArrowRight className="inline h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default LearnView;
