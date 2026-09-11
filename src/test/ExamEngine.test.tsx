import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { Question, Category } from '../types';
import { ExamEngine } from '../components/test/ExamEngine';
import { QuestionNavigator } from '../components/test/QuestionNavigator';
import { TestHome } from '../components/test/TestHome';

const mockQuestions: Question[] = [
  {
    id: 101,
    categoryId: 1,
    question: 'What is the primary function of engine coolant?',
    image: null,
    options: [
      { key: 'A', text: 'Lubricate parts' },
      { key: 'B', text: 'Prevent engine overheating' },
      { key: 'C', text: 'Clean fuel lines' },
      { key: 'D', text: 'Increase tire grip' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 102,
    categoryId: 1,
    question: 'When must you dim high beam headlights?',
    image: '/images/signs/102.png',
    options: [
      { key: 'A', text: 'When approaching oncoming traffic' },
      { key: 'B', text: 'Only in bright sunlight' },
      { key: 'C', text: 'Never dim high beams' },
      { key: 'D', text: 'When driving downhill' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 201,
    categoryId: 2,
    question: 'What is the speed limit in standard urban school zones?',
    image: null,
    options: [
      { key: 'A', text: '20 km/h' },
      { key: 'B', text: '40 km/h' },
      { key: 'C', text: '60 km/h' },
      { key: 'D', text: '80 km/h' },
    ],
    correctAnswer: 'A',
  },
];

describe('QuestionNavigator', () => {
  it('renders all numbered question buttons and reflects current, answered, and flagged states', () => {
    const onSelect = vi.fn();
    const answers = { 101: 'B' as const };
    const flagged = new Set<number>([102]);

    render(
      <QuestionNavigator
        questions={mockQuestions}
        currentIndex={0}
        answers={answers}
        flaggedQuestionIds={flagged}
        onSelectQuestion={onSelect}
      />
    );

    expect(screen.getByText('Question Navigator')).toBeDefined();
    expect(screen.getByText('1 of 3 answered')).toBeDefined();

    const q1Btn = screen.getByTestId('nav-question-1');
    const q2Btn = screen.getByTestId('nav-question-2');
    const q3Btn = screen.getByTestId('nav-question-3');

    expect(q1Btn).toBeDefined();
    expect(q2Btn).toBeDefined();
    expect(q3Btn).toBeDefined();

    // Q1 is current and answered (has ring class and blue background)
    expect(q1Btn.className).toContain('ring-2');
    expect(q1Btn.className).toContain('bg-blue-600');

    // Q2 is flagged
    expect(screen.getByTestId('flagged-badge-2')).toBeDefined();

    // Clicking Q2 triggers callback
    fireEvent.click(q2Btn);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});

describe('ExamEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders initial question, timer, and option choices without revealing answers', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        title="Official Driving License Test"
        durationSeconds={1800}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Official Driving License Test')).toBeDefined();
    expect(screen.getByText('What is the primary function of engine coolant?')).toBeDefined();
    expect(screen.getByText('30:00')).toBeDefined();

    // 4 options are rendered
    expect(screen.getByText('Lubricate parts')).toBeDefined();
    expect(screen.getByText('Prevent engine overheating')).toBeDefined();

    // In test mode, no answers are revealed (no correct/incorrect badge)
    expect(screen.queryByText(/correct/i)).toBeNull();
  });

  it('allows navigating between questions and bound checks Previous/Next buttons', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        durationSeconds={1800}
        onSubmit={onSubmit}
      />
    );

    const prevBtn = screen.getByTestId('prev-question-button') as HTMLButtonElement;
    const nextBtn = screen.getByTestId('next-question-button') as HTMLButtonElement;

    // On first question, Previous is disabled
    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);

    // Click Next -> Question 2
    fireEvent.click(nextBtn);
    expect(screen.getByText('When must you dim high beam headlights?')).toBeDefined();
    expect(prevBtn.disabled).toBe(false);

    // Click Next -> Question 3 (last question)
    fireEvent.click(nextBtn);
    expect(screen.getByText('What is the speed limit in standard urban school zones?')).toBeDefined();
    expect(nextBtn.disabled).toBe(true);

    // Click Previous -> Back to Question 2
    fireEvent.click(prevBtn);
    expect(screen.getByText('When must you dim high beam headlights?')).toBeDefined();
  });

  it('records option selections and allows clearing selection', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        durationSeconds={1800}
        onSubmit={onSubmit}
      />
    );

    const optionB = screen.getByTestId('option-B');
    fireEvent.click(optionB);

    // Option B should have selected styling
    expect(optionB.getAttribute('aria-checked')).toBe('true');

    // Clear selection button appears
    const clearBtn = screen.getByTestId('clear-selection-button');
    expect(clearBtn).toBeDefined();

    fireEvent.click(clearBtn);
    expect(optionB.getAttribute('aria-checked')).toBe('false');
    expect(screen.queryByTestId('clear-selection-button')).toBeNull();
  });

  it('toggles mark for review flag and updates status', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        durationSeconds={1800}
        onSubmit={onSubmit}
      />
    );

    const reviewBtn = screen.getByTestId('mark-review-button');
    expect(reviewBtn).toBeDefined();

    // Flag question 1
    fireEvent.click(reviewBtn);
    expect(reviewBtn.textContent).toContain('Marked for Review');

    // Flag icon should appear in navigator
    expect(screen.getByTestId('flagged-badge-1')).toBeDefined();

    // Unflag
    fireEvent.click(reviewBtn);
    expect(screen.queryByTestId('flagged-badge-1')).toBeNull();
  });

  it('opens submit confirmation dialog, shows breakdown, and allows canceling or confirming', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        durationSeconds={1800}
        onSubmit={onSubmit}
      />
    );

    // Select answer for Question 1
    fireEvent.click(screen.getByTestId('option-A'));

    // Open submit dialog
    const submitBtn = screen.getByTestId('submit-exam-button');
    fireEvent.click(submitBtn);

    // Submit dialog is visible
    expect(screen.getByTestId('submit-dialog')).toBeDefined();
    expect(screen.getByTestId('unanswered-warning').textContent).toContain('2 unanswered');

    // Cancel submit
    const cancelBtn = screen.getByTestId('cancel-submit-button');
    fireEvent.click(cancelBtn);
    expect(screen.queryByTestId('submit-dialog')).toBeNull();

    // Reopen and confirm
    fireEvent.click(submitBtn);
    const confirmBtn = screen.getByTestId('confirm-submit-button');
    fireEvent.click(confirmBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ 101: 'A' }, expect.any(Number));
  });

  it('counts down the timer and auto-submits when time expires', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        durationSeconds={10} // 10 seconds for test
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('00:10')).toBeDefined();

    // Fast forward 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('00:05')).toBeDefined();

    // Fast forward remaining 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('turns timer rose/red when remaining time is less than 5 minutes', () => {
    const onSubmit = vi.fn();

    render(
      <ExamEngine
        questions={mockQuestions}
        durationSeconds={305} // 5m 5s
        onSubmit={onSubmit}
      />
    );

    const timerBox = screen.getByTestId('exam-timer');
    expect(timerBox.className).not.toContain('text-rose-600');

    // Advance 10 seconds so remaining is 295s (< 5 mins)
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(timerBox.className).toContain('text-rose-600');
  });

  it('handles empty questions gracefully', () => {
    render(
      <ExamEngine
        questions={[]}
        durationSeconds={1800}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('No questions available for this exam.')).toBeDefined();
  });
});

