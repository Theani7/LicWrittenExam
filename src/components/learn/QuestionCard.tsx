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
import { getCategoryTheme } from '../../utils/categoryColors';

export interface QuestionCardProps {
  question: Question;
  categoryName?: string;
  isBookmarked?: boolean;
  onToggleBookmark: (questionId: number) => void;
  initialSelectedOption?: OptionKey | null;
  initialShowAnswer?: boolean;
  onAnswerSelected?: (questionId: number, optionKey: OptionKey, isCorrect: boolean) => void;
  compact?: boolean;
  hideShowAnswerButton?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  categoryName,
  isBookmarked = false,
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
    setSelectedOption(initialSelectedOption);
    setShowAnswer(initialShowAnswer);
  }, [question.id, initialSelectedOption, initialShowAnswer]);

  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === question.correctAnswer;
  const isRevealed = isAnswered || showAnswer;
  const catTheme = getCategoryTheme(question.categoryId);

  const handleSelectOption = (key: OptionKey) => {
    if (selectedOption === key) return;
    setSelectedOption(key);
    const correct = key === question.correctAnswer;
    onAnswerSelected?.(question.id, key, correct);
  };

  const handleToggleShowAnswer = () => setShowAnswer((prev) => !prev);
  const handleReset = () => {
    setSelectedOption(null);
    setShowAnswer(false);
  };

  return (
    <article
      className={`card-premium card-lift group relative overflow-hidden transition-all ${
        isAnswered
          ? isCorrect
            ? 'ring-1 ring-emerald-500/40'
            : 'ring-1 ring-crimson-500/30'
          : 'hover:shadow-card-hover'
      } ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
    >
      {/* top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100 ${
          isRevealed ? 'opacity-100' : ''
        } ${catTheme.accentBar}`}
      />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-xl bg-zinc-900 px-2.5 py-1 font-mono text-[12px] font-bold tracking-tight text-white dark:bg-white dark:text-zinc-900">
            Q{question.id}
          </span>
          {categoryName && (
            <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-bold ${catTheme.badge}`}>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${catTheme.dotBg}`} />
              <span className="truncate">{categoryName}</span>
            </span>
          )}
          {question.image && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60">
              Diagram
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          aria-label={isBookmarked ? `Remove bookmark for question ${question.id}` : `Bookmark question ${question.id}`}
          title={isBookmarked ? 'Remove bookmark' : 'Save for revision'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 ${
            isBookmarked
              ? 'border-transparent bg-gradient-to-br from-crimson-600 to-rose-500 text-white shadow-glow-crimson'
              : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:-translate-y-px hover:border-crimson-300 hover:bg-crimson-50 hover:text-crimson-600 dark:border-white/10 dark:bg-white/5 dark:hover:border-crimson-800'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Prompt */}
      <h3 className="mb-4 text-balance text-[15px] font-bold leading-relaxed tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-[17px]">
        {question.question}
      </h3>

      {/* Image */}
      {question.image && (
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="group/img relative flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-4 transition-all hover:border-navy-400 hover:shadow-card-hover dark:border-white/10 dark:from-white/5 dark:to-transparent"
          >
            <img
              src={question.image}
              alt={`Traffic sign for question ${question.id}`}
              className="max-h-40 w-auto object-contain transition-transform duration-300 group-hover/img:scale-[1.04] sm:max-h-48"
              loading="lazy"
            />
            <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-zinc-900/85 px-2.5 py-1 font-mono text-[10px] font-bold text-white opacity-0 backdrop-blur transition-opacity group-hover/img:opacity-100">
              <ZoomIn className="h-3 w-3" /> ENLARGE
            </span>
          </button>
        </div>
      )}

      {/* Options */}
      <div className="mb-4 space-y-2.5" role="radiogroup" aria-label={`Options for question ${question.id}`}>
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const isCorrectAnswer = opt.key === question.correctAnswer;

          let optionStyle =
            'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-card dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/25 dark:hover:bg-white/[0.06]';
          let badgeStyle =
            'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:border-white/10';
          let feedbackIcon = null;

          if (isRevealed) {
            if (isCorrectAnswer) {
              optionStyle =
                'border-emerald-500/70 bg-emerald-50 shadow-[0_0_0_3px_rgb(16_185_129/0.12)] dark:bg-emerald-500/[0.08] dark:border-emerald-500/50';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
              feedbackIcon = (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              );
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'border-crimson-500/70 bg-crimson-50 shadow-[0_0_0_3px_rgb(220_20_60/0.10)] dark:bg-crimson-500/[0.08] dark:border-crimson-500/50';
              badgeStyle = 'bg-crimson-600 text-white border-crimson-600 shadow-sm';
              feedbackIcon = (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson-600 text-white">
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              );
            } else {
              optionStyle = 'border-zinc-200/70 bg-zinc-50/50 text-zinc-400 opacity-70 dark:border-white/5 dark:bg-white/[0.02]';
              badgeStyle = 'bg-zinc-100 text-zinc-400 border-transparent dark:bg-white/5 dark:text-zinc-500';
            }
          } else if (isSelected) {
            optionStyle = 'border-navy-600 bg-blue-50/60 shadow-[0_0_0_3px_rgb(0_56_147/0.12)] dark:bg-blue-500/10 dark:border-blue-500/60';
            badgeStyle = 'bg-navy-700 text-white border-navy-700';
          }

          return (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelectOption(opt.key)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all active:scale-[0.995] sm:p-3.5 ${optionStyle}`}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border font-mono text-[13px] font-bold transition-colors ${badgeStyle}`}
                >
                  {opt.key}
                </span>
                <span className="min-w-0 flex-1 break-words text-sm font-medium leading-relaxed sm:text-[15px]">
                  {opt.text}
                </span>
              </span>
              {feedbackIcon}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {(!hideShowAnswerButton || isAnswered || isRevealed) && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-zinc-100 pt-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            {!hideShowAnswerButton && (
              <button
                type="button"
                onClick={handleToggleShowAnswer}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] font-bold transition-all active:scale-[0.97] ${
                  showAnswer
                    ? 'border-navy-200 bg-blue-50 text-navy-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
                }`}
              >
                {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
            )}
            {(isAnswered || showAnswer) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-[13px] font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>

          {isAnswered && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[12px] font-bold ${
                isCorrect
                  ? 'bg-emerald-600 text-white shadow-[0_4px_14px_-4px_rgb(16_185_129/0.6)]'
                  : 'bg-crimson-600 text-white shadow-glow-crimson'
              }`}
            >
              {isCorrect ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={3} /> Correct! ✓
                </>
              ) : (
                <>Incorrect (Correct: {question.correctAnswer})</>
              )}
            </span>
          )}
        </div>
      )}

      {/* Image modal */}
      {isImageModalOpen && question.image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged image for question ${question.id}`}
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white shadow-float dark:bg-ink-900 animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5 dark:border-white/10">
              <p className="font-mono text-[12px] font-bold text-zinc-600 dark:text-zinc-300">
                Question #{question.id} — Sign Detail
              </p>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                aria-label="Close enlarged image"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:bg-white/10 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-center bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-white/5 dark:to-transparent">
              <img src={question.image} alt={`Traffic sign for question ${question.id}`} className="max-h-72 w-auto object-contain" />
            </div>
            <p className="border-t border-zinc-100 px-5 py-3.5 text-center text-[13px] text-zinc-600 dark:border-white/10 dark:text-zinc-400">
              {question.question}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};

export default QuestionCard;
