import type { Question } from '../types';

/**
 * Official Department of Transport Management (DoTM)
 * question distribution per category for Category 'A' (Motorcycle/Scooter)
 * and Category 'K' (Scooter) written examinations (total 25 questions).
 */
export const OFFICIAL_EXAM_DISTRIBUTION: Record<number, number> = {
  1: 6, // Vehicle Operation Knowledge (सवारी सञ्चालन सम्बन्धी ज्ञान)
  2: 5, // Traffic Laws and Regulations (सवारी ऐन नियम सम्बन्धी ज्ञान)
  3: 3, // Technical and Mechanical Knowledge (सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान)
  4: 2, // Environmental Awareness (वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान)
  5: 3, // Accident Awareness and Safety (दुर्घटना सचेतना सम्बन्धी ज्ञान)
  6: 6, // Traffic Signs and Signals (ट्राफिक सङ्केत सम्बन्धी ज्ञान)
};

/**
 * Modern Fisher-Yates shuffle algorithm that creates a shuffled copy of an array.
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Samples N distinct random items from an array without mutating the original.
 * If N is greater than array length, returns all available items shuffled.
 */
export function sampleRandom<T>(array: readonly T[], count: number): T[] {
  if (count <= 0 || array.length === 0) {
    return [];
  }
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generates an official 25-question DoTM simulation exam.
 * Selects the exact quota from each category (6, 5, 3, 2, 3, 6)
 * and returns the shuffled 25 questions.
 */
export function generateOfficialExam(allQuestions: Question[]): Question[] {
  if (!allQuestions || allQuestions.length === 0) {
    return [];
  }

  const selectedQuestions: Question[] = [];

  for (const [categoryIdStr, targetCount] of Object.entries(OFFICIAL_EXAM_DISTRIBUTION)) {
    const categoryId = Number(categoryIdStr);
    const categoryPool = allQuestions.filter((q) => q.categoryId === categoryId);
    const sampled = sampleRandom(categoryPool, targetCount);
    selectedQuestions.push(...sampled);
  }

  // Shuffle the final assembled exam so questions from all categories are mixed
  return shuffleArray(selectedQuestions);
}

/**
 * Generates a targeted category practice test.
 * Samples `count` questions (defaults to 20 or category pool size, whichever is smaller)
 * from the selected category.
 */
export function generateCategoryTest(
  allQuestions: Question[],
  categoryId: number,
  count = 20
): Question[] {
  if (!allQuestions || allQuestions.length === 0 || count <= 0) {
    return [];
  }

  const categoryPool = allQuestions.filter((q) => q.categoryId === categoryId);
  if (categoryPool.length === 0) {
    return [];
  }

  const targetCount = Math.min(count, categoryPool.length);
  return sampleRandom(categoryPool, targetCount);
}
