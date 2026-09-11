import React, { useState } from 'react';
import {
  Bookmark,
  ZoomIn,
  X,
} from 'lucide-react';
import type { Question, OptionKey } from '../../types';
import { useBookmarks } from '../../hooks/useBookmarks';
import { getCategoryTheme } from '../../utils/categoryColors';

export interface QuestionReviewItemProps {
  question: Question;
  userAnswer?: OptionKey | null;
  questionNumber?: number;
  categoryName?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: number) => void;
}

export const QuestionReviewItem: React.FC<QuestionReviewItemProps> = ({
  question,
  userAnswer,
  questionNumber,
  categoryName,
  isBookmarked: propIsBookmarked,
  onToggleBookmark: propOnToggleBookmark,
}) => {
  const hookBookmarks = useBookmarks();
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const catTheme = getCategoryTheme(question.categoryId);

  const isBookmarked = propIsBookmarked !== undefined ? propIsBookmarked : hookBookmarks.isBookmarked(question.id);
  const handleToggleBookmark = () => {
    if (propOnToggleBookmark) propOnToggleBookmark(question.id);
    else hookBookmarks.toggleBookmark(question.id);
  };

  const isAnswered = userAnswer != null;
  const isCorrect = isAnswered && userAnswer === question.correctAnswer;
  const isIncorrect = isAnswered && userAnswer !== question.correctAnswer;
  const displayNum = questionNumber ?? question.id;

  return (
    <div
      data-testid={`question-review-item-${question.id}`}
      className={`card-premium relative overflow-hidden p-4 sm:p-6 ${
        isCorrect ? 'ring-1 ring-emerald-500/40' : isIncorrect ? 'ring-1 ring-crimson-500/40' : ''
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-[3px] ${isCorrect ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isIncorrect ? 'bg-gradient-to-r from-crimson-600 to-rose-400' : 'bg-gradient-to-r from-zinc-300 to-zinc-200 dark:from-white/20 dark:to-white/5'}`} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-zinc-900 px-2.5 py-1 font-mono text-[12px] font-bold text-white dark:bg-white dark:text-zinc-900">Q{displayNum}</span>
          {categoryName && (
            <span className={`inline-flex max-w-[52vw] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-bold sm:max-w-none ${catTheme.badge}`}>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${catTheme.dotBg}`} /><span className="truncate">{categoryName}</span>
            </span>
          )}
          {isCorrect && <span data-testid="status-badge-correct" className="rounded-full bg-emerald-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white">✓ CORRECT</span>}
          {isIncorrect && <span data-testid="status-badge-incorrect" className="rounded-full bg-crimson-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white">✗ WRONG</span>}
          {!isAnswered && <span data-testid="status-badge-unanswered" className="rounded-full bg-zinc-200 px-2.5 py-1 font-mono text-[11px] font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">UNANSWERED</span>}
        </div>
        <button type="button" onClick={handleToggleBookmark} data-testid={`bookmark-btn-${question.id}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          className={`flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border transition active:scale-90 ${isBookmarked ? 'border-transparent bg-crimson-600 text-white shadow-glow-crimson' : 'border-zinc-200 text-zinc-400 dark:border-white/10 dark:bg-white/5'}`}>
          <Bookmark className={`h-[18px] w-[18px] ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h3 className="mb-3.5 text-[15px] font-bold leading-snug tracking-tight sm:text-base sm:leading-relaxed">{question.question}</h3>

      {question.image && (
        <button type="button" onClick={() => setIsImageZoomed(true)} className="group relative mb-3.5 flex min-h-[96px] w-full touch-manipulation items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-3 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 sm:w-auto">
          <img src={question.image} alt={`Traffic sign for question ${question.id}`} className="h-28 w-auto max-w-full object-contain sm:h-32" loading="lazy" />
          <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 transition group-active:bg-zinc-900/15"><ZoomIn className="h-5 w-5 text-white opacity-80" /></span>
        </button>
      )}

      <div className="space-y-2">
        {question.options.map((opt) => {
          const isUserChoice = userAnswer === opt.key;
          const isCorrectChoice = question.correctAnswer === opt.key;
          let optionStyle = 'border-zinc-200 bg-zinc-50/60 text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400';
          let badgeText: string | null = null;
          let badgeStyle = '';
          if (isUserChoice && isCorrectChoice) {
            optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100';
            badgeText = 'Your Answer (Correct)'; badgeStyle = 'bg-emerald-600 text-white';
          } else if (isUserChoice && !isCorrectChoice) {
            optionStyle = 'border-crimson-500 bg-crimson-50 text-crimson-950 ring-1 ring-crimson-500/40 dark:bg-crimson-500/10 dark:text-crimson-100';
            badgeText = 'Your Answer'; badgeStyle = 'bg-crimson-600 text-white';
          } else if (!isUserChoice && isCorrectChoice) {
            optionStyle = 'border-emerald-400 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-400/30 dark:bg-emerald-500/[0.07] dark:text-emerald-100';
            badgeText = 'Correct Answer'; badgeStyle = 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:ring-emerald-800';
          }
          return (
            <div key={opt.key} data-testid={`review-option-${opt.key}`} className={`flex items-center justify-between gap-2 rounded-2xl border p-3 text-sm leading-snug sm:p-3.5 sm:leading-relaxed ${optionStyle}`}>
              <span className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-[13px] font-bold ${isCorrectChoice ? 'bg-emerald-600 text-white' : isUserChoice ? 'bg-crimson-600 text-white' : 'bg-white text-zinc-500 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:ring-white/10'}`}>{opt.key}</span>
                <span className="min-w-0 break-words font-medium">{opt.text}</span>
              </span>
              {badgeText && <span data-testid={isCorrectChoice ? 'correct-badge' : 'user-badge'} className={`shrink-0 rounded-full px-2 py-1 font-mono text-[10px] font-bold sm:px-2.5 ${badgeStyle}`}>{badgeText}</span>}
            </div>
          );
        })}
      </div>

      {isImageZoomed && question.image && (
        <div data-testid="zoom-modal" role="dialog" aria-modal="true" className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-950/80 backdrop-blur-md sm:items-center sm:p-4" onClick={() => setIsImageZoomed(false)}>
          <div className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-white p-4 pb-safe-offset shadow-float dark:bg-ink-900 sm:w-full sm:max-w-md sm:rounded-3xl sm:p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-zinc-200 dark:bg-white/15 sm:hidden" aria-hidden="true" />
            <button type="button" onClick={() => setIsImageZoomed(false)} aria-label="Close image modal" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 active:scale-95 dark:bg-white/10">
              <X className="h-5 w-5" />
            </button>
            <img src={question.image} alt={`Traffic sign for question ${question.id}`} className="mx-auto max-h-[60dvh] w-auto max-w-full object-contain sm:max-h-72" />
            <p className="mt-2 text-center font-mono text-[11px] text-zinc-500">Q{displayNum} · SIGN REFERENCE</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReviewItem;
