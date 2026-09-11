import { useState, useCallback } from 'react';
import type { ExamResult } from '../types';

const EXAM_HISTORY_STORAGE_KEY = 'nepal_prep_exam_history';

function getStoredExamHistory(): ExamResult[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(EXAM_HISTORY_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch {
    // Storage access or JSON parse error fallback
  }
  return [];
}

function saveStoredExamHistory(history: ExamResult[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(EXAM_HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
  } catch {
    // Storage quota or restriction fallback
  }
}

export interface UseExamHistoryReturn {
  history: ExamResult[];
  saveExamResult: (result: ExamResult) => void;
  clearHistory: () => void;
}

export function useExamHistory(): UseExamHistoryReturn {
  const [history, setHistory] = useState<ExamResult[]>(getStoredExamHistory);

  const saveExamResult = useCallback((result: ExamResult) => {
    setHistory((prev) => {
      const next = [result, ...prev];
      saveStoredExamHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveStoredExamHistory([]);
  }, []);

  return {
    history,
    saveExamResult,
    clearHistory,
  };
}
