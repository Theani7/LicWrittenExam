import React, { useState } from 'react';
import {
  Award,
  Clock,
  FileCheck,
  Target,
  History,
  Trash2,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
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
    const count =
      selectedCount === 'all'
        ? currentSelectedCategory?.poolCount || 999
        : selectedCount;
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
      const d = new Date(timestamp);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-crimson-200 dark:border-crimson-900 bg-crimson-50 dark:bg-crimson-950/70 text-crimson-700 dark:text-crimson-300 font-mono text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>OFFICIAL DoTM CURRICULUM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Exam Simulation &amp; Category Drills
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Simulate the timed Nepal driving license written examination under official rules, or practice focused categories.
        </p>
      </div>

      {/* Mode Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Official DoTM Exam Simulation */}
        <div
          data-testid="official-exam-card"
          className="relative bg-white dark:bg-[#0c1424] rounded-xl border-2 border-crimson-500/40 dark:border-crimson-600/40 p-6 sm:p-7 shadow-sm shadow-crimson-600/10 flex flex-col justify-between space-y-6 overflow-hidden"
        >
          {/* Subtle colorful top gradient strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-crimson-600 via-rose-500 to-crimson-700" />

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-crimson-600 text-white flex items-center justify-center font-bold shadow-sm shadow-crimson-600/30">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-white bg-crimson-600 px-3 py-1 rounded-md shadow-xs">
                OFFICIAL SIMULATION
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Official DoTM Exam Simulation
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                25 weighted questions randomly sampled across the 6 official syllabus categories with a 30-minute timer.
              </p>
            </div>

            {/* Rules badges */}
            <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 font-mono">
              <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-blue-950 dark:text-blue-200 font-bold text-xs">25 Qs (4 pts each)</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-950 dark:text-emerald-200 font-bold text-xs">Pass: 60 / 100</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-amber-950 dark:text-amber-200 font-bold text-xs">30 Mins (72s/Q)</span>
              </div>
              <div className="p-3 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="text-purple-950 dark:text-purple-200 font-bold text-xs">No Penalty</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="start-official-exam-btn"
            onClick={onStartOfficialExam}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-crimson-600 via-rose-600 to-crimson-700 hover:from-crimson-700 hover:to-rose-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-lg shadow-md shadow-crimson-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>Start Official Exam Simulation</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Card 2: Category Practice Drill */}
        <div
          data-testid="category-drill-card"
          className="relative bg-white dark:bg-[#0c1424] rounded-xl border-2 border-navy-700/40 dark:border-blue-600/40 p-6 sm:p-7 shadow-sm shadow-navy-700/10 flex flex-col justify-between space-y-6 overflow-hidden"
        >
          {/* Subtle colorful top gradient strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy-700 via-blue-600 to-indigo-700" />

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-navy-700 text-white flex items-center justify-center font-bold shadow-sm shadow-navy-700/30">
                <Target className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-white bg-navy-700 px-3 py-1 rounded-md shadow-xs">
                CATEGORY DRILL
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Category Practice Drill
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                Focus on high-yield areas like Traffic Signs or Mechanical rules with customizable question count.
              </p>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="category-select"
                className="block font-mono text-xs font-bold text-zinc-600 dark:text-zinc-300 tracking-wider"
              >
                SELECT CATEGORY
              </label>
              <select
                id="category-select"
                data-testid="category-select"
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(Number(e.target.value))}
                className="w-full px-3.5 py-3 text-xs sm:text-sm bg-zinc-50 dark:bg-navy-950 border border-zinc-300 dark:border-navy-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-navy-600"
              >
                {activeCategoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    Cat 0{cat.id}: {cat.name} ({cat.poolCount} Qs)
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <span className="block font-mono text-xs font-bold text-zinc-600 dark:text-zinc-300 tracking-wider">
                QUESTION COUNT
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {[10, 20, 'all'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    data-testid={`count-option-${opt}`}
                    onClick={() => setSelectedCount(opt as number | 'all')}
                    className={`py-2.5 text-xs sm:text-sm rounded-lg border font-bold transition ${
                      selectedCount === opt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20'
                        : 'bg-zinc-50 dark:bg-navy-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-900 hover:border-blue-300'
                    }`}
                  >
                    {opt === 'all' ? 'ALL POOL' : `${opt} QUESTIONS`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="start-category-drill-btn"
            onClick={handleStartCategoryDrill}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-navy-700 via-blue-700 to-navy-800 hover:from-navy-800 hover:to-blue-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-lg shadow-md shadow-navy-700/30 flex items-center justify-center gap-2 transition"
          >
            <span>Start Practice Drill</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recent Exam History Summary */}
      <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-navy-900 pb-2.5">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">
              Recent Exam Attempts ({history.length})
            </h3>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              data-testid="clear-history-button"
              onClick={clearHistory}
              className="text-[11px] font-mono text-zinc-400 hover:text-crimson-600 flex items-center gap-1 transition-colors"
              title="Clear exam history"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div
            data-testid="history-empty-state"
            className="text-center py-6 px-4 border border-dashed border-zinc-200 dark:border-navy-900 rounded space-y-1.5"
          >
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              No exam attempts recorded yet
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto">
              Complete your first 25-question simulation above to test your readiness and track scores here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-navy-900/60 overflow-hidden font-mono">
            {history.slice(0, 5).map((attempt) => (
              <div
                key={attempt.id}
                data-testid="history-row"
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      attempt.passed
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-crimson-100 dark:bg-crimson-950/60 text-crimson-800 dark:text-crimson-300 border border-crimson-300 dark:border-crimson-800'
                    }`}
                  >
                    {attempt.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                      {attempt.score} / {attempt.totalMarks} PTS ({attempt.correctCount}/
                      {attempt.totalQuestions} CORRECT)
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {formatDate(attempt.timestamp)} • TOOK {formatDuration(attempt.timeTakenSeconds)}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                    {Math.round((attempt.correctCount / attempt.totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHome;
