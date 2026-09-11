import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExamHistory } from '../hooks/useExamHistory';
import type { ExamResult } from '../types';

const mockExamResult1: ExamResult = {
  id: 'exam-1',
  timestamp: 1700000000000,
  totalQuestions: 25,
  correctCount: 20,
  totalMarks: 100,
  score: 80,
  passMark: 60,
  passed: true,
  durationSeconds: 1800,
  timeTakenSeconds: 900,
  categoryScores: [
    { categoryId: 1, categoryName: 'Vehicle Operation', totalAsked: 6, correctCount: 5, score: 20, maxScore: 24 }
  ],
  answers: { 1: 'A', 2: 'B' }
};

const mockExamResult2: ExamResult = {
  id: 'exam-2',
  timestamp: 1700000050000,
  totalQuestions: 25,
  correctCount: 12,
  totalMarks: 100,
  score: 48,
  passMark: 60,
  passed: false,
  durationSeconds: 1800,
  timeTakenSeconds: 1200,
  categoryScores: [
    { categoryId: 1, categoryName: 'Vehicle Operation', totalAsked: 6, correctCount: 3, score: 12, maxScore: 24 }
  ],
  answers: { 1: 'C', 2: 'D' }
};

describe('useExamHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with empty history when localStorage is empty', () => {
    const { result } = renderHook(() => useExamHistory());
    expect(result.current.history).toEqual([]);
  });

  it('loads existing exam history from localStorage', () => {
    localStorage.setItem('nepal_prep_exam_history', JSON.stringify([mockExamResult1]));
    const { result } = renderHook(() => useExamHistory());
    expect(result.current.history).toEqual([mockExamResult1]);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('nepal_prep_exam_history', '{broken-json');
    const { result } = renderHook(() => useExamHistory());
    expect(result.current.history).toEqual([]);
  });

  it('handles non-array in localStorage gracefully', () => {
    localStorage.setItem('nepal_prep_exam_history', JSON.stringify({ notAnArray: 123 }));
    const { result } = renderHook(() => useExamHistory());
    expect(result.current.history).toEqual([]);
  });

  it('saves new exam result by prepending it and persists to localStorage', () => {
    const { result } = renderHook(() => useExamHistory());

    act(() => {
      result.current.saveExamResult(mockExamResult1);
    });

    expect(result.current.history).toEqual([mockExamResult1]);
    expect(JSON.parse(localStorage.getItem('nepal_prep_exam_history') || '[]')).toEqual([mockExamResult1]);

    // Save second result - should be prepended (newest first)
    act(() => {
      result.current.saveExamResult(mockExamResult2);
    });

    expect(result.current.history).toEqual([mockExamResult2, mockExamResult1]);
    expect(JSON.parse(localStorage.getItem('nepal_prep_exam_history') || '[]')).toEqual([
      mockExamResult2,
      mockExamResult1
    ]);
  });

  it('clears exam history from state and localStorage', () => {
    localStorage.setItem('nepal_prep_exam_history', JSON.stringify([mockExamResult1, mockExamResult2]));
    const { result } = renderHook(() => useExamHistory());
    expect(result.current.history.length).toBe(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(JSON.parse(localStorage.getItem('nepal_prep_exam_history') || '[]')).toEqual([]);
  });

  it('handles localStorage setItem failure without throwing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useExamHistory());
    expect(() => {
      act(() => {
        result.current.saveExamResult(mockExamResult1);
      });
    }).not.toThrow();

    expect(result.current.history).toEqual([mockExamResult1]);
  });
});
