import { describe, it, expect } from 'vitest';
import type { Question, Category, OptionKey } from '../types';
import { calculateExamResult } from '../utils/examScorer';

const mockCategories: Category[] = [
  { id: 1, name: 'Vehicle Operation', slug: 'vehicle-operation', poolCount: 130, examWeight: 6 },
  { id: 2, name: 'Traffic Laws', slug: 'traffic-laws', poolCount: 90, examWeight: 5 },
  { id: 3, name: 'Technical & Mechanical', slug: 'technical-mechanical', poolCount: 80, examWeight: 3 },
  { id: 4, name: 'Environmental Awareness', slug: 'environmental-awareness', poolCount: 40, examWeight: 2 },
  { id: 5, name: 'Accident Safety', slug: 'accident-safety', poolCount: 60, examWeight: 3 },
  { id: 6, name: 'Traffic Signs', slug: 'traffic-signs', poolCount: 100, examWeight: 6 },
];

function createMockQuestion(id: number, categoryId: number, correctAnswer: OptionKey = 'A'): Question {
  return {
    id,
    categoryId,
    question: `Question ${id}?`,
    image: null,
    options: [
      { key: 'A', text: 'Ans A' },
      { key: 'B', text: 'Ans B' },
      { key: 'C', text: 'Ans C' },
      { key: 'D', text: 'Ans D' },
    ],
    correctAnswer,
  };
}

