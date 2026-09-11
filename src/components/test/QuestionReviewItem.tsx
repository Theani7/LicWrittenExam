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
      className={`rounded-2xl border transition-all p-5 sm:p-6 bg-white dark:bg-slate-900 ${
        isCorrect
          ? 'border-emerald-200 dark:border-emerald-900/60 shadow-xs'
          : isIncorrect
          ? 'border-rose-200 dark:border-rose-900/60 shadow-xs'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Header: Question Number, Category, Status Badge, Bookmark */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
            Q{displayNum}
          </span>
          {categoryName && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 text-xs font-medium">
              {categoryName}
            </span>
          )}
          {isCorrect && (
            <span
              data-testid="status-badge-correct"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </span>
          )}
          {isIncorrect && (
            <span
              data-testid="status-badge-incorrect"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorrect</span>
            </span>
          )}
          {isUnanswered && (
            <span
              data-testid="status-badge-unanswered"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unanswered</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleBookmark}
          data-testid={`bookmark-btn-${question.id}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          className={`p-2 rounded-xl border transition-all duration-150 ${
            isBookmarked
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500 dark:text-amber-400 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-4">
        {question.question}
      </h3>

      {/* Sign Image if present */}
      {question.image && (
        <div className="mb-4">
          <div
            onClick={() => setIsImageZoomed(true)}
            className="inline-block relative group cursor-zoom-in rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs"
          >
            <img
              src={question.image}
              alt={`Traffic sign for question ${question.id}`}
              className="h-28 sm:h-36 object-contain p-2 transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <ZoomIn className="w-6 h-6 drop-shadow" />
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
            'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
          let badgeText: string | null = null;
          let badgeStyle = '';

          if (isUserChoice && isCorrectChoice) {
            optionStyle =
              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-medium shadow-xs';
            badgeText = 'Your Answer (Correct)';
            badgeStyle =
              'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold';
          } else if (isUserChoice && !isCorrectChoice) {
            optionStyle =
              'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-200 font-medium shadow-xs';
            badgeText = 'Your Answer';
            badgeStyle = 'bg-rose-600 text-white font-bold';
          } else if (!isUserChoice && isCorrectChoice) {
            optionStyle =
              'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400/80 dark:border-emerald-600/80 text-emerald-900 dark:text-emerald-200 font-medium';
            badgeText = 'Correct Answer';
            badgeStyle =
              'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold border border-emerald-300 dark:border-emerald-700';
          }

          return (
            <div
              key={opt.key}
              data-testid={`review-option-${opt.key}`}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-sm transition-all ${optionStyle}`}
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <span
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs border ${
                    isCorrectChoice
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isUserChoice
                      ? 'bg-rose-600 border-rose-600 text-white'
                      : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="break-words leading-relaxed">{opt.text}</span>
              </div>

              {badgeText && (
                <span
                  data-testid={isCorrectChoice ? 'correct-badge' : 'user-badge'}
                  className={`shrink-0 ml-2 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${badgeStyle}`}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              aria-label="Close image modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <img
                src={question.image}
                alt={`Traffic sign for question ${question.id}`}
                className="max-h-80 mx-auto object-contain rounded-lg mb-3"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Question {displayNum} Sign Reference
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
