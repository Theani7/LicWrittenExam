import React from 'react';
import { Flag } from 'lucide-react';
import type { Question, OptionKey } from '../../types';

export interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, OptionKey | null>;
  flaggedQuestionIds: Set<number>;
  onSelectQuestion: (index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  flaggedQuestionIds,
  onSelectQuestion,
  onClose,
}) => {
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => answers[q.id] != null).length;
  const flaggedCount = questions.filter((q) => flaggedQuestionIds.has(q.id)).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div data-testid="question-navigator" className="card-premium flex max-h-[82dvh] flex-col gap-3.5 overflow-hidden p-4 sm:gap-4 sm:p-5">
      {onClose && (
        <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-zinc-200 dark:bg-white/15 lg:hidden" aria-hidden="true" />
      )}
      <div className="flex shrink-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold tracking-tight">Question Navigator</h3>
          <p className="mt-0.5 font-mono text-[12px] font-semibold text-zinc-500">{answeredCount} of {totalQuestions} answered</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close navigator" className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 active:scale-95 dark:bg-white/10 dark:hover:text-white">
            ✕
          </button>
        )}
      </div>

      <div className="h-2 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-navy-700 via-blue-600 to-crimson-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-2 font-mono text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
        <span className="flex items-center gap-1.5 truncate"><span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-navy-700 text-[9px] text-white">✓</span>{answeredCount} done</span>
        <span className="flex items-center gap-1.5 truncate"><span className="h-4 w-4 shrink-0 rounded-md border border-zinc-300 bg-zinc-50 dark:border-white/15 dark:bg-white/5" />{unansweredCount} left</span>
        <span className="flex items-center gap-1.5 truncate"><span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-crimson-600 text-white"><Flag className="h-2.5 w-2.5 fill-current" /></span>{flaggedCount} flagged</span>
      </div>

      <div className="no-scrollbar grid min-h-0 grid-cols-5 gap-2 overflow-y-auto overscroll-contain-y pb-1 pr-0.5 sm:max-h-[380px]">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] != null;
          const isFlagged = flaggedQuestionIds.has(q.id);
          return (
            <button
              key={q.id}
              type="button"
              data-testid={`nav-question-${idx + 1}`}
              aria-label={`Question ${idx + 1}${isAnswered ? ', Answered' : ', Unanswered'}${isFlagged ? ', Flagged for review' : ''}${isCurrent ? ', Current' : ''}`}
              onClick={() => onSelectQuestion(idx)}
              className={`relative flex aspect-square min-h-[48px] w-full touch-manipulation items-center justify-center rounded-xl font-mono text-[14px] font-bold transition-all active:scale-90 ${
                isAnswered
                  ? 'bg-blue-600 text-white'
                  : 'border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
              } ${
                isCurrent
                  ? 'ring-2 ring-crimson-600 ring-offset-2 dark:ring-offset-ink-900'
                  : ''
              }`}
            >
              {idx + 1}
              {isFlagged && (
                <span data-testid={`flagged-badge-${idx + 1}`} title="Flagged for review" className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-crimson-600 text-white ring-2 ring-white dark:ring-ink-900">
                  <Flag className="h-2 w-2 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
