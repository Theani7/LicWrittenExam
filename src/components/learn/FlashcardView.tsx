import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Eye,
  EyeOff,
  HelpCircle,
  Keyboard,
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

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const displayQuestions = useMemo(() => {
    if (!isShuffled) return questions;
    const copy = [...questions];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [questions, isShuffled]);

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

  const handleToggleReveal = useCallback(() => setRevealed((prev) => !prev), []);
  const handleToggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
    setCurrentIndex(0);
    setRevealed(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      else if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); handleToggleReveal(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleToggleReveal]);

  if (displayQuestions.length === 0) {
    return (
      <div className="card-premium p-12 text-center">
        <HelpCircle className="mx-auto h-8 w-8 text-zinc-300" />
        <h3 className="mt-3 font-extrabold">No cards in this deck</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">Clear your search or pick another category to rebuild the deck.</p>
      </div>
    );
  }

  const categoryName = categoryMap.get(currentQuestion.categoryId);
  const progressPercent = Math.round(((currentIndex + 1) / displayQuestions.length) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card-premium overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-crimson-600 via-rose-400 to-navy-600" style={{ width: `${progressPercent}%` }} />
        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-extrabold tracking-tight">Flashcard {currentIndex + 1}</span>
              <span className="font-mono text-sm text-zinc-400">of {displayQuestions.length} ({progressPercent}%)</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                {progressPercent}%
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleShuffle}
              aria-label="Toggle shuffle mode"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[12px] font-bold transition active:scale-[0.97] ${
                isShuffled
                  ? 'border-crimson-300 bg-crimson-50 text-crimson-700 dark:border-crimson-800 dark:bg-crimson-950/40 dark:text-crimson-300'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
              }`}
            >
              <Shuffle className="h-3.5 w-3.5" /> {isShuffled ? 'Shuffle ON' : 'Shuffle OFF'}
            </button>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-crimson-700 via-crimson-500 to-rose-400 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="hidden items-center justify-center gap-4 font-mono text-[11px] font-semibold text-zinc-400 sm:flex">
            <span className="flex items-center gap-1"><Keyboard className="h-3 w-3" /> ← PREV</span>
            <span>→ NEXT</span>
            <span>SPACE REVEAL</span>
          </p>
        </div>
      </div>

      <div key={`flashcard-${currentQuestion.id}-${isShuffled ? 'shuffled' : 'normal'}`} className="animate-fade-up">
        <QuestionCard
          question={currentQuestion}
          categoryName={categoryName}
          isBookmarked={isBookmarked(currentQuestion.id)}
          onToggleBookmark={onToggleBookmark}
          initialShowAnswer={revealed}
          hideShowAnswerButton={true}
        />
      </div>

      <div className="card-premium flex items-center justify-between gap-2 p-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous question"
          className="btn-ghost flex-1 sm:flex-none sm:px-6"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          type="button"
          onClick={handleToggleReveal}
          aria-label="Toggle answer reveal"
          className={`inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition active:scale-[0.98] ${
            revealed
              ? 'border border-zinc-200 bg-zinc-100 text-zinc-900 dark:border-white/10 dark:bg-white/10 dark:text-white'
              : 'bg-gradient-to-r from-crimson-700 to-rose-600 text-white shadow-glow-crimson hover:brightness-110'
          }`}
        >
          {revealed ? <><EyeOff className="h-4 w-4" /> Hide Answer</> : <><Eye className="h-4 w-4" /> Reveal Answer</>}
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next question"
          className="btn-ghost flex-1 sm:flex-none sm:px-6"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
