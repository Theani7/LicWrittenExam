import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  X,
  ZoomIn,
} from 'lucide-react';
import type { Question, OptionKey } from '../../types';

export interface QuestionCardProps {
  question: Question;
  categoryName?: string;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  initialSelectedOption?: OptionKey | null;
  initialShowAnswer?: boolean;
  onAnswerSelected?: (questionId: number, optionKey: OptionKey, isCorrect: boolean) => void;
  compact?: boolean;
  hideShowAnswerButton?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  categoryName,
  isBookmarked,
  onToggleBookmark,
  initialSelectedOption = null,
  initialShowAnswer = false,
  onAnswerSelected,
  compact = false,
  hideShowAnswerButton = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(initialSelectedOption);
  const [showAnswer, setShowAnswer] = useState<boolean>(initialShowAnswer);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setShowAnswer(initialShowAnswer);
  }, [initialShowAnswer]);

  useEffect(() => {
    setSelectedOption(initialSelectedOption);
    setShowAnswer(initialShowAnswer);
  }, [question.id]);

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correctAnswer;
  const isRevealed = showAnswer || initialShowAnswer || isAnswered;

  const handleSelectOption = (key: OptionKey) => {
    if (selectedOption === key) return;
    setSelectedOption(key);
    const correct = key === question.correctAnswer;
    onAnswerSelected?.(question.id, key, correct);
  };

  const handleToggleShowAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowAnswer(false);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700/80 ${
        compact ? 'p-3 sm:p-4' : 'p-4 sm:p-6'
      }`}
    >
      {/* Header: Question Number, Category Badge, Bookmark */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
            Q{question.id}
          </span>
          {categoryName && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium truncate max-w-[200px] sm:max-w-xs">
              {categoryName}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          aria-label={isBookmarked ? `Remove bookmark for question ${question.id}` : `Bookmark question ${question.id}`}
          className={`p-2 rounded-xl border transition-all duration-150 ${
            isBookmarked
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500 dark:text-amber-400 shadow-sm'
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

      {/* Traffic Sign Image Preview */}
      {question.image && (
        <div className="mb-5 flex flex-col items-center sm:items-start">
          <div
            onClick={() => setIsImageModalOpen(true)}
            className="group relative inline-flex items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 cursor-pointer overflow-hidden transition-all hover:border-blue-400 dark:hover:border-blue-500 shadow-sm"
          >
            <img
              src={question.image}
              alt={`Traffic sign for question ${question.id}`}
              className="max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur">
                <ZoomIn className="w-3.5 h-3.5" />
                Zoom
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
            Click image to enlarge
          </span>
        </div>
      )}

      {/* 4 Interactive Option Rows */}
      <div className="space-y-2.5 mb-5">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const isCorrectAnswer = opt.key === question.correctAnswer;

          // Compute style classes based on selection and reveal state
          let optionStyle =
            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40';
          let badgeStyle =
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
          let feedbackIcon = null;

          if (isRevealed) {
            if (isCorrectAnswer) {
              optionStyle =
                'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-medium ring-1 ring-emerald-500/50';
              badgeStyle = 'bg-emerald-600 text-white font-bold';
              feedbackIcon = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 font-medium ring-1 ring-rose-500/50';
              badgeStyle = 'bg-rose-600 text-white font-bold';
              feedbackIcon = <X className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
            } else {
              optionStyle =
                'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500';
              badgeStyle =
                'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500';
            }
          }

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelectOption(opt.key)}
              className={`w-full flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border text-left text-sm transition-all duration-150 ${optionStyle}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors ${badgeStyle}`}
                >
                  {opt.key}
                </span>
                <span className="flex-1 leading-snug break-words">{opt.text}</span>
              </div>
              {feedbackIcon}
            </button>
          );
        })}
      </div>

      {/* Footer Controls: Show Answer, Reset */}
      {(!hideShowAnswerButton || isAnswered || isRevealed) && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {!hideShowAnswerButton && (
              <button
                type="button"
                onClick={handleToggleShowAnswer}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  showAnswer
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Answer</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Answer</span>
                  </>
                )}
              </button>
            )}

            {(isAnswered || showAnswer) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Answer Status feedback pill */}
          {isAnswered && (
            <span
              className={`font-semibold px-2.5 py-1 rounded-md text-xs ${
                isCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
              }`}
            >
              {isCorrect ? 'Correct! ✓' : `Incorrect (Correct: ${question.correctAnswer})`}
            </span>
          )}
        </div>
      )}

      {/* Click-to-enlarge Modal for Sign Image */}
      {isImageModalOpen && question.image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged image for question ${question.id}`}
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Question #{question.id} — Sign Detail
              </h4>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                aria-label="Close enlarged image"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <img
                src={question.image}
                alt={`Traffic sign for question ${question.id}`}
                className="max-h-72 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              {question.question}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
