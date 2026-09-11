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
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400">No questions available for this exam.</p>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Fixed Action Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Exam Title & Exit */}
          <div className="flex items-center space-x-3">
            {onExit && (
              <button
                type="button"
                onClick={() => setShowExitModal(true)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Exit exam"
                aria-label="Exit exam"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          {/* Center/Right Timer & Buttons */}
          <div className="flex items-center space-x-3">
            {/* Timer Countdown */}
            <div
              data-testid="exam-timer"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold border ${
                isTimeCritical
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            {/* Mobile Navigator Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileNavigator(true)}
              className="lg:hidden px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              aria-label="Open navigator"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Nav</span>
            </button>

            {/* Submit Exam Button */}
            <button
              type="button"
              data-testid="submit-exam-button"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Pane (Cols 1-8) */}
        <section className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Question {currentIndex + 1} of {totalQuestions}
              </span>

              {/* Review Flag Toggle */}
              <button
                type="button"
                data-testid="mark-review-button"
                onClick={handleToggleFlag}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isCurrentFlagged
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Flag
                  className={`w-3.5 h-3.5 ${
                    isCurrentFlagged ? 'fill-current text-amber-500' : 'text-slate-400'
                  }`}
                />
                <span>{isCurrentFlagged ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-4">
              {currentQuestion.question}
            </h2>

            {/* Question Image if present */}
            {currentQuestion.image && (
              <div className="mb-6 flex flex-col items-center">
                <div
                  className="relative group cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-2 max-w-sm"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <img
                    src={currentQuestion.image}
                    alt={`Question ${currentQuestion.id} illustration`}
                    className="max-h-52 w-auto object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <span className="text-white text-xs font-medium flex items-center space-x-1 bg-black/60 px-2 py-1 rounded">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Click to zoom</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Options (A, B, C, D) without immediate feedback */}
            <div className="space-y-3 mb-6" role="radiogroup" aria-label="Question options">
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
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start space-x-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {option.key}
                    </span>
                    <span className="text-sm font-medium leading-relaxed pt-0.5">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation & Clear Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                data-testid="prev-question-button"
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {selectedForCurrent && (
                <button
                  type="button"
                  data-testid="clear-selection-button"
                  onClick={handleClearAnswer}
                  className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center space-x-1 px-2 py-1 rounded transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Selection</span>
                </button>
              )}

              <button
                type="button"
                data-testid="next-question-button"
                disabled={currentIndex === totalQuestions - 1}
                onClick={handleNext}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-100 transition"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Desktop Sidebar Navigator (Cols 9-12) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-20">
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
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    unansweredCount > 0
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {unansweredCount > 0 ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Submit Examination?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review your progress before finishing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Unanswered warning */}
            {unansweredCount > 0 && (
              <div
                data-testid="unanswered-warning"
                className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300"
              >
                <strong>Warning:</strong> You have{' '}
                <span className="font-bold underline">{unansweredCount} unanswered</span> questions.
                Unanswered questions will be scored as zero.
              </div>
            )}

            {/* Breakdown card */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Answered</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {answeredCount}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Unanswered</div>
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {unansweredCount}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Flagged</div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {flaggedCount}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                data-testid="cancel-submit-button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Keep Working
              </button>
              <button
                type="button"
                data-testid="confirm-submit-button"
                onClick={handleFinalSubmit}
                className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition"
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Exit Exam?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to exit? Your exam progress will not be submitted or saved.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitModal(false);
                  onExit?.();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700"
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
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEngine;
