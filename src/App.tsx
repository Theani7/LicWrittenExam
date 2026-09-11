import React from 'react';
import { useQuestions } from './hooks/useQuestions';
import { BookOpen, Award, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function App(): React.JSX.Element {
  const { questions, categories, metadata, loading, error } = useQuestions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading exam question bank...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-6 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">Failed to Load Questions</h2>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-100 selection:text-blue-900">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                Nepal Driving License Exam Prep
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Category A &amp; K • {metadata?.version || '2082/2083'}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Questions</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {questions.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Exam Duration</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metadata?.examDurationMinutes ?? 30} mins
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Exam Questions</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metadata?.questionsPerExam ?? 25}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Pass Mark</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {metadata?.passMark ?? 60} / {metadata?.totalMarks ?? 100}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Syllabus Categories ({categories.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between space-x-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">
                      {cat.id}
                    </span>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Exam weight: <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.examWeight} questions</span> ({cat.examWeight * 4} marks)
                  </p>
                </div>
                <span className="shrink-0 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {cat.poolCount} questions
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
