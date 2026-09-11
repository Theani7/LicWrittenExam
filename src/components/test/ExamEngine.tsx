import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Clock,
  Flag,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X,
  Menu,
  ZoomIn,
  LogOut,
} from 'lucide-react';
import type { Question, OptionKey } from '../../types';
import { QuestionNavigator } from './QuestionNavigator';

export interface ExamEngineProps {
  questions: Question[];
  title?: string;
  durationSeconds?: number; // default 1800 (30 mins)
  onSubmit: (userAnswers: Record<number, OptionKey | null>, timeTakenSeconds: number) => void;
  onExit?: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  questions,
  title = 'DoTM Driving License Examination',
  durationSeconds = 1800,
  onSubmit,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey | null>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<number>>(new Set());
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showMobileNavigator, setShowMobileNavigator] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  const isSubmittedRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalQuestions = questions.length;
  const currentQuestion: Question | undefined = questions[currentIndex];

  const answeredCount = useMemo(() => {
    return questions.filter((q) => answers[q.id] != null).length;
  }, [questions, answers]);

  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = useMemo(() => {
    return questions.filter((q) => flaggedQuestionIds.has(q.id)).length;
  }, [questions, flaggedQuestionIds]);

  // Final submission handler
  const handleFinalSubmit = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const timeTaken = Math.max(0, durationSeconds - remainingSeconds);
    onSubmit(answers, timeTaken);
  }, [answers, durationSeconds, remainingSeconds, onSubmit]);

  // Countdown timer
  useEffect(() => {
    if (durationSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [durationSeconds, handleFinalSubmit]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = remainingSeconds < 300 && remainingSeconds > 0; // Less than 5 mins

  // Option selection
  const handleSelectOption = (key: OptionKey) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: key,
    }));
  };

  // Clear current answer
  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Toggle flag / review
  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (totalQuestions === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 text-center bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">No questions available for this exam.</p>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="mt-3 px-3 py-1.5 bg-navy-700 text-white rounded text-xs font-medium hover:bg-navy-800"
          >
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  const selectedForCurrent = currentQuestion ? answers[currentQuestion.id] : null;
  const isCurrentFlagged = currentQuestion ? flaggedQuestionIds.has(currentQuestion.id) : false;

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#070d19] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Top Fixed Action Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070d19]/90 backdrop-blur-md border-b border-zinc-200 dark:border-navy-900/80">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Exam Title & Exit */}
          <div className="flex items-center gap-2.5">
            {onExit && (
              <button
                type="button"
                onClick={() => setShowExitModal(true)}
                className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
                title="Exit exam"
                aria-label="Exit exam"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <div>
              <h1 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] sm:max-w-xs md:max-w-md tracking-tight">
                {title}
              </h1>
              <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:block">
                QUESTION {currentIndex + 1} OF {totalQuestions}
              </p>
            </div>
          </div>

          {/* Center/Right Timer & Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Timer Countdown */}
            <div
              data-testid="exam-timer"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-semibold tabular-nums border ${
                isTimeCritical
                  ? 'bg-crimson-50 dark:bg-crimson-950/60 border-crimson-300 dark:border-crimson-800 text-crimson-600 text-rose-600 dark:text-crimson-400 animate-pulse'
                  : 'bg-zinc-100 dark:bg-navy-950 border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-crimson-600" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            {/* Mobile Navigator Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileNavigator(true)}
              className="lg:hidden px-2.5 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-navy-950 border border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
              aria-label="Open navigator"
            >
              <Menu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GRID</span>
            </button>

            {/* Submit Exam Button */}
            <button
              type="button"
              data-testid="submit-exam-button"
              onClick={() => setShowSubmitModal(true)}
              className="px-3 py-1 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-medium rounded shadow-2xs transition"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-zinc-200 dark:bg-navy-950 h-0.5">
          <div
            className="bg-crimson-600 h-0.5 transition-all duration-200"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Question Pane (Cols 1-8) */}
        <section className="lg:col-span-8 flex flex-col space-y-3">
          <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900/90 p-4 sm:p-6 shadow-2xs">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-100 dark:border-navy-900">
              <span className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                QUESTION {currentIndex + 1} / {totalQuestions}
              </span>

              {/* Review Flag Toggle */}
              <button
                type="button"
                data-testid="mark-review-button"
                onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition border ${
                  isCurrentFlagged
                    ? 'bg-crimson-50 dark:bg-crimson-950/60 text-crimson-700 dark:text-crimson-300 border-crimson-300 dark:border-crimson-800'
                    : 'bg-zinc-50 dark:bg-navy-950/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-navy-900 hover:bg-zinc-100'
                }`}
              >
                <Flag
                  className={`w-3 h-3 ${
                    isCurrentFlagged ? 'fill-current text-crimson-600' : 'text-zinc-400'
                  }`}
                />
                <span>{isCurrentFlagged ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug tracking-tight mb-4">
              {currentQuestion.question}
            </h2>

            {/* Question Image if present */}
            {currentQuestion.image && (
              <div className="mb-5 flex flex-col items-center">
                <div
                  className="relative group cursor-pointer border border-zinc-200 dark:border-navy-900 rounded-md overflow-hidden bg-zinc-50 dark:bg-navy-950 p-2 max-w-xs"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <img
                    src={currentQuestion.image}
                    alt={`Question ${currentQuestion.id} illustration`}
                    className="max-h-44 w-auto object-contain rounded"
                  />
                  <div className="absolute inset-0 bg-zinc-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                    <span className="text-white font-mono text-[10px] flex items-center gap-1 bg-zinc-900/80 px-2 py-0.5 rounded">
                      <ZoomIn className="w-3 h-3" />
                      <span>ZOOM</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Options (A, B, C, D) without immediate feedback */}
            <div className="space-y-2 mb-5" role="radiogroup" aria-label="Question options">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedForCurrent === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    data-testid={`option-${option.key}`}
                    onClick={() => handleSelectOption(option.key)}
                    className={`w-full text-left p-3 rounded-md border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-navy-700 bg-navy-50/60 dark:bg-navy-950/60 text-navy-950 dark:text-navy-100 ring-1 ring-navy-700/40'
                        : 'border-zinc-200 dark:border-navy-900 hover:border-zinc-300 dark:hover:border-navy-700 bg-white dark:bg-[#0c1424] text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded font-mono text-[11px] font-semibold shrink-0 transition-colors border ${
                        isSelected
                          ? 'bg-navy-700 text-white border-navy-700'
                          : 'bg-zinc-100 dark:bg-navy-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-navy-800'
                      }`}
                    >
                      {option.key}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-snug pt-0.5">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation & Clear Button */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-navy-900">
              <button
                type="button"
                data-testid="prev-question-button"
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 border border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-navy-900 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {selectedForCurrent && (
                <button
                  type="button"
                  data-testid="clear-selection-button"
                  onClick={handleClearAnswer}
                  className="font-mono text-[11px] text-zinc-400 hover:text-crimson-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>CLEAR</span>
                </button>
              )}

              <button
                type="button"
                data-testid="next-question-button"
                disabled={currentIndex === totalQuestions - 1}
                onClick={handleNext}
                className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 bg-navy-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-800 transition"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Desktop Sidebar Navigator (Cols 9-12) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-18">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flaggedQuestionIds={flaggedQuestionIds}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </aside>
      </main>

      {/* Mobile Drawer Navigator Modal */}
      {showMobileNavigator && (
        <div
          data-testid="mobile-navigator-overlay"
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
        >
          <div className="w-full max-w-sm bg-white dark:bg-[#0c1424] rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-navy-900">
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              flaggedQuestionIds={flaggedQuestionIds}
              onSelectQuestion={(idx) => {
                setCurrentIndex(idx);
                setShowMobileNavigator(false);
              }}
              onClose={() => setShowMobileNavigator(false)}
            />
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div
          data-testid="submit-dialog"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 max-w-sm w-full p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 font-mono text-xs ${
                    unansweredCount > 0
                      ? 'bg-crimson-100 dark:bg-crimson-950/60 text-crimson-700'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700'
                  }`}
                >
                  {unansweredCount > 0 ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Submit Examination?
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-400">
                    REVIEW PROGRESS BEFORE FINISHING
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Unanswered warning */}
            {unansweredCount > 0 && (
              <div
                data-testid="unanswered-warning"
                className="p-2.5 bg-crimson-50 dark:bg-crimson-950/40 border border-crimson-200 dark:border-crimson-900 text-xs text-crimson-800 dark:text-crimson-300 rounded"
              >
                <strong>Warning:</strong> You have{' '}
                <span className="font-bold underline">{unansweredCount} unanswered</span> questions.
                Unanswered questions receive 0 marks.
              </div>
            )}

            {/* Breakdown card */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-zinc-50 dark:bg-navy-950/50 rounded border border-zinc-200 dark:border-navy-900 text-center font-mono">
              <div>
                <div className="text-[10px] text-zinc-400">ANSWERED</div>
                <div className="text-base font-bold text-navy-700 dark:text-navy-300">
                  {answeredCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">LEFT</div>
                <div className="text-base font-bold text-zinc-700 dark:text-zinc-300">
                  {unansweredCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">FLAGGED</div>
                <div className="text-base font-bold text-crimson-600">
                  {flaggedCount}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                data-testid="cancel-submit-button"
                onClick={() => setShowSubmitModal(false)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-navy-900 transition"
              >
                Keep Working
              </button>
              <button
                type="button"
                data-testid="confirm-submit-button"
                onClick={handleFinalSubmit}
                className="px-3.5 py-1.5 text-xs font-medium rounded bg-crimson-600 hover:bg-crimson-700 text-white shadow-2xs transition"
              >
                Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Exam Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 max-w-xs w-full p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Exit Exam?</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your exam progress will not be submitted or saved. Are you sure?
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitModal(false);
                  onExit?.();
                }}
                className="px-3 py-1.5 text-xs font-medium rounded bg-crimson-600 text-white hover:bg-crimson-700"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isImageModalOpen && currentQuestion?.image && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={currentQuestion.image}
              alt="Expanded view"
              className="max-h-[85vh] w-auto object-contain rounded"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/70 text-white rounded p-1"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEngine;
