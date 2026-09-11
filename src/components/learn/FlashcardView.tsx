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
      <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-12 text-center space-y-3">
        <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          No questions match your filter
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Try clearing your search query or selecting a different category.
        </p>
      </div>
    );
  }

  const categoryName = categoryMap.get(currentQuestion.categoryId);
  const progressPercent = Math.round(((currentIndex + 1) / displayQuestions.length) * 100);

  return (
    <div className="space-y-4">
      {/* Top Header & Progress */}
      <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-4 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Progress label */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-semibold text-zinc-900 dark:text-white">
              Flashcard {currentIndex + 1}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">
              of {displayQuestions.length} ({progressPercent}%)
            </span>
          </div>

          {/* Shuffle Toggle */}
          <button
            type="button"
            onClick={handleToggleShuffle}
            aria-label="Toggle shuffle mode"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all border ${
              isShuffled
                ? 'bg-crimson-50 dark:bg-crimson-950/60 border-crimson-300 dark:border-crimson-800 text-crimson-700 dark:text-crimson-300'
                : 'bg-white dark:bg-navy-900/60 border-zinc-200 dark:border-navy-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-navy-900'
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle {isShuffled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Progress Bar in Nepal Crimson */}
        <div className="w-full bg-zinc-100 dark:bg-navy-950 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-crimson-600 h-full rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Keyboard shortcut hint */}
        <div className="hidden sm:flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-navy-900 border border-zinc-200 dark:border-navy-800">
              ←
            </kbd>{' '}
            PREV
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-navy-900 border border-zinc-200 dark:border-navy-800">
              →
            </kbd>{' '}
            NEXT
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-navy-900 border border-zinc-200 dark:border-navy-800">
              SPACE
            </kbd>{' '}
            REVEAL
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
          hideShowAnswerButton={true}
        />
      </div>

      {/* Flashcard Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous question"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 dark:border-navy-900 bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-navy-900 text-xs font-medium transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleToggleReveal}
          aria-label="Toggle answer reveal"
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-medium text-xs transition-all border ${
            revealed
              ? 'bg-zinc-100 dark:bg-navy-900 border-zinc-300 dark:border-navy-800 text-zinc-800 dark:text-zinc-200'
              : 'bg-crimson-600 border-crimson-600 text-white hover:bg-crimson-700 shadow-2xs'
          }`}
        >
          {revealed ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Answer</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal Answer</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next question"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-zinc-200 dark:border-navy-900 bg-white dark:bg-[#0c1424] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-navy-900 text-xs font-medium transition-all"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
