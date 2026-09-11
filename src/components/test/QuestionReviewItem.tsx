import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ZoomIn,
  X,
} from 'lucide-react';
import type { Question, OptionKey } from '../../types';
import { useBookmarks } from '../../hooks/useBookmarks';

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

  const isBookmarked =
    propIsBookmarked !== undefined
      ? propIsBookmarked
      : hookBookmarks.isBookmarked(question.id);

  const handleToggleBookmark = () => {
    if (propOnToggleBookmark) {
      propOnToggleBookmark(question.id);
    } else {
      hookBookmarks.toggleBookmark(question.id);
    }
  };

  const isAnswered = userAnswer != null;
  const isCorrect = isAnswered && userAnswer === question.correctAnswer;
  const isIncorrect = isAnswered && userAnswer !== question.correctAnswer;
  const isUnanswered = !isAnswered;

  const displayNum = questionNumber ?? question.id;

  return (
    <div
      data-testid={`question-review-item-${question.id}`}
      className={`rounded-lg border p-4 sm:p-5 bg-white dark:bg-[#0c1424] transition-all ${
        isCorrect
          ? 'border-emerald-300/80 dark:border-emerald-900/60 shadow-2xs'
          : isIncorrect
          ? 'border-crimson-300/80 dark:border-crimson-900/60 shadow-2xs'
          : 'border-zinc-200 dark:border-navy-900'
      }`}
    >
      {/* Header: Question Number, Category, Status Badge, Bookmark */}
      <div className="flex items-center justify-between gap-3 mb-3.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-navy-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-navy-800">
            Q{displayNum}
          </span>
          {categoryName && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-navy-50 dark:bg-navy-950/60 text-navy-700 dark:text-navy-300 border border-navy-200/60 dark:border-navy-900/60">
              {categoryName}
            </span>
          )}
          {isCorrect && (
            <span
              data-testid="status-badge-correct"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CORRECT</span>
            </span>
          )}
          {isIncorrect && (
            <span
              data-testid="status-badge-incorrect"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-crimson-50 dark:bg-crimson-950/60 text-crimson-700 dark:text-crimson-300 border border-crimson-200 dark:border-crimson-800"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>INCORRECT</span>
            </span>
          )}
          {isUnanswered && (
            <span
              data-testid="status-badge-unanswered"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-zinc-100 dark:bg-navy-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-navy-800"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>UNANSWERED</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleBookmark}
          data-testid={`bookmark-btn-${question.id}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          className={`p-2 rounded-md border transition-all ${
            isBookmarked
              ? 'bg-crimson-50 dark:bg-crimson-950/50 border-crimson-300 dark:border-crimson-800 text-crimson-600 dark:text-crimson-400'
              : 'bg-zinc-50 dark:bg-navy-950/40 border-zinc-200 dark:border-navy-900 text-zinc-400 hover:text-crimson-600'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug tracking-tight mb-4">
        {question.question}
      </h3>

      {/* Sign Image if present */}
      {question.image && (
        <div className="mb-4">
          <div
            onClick={() => setIsImageZoomed(true)}
            className="inline-block relative group cursor-zoom-in rounded-lg border border-zinc-200 dark:border-navy-900 bg-white dark:bg-navy-950 overflow-hidden"
          >
            <img
              src={question.image}
              alt={`Traffic sign for question ${question.id}`}
              className="h-28 sm:h-36 object-contain p-2.5 transition-transform duration-150 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5">
        {question.options.map((opt) => {
          const isUserChoice = userAnswer === opt.key;
          const isCorrectChoice = question.correctAnswer === opt.key;

          let optionStyle =
            'bg-zinc-50/50 dark:bg-navy-950/40 border-zinc-200/80 dark:border-navy-900 text-zinc-700 dark:text-zinc-300';
          let badgeText: string | null = null;
          let badgeStyle = '';

          if (isUserChoice && isCorrectChoice) {
            optionStyle =
              'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-semibold';
            badgeText = 'Your Answer (Correct)';
            badgeStyle =
              'bg-emerald-600 text-white font-mono text-xs font-bold';
          } else if (isUserChoice && !isCorrectChoice) {
            optionStyle =
              'bg-crimson-50/70 dark:bg-crimson-950/30 border-crimson-500 dark:border-crimson-600 text-crimson-950 dark:text-crimson-200 font-semibold';
            badgeText = 'Your Answer';
            badgeStyle = 'bg-crimson-600 text-white font-mono text-xs font-bold';
          } else if (!isUserChoice && isCorrectChoice) {
            optionStyle =
              'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 font-semibold';
            badgeText = 'Correct Answer';
            badgeStyle =
              'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-700';
          }

          return (
            <div
              key={opt.key}
              data-testid={`review-option-${opt.key}`}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-lg border text-sm sm:text-base leading-relaxed transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md shrink-0 flex items-center justify-center font-mono font-bold text-xs sm:text-sm border ${
                    isCorrectChoice
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : isUserChoice
                      ? 'bg-crimson-600 border-crimson-600 text-white shadow-xs'
                      : 'bg-white dark:bg-navy-900 border-zinc-300 dark:border-navy-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="break-words font-medium">{opt.text}</span>
              </div>

              {badgeText && (
                <span
                  data-testid={isCorrectChoice ? 'correct-badge' : 'user-badge'}
                  className={`shrink-0 ml-2 px-2.5 py-1 rounded whitespace-nowrap ${badgeStyle}`}
                >
                  {badgeText}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Zoom Modal */}
      {isImageZoomed && question.image && (
        <div
          data-testid="zoom-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            className="relative max-w-md w-full bg-white dark:bg-[#0c1424] rounded-lg p-5 shadow-xl border border-zinc-200 dark:border-navy-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-2.5 right-2.5 p-1 rounded bg-zinc-100 dark:bg-navy-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
              aria-label="Close image modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center pt-2">
              <img
                src={question.image}
                alt={`Traffic sign for question ${question.id}`}
                className="max-h-72 mx-auto object-contain rounded mb-2"
              />
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Question {displayNum} Sign Reference
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReviewItem;
