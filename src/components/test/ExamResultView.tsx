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

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  questions,
  categories,
  onRetakeExam,
  onPracticeMissed,
  onBackToDashboard,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  // Confetti explosion on pass
  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback in test or headless environments
      }
    }
  }, [result.passed]);

  // Derived counts
  const unansweredCount = useMemo(() => {
    return questions.filter((q) => result.answers[q.id] == null).length;
  }, [questions, result.answers]);

  const incorrectCount = useMemo(() => {
    return questions.filter(
      (q) => result.answers[q.id] != null && result.answers[q.id] !== q.correctAnswer
    ).length;
  }, [questions, result.answers]);

  const percentage = Math.round((result.score / result.totalMarks) * 100);
  const accuracyPercentage =
    result.totalQuestions > 0
      ? Math.round((result.correctCount / result.totalQuestions) * 100)
      : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtered review questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const ans = result.answers[q.id];
      if (filter === 'correct') return ans === q.correctAnswer;
      if (filter === 'incorrect') return ans != null && ans !== q.correctAnswer;
      if (filter === 'unanswered') return ans == null;
      return true;
    });
  }, [questions, result.answers, filter]);

  // Questions answered incorrectly or left blank for targeted practice
  const missedQuestions = useMemo(() => {
    return questions.filter((q) => result.answers[q.id] !== q.correctAnswer);
  }, [questions, result.answers]);

  const categoryNameMap = useMemo(() => {
    const map = new Map<number, string>();
    categories?.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Pass / Fail Banner */}
      <div
        data-testid="result-banner"
        className={`rounded-3xl p-6 sm:p-8 text-center border shadow-lg relative overflow-hidden ${
          result.passed
            ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
        }`}
      >
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-xs">
            {result.passed ? (
              <span
                data-testid="verdict-passed"
                className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-1.5 rounded-full shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>PASSED</span>
              </span>
            ) : (
              <span
                data-testid="verdict-failed"
                className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-4 py-1.5 rounded-full shadow-md shadow-rose-500/20"
              >
                <XCircle className="w-4 h-4" />
                <span>FAILED</span>
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              {result.score} <span className="text-2xl sm:text-3xl text-slate-500 font-bold">/ {result.totalMarks} Marks</span>
            </h1>
            <p className="text-xl font-bold text-slate-700 dark:text-slate-300">
              {percentage}% Score
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {result.passed
              ? 'Congratulations! You achieved the required pass threshold (>= 60%) for the Nepal Driving License Written Exam.'
              : 'You did not achieve the required 60% pass mark. Review the questions you missed below and attempt another practice test!'}
          </p>

          {/* Quick Top Actions */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {onRetakeExam && (
              <button
                type="button"
                data-testid="retake-exam-top-btn"
                onClick={onRetakeExam}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </button>
            )}

            {onPracticeMissed && missedQuestions.length > 0 && (
              <button
                type="button"
                data-testid="practice-missed-top-btn"
                onClick={() => onPracticeMissed(missedQuestions)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition"
              >
                <Target className="w-4 h-4" />
                <span>Practice Missed ({missedQuestions.length})</span>
              </button>
            )}

            {onBackToDashboard && (
              <button
                type="button"
                data-testid="back-dashboard-top-btn"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Stat 1: Total Score */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {result.score} <span className="text-xs font-medium text-slate-500">/ {result.totalMarks}</span>
          </div>
        </div>

        {/* Stat 2: Accuracy */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Accuracy</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {accuracyPercentage}%
          </div>
        </div>

        {/* Stat 3: Time Taken */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Time Taken</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {formatTime(result.timeTakenSeconds)}
          </div>
        </div>

        {/* Stat 4: Answer Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Breakdown</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold pt-1">
            <span className="text-emerald-600 dark:text-emerald-400" title="Correct">
              {result.correctCount} ✓
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-rose-600 dark:text-rose-400" title="Incorrect">
              {incorrectCount} ✗
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-500 dark:text-slate-400" title="Unanswered">
              {unansweredCount} -
            </span>
          </div>
        </div>
      </div>

      {/* Category Performance Card */}
      {result.categoryScores && result.categoryScores.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Category Performance Breakdown
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {result.categoryScores.length} Categories
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {result.categoryScores.map((cat) => {
              const catAccuracy =
                cat.totalAsked > 0 ? Math.round((cat.correctCount / cat.totalAsked) * 100) : 0;
              const catDisplayName =
                categoryNameMap.get(cat.categoryId) || cat.categoryName;

              return (
                <div key={cat.categoryId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[240px] sm:max-w-md">
                      {catDisplayName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">
                        {cat.correctCount}/{cat.totalAsked} ({catAccuracy}%)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {cat.score}/{cat.maxScore} marks
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        catAccuracy >= 80
                          ? 'bg-emerald-500'
                          : catAccuracy >= 60
                          ? 'bg-blue-500'
                          : catAccuracy >= 40
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${catAccuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer Review Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Detailed Question Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review your answers against the correct solutions.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
            <button
              type="button"
              data-testid="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({result.totalQuestions})
            </button>
            <button
              type="button"
              data-testid="filter-incorrect-btn"
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'incorrect'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              type="button"
              data-testid="filter-correct-btn"
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              Correct ({result.correctCount})
            </button>
            <button
              type="button"
              data-testid="filter-unanswered-btn"
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                filter === 'unanswered'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Unanswered ({unansweredCount})
            </button>
          </div>
        </div>

        {/* Question Review List */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              No Questions Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              There are no questions matching this filter category.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const originalIndex = questions.findIndex((orig) => orig.id === q.id);
              const questionNumber = originalIndex !== -1 ? originalIndex + 1 : idx + 1;
              const categoryName = categoryNameMap.get(q.categoryId);

              return (
                <QuestionReviewItem
                  key={q.id}
                  question={q}
                  questionNumber={questionNumber}
                  categoryName={categoryName}
                  userAnswer={result.answers[q.id]}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {onBackToDashboard && (
          <button
            type="button"
            data-testid="back-dashboard-bottom-btn"
            onClick={onBackToDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        )}

        <div className="w-full sm:w-auto flex items-center gap-3">
          {onPracticeMissed && missedQuestions.length > 0 && (
            <button
              type="button"
              data-testid="practice-missed-bottom-btn"
              onClick={() => onPracticeMissed(missedQuestions)}
              className="flex-1 sm:flex-initial px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>Practice Missed</span>
            </button>
          )}

          {onRetakeExam && (
            <button
              type="button"
              data-testid="retake-exam-bottom-btn"
              onClick={onRetakeExam}
              className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
