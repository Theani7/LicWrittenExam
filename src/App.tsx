import React, { useState, useEffect, useCallback } from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useBookmarks } from './hooks/useBookmarks';
import { useExamHistory } from './hooks/useExamHistory';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar, type NavigationTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GuidelinesModal } from './components/guidelines/GuidelinesModal';
import { LanguageModal } from './components/language/LanguageModal';
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
  const { language, t } = useLanguage();
  const { questions, categories, metadata, loading, error } = useQuestions();
  const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks();
  const { saveExamResult } = useExamHistory();

  const [activeTab, setActiveTab] = useState<NavigationTab>('learn');
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);

  const [testView, setTestView] = useState<TestViewMode>('home');
  const [activeExamQuestions, setActiveExamQuestions] = useState<Question[]>([]);
  const [activeExamTitle, setActiveExamTitle] = useState<string>('DoTM Driving License Examination');
  const [activeExamDuration, setActiveExamDuration] = useState<number>(1800);
  const [activeExamResult, setActiveExamResult] = useState<ExamResult | null>(null);

  const [pendingTab, setPendingTab] = useState<NavigationTab | null>(null);
  const [showLeaveExamModal, setShowLeaveExamModal] = useState<boolean>(false);

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

  const handleStartOfficialExam = useCallback(() => {
    const examQuestions = generateOfficialExam(questions);
    setActiveExamQuestions(examQuestions);
    setActiveExamTitle(
      language === 'ne'
        ? 'सरकारी नमुना परीक्षा सिमुलेसन (वर्ग क र ट)'
        : 'DoTM Official Exam Simulation (Cat A & K)'
    );
    setActiveExamDuration((metadata?.examDurationMinutes ?? 30) * 60);
    setTestView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questions, metadata, language]);

  const handleStartCategoryExam = useCallback(
    (categoryId: number, count?: number) => {
      const examQuestions = generateCategoryTest(questions, categoryId, count ?? 20);
      const cat = categories.find((c) => c.id === categoryId);
      setActiveExamQuestions(examQuestions);
      setActiveExamTitle(
        cat
          ? language === 'ne'
            ? `${cat.name} अभ्यास`
            : `${cat.name} Practice Drill`
          : `Category ${categoryId} Practice Drill`
      );
      setActiveExamDuration(Math.max(300, examQuestions.length * 72));
      setTestView('exam');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [questions, categories, language]
  );

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeExamQuestions, activeExamDuration, categories, saveExamResult]
  );

  const handleRetakeExam = useCallback(() => {
    if (activeExamQuestions.length > 0) {
      const isCategory = activeExamQuestions.every((q) => q.categoryId === activeExamQuestions[0].categoryId);
      if (isCategory) {
        handleStartCategoryExam(activeExamQuestions[0].categoryId, activeExamQuestions.length);
      } else {
        handleStartOfficialExam();
      }
    } else {
      handleStartOfficialExam();
    }
  }, [activeExamQuestions, handleStartCategoryExam, handleStartOfficialExam]);

  const handleExamExit = useCallback(() => {
    setTestView('home');
    setActiveExamQuestions([]);
  }, []);

  const handlePracticeMissed = useCallback((missedQuestions: Question[]) => {
    setActiveExamQuestions(missedQuestions);
    setActiveExamTitle(
      language === 'ne' ? 'बिग्रिएका प्रश्नहरूको अभ्यास' : 'Practice Incorrect Questions'
    );
    setActiveExamDuration(Math.max(300, missedQuestions.length * 72));
    setTestView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [language]);

  const handleBackToDashboard = useCallback(() => {
    setTestView('home');
    setActiveExamQuestions([]);
    setActiveExamResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePracticeBookmarks = useCallback((bookmarkedQuestions: Question[]) => {
    setActiveExamQuestions(bookmarkedQuestions);
    setActiveExamTitle(
      language === 'ne' ? 'सुरक्षित गरिएका प्रश्नहरूको अभ्यास' : 'Bookmarked Questions Practice'
    );
    setActiveExamDuration(Math.max(300, bookmarkedQuestions.length * 72));
    setActiveTab('test');
    setTestView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [language]);

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
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 antialiased transition-colors duration-200 dark:bg-[#060b16] dark:text-zinc-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        bookmarkCount={bookmarks.length}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
      />

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

            {testView === 'exam' && activeExamQuestions.length > 0 && (
              <ExamEngine
                title={activeExamTitle}
                questions={activeExamQuestions}
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

      <Footer />

      {/* First-time / user selectable Language Modal */}
      <LanguageModal />

      {/* Guidelines Modal */}
      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      {/* Leave Exam Confirmation Modal */}
      {showLeaveExamModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-exam-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCancelLeaveExam}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-modal dark:border-white/10 dark:bg-[#0c1222] sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 id="leave-exam-title" className="text-lg font-extrabold tracking-tight">
                    {t('leaveExamConfirm', 'Leave Exam in Progress?')}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {t('leaveExamWarning', 'Your timer is still running. Leaving now will discard all answers for this attempt.')}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCancelLeaveExam}
                    data-testid="cancel-leave-exam-btn"
                    className="btn-ghost"
                  >
                    {t('cancelLeave', 'Continue Exam')}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmLeaveExam}
                    data-testid="confirm-leave-exam-btn"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-crimson-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow-crimson transition hover:bg-crimson-700"
                  >
                    {t('confirmLeave', 'Yes, Leave Exam')}
                  </button>
                </div>
              </div>
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
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
