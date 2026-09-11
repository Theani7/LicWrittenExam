import React, { useState } from 'react';
import {
  Award,
  Clock,
  FileCheck2,
  Target,
  History,
  Trash2,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';
import type { Category } from '../../types';
import { useExamHistory } from '../../hooks/useExamHistory';

export interface TestHomeProps {
  categories?: Category[];
  onStartOfficialExam: () => void;
  onStartCategoryExam: (categoryId: number, count?: number) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Knowledge Related to Vehicle Operation', slug: 'vehicle-operation', poolCount: 130, examWeight: 6 },
  { id: 2, name: 'Knowledge of Vehicle Laws', slug: 'vehicle-laws', poolCount: 90, examWeight: 5 },
  { id: 3, name: 'Technical and Mechanical Knowledge of Vehicles', slug: 'technical-mechanical', poolCount: 80, examWeight: 3 },
  { id: 4, name: 'Conceptual Knowledge of Environmental Pollution', slug: 'environmental-pollution', poolCount: 30, examWeight: 2 },
  { id: 5, name: 'Knowledge on Accident Awareness', slug: 'accident-awareness', poolCount: 60, examWeight: 3 },
  { id: 6, name: 'Knowledge of Traffic Signs', slug: 'traffic-signs', poolCount: 110, examWeight: 6 },
];

export const TestHome: React.FC<TestHomeProps> = ({
  categories = DEFAULT_CATEGORIES,
  onStartOfficialExam,
  onStartCategoryExam,
}) => {
  const { history, clearHistory } = useExamHistory();
  const [selectedCatId, setSelectedCatId] = useState<number>(categories[0]?.id ?? 1);
  const [selectedCount, setSelectedCount] = useState<number | 'all'>(20);

  const activeCategoryList = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const currentSelectedCategory = activeCategoryList.find((c) => c.id === selectedCatId);

  const handleStartCategoryDrill = () => {
    const count = selectedCount === 'all' ? currentSelectedCategory?.poolCount || 999 : selectedCount;
    onStartCategoryExam(selectedCatId, count);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number): string => {
    try {
      return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return 'Recent'; }
  };

  const bestScore = history.length ? Math.max(...history.map((h) => Math.round((h.score / h.totalMarks) * 100))) : null;
  const passRate = history.length ? Math.round((history.filter((h) => h.passed).length / history.length) * 100) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden rounded-[28px] bg-zinc-950 text-white shadow-float">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-crimson-700 via-[#1a0b18] to-navy-900" />
          <div className="bg-diagonal-lines absolute inset-0 opacity-40" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-crimson-600/40 blur-[90px]" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-600/40 blur-[90px]" />
        </div>
        <div className="relative grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest text-white ring-1 ring-white/20 backdrop-blur">
              <Award className="h-3.5 w-3.5 text-amber-300" /> OFFICIAL DOTM FORMAT
            </span>
            <h1 className="text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Walk into the likhit exam like you&apos;ve already passed it.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-white/70 sm:text-[15px]">
              A true 25-question, 30-minute simulation sampled by official weightage — plus focused drills for signs, laws and mechanics.
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-[11px] font-bold">
              <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">25 QS · 4 PTS EACH</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">PASS 60/100</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">30 MIN · NO NEGATIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { label: 'Attempts', value: String(history.length), icon: History },
              { label: 'Best score', value: bestScore !== null ? `${bestScore}%` : '—', icon: TrendingUp },
              { label: 'Pass rate', value: passRate !== null ? `${passRate}%` : '—', icon: Zap },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/[0.07] p-3.5 text-center ring-1 ring-white/15 backdrop-blur">
                <s.icon className="mx-auto mb-1.5 h-4 w-4 text-white/60" />
                <p className="font-mono text-xl font-extrabold">{s.value}</p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mode cards */}
      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {/* Official */}
        <div data-testid="official-exam-card" className="card-premium card-lift relative overflow-hidden p-6 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-crimson-700 via-rose-500 to-amber-400" />
          <div className="bg-dot-grid-faint absolute inset-0 opacity-60 [mask-image:radial-gradient(20rem_10rem_at_100%_0%,black,transparent)]" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson-700 to-rose-500 text-white shadow-glow-crimson">
                <FileCheck2 className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-crimson-600 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-white">OFFICIAL SIM</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Official DoTM Exam Simulation</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Weighted sampling across all 6 categories — exactly like the DoTM paper. Timer, navigator, flagging and auto-submit included.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: HelpCircle, label: '25 Qs · 100 marks', tint: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60' },
                { icon: CheckCircle2, label: 'Pass at 60', tint: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60' },
                { icon: Clock, label: '30 min timer', tint: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60' },
                { icon: ShieldCheck, label: 'No negative', tint: 'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-900/60' },
              ].map((b) => (
                <div key={b.label} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 font-mono text-[12px] font-bold ring-1 ${b.tint}`}>
                  <b.icon className="h-4 w-4 shrink-0" /> {b.label}
                </div>
              ))}
            </div>
            <button type="button" data-testid="start-official-exam-btn" onClick={onStartOfficialExam} className="btn-primary w-full !py-4 text-[15px]">
              Start official simulation <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drill */}
        <div data-testid="category-drill-card" className="card-premium card-lift relative overflow-hidden p-6 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-navy-800 via-blue-600 to-cyan-400" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-blue-600 text-white shadow-glow-navy">
                <Target className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-navy-700 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-white">FOCUSED DRILL</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Category Drill</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Attack your weakest section — traffic signs alone carry 24 marks.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="category-select" className="mb-1.5 block font-mono text-[11px] font-bold tracking-widest text-zinc-500">CATEGORY</label>
                <select
                  id="category-select"
                  data-testid="category-select"
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(Number(e.target.value))}
                  className="w-full cursor-pointer rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm font-bold outline-none transition focus:border-navy-600 focus:ring-4 focus:ring-navy-600/10 dark:border-white/10 dark:bg-white/5"
                >
                  {activeCategoryList.map((cat) => (
                    <option key={cat.id} value={cat.id}>Cat 0{cat.id} · {cat.name} ({cat.poolCount})</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="mb-1.5 block font-mono text-[11px] font-bold tracking-widest text-zinc-500">QUESTIONS</span>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 'all'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      data-testid={`count-option-${opt}`}
                      onClick={() => setSelectedCount(opt as number | 'all')}
                      className={`rounded-xl border py-3 font-mono text-[13px] font-bold transition active:scale-[0.97] ${
                        selectedCount === opt
                          ? 'border-navy-700 bg-navy-700 text-white shadow-glow-navy'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-navy-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300'
                      }`}
                    >
                      {opt === 'all' ? 'ALL' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" data-testid="start-category-drill-btn" onClick={handleStartCategoryDrill} className="btn-navy w-full !py-4 text-[15px]">
              Start drill{currentSelectedCategory ? ` · ${currentSelectedCategory.poolCount > 0 ? (selectedCount === 'all' ? currentSelectedCategory.poolCount : selectedCount) : ''} Qs` : ''} <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="card-premium mt-4 p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-white/10">
          <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
            <History className="h-4 w-4 text-zinc-400" /> Recent attempts ({history.length})
          </h3>
          {history.length > 0 && (
            <button type="button" data-testid="clear-history-button" onClick={clearHistory} className="flex items-center gap-1 font-mono text-[11px] font-bold text-zinc-400 transition hover:text-crimson-600">
              <Trash2 className="h-3 w-3" /> CLEAR
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div data-testid="history-empty-state" className="mt-3 rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-white/15">
            <p className="text-sm font-bold">No attempts yet — your history will live here</p>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-zinc-500">Finish one official simulation to see your score, accuracy and trend.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {history.slice(0, 5).map((attempt) => (
              <div key={attempt.id} data-testid="history-row" className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${attempt.passed ? 'bg-emerald-600 text-white' : 'bg-crimson-600 text-white'}`}>
                    {attempt.passed ? 'PASS' : 'FAIL'}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold">{attempt.score}/{attempt.totalMarks} pts · {attempt.correctCount}/{attempt.totalQuestions} correct</p>
                    <p className="font-mono text-[11px] text-zinc-400">{formatDate(attempt.timestamp)} · {formatDuration(attempt.timeTakenSeconds)}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-sm font-extrabold">{Math.round((attempt.correctCount / attempt.totalQuestions) * 100)}%</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TestHome;
