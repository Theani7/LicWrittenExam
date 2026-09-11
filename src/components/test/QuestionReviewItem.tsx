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
      className={`card-premium relative overflow-hidden p-5 sm:p-6 ${
        isCorrect ? 'ring-1 ring-emerald-500/40' : isIncorrect ? 'ring-1 ring-crimson-500/40' : ''
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-[3px] ${isCorrect ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isIncorrect ? 'bg-gradient-to-r from-crimson-600 to-rose-400' : 'bg-gradient-to-r from-zinc-300 to-zinc-200 dark:from-white/20 dark:to-white/5'}`} />

      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-zinc-900 px-2.5 py-1 font-mono text-[12px] font-bold text-white dark:bg-white dark:text-zinc-900">Q{displayNum}</span>
          {categoryName && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-bold ${catTheme.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${catTheme.dotBg}`} />{categoryName}
            </span>
          )}
          {isCorrect && <span data-testid="status-badge-correct" className="rounded-full bg-emerald-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white">✓ CORRECT</span>}
          {isIncorrect && <span data-testid="status-badge-incorrect" className="rounded-full bg-crimson-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white">✗ WRONG</span>}
          {!isAnswered && <span data-testid="status-badge-unanswered" className="rounded-full bg-zinc-200 px-2.5 py-1 font-mono text-[11px] font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">UNANSWERED</span>}
        </div>
        <button type="button" onClick={handleToggleBookmark} data-testid={`bookmark-btn-${question.id}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${isBookmarked ? 'border-transparent bg-crimson-600 text-white shadow-glow-crimson' : 'border-zinc-200 text-zinc-400 hover:border-crimson-300 hover:text-crimson-600 dark:border-white/10 dark:bg-white/5'}`}>
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h3 className="mb-4 text-[15px] font-bold leading-relaxed tracking-tight sm:text-base">{question.question}</h3>

      {question.image && (
        <button type="button" onClick={() => setIsImageZoomed(true)} className="group relative mb-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-3 transition hover:shadow-card-hover dark:border-white/10 dark:bg-white/5">
          <img src={question.image} alt={`Traffic sign for question ${question.id}`} className="h-28 object-contain transition group-hover:scale-105 sm:h-32" />
          <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 transition group-hover:bg-zinc-900/15"><ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" /></span>
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
            <div key={opt.key} data-testid={`review-option-${opt.key}`} className={`flex items-center justify-between gap-2 rounded-2xl border p-3.5 text-sm leading-relaxed ${optionStyle}`}>
              <span className="flex min-w-0 items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-[13px] font-bold ${isCorrectChoice ? 'bg-emerald-600 text-white' : isUserChoice ? 'bg-crimson-600 text-white' : 'bg-white text-zinc-500 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:ring-white/10'}`}>{opt.key}</span>
                <span className="break-words font-medium">{opt.text}</span>
              </span>
              {badgeText && <span data-testid={isCorrectChoice ? 'correct-badge' : 'user-badge'} className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${badgeStyle}`}>{badgeText}</span>}
            </div>
          );
        })}
      </div>

      {isImageZoomed && question.image && (
        <div data-testid="zoom-modal" role="dialog" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md" onClick={() => setIsImageZoomed(false)}>
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-5 shadow-float dark:bg-ink-900" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setIsImageZoomed(false)} aria-label="Close image modal" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900 dark:bg-white/10">
              <X className="h-4 w-4" />
            </button>
            <img src={question.image} alt={`Traffic sign for question ${question.id}`} className="mx-auto max-h-72 object-contain" />
            <p className="mt-2 text-center font-mono text-[11px] text-zinc-500">Q{displayNum} · SIGN REFERENCE</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReviewItem;