describe('examScorer', () => {
  describe('calculateExamResult for standard 25-question official exam', () => {
    // Generate 25 questions across categories
    const questions: Question[] = [];
    let qId = 1;
    for (let c = 1; c <= 5; c++) {
      for (let i = 0; i < 5; i++) {
        questions.push(createMockQuestion(qId++, c, 'A'));
      }
    }

    it('calculates 100% score (100 marks, passed) when all 25 are correct', () => {
      const userAnswers: Record<number, OptionKey | null> = {};
      questions.forEach((q) => {
        userAnswers[q.id] = 'A';
      });

      const result = calculateExamResult(questions, userAnswers, 1800, 720, mockCategories);

      expect(result.totalQuestions).toBe(25);
      expect(result.correctCount).toBe(25);
      expect(result.totalMarks).toBe(100);
      expect(result.score).toBe(100);
      expect(result.passMark).toBe(60);
      expect(result.passed).toBe(true);
      expect(result.durationSeconds).toBe(1800);
      expect(result.timeTakenSeconds).toBe(720);
      expect(result.id).toMatch(/^exam_\d+/);
      expect(typeof result.timestamp).toBe('number');
    });

    it('passes when exactly at threshold (15 correct = 60 marks)', () => {
      const userAnswers: Record<number, OptionKey | null> = {};
      // 15 correct, 10 incorrect
      questions.forEach((q, idx) => {
        userAnswers[q.id] = idx < 15 ? 'A' : 'B';
      });

      const result = calculateExamResult(questions, userAnswers, 1800, 600, mockCategories);

      expect(result.correctCount).toBe(15);
      expect(result.score).toBe(60);
      expect(result.passMark).toBe(60);
      expect(result.passed).toBe(true);
    });

    it('fails when below threshold (14 correct = 56 marks)', () => {
      const userAnswers: Record<number, OptionKey | null> = {};
      // 14 correct, 11 incorrect
      questions.forEach((q, idx) => {
        userAnswers[q.id] = idx < 14 ? 'A' : 'B';
      });

      const result = calculateExamResult(questions, userAnswers, 1800, 900, mockCategories);

      expect(result.correctCount).toBe(14);
      expect(result.score).toBe(56);
      expect(result.passMark).toBe(60);
      expect(result.passed).toBe(false);
    });

    it('handles unanswered questions and null values', () => {
      const userAnswers: Record<number, OptionKey | null> = {};
      // First 10 correct, 5 null, 10 missing from userAnswers
      questions.slice(0, 10).forEach((q) => {
        userAnswers[q.id] = 'A';
      });
      questions.slice(10, 15).forEach((q) => {
        userAnswers[q.id] = null;
      });
      // slice(15, 25) not in userAnswers

      const result = calculateExamResult(questions, userAnswers, 1800, 500, mockCategories);

      expect(result.correctCount).toBe(10);
      expect(result.score).toBe(40);
      expect(result.passed).toBe(false);
    });

    it('correctly calculates categoryScores breakdown', () => {
      const userAnswers: Record<number, OptionKey | null> = {};
      // Cat 1 (ids 1-5): all 5 correct
      // Cat 2 (ids 6-10): 3 correct, 2 incorrect
      // Cat 3 (ids 11-15): 0 correct (all unanswered)
      // Cat 4 (ids 16-20): 2 correct
      // Cat 5 (ids 21-25): 4 correct
      for (let i = 1; i <= 5; i++) userAnswers[i] = 'A';
      for (let i = 6; i <= 8; i++) userAnswers[i] = 'A';
      for (let i = 9; i <= 10; i++) userAnswers[i] = 'B';
      // 11-15: leave undefined
      for (let i = 16; i <= 17; i++) userAnswers[i] = 'A';
      for (let i = 18; i <= 20; i++) userAnswers[i] = 'C';
      for (let i = 21; i <= 24; i++) userAnswers[i] = 'A';
      userAnswers[25] = 'D';

      const result = calculateExamResult(questions, userAnswers, 1800, 1000, mockCategories);

      expect(result.categoryScores.length).toBe(5);

      const cat1 = result.categoryScores.find((cs) => cs.categoryId === 1);
      expect(cat1).toBeDefined();
      expect(cat1?.categoryName).toBe('Vehicle Operation');
      expect(cat1?.totalAsked).toBe(5);
      expect(cat1?.correctCount).toBe(5);
      expect(cat1?.score).toBe(20);
      expect(cat1?.maxScore).toBe(20);

      const cat2 = result.categoryScores.find((cs) => cs.categoryId === 2);
      expect(cat2?.totalAsked).toBe(5);
      expect(cat2?.correctCount).toBe(3);
      expect(cat2?.score).toBe(12);
      expect(cat2?.maxScore).toBe(20);

      const cat3 = result.categoryScores.find((cs) => cs.categoryId === 3);
      expect(cat3?.totalAsked).toBe(5);
      expect(cat3?.correctCount).toBe(0);
      expect(cat3?.score).toBe(0);
      expect(cat3?.maxScore).toBe(20);
    });

    it('falls back gracefully if categories are not provided', () => {
      const userAnswers: Record<number, OptionKey | null> = { 1: 'A' };
      const sample = [createMockQuestion(1, 99, 'A')];

      const result = calculateExamResult(sample, userAnswers, 600);

      expect(result.categoryScores[0].categoryId).toBe(99);
      expect(result.categoryScores[0].categoryName).toBe('Category 99');
    });
  });

  describe('calculateExamResult with custom question count', () => {
    it('handles custom 10-question drill: totalMarks = 40, passMark = 24 (60%)', () => {
      const questions: Question[] = [];
      for (let i = 1; i <= 10; i++) {
        questions.push(createMockQuestion(i, 1, 'B'));
      }

      // 6 correct out of 10 => 24 marks => Pass
      const userAnswersPass: Record<number, OptionKey | null> = {};
      questions.forEach((q, idx) => {
        userAnswersPass[q.id] = idx < 6 ? 'B' : 'A';
      });

      const resultPass = calculateExamResult(questions, userAnswersPass, 600, 300);
      expect(resultPass.totalQuestions).toBe(10);
      expect(resultPass.totalMarks).toBe(40);
      expect(resultPass.passMark).toBe(24);
      expect(resultPass.correctCount).toBe(6);
      expect(resultPass.score).toBe(24);
      expect(resultPass.passed).toBe(true);

      // 5 correct out of 10 => 20 marks => Fail
      const userAnswersFail: Record<number, OptionKey | null> = {};
      questions.forEach((q, idx) => {
        userAnswersFail[q.id] = idx < 5 ? 'B' : 'A';
      });

      const resultFail = calculateExamResult(questions, userAnswersFail, 600, 300);
      expect(resultFail.correctCount).toBe(5);
      expect(resultFail.score).toBe(20);
      expect(resultFail.passed).toBe(false);
    });

    it('defaults timeTakenSeconds to durationSeconds if omitted', () => {
      const questions = [createMockQuestion(1, 1, 'A')];
      const result = calculateExamResult(questions, { 1: 'A' }, 900);
      expect(result.durationSeconds).toBe(900);
      expect(result.timeTakenSeconds).toBe(900);
    });
  });
});
