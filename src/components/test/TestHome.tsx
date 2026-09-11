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
          className="relative bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-6 shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-md bg-crimson-600 text-white flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-crimson-700 dark:text-crimson-300 bg-crimson-50 dark:bg-crimson-950/70 px-2.5 py-0.5 rounded border border-crimson-200 dark:border-crimson-900">
                OFFICIAL SIMULATION
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Official DoTM Exam Simulation
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                25 weighted questions randomly sampled across the 6 official syllabus categories with a 30-minute timer.
              </p>
            </div>

            {/* Rules badges */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
              <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-navy-950/60 border border-zinc-200 dark:border-navy-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-navy-600 dark:text-navy-400 shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-xs">25 Qs (4 pts each)</span>
              </div>
              <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-navy-950/60 border border-zinc-200 dark:border-navy-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-xs">Pass: 60 / 100</span>
              </div>
              <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-navy-950/60 border border-zinc-200 dark:border-navy-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-xs">30 Mins (72s/Q)</span>
              </div>
              <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-navy-950/60 border border-zinc-200 dark:border-navy-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-xs">No Penalty</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="start-official-exam-btn"
            onClick={onStartOfficialExam}
            className="w-full py-3 px-5 bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-md shadow-xs flex items-center justify-center gap-2 transition"
          >
            <span>Start Official Exam Simulation</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Card 2: Category Practice Drill */}
        <div
          data-testid="category-drill-card"
          className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-6 shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-md bg-navy-700 text-white flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-navy-700 dark:text-navy-300 bg-navy-50 dark:bg-navy-950/70 px-2.5 py-0.5 rounded border border-navy-200 dark:border-navy-900">
                CATEGORY DRILL
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
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
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50 dark:bg-navy-950 border border-zinc-300 dark:border-navy-800 rounded-md text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-navy-600"
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
                    className={`py-2 text-xs sm:text-sm rounded-md border font-bold transition ${
                      selectedCount === opt
                        ? 'bg-navy-700 text-white border-navy-700 shadow-2xs'
                        : 'bg-zinc-50 dark:bg-navy-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-navy-900 hover:border-zinc-300'
                    }`}
                  >
                    {opt === 'all' ? 'ALL' : `${opt} QS`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="start-category-drill-btn"
            onClick={handleStartCategoryDrill}
            className="w-full py-2.5 px-4 bg-navy-700 hover:bg-navy-800 active:scale-[0.99] text-white font-medium text-xs rounded-md shadow-2xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Start Category Drill</span>
            <ChevronRight className="w-4 h-4" />
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
