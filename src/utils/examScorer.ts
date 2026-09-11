import type { Question, Category, OptionKey, ExamResult, ExamCategoryScore } from '../types';

/**
 * Calculates exam results including total marks, pass/fail status,
 * and category-wise performance breakdown.
 */
export function calculateExamResult(
  questions: Question[],
  userAnswers: Record<number, OptionKey | null>,
  durationSeconds: number,
  timeTakenSeconds?: number,
  categories?: Category[]
): ExamResult {
  const marksPerQuestion = 4;
  const totalQuestions = questions.length;
  const totalMarks = totalQuestions === 25 ? 100 : totalQuestions * marksPerQuestion;
  const passMark = totalQuestions === 25 ? 60 : Math.ceil(totalMarks * 0.6);

  let correctCount = 0;

  // Track category counts
  const categoryMap = new Map<number, { totalAsked: number; correctCount: number }>();

  questions.forEach((q) => {
    const isCorrect = userAnswers[q.id] === q.correctAnswer;
    if (isCorrect) {
      correctCount += 1;
    }

    const currentCat = categoryMap.get(q.categoryId) || { totalAsked: 0, correctCount: 0 };
    currentCat.totalAsked += 1;
    if (isCorrect) {
      currentCat.correctCount += 1;
    }
    categoryMap.set(q.categoryId, currentCat);
  });

  const score = correctCount * marksPerQuestion;
  const passed = score >= passMark;

  const categoryScores: ExamCategoryScore[] = Array.from(categoryMap.entries())
    .sort(([catIdA], [catIdB]) => catIdA - catIdB)
    .map(([catId, data]) => {
      const matchedCategory = categories?.find((c) => c.id === catId);
      const categoryName = matchedCategory ? matchedCategory.name : `Category ${catId}`;
      const catScore = data.correctCount * marksPerQuestion;
      const catMaxScore = data.totalAsked * marksPerQuestion;

      return {
        categoryId: catId,
        categoryName,
        totalAsked: data.totalAsked,
        correctCount: data.correctCount,
        score: catScore,
        maxScore: catMaxScore,
      };
    });

  const actualTimeTaken = timeTakenSeconds !== undefined ? timeTakenSeconds : durationSeconds;
  const timestamp = Date.now();
  const id = `exam_${timestamp}`;

  return {
    id,
    timestamp,
    totalQuestions,
    correctCount,
    totalMarks,
    score,
    passMark,
    passed,
    durationSeconds,
    timeTakenSeconds: actualTimeTaken,
    categoryScores,
    answers: { ...userAnswers },
  };
}
