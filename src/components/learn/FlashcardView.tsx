import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Eye,
  EyeOff,
  HelpCircle,
} from 'lucide-react';
import type { Question, Category } from '../../types';
import QuestionCard from './QuestionCard';

export interface FlashcardViewProps {
  questions: Question[];
  categories?: Category[];
  isBookmarked: (id: number) => boolean;
  onToggleBookmark: (id: number) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  questions,
  categories = [],
  isBookmarked,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  // Category name lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Handle shuffling
  const displayQuestions = useMemo(() => {
    if (!isShuffled) return questions;
    const copy = [...questions];
    // Fisher-Yates shuffle with deterministic seeded shuffle or standard random
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [questions, isShuffled]);

  // Keep currentIndex in bounds when questions or shuffle changes
  useEffect(() => {
    if (currentIndex >= displayQuestions.length) {
      setCurrentIndex(Math.max(0, displayQuestions.length - 1));
    }
    setRevealed(false);
  }, [displayQuestions.length]);

  const currentQuestion = displayQuestions[currentIndex];

  const handleNext = useCallback(() => {
    if (displayQuestions.length === 0) return;
    setCurrentIndex((prev) => (prev + 1 < displayQuestions.length ? prev + 1 : 0));
    setRevealed(false);
  }, [displayQuestions.length]);

  const handlePrev = useCallback(() => {
    if (displayQuestions.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : displayQuestions.length - 1));
    setRevealed(false);
  }, [displayQuestions.length]);

  const handleToggleReveal = useCallback(() => {
    setRevealed((prev) => !prev);
  }, []);

  const handleToggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
    setCurrentIndex(0);
    setRevealed(false);
  }, []);

  // Keyboard navigation: Left Arrow (prev), Right Arrow (next), Space (flip/reveal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleToggleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev, handleToggleReveal]);

  if (displayQuestions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          No questions match your filter
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Try resetting your search query or selecting a different category pill above.
        </p>
      </div>
    );
  }

  const categoryName = categoryMap.get(currentQuestion.categoryId);
  const progressPercent = Math.round(((currentIndex + 1) / displayQuestions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header & Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Progress label */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Flashcard {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              of {displayQuestions.length} ({progressPercent}%)
            </span>
          </div>

          {/* Shuffle Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleShuffle}
              aria-label="Toggle shuffle mode"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isShuffled
                  ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle {isShuffled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Keyboard shortcut hint */}
        <div className="hidden sm:flex items-center justify-center gap-4 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              ←
            </kbd>{' '}
            Prev
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              →
            </kbd>{' '}
            Next
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              Space
            </kbd>{' '}
            Reveal
          </span>
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div className="relative">
        <QuestionCard
          key={`flashcard-${currentQuestion.id}-${isShuffled ? 'shuffled' : 'normal'}`}
          question={currentQuestion}
          categoryName={categoryName}
          isBookmarked={isBookmarked(currentQuestion.id)}
          onToggleBookmark={onToggleBookmark}
          initialShowAnswer={revealed}
        />
      </div>

      {/* Flashcard Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous question"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleToggleReveal}
          aria-label="Toggle answer reveal"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95 border ${
            revealed
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {revealed ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Hide Answer</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Reveal Answer</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next question"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
