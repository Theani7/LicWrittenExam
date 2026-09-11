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
  BarChart3,
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Official DoTM Syllabus Compliant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Driving License Test Simulation
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Simulate the real Nepal Driving License written test with time limits and official category quotas, or drill specific categories.
        </p>
      </div>

      {/* Mode Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Official DoTM Exam Simulation */}
        <div
          data-testid="official-exam-card"
          className="relative bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500/80 dark:border-blue-500/60 p-6 sm:p-7 shadow-lg shadow-blue-500/5 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Official Rules
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Official DoTM Exam Simulation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                25 randomly generated questions with exact official category distribution under realistic test constraints.
              </p>
            </div>

            {/* Rules badges */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">25 Questions (4 pts each)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">30 Minutes Limit</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Pass Mark: 60/100 (15 Correct)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Weighted 6 Categories</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="start-official-exam-btn"
            onClick={onStartOfficialExam}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
          >
            <span>Start Official Exam</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Category Practice Drill */}
        <div
          data-testid="category-drill-card"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Targeted Practice
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Category Practice Drill
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Focus on weak subjects or master a specific category with custom question lengths.
              </p>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="category-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Select Category
              </label>
              <select
                id="category-select"
                data-testid="category-select"
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 font-medium"
              >
                {activeCategoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    Cat {cat.id}: {cat.name} ({cat.poolCount} Qs)
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Question Count
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 'all'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    data-testid={`count-option-${opt}`}
                    onClick={() => setSelectedCount(opt as number | 'all')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      selectedCount === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt === 'all' ? 'All' : `${opt} Qs`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="start-category-drill-btn"
            onClick={handleStartCategoryDrill}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition"
          >
            <span>Start Category Drill</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Exam History Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Recent Exam Attempts ({history.length})
            </h3>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              data-testid="clear-history-button"
              onClick={clearHistory}
              className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center space-x-1"
              title="Clear exam history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div
            data-testid="history-empty-state"
            className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
          >
            <Award className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No exam attempts yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Take your first official 25-question exam simulation above to test your readiness and track your scores here!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {history.slice(0, 5).map((attempt) => (
              <div
                key={attempt.id}
                data-testid="history-row"
                className="py-3 sm:py-4 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      attempt.passed
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {attempt.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Score: {attempt.score} / {attempt.totalMarks} ({attempt.correctCount}/
                      {attempt.totalQuestions} correct)
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(attempt.timestamp)} • Took {formatDuration(attempt.timeTakenSeconds)}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300">
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
