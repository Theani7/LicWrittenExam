import { describe, it, expect } from 'vitest';
import type { Question } from '../types';
import {
  OFFICIAL_EXAM_DISTRIBUTION,
  generateOfficialExam,
  generateCategoryTest,
} from '../utils/examGenerator';

function createMockQuestion(id: number, categoryId: number): Question {
  return {
    id,
    categoryId,
    question: `Sample question ${id} for category ${categoryId}`,
    image: null,
    options: [
      { key: 'A', text: 'Option A' },
      { key: 'B', text: 'Option B' },
      { key: 'C', text: 'Option C' },
      { key: 'D', text: 'Option D' },
    ],
    correctAnswer: 'A',
  };
}

function generateMockQuestionBank(): Question[] {
  const questions: Question[] = [];
  let idCounter = 1;
  // Create 15 questions for each of the 6 categories
  for (let catId = 1; catId <= 6; catId++) {
    for (let i = 0; i < 15; i++) {
      questions.push(createMockQuestion(idCounter++, catId));
    }
  }
  return questions;
}

describe('examGenerator', () => {
  const mockBank = generateMockQuestionBank();

  describe('OFFICIAL_EXAM_DISTRIBUTION', () => {
    it('defines exact distribution summing to 25 questions across categories 1 to 6', () => {
      expect(OFFICIAL_EXAM_DISTRIBUTION).toEqual({
        1: 6,
        2: 5,
        3: 3,
        4: 2,
        5: 3,
        6: 6,
      });

      const total = Object.values(OFFICIAL_EXAM_DISTRIBUTION).reduce((acc, count) => acc + count, 0);
      expect(total).toBe(25);
    });
  });

  describe('generateOfficialExam', () => {
    it('generates an exam with exactly 25 questions and matching category weights', () => {
      const exam = generateOfficialExam(mockBank);

      expect(exam.length).toBe(25);

      // Verify no duplicates
      const uniqueIds = new Set(exam.map((q) => q.id));
      expect(uniqueIds.size).toBe(25);

      // Count by category
      const counts: Record<number, number> = {};
      for (const q of exam) {
        counts[q.categoryId] = (counts[q.categoryId] || 0) + 1;
      }

      expect(counts[1]).toBe(6);
      expect(counts[2]).toBe(5);
      expect(counts[3]).toBe(3);
      expect(counts[4]).toBe(2);
      expect(counts[5]).toBe(3);
      expect(counts[6]).toBe(6);
    });

    it('generates diverse randomized selections across multiple invocations', () => {
      const exam1 = generateOfficialExam(mockBank);
      const exam2 = generateOfficialExam(mockBank);

      const ids1 = exam1.map((q) => q.id).join(',');
      const ids2 = exam2.map((q) => q.id).join(',');

      // Given 90 questions, the exact ordered IDs should almost certainly differ
      expect(ids1).not.toBe(ids2);
    });

    it('handles empty questions gracefully without throwing', () => {
      const exam = generateOfficialExam([]);
      expect(exam).toEqual([]);
    });

    it('handles pool shortages gracefully when category pool has fewer questions than quota', () => {
      // Create limited pool: Category 1 only has 2 questions, Category 4 has 1 question
      const limitedBank: Question[] = [
        createMockQuestion(101, 1),
        createMockQuestion(102, 1),
        createMockQuestion(201, 2),
        createMockQuestion(202, 2),
        createMockQuestion(203, 2),
        createMockQuestion(204, 2),
        createMockQuestion(205, 2),
        createMockQuestion(301, 3),
        createMockQuestion(302, 3),
        createMockQuestion(303, 3),
        createMockQuestion(401, 4),
        createMockQuestion(501, 5),
        createMockQuestion(502, 5),
        createMockQuestion(503, 5),
        createMockQuestion(601, 6),
        createMockQuestion(602, 6),
      ];

      const exam = generateOfficialExam(limitedBank);
      const cat1Questions = exam.filter((q) => q.categoryId === 1);
      const cat4Questions = exam.filter((q) => q.categoryId === 4);

      expect(cat1Questions.length).toBe(2);
      expect(cat4Questions.length).toBe(1);
      // No duplicate ids
      const ids = new Set(exam.map((q) => q.id));
      expect(ids.size).toBe(exam.length);
    });
  });

  describe('generateCategoryTest', () => {
    it('samples specified count of questions from chosen category', () => {
      const testQuestions = generateCategoryTest(mockBank, 1, 5);

      expect(testQuestions.length).toBe(5);
      expect(testQuestions.every((q) => q.categoryId === 1)).toBe(true);

      const uniqueIds = new Set(testQuestions.map((q) => q.id));
      expect(uniqueIds.size).toBe(5);
    });

    it('defaults to 20 or category pool size when count is omitted', () => {
      // mockBank category 2 has 15 questions
      const testQuestions = generateCategoryTest(mockBank, 2);

      // Category 2 only has 15, so it should cap at 15
      expect(testQuestions.length).toBe(15);
      expect(testQuestions.every((q) => q.categoryId === 2)).toBe(true);
    });

    it('caps at category pool size if requested count exceeds available', () => {
      const testQuestions = generateCategoryTest(mockBank, 3, 50);

      expect(testQuestions.length).toBe(15);
      expect(testQuestions.every((q) => q.categoryId === 3)).toBe(true);
    });

    it('returns empty array if category does not exist or has no questions', () => {
      const testQuestions = generateCategoryTest(mockBank, 999, 10);
      expect(testQuestions).toEqual([]);
    });

    it('returns empty array for empty questions list', () => {
      const testQuestions = generateCategoryTest([], 1, 10);
      expect(testQuestions).toEqual([]);
    });
  });
});
