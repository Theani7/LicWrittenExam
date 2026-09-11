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
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#c8102e', '#003893', '#ffffff', '#e01a3c'],
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Pass / Fail Banner */}
      <div
        data-testid="result-banner"
        className={`rounded-lg p-6 sm:p-7 text-center border shadow-2xs relative overflow-hidden ${
          result.passed
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
            : 'bg-crimson-50/40 dark:bg-crimson-950/20 border-crimson-300 dark:border-crimson-800'
        }`}
      >
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2">
            {result.passed ? (
              <span
                data-testid="verdict-passed"
                className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded font-mono text-xs font-bold shadow-2xs tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXAM PASSED</span>
              </span>
            ) : (
              <span
                data-testid="verdict-failed"
                className="inline-flex items-center gap-1.5 bg-crimson-600 text-white px-3 py-1 rounded font-mono text-xs font-bold shadow-2xs tracking-wider"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>NOT PASSED</span>
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
              {result.score} <span className="text-xl text-zinc-400 font-normal">/ {result.totalMarks} MARKS</span>
            </h1>
            <p className="font-mono text-sm font-semibold text-zinc-600 dark:text-zinc-400 mt-0.5">
              {percentage}% Score · Pass Threshold: 60%
            </p>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            {result.passed
              ? 'Congratulations! You achieved the required pass threshold (>= 60%) for the official Nepal Driving License Written Exam.'
              : 'You did not achieve the required 60% pass mark. Review the missed questions below and attempt another simulation.'}
          </p>

          {/* Quick Top Actions */}
          <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
            {onRetakeExam && (
              <button
                type="button"
                data-testid="retake-exam-top-btn"
                onClick={onRetakeExam}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-medium rounded shadow-2xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>
            )}

            {onPracticeMissed && missedQuestions.length > 0 && (
              <button
                type="button"
                data-testid="practice-missed-top-btn"
                onClick={() => onPracticeMissed(missedQuestions)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-700 hover:bg-navy-800 text-white text-xs font-medium rounded shadow-2xs transition"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Practice Missed ({missedQuestions.length})</span>
              </button>
            )}

            {onBackToDashboard && (
              <button
                type="button"
                data-testid="back-dashboard-top-btn"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-navy-900 border border-zinc-200 dark:border-navy-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded hover:bg-zinc-50 dark:hover:bg-navy-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {/* Stat 1: Total Score */}
        <div className="bg-white dark:bg-[#0c1424] p-3.5 rounded-lg border border-zinc-200 dark:border-navy-900 shadow-2xs">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Award className="w-3.5 h-3.5 text-crimson-600" />
            <span className="text-[10px] font-semibold tracking-wider">SCORE</span>
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {result.score} <span className="text-xs font-normal text-zinc-400">/ {result.totalMarks}</span>
          </div>
        </div>

        {/* Stat 2: Accuracy */}
        <div className="bg-white dark:bg-[#0c1424] p-3.5 rounded-lg border border-zinc-200 dark:border-navy-900 shadow-2xs">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Target className="w-3.5 h-3.5 text-navy-600 dark:text-navy-400" />
            <span className="text-[10px] font-semibold tracking-wider">ACCURACY</span>
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {accuracyPercentage}%
          </div>
        </div>

        {/* Stat 3: Time Taken */}
        <div className="bg-white dark:bg-[#0c1424] p-3.5 rounded-lg border border-zinc-200 dark:border-navy-900 shadow-2xs">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-semibold tracking-wider">TIME</span>
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatTime(result.timeTakenSeconds)}
          </div>
        </div>

        {/* Stat 4: Answer Breakdown */}
        <div className="bg-white dark:bg-[#0c1424] p-3.5 rounded-lg border border-zinc-200 dark:border-navy-900 shadow-2xs">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-semibold tracking-wider">SUMMARY</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold pt-0.5">
            <span className="text-emerald-600 dark:text-emerald-400" title="Correct">
              {result.correctCount} ✓
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-crimson-600 dark:text-crimson-400" title="Incorrect">
              {incorrectCount} ✗
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-zinc-400" title="Unanswered">
              {unansweredCount} -
            </span>
          </div>
        </div>
      </div>

      {/* Category Performance Card */}
      {result.categoryScores && result.categoryScores.length > 0 && (
        <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-navy-900 pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-navy-600 dark:text-navy-400" />
              <h2 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Category Performance Breakdown
              </h2>
            </div>
            <span className="font-mono text-[10px] text-zinc-400">
              {result.categoryScores.length} SECTIONS
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {result.categoryScores.map((cat) => {
              const catAccuracy =
                cat.totalAsked > 0 ? Math.round((cat.correctCount / cat.totalAsked) * 100) : 0;
              const catDisplayName =
                categoryNameMap.get(cat.categoryId) || cat.categoryName;

              return (
                <div key={cat.categoryId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[220px] sm:max-w-md">
                      {catDisplayName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                      <span className="text-zinc-400">
                        {cat.correctCount}/{cat.totalAsked} ({catAccuracy}%)
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {cat.score}/{cat.maxScore} PTS
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-navy-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        catAccuracy >= 60 ? 'bg-emerald-500' : 'bg-crimson-600'
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Detailed Question Review
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Compare your selected answers with the official DoTM key.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-navy-950 p-0.5 rounded-lg border border-zinc-200 dark:border-navy-900 overflow-x-auto font-mono text-xs">
            <button
              type="button"
              data-testid="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs rounded transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white dark:bg-navy-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              ALL ({result.totalQuestions})
            </button>
            <button
              type="button"
              data-testid="filter-incorrect-btn"
              onClick={() => setFilter('incorrect')}
              className={`px-2.5 py-1 text-xs rounded transition whitespace-nowrap ${
                filter === 'incorrect'
                  ? 'bg-crimson-600 text-white font-semibold shadow-2xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-crimson-600'
              }`}
            >
              WRONG ({incorrectCount})
            </button>
            <button
              type="button"
              data-testid="filter-correct-btn"
              onClick={() => setFilter('correct')}
              className={`px-2.5 py-1 text-xs rounded transition whitespace-nowrap ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-emerald-600'
              }`}
            >
              RIGHT ({result.correctCount})
            </button>
            <button
              type="button"
              data-testid="filter-unanswered-btn"
              onClick={() => setFilter('unanswered')}
              className={`px-2.5 py-1 text-xs rounded transition whitespace-nowrap ${
                filter === 'unanswered'
                  ? 'bg-zinc-700 text-white font-semibold shadow-2xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              LEFT ({unansweredCount})
            </button>
          </div>
        </div>

        {/* Question Review List */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-[#0c1424] rounded-lg border border-zinc-200 dark:border-navy-900 p-8 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
              No Questions in this Filter
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              There are no questions matching this specific filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
      <div className="border-t border-zinc-200 dark:border-navy-900/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {onBackToDashboard && (
          <button
            type="button"
            data-testid="back-dashboard-bottom-btn"
            onClick={onBackToDashboard}
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-navy-950 border border-zinc-200 dark:border-navy-900 hover:bg-zinc-50 dark:hover:bg-navy-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        )}

        <div className="w-full sm:w-auto flex items-center gap-2">
          {onPracticeMissed && missedQuestions.length > 0 && (
            <button
              type="button"
              data-testid="practice-missed-bottom-btn"
              onClick={() => onPracticeMissed(missedQuestions)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white text-xs font-medium rounded shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Practice Missed</span>
            </button>
          )}

          {onRetakeExam && (
            <button
              type="button"
              data-testid="retake-exam-bottom-btn"
              onClick={onRetakeExam}
              className="flex-1 sm:flex-initial px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-medium rounded shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Exam</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResultView;
