export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  key: OptionKey;
  text: string;
}

/** Alias for QuestionOption */
export type Option = QuestionOption;

export interface Question {
  id: number;
  categoryId: number;
  question: string;
  image: string | null;
  options: QuestionOption[];
  correctAnswer: OptionKey;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  poolCount: number;
  examWeight: number;
}

export interface ExamMetadata {
  title: string;
  version: string;
  totalQuestions: number;
  passMark: number;
  totalMarks: number;
  examDurationMinutes: number;
  questionsPerExam: number;
  marksPerQuestion: number;
}

export interface ExamConfig {
  durationMinutes: number;
  passMark: number;
  totalMarks: number;
  questionsPerExam: number;
  marksPerQuestion: number;
}

export interface QuestionsData {
  metadata: ExamMetadata;
  categories: Category[];
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: OptionKey | null;
  isFlagged?: boolean;
}

export interface ExamCategoryScore {
  categoryId: number;
  categoryName: string;
  totalAsked: number;
  correctCount: number;
  score: number;
  maxScore: number;
}

export interface ExamResult {
  id: string;
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  totalMarks: number;
  score: number;
  passMark: number;
  passed: boolean;
  durationSeconds: number;
  timeTakenSeconds: number;
  categoryScores: ExamCategoryScore[];
  answers: Record<number, OptionKey | null>;
}
