import React, { useState, useEffect, useCallback } from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useBookmarks } from './hooks/useBookmarks';
import { useExamHistory } from './hooks/useExamHistory';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, type NavigationTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GuidelinesModal } from './components/guidelines/GuidelinesModal';
import { LearnView } from './components/learn/LearnView';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { TestHome } from './components/test/TestHome';
import { ExamEngine } from './components/test/ExamEngine';
import { ExamResultView } from './components/test/ExamResultView';
import { generateOfficialExam, generateCategoryTest } from './utils/examGenerator';
import { calculateExamResult } from './utils/examScorer';
import type { Question, ExamResult, OptionKey } from './types';
import { AlertCircle, AlertTriangle } from 'lucide-react';

type TestViewMode = 'home' | 'exam' | 'result';

export function AppContent(): React.JSX.Element {
  const { questions, categories, metadata, loading, error } = useQuestions();
  const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks();
  const { saveExamResult } = useExamHistory();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('learn');
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);

  // Test Mode State
  const [testView, setTestView] = useState<TestViewMode>('home');
  const [activeExamQuestions, setActiveExamQuestions] = useState<Question[]>([]);
  const [activeExamTitle, setActiveExamTitle] = useState<string>('DoTM Driving License Examination');
  const [activeExamDuration, setActiveExamDuration] = useState<number>(1800);
  const [activeExamResult, setActiveExamResult] = useState<ExamResult | null>(null);

  // Pending Navigation Confirmation State (when exam is in progress)
  const [pendingTab, setPendingTab] = useState<NavigationTab | null>(null);
  const [showLeaveExamModal, setShowLeaveExamModal] = useState<boolean>(false);

  // Prevent accidental browser reload/close during exam
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeTab === 'test' && testView === 'exam') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeTab, testView]);

  // Handle Tab Navigation with safeguard for running exams
  const handleTabChange = useCallback(
    (newTab: NavigationTab) => {
      if (activeTab === newTab && testView !== 'exam') return;

      if (activeTab === 'test' && testView === 'exam') {
        setPendingTab(newTab);
        setShowLeaveExamModal(true);
        return;
      }

      setActiveTab(newTab);
    },
    [activeTab, testView]
  );

  const handleConfirmLeaveExam = () => {
    setShowLeaveExamModal(false);
    setTestView('home');
    setActiveExamQuestions([]);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleCancelLeaveExam = () => {
    setShowLeaveExamModal(false);
    setPendingTab(null);
  };

  // Start Official Exam
  const handleStartOfficialExam = useCallback(() => {
    const examQuestions = generateOfficialExam(questions);
    setActiveExamQuestions(examQuestions);
    setActiveExamTitle('DoTM Official Exam Simulation (Cat A & K)');
    setActiveExamDuration((metadata?.examDurationMinutes ?? 30) * 60);
    setTestView('exam');
  }, [questions, metadata]);

  // Start Category Drill Test
  const handleStartCategoryExam = useCallback(
    (categoryId: number, count?: number) => {
      const examQuestions = generateCategoryTest(questions, categoryId, count ?? 20);
      const cat = categories.find((c) => c.id === categoryId);
      setActiveExamQuestions(examQuestions);
      setActiveExamTitle(cat ? `${cat.name} Practice Drill` : `Category ${categoryId} Practice Drill`);
      setActiveExamDuration(Math.max(300, examQuestions.length * 72));
      setTestView('exam');
    },
    [questions, categories]
  );

  // Exam Engine Submit
  const handleExamSubmit = useCallback(
    (userAnswers: Record<number, OptionKey | null>, timeTakenSeconds: number) => {
      const result = calculateExamResult(
        activeExamQuestions,
        userAnswers,
        activeExamDuration,
        timeTakenSeconds,
        categories
      );
      saveExamResult(result);
      setActiveExamResult(result);
      setTestView('result');
    },
    [activeExamQuestions, activeExamDuration, categories, saveExamResult]
  );

  // Exam Engine Exit
  const handleExamExit = useCallback(() => {
    setTestView('home');
    setActiveExamQuestions([]);
  }, []);

  // Exam Result: Retake
  const handleRetakeExam = useCallback(() => {
    // If it was a 25-question official simulation, generate a fresh one; otherwise restart same questions
    if (activeExamQuestions.length === 25) {
      const freshQuestions = generateOfficialExam(questions);
      setActiveExamQuestions(freshQuestions);
    }
    setActiveExamResult(null);
    setTestView('exam');
  }, [activeExamQuestions.length, questions]);

  // Exam Result: Practice Missed Questions
  const handlePracticeMissed = useCallback((missedQuestions: Question[]) => {
    setActiveExamQuestions(missedQuestions);
    setActiveExamTitle('Practice Missed Questions');
    setActiveExamDuration(Math.max(300, missedQuestions.length * 72));
    setActiveExamResult(null);
    setTestView('exam');
  }, []);

  // Exam Result: Back to Dashboard
  const handleBackToDashboard = useCallback(() => {
    setTestView('home');
    setActiveExamResult(null);
    setActiveExamQuestions([]);
  }, []);

  // Practice Bookmarked Questions
  const handlePracticeBookmarks = useCallback((bookmarkedQuestions: Question[]) => {
    setActiveExamQuestions(bookmarkedQuestions);
    setActiveExamTitle('Bookmarked Questions Practice');
    setActiveExamDuration(Math.max(300, bookmarkedQuestions.length * 72));
    setActiveExamResult(null);
    setTestView('exam');
    setActiveTab('test');
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] dark:bg-[#070d19] text-zinc-900 dark:text-zinc-100 p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-9 h-9 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tracking-wide">
            Loading 500-question exam database...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] dark:bg-[#070d19] text-zinc-900 dark:text-zinc-100 p-4">
        <div className="max-w-md w-full bg-crimson-50 dark:bg-crimson-950/40 border border-crimson-200 dark:border-crimson-900/60 rounded-md p-6 text-center space-y-3">
          <AlertCircle className="w-9 h-9 text-crimson-600 mx-auto" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Failed to Load Questions</h2>
          <p className="font-mono text-xs text-crimson-700 dark:text-crimson-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] dark:bg-[#070d19] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-crimson-100 selection:text-crimson-900 dark:selection:bg-crimson-950 dark:selection:text-crimson-200 font-sans">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        bookmarkCount={bookmarks.length}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'learn' && (
          <LearnView questions={questions} categories={categories} />
        )}

        {activeTab === 'test' && (
          <div>
            {testView === 'home' && (
              <TestHome
                categories={categories}
                onStartOfficialExam={handleStartOfficialExam}
                onStartCategoryExam={handleStartCategoryExam}
              />
            )}

            {testView === 'exam' && (
              <ExamEngine
                questions={activeExamQuestions}
                title={activeExamTitle}
                durationSeconds={activeExamDuration}
                onSubmit={handleExamSubmit}
                onExit={handleExamExit}
              />
            )}

            {testView === 'result' && activeExamResult && (
              <ExamResultView
                result={activeExamResult}
                questions={activeExamQuestions}
                categories={categories}
                onRetakeExam={handleRetakeExam}
                onPracticeMissed={handlePracticeMissed}
                onBackToDashboard={handleBackToDashboard}
              />
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            questions={questions}
            categories={categories}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onClearBookmarks={clearBookmarks}
            onPracticeBookmarks={handlePracticeBookmarks}
            onExploreQuestions={() => setActiveTab('learn')}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Official Guidelines Modal */}
      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      {/* Leave Exam Confirmation Safeguard Dialog */}
      {showLeaveExamModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-exam-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 dark:bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelLeaveExam();
            }
          }}
        >
          <div className="bg-white dark:bg-navy-950 border border-zinc-200 dark:border-navy-900 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="leave-exam-title"
                className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
              >
                Leave Exam in Progress?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Your test is currently active. If you navigate away now, your current test progress and answers will be lost.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancelLeaveExam}
                data-testid="cancel-leave-exam-btn"
                className="px-3.5 py-1.5 rounded-md border border-zinc-200 dark:border-navy-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-navy-900 font-mono text-xs font-semibold transition-colors"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveExam}
                data-testid="confirm-leave-exam-btn"
                className="px-3.5 py-1.5 bg-crimson-600 hover:bg-crimson-700 text-white font-mono text-xs font-semibold rounded-md shadow-sm transition-colors"
              >
                Yes, Leave Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
