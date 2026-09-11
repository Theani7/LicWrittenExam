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
  LayoutGrid,
  ZoomIn,
  LogOut,
} from 'lucide-react';
import type { Question, OptionKey } from '../../types';
import { QuestionNavigator } from './QuestionNavigator';

export interface ExamEngineProps {
  questions: Question[];
  title?: string;
  durationSeconds?: number;
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

  const answeredCount = useMemo(() => questions.filter((q) => answers[q.id] != null).length, [questions, answers]);
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = useMemo(() => questions.filter((q) => flaggedQuestionIds.has(q.id)).length, [questions, flaggedQuestionIds]);

  const handleFinalSubmit = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.max(0, durationSeconds - remainingSeconds);
    onSubmit(answers, timeTaken);
  }, [answers, durationSeconds, remainingSeconds, onSubmit]);

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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [durationSeconds, handleFinalSubmit]);

  // Keyboard: arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (showSubmitModal || showExitModal) return;
      if (e.key === 'ArrowRight') setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSubmitModal, showExitModal, totalQuestions]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = remainingSeconds < 300 && remainingSeconds > 0;

  const handleSelectOption = (key: OptionKey) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }));
  };
  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => { const copy = { ...prev }; delete copy[currentQuestion.id]; return copy; });
  };
  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  };
  const handleNext = () => { if (currentIndex < totalQuestions - 1) setCurrentIndex((p) => p + 1); };
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex((p) => p - 1); };

  if (totalQuestions === 0) {
    return (
      <div className="mx-auto my-12 max-w-md p-6 text-center card-premium">
        <p className="text-sm text-zinc-500">No questions available for this exam.</p>
        {onExit && <button type="button" onClick={onExit} className="btn-navy mt-4">Back to dashboard</button>}
      </div>
    );
  }

  const selectedForCurrent = currentQuestion ? answers[currentQuestion.id] : null;
  const isCurrentFlagged = currentQuestion ? flaggedQuestionIds.has(currentQuestion.id) : false;

  return (
    <div className="min-h-screen">
      {/* Exam top bar */}
      <header className="glass sticky top-[68px] z-30 border-b border-zinc-200/70 bg-white/80 dark:border-white/10 dark:bg-[#060b16]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            {onExit && (
              <button type="button" onClick={() => setShowExitModal(true)} title="Exit exam" aria-label="Exit exam"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400 transition hover:text-crimson-600 hover:border-crimson-300 dark:border-white/10 dark:bg-white/5">
                <LogOut className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold tracking-tight sm:text-[15px]">{title}</h1>
              <p className="font-mono text-[11px] font-bold text-zinc-500">Q {currentIndex + 1} / {totalQuestions} · {answeredCount} ANSWERED</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div data-testid="exam-timer"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[15px] font-extrabold tabular-nums ${
                isTimeCritical
                  ? 'border-crimson-300 bg-crimson-50 text-rose-600 animate-pulse dark:border-crimson-800 dark:bg-crimson-950/50 dark:text-rose-400'
                  : 'border-zinc-200 bg-zinc-900 text-white dark:border-white/10 dark:bg-white dark:text-zinc-900'
              }`}>
              <Clock className="h-4 w-4" />
              {formatTime(remainingSeconds)}
            </div>
            <button type="button" onClick={() => setShowMobileNavigator(true)} aria-label="Open navigator"
              className="btn-ghost !px-3 !py-2 lg:hidden">
              <LayoutGrid className="h-4 w-4" /><span className="hidden sm:inline font-mono text-[12px]">GRID</span>
            </button>
            <button type="button" data-testid="submit-exam-button" onClick={() => setShowSubmitModal(true)}
              className="rounded-xl bg-crimson-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow-crimson transition hover:bg-crimson-700 active:scale-[0.98] sm:text-sm">
              Submit
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-zinc-100 dark:bg-white/5">
          <div className="h-full bg-gradient-to-r from-navy-700 via-crimson-600 to-amber-400 transition-all duration-300" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-5 p-4 sm:p-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="card-premium overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-5 py-3.5 dark:border-white/10 sm:px-7">
              <span className="inline-flex items-center gap-2 font-mono text-[12px] font-bold text-zinc-500">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 font-mono text-[12px] text-white dark:bg-white dark:text-zinc-900">{currentIndex + 1}</span>
                OF {totalQuestions}
              </span>
              <button type="button" data-testid="mark-review-button" onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[12px] font-bold transition active:scale-[0.97] ${
                  isCurrentFlagged
                    ? 'border-crimson-300 bg-crimson-50 text-crimson-700 dark:border-crimson-800 dark:bg-crimson-950/40 dark:text-crimson-300'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
                }`}>
                <Flag className={`h-3.5 w-3.5 ${isCurrentFlagged ? 'fill-current' : ''}`} />
                {isCurrentFlagged ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <h2 className="text-balance text-[17px] font-bold leading-relaxed tracking-tight sm:text-xl">
                {currentQuestion.question}
              </h2>

              {currentQuestion.image && (
                <div className="mt-4 flex justify-center">
                  <button type="button" onClick={() => setIsImageModalOpen(true)}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-navy-400 hover:shadow-card-hover dark:border-white/10 dark:bg-white/5">
                    <img src={currentQuestion.image} alt={`Question ${currentQuestion.id} illustration`} className="max-h-52 w-auto object-contain" />
                    <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 transition group-hover:bg-zinc-900/20">
                      <span className="flex items-center gap-1.5 rounded-full bg-zinc-900/90 px-3 py-1.5 font-mono text-[11px] font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                        <ZoomIn className="h-3.5 w-3.5" /> ZOOM
                      </span>
                    </span>
                  </button>
                </div>
              )}

              <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Question options">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedForCurrent === option.key;
                  return (
                    <button key={option.key} type="button" role="radio" aria-checked={isSelected} data-testid={`option-${option.key}`}
                      onClick={() => handleSelectOption(option.key)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all active:scale-[0.995] ${
                        isSelected
                          ? 'border-navy-700 bg-blue-50/80 shadow-[0_0_0_3px_rgb(0_56_147/0.12)] dark:border-blue-500/60 dark:bg-blue-500/10'
                          : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-card dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'
                      }`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold transition ${
                        isSelected ? 'border-navy-700 bg-navy-700 text-white' : 'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300'
                      }`}>{option.key}</span>
                      <span className="flex-1 text-[15px] font-medium leading-relaxed">{option.text}</span>
                      {isSelected && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-navy-700 dark:bg-blue-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-white/10">
                <button type="button" data-testid="prev-question-button" disabled={currentIndex === 0} onClick={handlePrevious}
                  className="btn-ghost disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                {selectedForCurrent ? (
                  <button type="button" data-testid="clear-selection-button" onClick={handleClearAnswer}
                    className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-zinc-400 transition hover:text-crimson-600">
                    <RotateCcw className="h-3.5 w-3.5" /> CLEAR
                  </button>
                ) : <span className="font-mono text-[11px] text-zinc-300 dark:text-zinc-600">SELECT AN OPTION</span>}
                <button type="button" data-testid="next-question-button" disabled={currentIndex === totalQuestions - 1} onClick={handleNext}
                  className="btn-navy !py-2.5 disabled:opacity-40">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-zinc-400">← → keys to move · answers auto-save · timer auto-submits at 00:00</p>
        </section>

        <aside className="hidden lg:col-span-4 lg:block lg:sticky lg:top-[132px]">
          <QuestionNavigator questions={questions} currentIndex={currentIndex} answers={answers} flaggedQuestionIds={flaggedQuestionIds} onSelectQuestion={(idx) => setCurrentIndex(idx)} />
          <button type="button" onClick={() => setShowSubmitModal(true)} className="btn-primary mt-3 w-full !py-3.5">
            Review & submit · {answeredCount}/{totalQuestions}
          </button>
        </aside>
      </main>

      {showMobileNavigator && (
        <div data-testid="mobile-navigator-overlay" className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-fade-in sm:items-center lg:hidden">
          <div className="w-full max-w-sm animate-scale-in">
            <QuestionNavigator questions={questions} currentIndex={currentIndex} answers={answers} flaggedQuestionIds={flaggedQuestionIds}
              onSelectQuestion={(idx) => { setCurrentIndex(idx); setShowMobileNavigator(false); }} onClose={() => setShowMobileNavigator(false)} />
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div data-testid="submit-dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-float dark:border-white/10 dark:bg-ink-900 animate-scale-in">
            <div className={`h-1.5 ${unansweredCount > 0 ? 'bg-gradient-to-r from-amber-400 to-crimson-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} />
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${unansweredCount > 0 ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-950/40' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-950/40'}`}>
                    {unansweredCount > 0 ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  </span>
                  <div>
                    <h3 className="font-extrabold tracking-tight">Submit exam?</h3>
                    <p className="font-mono text-[11px] font-bold text-zinc-400">FINAL CHECK</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowSubmitModal(false)} aria-label="Close dialog" className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {unansweredCount > 0 && (
                <div data-testid="unanswered-warning" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                  <strong>{unansweredCount} unanswered.</strong> They score 0 — consider guessing, there&apos;s no negative marking.
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'DONE', value: answeredCount, tint: 'text-navy-700 dark:text-blue-300' },
                  { label: 'LEFT', value: unansweredCount, tint: 'text-zinc-600 dark:text-zinc-300' },
                  { label: 'FLAGGED', value: flaggedCount, tint: 'text-crimson-600' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-zinc-50 px-2 py-3 ring-1 ring-zinc-100 dark:bg-white/5 dark:ring-white/10">
                    <p className="font-mono text-[10px] font-bold text-zinc-400">{s.label}</p>
                    <p className={`font-mono text-2xl font-extrabold ${s.tint}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button type="button" data-testid="cancel-submit-button" onClick={() => setShowSubmitModal(false)} className="btn-ghost flex-1">Keep writing</button>
                <button type="button" data-testid="confirm-submit-button" onClick={handleFinalSubmit} className="flex-1 rounded-xl bg-crimson-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow-crimson transition hover:bg-crimson-700">Submit now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-float dark:border-white/10 dark:bg-ink-900 animate-scale-in">
            <h3 className="font-extrabold tracking-tight">Exit exam?</h3>
            <p className="mt-1.5 text-sm text-zinc-500">Progress won&apos;t be saved or scored. This can&apos;t be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowExitModal(false)} className="btn-ghost">Keep writing</button>
              <button type="button" onClick={() => { setShowExitModal(false); onExit?.(); }} className="rounded-xl bg-crimson-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-crimson-700">Exit</button>
            </div>
          </div>
        </div>
      )}

      {isImageModalOpen && currentQuestion?.image && (
        <div className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-zinc-950/85 p-4 backdrop-blur-md" onClick={() => setIsImageModalOpen(false)}>
          <img src={currentQuestion.image} alt="Expanded view" className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-float" />
        </div>
      )}
    </div>
  );
};

export default ExamEngine;
