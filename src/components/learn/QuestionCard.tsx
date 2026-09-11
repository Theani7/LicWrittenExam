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
      className={`bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900/80 shadow-2xs transition-all hover:border-zinc-300 dark:hover:border-navy-800 ${
        compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'
      }`}
    >
      {/* Card Header: Question Number & Category & Bookmark */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs sm:text-sm font-bold text-crimson-700 dark:text-crimson-400 bg-crimson-50 dark:bg-crimson-950/70 px-2 py-0.5 rounded border border-crimson-200 dark:border-crimson-900">
            Q{question.id}
          </span>
          {categoryName && (
            <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-navy-900/80 text-zinc-700 dark:text-zinc-300 truncate max-w-[220px] sm:max-w-md border border-zinc-200 dark:border-navy-800">
              {categoryName}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          aria-label={isBookmarked ? `Remove bookmark for question ${question.id}` : `Bookmark question ${question.id}`}
          className={`p-2 rounded-md border transition-all ${
            isBookmarked
              ? 'bg-crimson-50 dark:bg-crimson-950/60 border-crimson-300 dark:border-crimson-800 text-crimson-600 dark:text-crimson-400'
              : 'bg-zinc-50 dark:bg-navy-900/40 border-zinc-200 dark:border-navy-900 text-zinc-400 hover:text-crimson-600 hover:border-crimson-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Question Prompt */}
      <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight mb-4">
        {question.question}
      </h3>

      {/* Traffic Sign Image Preview */}
      {question.image && (
        <div className="mb-4 flex flex-col items-center sm:items-start">
          <div
            onClick={() => setIsImageModalOpen(true)}
            className="group relative inline-flex items-center justify-center p-3 rounded-lg bg-zinc-50 dark:bg-navy-950/70 border border-zinc-200 dark:border-navy-900 cursor-pointer overflow-hidden transition-all hover:border-navy-500"
          >
            <img
              src={question.image}
              alt={`Traffic sign for question ${question.id}`}
              className="max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-zinc-900/20 dark:bg-zinc-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900/90 text-white font-mono text-xs font-semibold backdrop-blur">
                <ZoomIn className="w-3.5 h-3.5" />
                Zoom
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Click diagram to enlarge
          </span>
        </div>
      )}

      {/* 4 Interactive Option Rows */}
      <div className="space-y-2.5 mb-4">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const isCorrectAnswer = opt.key === question.correctAnswer;

          let optionStyle =
            'border-zinc-200 dark:border-navy-900/70 bg-white dark:bg-[#0c1424] text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-navy-700 hover:bg-zinc-50/70 dark:hover:bg-navy-900/40';
          let badgeStyle =
            'bg-zinc-100 dark:bg-navy-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-800';
          let feedbackIcon = null;

          if (isRevealed) {
            if (isCorrectAnswer) {
              optionStyle =
                'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-50 font-semibold ring-1 ring-emerald-500/50';
              badgeStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
              feedbackIcon = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'border-crimson-500 bg-crimson-50/50 dark:bg-crimson-950/30 text-crimson-950 dark:text-crimson-50 font-semibold ring-1 ring-crimson-500/50';
              badgeStyle = 'bg-crimson-600 text-white font-bold border-crimson-600';
              feedbackIcon = <X className="w-4 h-4 text-crimson-600 dark:text-crimson-400 shrink-0" />;
            } else {
              optionStyle =
                'border-zinc-200/60 dark:border-navy-900/40 bg-zinc-50/40 dark:bg-navy-950/30 text-zinc-400 dark:text-zinc-500 opacity-60';
              badgeStyle =
                'bg-zinc-100 dark:bg-navy-900/40 text-zinc-400 dark:text-zinc-500 border-transparent';
            }
          }

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelectOption(opt.key)}
              className={`w-full flex items-center justify-between gap-3.5 p-3 sm:p-3.5 rounded-lg border text-left text-sm sm:text-base transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs sm:text-sm font-bold shrink-0 border transition-colors ${badgeStyle}`}
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

      {/* Footer Controls: Show Answer, Reset, Status Feedback */}
      {(!hideShowAnswerButton || isAnswered || isRevealed) && (
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-navy-900/60 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            {!hideShowAnswerButton && (
              <button
                type="button"
                onClick={handleToggleShowAnswer}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-semibold text-xs sm:text-sm transition-all ${
                  showAnswer
                    ? 'bg-navy-50 dark:bg-navy-950 border-navy-300 dark:border-navy-800 text-navy-700 dark:text-navy-300'
                    : 'bg-white dark:bg-navy-900/60 border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-navy-900'
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-navy-900 bg-white dark:bg-navy-900/60 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-navy-900 font-semibold text-xs sm:text-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Answer Status feedback badge */}
          {isAnswered && (
            <span
              className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs sm:text-sm ${
                isCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-crimson-100 dark:bg-crimson-950/70 text-crimson-800 dark:text-crimson-300 border border-crimson-300 dark:border-crimson-800'
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
          className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0c1424] rounded-lg p-5 max-w-lg w-full border border-zinc-200 dark:border-navy-900 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-navy-900 pb-2">
              <h4 className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Question #{question.id} — Sign Detail
              </h4>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                aria-label="Close enlarged image"
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center p-4 bg-zinc-50 dark:bg-[#070d19] rounded border border-zinc-100 dark:border-navy-900">
              <img
                src={question.image}
                alt={`Traffic sign for question ${question.id}`}
                className="max-h-72 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
              {question.question}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
