import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Target,
  PartyPopper,
} from 'lucide-react';
import type { ExamResult, Question, Category } from '../../types';
import { QuestionReviewItem } from './QuestionReviewItem';

export interface ExamResultViewProps {
  result: ExamResult;
  questions: Question[];
  categories?: Category[];
  onRetakeExam?: () => void;
  onPracticeMissed?: (missedQuestions: Question[]) => void;
  onBackToDashboard?: () => void;
}

type FilterType = 'all' | 'incorrect' | 'correct' | 'unanswered';

function ScoreRing({ percentage, passed }: { percentage: number; passed: boolean }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const [offset, setOffset] = useState(C);
  useEffect(() => {
    const t = requestAnimationFrame(() => setOffset(C - (C * Math.min(100, percentage)) / 100));
    return () => cancelAnimationFrame(t);
  }, [percentage, C]);
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={R} fill="none" strokeWidth="11" className="stroke-zinc-200 dark:stroke-white/10" />
        <circle
          cx="64" cy="64" r={R} fill="none" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={offset}
          className={passed ? 'stroke-emerald-500' : 'stroke-crimson-600'}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-extrabold tracking-tight">{percentage}<small className="text-lg font-bold text-zinc-400">%</small></span>
        <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500">SCORE</span>
      </div>
    </div>
  );
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  questions,
  categories,
  onRetakeExam,
  onPracticeMissed,
  onBackToDashboard,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c8102e', '#003893', '#ffffff', '#f59e0b'],
        });
      } catch { /* headless */ }
    }
  }, [result.passed]);

  const unansweredCount = useMemo(() => questions.filter((q) => result.answers[q.id] == null).length, [questions, result.answers]);
  const incorrectCount = useMemo(() => questions.filter((q) => result.answers[q.id] != null && result.answers[q.id] !== q.correctAnswer).length, [questions, result.answers]);

  const percentage = Math.round((result.score / result.totalMarks) * 100);
  const accuracyPercentage = result.totalQuestions > 0 ? Math.round((result.correctCount / result.totalQuestions) * 100) : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const ans = result.answers[q.id];
      if (filter === 'correct') return ans === q.correctAnswer;
      if (filter === 'incorrect') return ans != null && ans !== q.correctAnswer;
      if (filter === 'unanswered') return ans == null;
      return true;
    });
  }, [questions, result.answers, filter]);

  const missedQuestions = useMemo(() => questions.filter((q) => result.answers[q.id] !== q.correctAnswer), [questions, result.answers]);

  const categoryNameMap = useMemo(() => {
    const map = new Map<number, string>();
    categories?.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
      {/* Verdict hero */}
      <section
        data-testid="result-banner"
        className={`relative mt-6 overflow-hidden rounded-[28px] border p-7 text-center shadow-float sm:p-9 ${
          result.passed
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 via-white to-white dark:from-emerald-500/20 dark:via-ink-900 dark:to-ink-900'
            : 'border-crimson-500/40 bg-gradient-to-b from-crimson-600/10 via-white to-white dark:from-crimson-600/20 dark:via-ink-900 dark:to-ink-900'
        }`}
      >
        <div className="bg-dot-grid-faint absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-xl space-y-5">
          {result.passed ? (
            <span data-testid="verdict-passed" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 font-mono text-[12px] font-bold tracking-widest text-white shadow-lg shadow-emerald-600/30">
              <PartyPopper className="h-4 w-4" /> PASSED · LICENSE READY
            </span>
          ) : (
            <span data-testid="verdict-failed" className="inline-flex items-center gap-1.5 rounded-full bg-crimson-600 px-4 py-1.5 font-mono text-[12px] font-bold tracking-widest text-white shadow-glow-crimson">
              <XCircle className="h-4 w-4" /> NOT YET — KEEP PUSHING
            </span>
          )}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <ScoreRing percentage={percentage} passed={result.passed} />
            <div className="text-center sm:text-left">
              <p className="font-mono text-4xl font-extrabold tracking-tight sm:text-5xl">
                {result.score}<span className="text-xl font-bold text-zinc-400">/{result.totalMarks}</span>
              </p>
              <p className="mt-1 font-mono text-[13px] font-bold text-zinc-500">
                {percentage}% Score · {result.correctCount}/{result.totalQuestions} correct · Pass 60%
              </p>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                {result.passed
                  ? 'Badhai chha! You cleared the 60% DoTM threshold. Now repeat it twice more to lock it in.'
                  : 'You missed the 60% line this time. Drill the red categories below — most students pass within 3 focused retries.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {onRetakeExam && (
              <button type="button" data-testid="retake-exam-top-btn" onClick={onRetakeExam} className="btn-primary">
                <RotateCcw className="h-4 w-4" /> Retake exam
              </button>
            )}
            {onPracticeMissed && missedQuestions.length > 0 && (
              <button type="button" data-testid="practice-missed-top-btn" onClick={() => onPracticeMissed(missedQuestions)} className="btn-navy">
                <Target className="h-4 w-4" /> Drill missed ({missedQuestions.length})
              </button>
            )}
            {onBackToDashboard && (
              <button type="button" data-testid="back-dashboard-top-btn" onClick={onBackToDashboard} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Award, label: 'SCORE', value: `${result.score}/${result.totalMarks}`, tint: 'text-crimson-600 bg-crimson-50 dark:bg-crimson-950/40', bar: 'from-crimson-600 to-rose-400' },
          { icon: Target, label: 'ACCURACY', value: `${accuracyPercentage}%`, tint: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300', bar: 'from-navy-700 to-blue-500' },
          { icon: Clock, label: 'TIME', value: formatTime(result.timeTakenSeconds), tint: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40', bar: 'from-amber-500 to-orange-400' },
          { icon: Sparkles, label: 'VERDICT', value: result.passed ? 'PASS' : 'FAIL', tint: result.passed ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-crimson-600 bg-crimson-50 dark:bg-crimson-950/40', bar: result.passed ? 'from-emerald-500 to-teal-400' : 'from-zinc-400 to-zinc-500' },
        ].map((s) => (
          <div key={s.label} className="card-premium card-lift overflow-hidden p-4">
            <span className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.tint}`}><s.icon className="h-4 w-4" /></span>
            <p className="font-mono text-[10px] font-bold tracking-widest text-zinc-400">{s.label}</p>
            <p className="font-mono text-2xl font-extrabold tracking-tight">{s.value}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"><div className={`h-full rounded-full bg-gradient-to-r ${s.bar}`} style={{ width: s.label === 'ACCURACY' ? `${accuracyPercentage}%` : s.label === 'SCORE' ? `${percentage}%` : '100%' }} /></div>
          </div>
        ))}
        <div className="col-span-2 flex items-center justify-center gap-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 font-mono text-[13px] font-bold shadow-card dark:border-white/10 dark:bg-ink-900 sm:col-span-4">
          <span className="text-emerald-600">{result.correctCount} ✓ right</span>
          <span className="text-zinc-300">·</span>
          <span className="text-crimson-600">{incorrectCount} ✗ wrong</span>
          <span className="text-zinc-300">·</span>
          <span className="text-zinc-400">{unansweredCount} — skipped</span>
        </div>
      </section>

      {/* Categories */}
      {result.categoryScores && result.categoryScores.length > 0 && (
        <section className="card-premium mt-4 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-white/10">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight"><BarChart3 className="h-4 w-4 text-navy-700 dark:text-blue-400" /> Category Performance Breakdown</h2>
            <span className="font-mono text-[11px] font-bold text-zinc-400">{result.categoryScores.length} SECTIONS</span>
          </div>
          <div className="space-y-4 pt-4">
            {result.categoryScores.map((cat) => {
              const acc = cat.totalAsked > 0 ? Math.round((cat.correctCount / cat.totalAsked) * 100) : 0;
              const name = categoryNameMap.get(cat.categoryId) || cat.categoryName;
              const good = acc >= 60;
              return (
                <div key={cat.categoryId} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="min-w-0 truncate font-bold">{name}</span>
                    <span className="shrink-0 font-mono text-[12px] font-bold text-zinc-500">{cat.correctCount}/{cat.totalAsked} · {cat.score}/{cat.maxScore} PTS</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
                    <div className={`h-full rounded-full transition-all ${good ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-crimson-600 to-rose-400'}`} style={{ width: `${acc}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Review */}
      <section className="mt-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Answer review</h2>
            <p className="text-[13px] text-zinc-500">Compare your picks against the official DoTM key.</p>
          </div>
          <div className="flex items-center gap-1 rounded-2xl border border-zinc-200 bg-white p-1 shadow-card dark:border-white/10 dark:bg-ink-900">
            {([['all', `ALL ${result.totalQuestions}`], ['incorrect', `WRONG ${incorrectCount}`], ['correct', `RIGHT ${result.correctCount}`], ['unanswered', `LEFT ${unansweredCount}`]] as [FilterType, string][]).map(([id, label]) => (
              <button key={id} type="button" data-testid={`filter-${id}-btn`} onClick={() => setFilter(id)}
                className={`whitespace-nowrap rounded-xl px-3 py-2 font-mono text-[11px] font-bold transition ${filter === id ? (id === 'incorrect' ? 'bg-crimson-600 text-white' : id === 'correct' ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="card-premium p-10 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500" />
            <h3 className="mt-2 font-extrabold">Nothing in this filter</h3>
            <p className="text-sm text-zinc-500">Try another tab to review different questions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <QuestionReviewItem key={q.id} question={q} questionNumber={questions.findIndex((o) => o.id === q.id) + 1 || idx + 1} categoryName={categoryNameMap.get(q.categoryId)} userAnswer={result.answers[q.id]} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 flex flex-col gap-2.5 border-t border-zinc-200 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        {onBackToDashboard && (
          <button type="button" data-testid="back-dashboard-bottom-btn" onClick={onBackToDashboard} className="btn-ghost w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </button>
        )}
        <div className="flex w-full gap-2.5 sm:w-auto">
          {onPracticeMissed && missedQuestions.length > 0 && (
            <button type="button" data-testid="practice-missed-bottom-btn" onClick={() => onPracticeMissed(missedQuestions)} className="btn-navy flex-1 sm:flex-none">
              <Target className="h-4 w-4" /> Drill missed
            </button>
          )}
          {onRetakeExam && (
            <button type="button" data-testid="retake-exam-bottom-btn" onClick={onRetakeExam} className="btn-primary flex-1 sm:flex-none">
              <RotateCcw className="h-4 w-4" /> Retake
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExamResultView;
