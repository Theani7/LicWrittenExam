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

  return (
    <div
      data-testid="question-navigator"
      className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900/90 p-4 shadow-2xs flex flex-col space-y-3"
    >
      {/* Header & Stats */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-navy-900 pb-2.5">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">
            Question Navigator
          </h3>
          <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigator"
            className="md:hidden text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400 pb-2 border-b border-zinc-100 dark:border-navy-900">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-navy-700 text-white flex items-center justify-center text-[8px] font-bold">
            ✓
          </span>
          <span>Done ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-zinc-100 dark:bg-navy-950 border border-zinc-200 dark:border-navy-800" />
          <span>Left ({unansweredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-crimson-600 text-white flex items-center justify-center text-[8px]">
            <Flag className="w-2 h-2" />
          </span>
          <span>Flagged ({flaggedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-crimson-600" />
          <span>Current</span>
        </div>
      </div>

      {/* Grid of Questions */}
      <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto pr-0.5 font-mono">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] != null;
          const isFlagged = flaggedQuestionIds.has(q.id);

          let buttonClasses =
            'relative w-full aspect-square rounded flex items-center justify-center text-xs font-medium transition-all ';

          if (isCurrent) {
            buttonClasses += 'ring-2 ring-crimson-600 ring-offset-1 dark:ring-offset-[#0c1424] font-bold ';
          }

          if (isAnswered) {
            buttonClasses += 'bg-navy-700 bg-blue-600 text-white hover:bg-navy-800 ';
          } else {
            buttonClasses +=
              'bg-zinc-50 dark:bg-navy-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-navy-900 border border-zinc-200 dark:border-navy-900 ';
          }

          return (
            <button
              key={q.id}
              type="button"
              data-testid={`nav-question-${idx + 1}`}
              aria-label={`Question ${idx + 1}${isAnswered ? ', Answered' : ', Unanswered'}${
                isFlagged ? ', Flagged for review' : ''
              }${isCurrent ? ', Current' : ''}`}
              onClick={() => onSelectQuestion(idx)}
              className={buttonClasses}
            >
              <span>{idx + 1}</span>

              {/* Flagged indicator badge */}
              {isFlagged && (
                <span
                  data-testid={`flagged-badge-${idx + 1}`}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-crimson-600 text-white rounded-full flex items-center justify-center text-[7px]"
                  title="Flagged for review"
                >
                  <Flag className="w-1.5 h-1.5 fill-current" />
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
