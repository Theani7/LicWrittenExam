import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'ne';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'Nepal License Prep',
    catTag: 'Cat A & K 2082/83',
    ribbonText: 'OFFICIAL DOTM SYLLABUS · FY 2082/83 · CATEGORY A & K · 500 QUESTIONS',
    ribbonShort: 'DOTM 2082/83 · CAT A & K · 500 QS',
    tabLearn: 'Learn',
    tabTest: 'Mock Exam',
    tabBookmarks: 'Saved',
    hintLearn: '500 Qs',
    hintTest: '30 min',
    hintBookmarks: 'Review',
    guidelinesBtn: 'Exam Rules',
    languageToggle: 'भाषा: नेपाली',
    searchPlaceholder: 'Search questions by text or number...',
    allCategories: 'All Categories',
    practiceDrill: 'Practice Drill',
    startOfficialExam: 'Start Official Exam Simulation',
    categoryDrill: 'Category Drill',
    questionsCount: 'Questions',
    timeRemaining: 'Time Remaining',
    submitExam: 'Submit Exam',
    nextQuestion: 'Next',
    prevQuestion: 'Previous',
    flagForReview: 'Flag for Review',
    flagged: 'Flagged',
    passStatus: 'PASSED',
    failStatus: 'FAILED',
    congratsTitle: 'Congratulations, You Passed!',
    failTitle: 'Needs More Practice',
    score: 'Score',
    passMark: 'Pass Mark',
    totalMarks: 'Total Marks',
    timeTaken: 'Time Taken',
    retakeExam: 'Take Another Exam',
    reviewAnswers: 'Review Answers',
    noBookmarksTitle: 'No Bookmarked Questions Yet',
    noBookmarksSubtitle: 'Bookmark questions during learning or mock tests to review them here.',
    leaveExamConfirm: 'Leave Exam in Progress?',
    leaveExamWarning: 'Your test is currently active. If you navigate away now, your current test progress and answers will be lost.',
    confirmLeave: 'Yes, Leave Exam',
    cancelLeave: 'Continue Exam',
  },
  ne: {
    appTitle: 'नेपाल सवारी लाइसेन्स तयारी',
    catTag: 'वर्ग क र ट २०८२/८३',
    ribbonText: 'आधिकारिक यातायात व्यवस्था विभाग पाठ्यक्रम · आ.व. २०८२/८३ · वर्ग क र ट · ५०० प्रश्नहरू',
    ribbonShort: 'या.व्य.वि. २०८२/८३ · क र ट · ५०० प्रश्न',
    tabLearn: 'सिक्नुहोस्',
    tabTest: 'नमुना परीक्षा',
    tabBookmarks: 'सुरक्षित',
    hintLearn: '५०० प्रश्न',
    hintTest: '३० मिनेट',
    hintBookmarks: 'दोहोर्याउनुहोस्',
    guidelinesBtn: 'परीक्षा नियम',
    languageToggle: 'Language: English',
    searchPlaceholder: 'प्रश्न वा नम्बर खोज्नुहोस्...',
    allCategories: 'सबै वर्गहरू',
    practiceDrill: 'वर्गगत अभ्यास',
    startOfficialExam: 'सरकारी नमुना परीक्षा सुरु गर्नुहोस्',
    categoryDrill: 'अभ्यास सुरु गर्नुहोस्',
    questionsCount: 'प्रश्नहरू',
    timeRemaining: 'बाँकी समय',
    submitExam: 'परीक्षा बुझाउनुहोस्',
    nextQuestion: 'अर्को',
    prevQuestion: 'अघिल्लो',
    flagForReview: 'समीक्षाको लागि चिन्ह लगाउनुहोस्',
    flagged: 'चिन्हित',
    passStatus: 'उत्तीर्ण',
    failStatus: 'अनुत्तीर्ण',
    congratsTitle: 'बधाई छ, तपाईं उत्तीर्ण हुनुभयो!',
    failTitle: 'थप अभ्यासको आवश्यकता छ',
    score: 'प्राप्ताङ्क',
    passMark: 'उत्तीर्णाङ्क',
    totalMarks: 'पूर्णाङ्क',
    timeTaken: 'लागेको समय',
    retakeExam: 'अर्को परीक्षा दिनुहोस्',
    reviewAnswers: 'उत्तरहरू हेर्नुहोस्',
    noBookmarksTitle: 'कुनै प्रश्न सुरक्षित गरिएको छैन',
    noBookmarksSubtitle: 'सिक्दा वा परीक्षा दिँदा मनपरेका प्रश्नहरू सुरक्षित गरी यहाँ हेर्न सक्नुहुन्छ।',
    leaveExamConfirm: 'चालु परीक्षा छोड्न चाहनुहुन्छ?',
    leaveExamWarning: 'अहिले छोडेमा तपाईंको परीक्षाको प्रगति मेटिनेछ।',
    confirmLeave: 'परीक्षा छोड्नुहोस्',
    cancelLeave: 'परीक्षा जारी राख्नुहोस्',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasChosenLanguage: boolean;
  setHasChosenLanguage: (chosen: boolean) => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'license_prep_language';
const STORAGE_CHOSEN_KEY = 'license_prep_has_chosen_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_LANG_KEY);
        if (stored === 'en' || stored === 'ne') {
          return stored;
        }
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [hasChosenLanguage, setHasChosenLanguageState] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_CHOSEN_KEY);
        if (stored !== null) {
          return stored === 'true';
        }
        if (process.env.NODE_ENV === 'test') {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_LANG_KEY, newLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const setHasChosenLanguage = useCallback((chosen: boolean) => {
    setHasChosenLanguageState(chosen);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_CHOSEN_KEY, chosen ? 'true' : 'false');
      }
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string, defaultText?: string): string => {
      const dict = TRANSLATIONS[language];
      if (dict && dict[key]) {
        return dict[key];
      }
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return defaultText || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        hasChosenLanguage,
        setHasChosenLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      hasChosenLanguage: true,
      setHasChosenLanguage: () => {},
      t: (key: string, defaultText?: string) => {
        const dict = TRANSLATIONS.en;
        return dict[key] || defaultText || key;
      },
    };
  }
  return context;
};
