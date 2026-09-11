import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import confetti from 'canvas-confetti';
import type { ExamResult, Question, Category } from '../types';
import { ExamResultView } from '../components/test/ExamResultView';
import { QuestionReviewItem } from '../components/test/QuestionReviewItem';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const mockCategories: Category[] = [
  { id: 1, name: 'Vehicle Operation', slug: 'vehicle-operation', poolCount: 130, examWeight: 6 },
  { id: 2, name: 'Traffic Laws', slug: 'traffic-laws', poolCount: 90, examWeight: 5 },
];

const mockQuestions: Question[] = [
  {
    id: 101,
    categoryId: 1,
    question: 'What is the function of the brake pedal?',
    image: null,
    options: [
      { key: 'A', text: 'Speed up' },
      { key: 'B', text: 'Slow down or stop' },
      { key: 'C', text: 'Change music' },
      { key: 'D', text: 'Honk horn' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 102,
    categoryId: 1,
    question: 'What does this traffic sign signify?',
    image: '/images/signs/stop.png',
    options: [
      { key: 'A', text: 'Stop' },
      { key: 'B', text: 'Yield' },
      { key: 'C', text: 'Go' },
      { key: 'D', text: 'No entry' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 201,
    categoryId: 2,
    question: 'What is the legal speed limit in school zones?',
    image: null,
    options: [
      { key: 'A', text: '20 km/h' },
      { key: 'B', text: '50 km/h' },
      { key: 'C', text: '80 km/h' },
      { key: 'D', text: '100 km/h' },
    ],
    correctAnswer: 'A',
  },
];

const mockPassedResult: ExamResult = {
  id: 'exam_123456789',
  timestamp: 1726056000000,
  totalQuestions: 3,
  correctCount: 2,
  totalMarks: 12,
  score: 8,
  passMark: 8,
  passed: true,
  durationSeconds: 1800,
  timeTakenSeconds: 750, // 12:30
  categoryScores: [
    {
      categoryId: 1,
      categoryName: 'Vehicle Operation',
      totalAsked: 2,
      correctCount: 2,
      score: 8,
      maxScore: 8,
    },
    {
      categoryId: 2,
      categoryName: 'Traffic Laws',
      totalAsked: 1,
      correctCount: 0,
      score: 0,
      maxScore: 4,
    },
  ],
  answers: {
    101: 'B', // Correct
    102: 'A', // Correct
    201: 'C', // Incorrect (user answered C, correct is A)
  },
};

const mockFailedResult: ExamResult = {
  id: 'exam_987654321',
  timestamp: 1726056000000,
  totalQuestions: 3,
  correctCount: 1,
  totalMarks: 12,
  score: 4,
  passMark: 8,
  passed: false,
  durationSeconds: 1800,
  timeTakenSeconds: 900,
  categoryScores: [
    {
      categoryId: 1,
      categoryName: 'Vehicle Operation',
      totalAsked: 2,
      correctCount: 1,
      score: 4,
      maxScore: 8,
    },
    {
      categoryId: 2,
      categoryName: 'Traffic Laws',
      totalAsked: 1,
      correctCount: 0,
      score: 0,
      maxScore: 4,
    },
  ],
  answers: {
    101: 'B', // Correct
    102: null, // Unanswered
    201: 'B', // Incorrect
  },
};

describe('QuestionReviewItem', () => {
  it('renders correct answer status and highlights user choice as correct', () => {
    render(
      <QuestionReviewItem
        question={mockQuestions[0]}
        userAnswer="B"
        questionNumber={1}
        categoryName="Vehicle Operation"
      />
    );

    expect(screen.getByTestId('status-badge-correct')).toBeDefined();
    expect(screen.getByText('Q1')).toBeDefined();
    expect(screen.getByText('Vehicle Operation')).toBeDefined();
    expect(screen.getByText('What is the function of the brake pedal?')).toBeDefined();
    expect(screen.getByText('Your Answer (Correct)')).toBeDefined();
  });

  it('renders incorrect answer status and highlights user choice and correct choice distinctly', () => {
    render(
      <QuestionReviewItem
        question={mockQuestions[0]}
        userAnswer="A"
        questionNumber={1}
      />
    );

    expect(screen.getByTestId('status-badge-incorrect')).toBeDefined();
    expect(screen.getByText('Your Answer')).toBeDefined();
    expect(screen.getByText('Correct Answer')).toBeDefined();
  });

  it('renders unanswered status when user answer is null or undefined', () => {
    render(
      <QuestionReviewItem
        question={mockQuestions[0]}
        userAnswer={null}
        questionNumber={1}
      />
    );

    expect(screen.getByTestId('status-badge-unanswered')).toBeDefined();
    expect(screen.getByText('Correct Answer')).toBeDefined();
    expect(screen.queryByText('Your Answer')).toBeNull();
  });

  it('supports bookmark toggling callback', () => {
    const onToggle = vi.fn();
    render(
      <QuestionReviewItem
        question={mockQuestions[0]}
        userAnswer="B"
        isBookmarked={false}
        onToggleBookmark={onToggle}
      />
    );

    const bookmarkBtn = screen.getByTestId('bookmark-btn-101');
    fireEvent.click(bookmarkBtn);
    expect(onToggle).toHaveBeenCalledWith(101);
  });

  it('opens and closes sign image zoom modal', () => {
    render(
      <QuestionReviewItem
        question={mockQuestions[1]}
        userAnswer="A"
        questionNumber={2}
      />
    );

    const img = screen.getByAltText('Traffic sign for question 102');
    expect(img).toBeDefined();

    // Click image thumbnail
    fireEvent.click(img);

    expect(screen.getByTestId('zoom-modal')).toBeDefined();
    const closeBtn = screen.getByLabelText('Close image modal');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('zoom-modal')).toBeNull();
  });
});

describe('ExamResultView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers confetti when passed is true', () => {
    render(
      <ExamResultView
        result={mockPassedResult}
        questions={mockQuestions}
        categories={mockCategories}
      />
    );

    expect(confetti).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('verdict-passed')).toBeDefined();
    expect(screen.getByText(/67% Score/)).toBeDefined();
  });

  it('does not trigger confetti when passed is false', () => {
    render(
      <ExamResultView
        result={mockFailedResult}
        questions={mockQuestions}
        categories={mockCategories}
      />
    );

    expect(confetti).not.toHaveBeenCalled();
    expect(screen.getByTestId('verdict-failed')).toBeDefined();
  });

  it('displays summary statistics and category performance accurately', () => {
    render(
      <ExamResultView
        result={mockPassedResult}
        questions={mockQuestions}
        categories={mockCategories}
      />
    );

    // Accuracy: 2 out of 3 = 67%
    expect(screen.getByText('67%')).toBeDefined();
    // Time Taken: 750 seconds = 12:30
    expect(screen.getByText('12:30')).toBeDefined();

    // Category names
    expect(screen.getByText('Category Performance Breakdown')).toBeDefined();
    expect(screen.getAllByText('Vehicle Operation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Traffic Laws').length).toBeGreaterThan(0);
  });

  it('filters review questions by All, Incorrect, Correct, and Unanswered', () => {
    render(
      <ExamResultView
        result={mockFailedResult}
        questions={mockQuestions}
        categories={mockCategories}
      />
    );

    // Initial state: 'all' filter shows all 3 questions
    expect(screen.getByTestId('question-review-item-101')).toBeDefined();
    expect(screen.getByTestId('question-review-item-102')).toBeDefined();
    expect(screen.getByTestId('question-review-item-201')).toBeDefined();

    // Filter Incorrect only (201)
    const filterIncorrectBtn = screen.getByTestId('filter-incorrect-btn');
    fireEvent.click(filterIncorrectBtn);
    expect(screen.getByTestId('question-review-item-201')).toBeDefined();
    expect(screen.queryByTestId('question-review-item-101')).toBeNull();
    expect(screen.queryByTestId('question-review-item-102')).toBeNull();

    // Filter Correct only (101)
    const filterCorrectBtn = screen.getByTestId('filter-correct-btn');
    fireEvent.click(filterCorrectBtn);
    expect(screen.getByTestId('question-review-item-101')).toBeDefined();
    expect(screen.queryByTestId('question-review-item-201')).toBeNull();

    // Filter Unanswered only (102)
    const filterUnansweredBtn = screen.getByTestId('filter-unanswered-btn');
    fireEvent.click(filterUnansweredBtn);
    expect(screen.getByTestId('question-review-item-102')).toBeDefined();
    expect(screen.queryByTestId('question-review-item-101')).toBeNull();
  });

  it('triggers action button callbacks: Retake, Practice Missed, Back to Dashboard', () => {
    const onRetakeExam = vi.fn();
    const onPracticeMissed = vi.fn();
    const onBackToDashboard = vi.fn();

    render(
      <ExamResultView
        result={mockPassedResult}
        questions={mockQuestions}
        categories={mockCategories}
        onRetakeExam={onRetakeExam}
        onPracticeMissed={onPracticeMissed}
        onBackToDashboard={onBackToDashboard}
      />
    );

    // Retake exam
    const retakeBtn = screen.getByTestId('retake-exam-top-btn');
    fireEvent.click(retakeBtn);
    expect(onRetakeExam).toHaveBeenCalledTimes(1);

    // Practice missed: 201 is incorrect
    const practiceBtn = screen.getByTestId('practice-missed-top-btn');
    fireEvent.click(practiceBtn);
    expect(onPracticeMissed).toHaveBeenCalledTimes(1);
    expect(onPracticeMissed).toHaveBeenCalledWith([mockQuestions[2]]);

    // Back to dashboard
    const backBtn = screen.getByTestId('back-dashboard-top-btn');
    fireEvent.click(backBtn);
    expect(onBackToDashboard).toHaveBeenCalledTimes(1);
  });
});