describe('TestHome', () => {
  const mockCategories: Category[] = [
    { id: 1, name: 'Vehicle Operation', slug: 'cat-1', poolCount: 50, examWeight: 6 },
    { id: 2, name: 'Traffic Laws', slug: 'cat-2', poolCount: 40, examWeight: 5 },
  ];

  it('renders official exam card and category drill card with actions', () => {
    const onStartOfficial = vi.fn();
    const onStartCategory = vi.fn();

    render(
      <TestHome
        categories={mockCategories}
        onStartOfficialExam={onStartOfficial}
        onStartCategoryExam={onStartCategory}
      />
    );

    expect(screen.getByTestId('official-exam-card')).toBeDefined();
    expect(screen.getByTestId('category-drill-card')).toBeDefined();

    // Start official exam
    fireEvent.click(screen.getByTestId('start-official-exam-btn'));
    expect(onStartOfficial).toHaveBeenCalledTimes(1);

    // Change category drill options
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: '2' } });

    const count10Btn = screen.getByTestId('count-option-10');
    fireEvent.click(count10Btn);

    fireEvent.click(screen.getByTestId('start-category-drill-btn'));
    expect(onStartCategory).toHaveBeenCalledWith(2, 10);
  });

  it('displays empty state when no history is present', () => {
    render(
      <TestHome
        categories={mockCategories}
        onStartOfficialExam={vi.fn()}
        onStartCategoryExam={vi.fn()}
      />
    );

    expect(screen.getByTestId('history-empty-state')).toBeDefined();
  });
});
