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
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col space-y-4"
    >
      {/* Header & Stats */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            Question Navigator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigator"
            className="md:hidden text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
            ✓
          </span>
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-500 text-white flex items-center justify-center text-[9px]">
            <Flag className="w-2.5 h-2.5" />
          </span>
          <span>Flagged ({flaggedCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded border-2 border-blue-500" />
          <span>Current</span>
        </div>
      </div>

      {/* Grid of Questions */}
      <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] != null;
          const isFlagged = flaggedQuestionIds.has(q.id);

          let buttonClasses =
            'relative w-full aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-150 ';

          if (isCurrent) {
            buttonClasses += 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 ';
          }

          if (isAnswered) {
            buttonClasses += 'bg-blue-600 text-white hover:bg-blue-700 ';
          } else {
            buttonClasses +=
              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 ';
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
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xs text-[8px]"
                  title="Flagged for review"
                >
                  <Flag className="w-2 h-2 fill-current" />
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
