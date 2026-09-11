import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import * as useQuestionsModule from '../hooks/useQuestions';
import type { Question, Category, ExamMetadata } from '../types';

const mockCategories: Category[] = [
  { id: 1, name: 'Vehicle Operation', slug: 'vehicle-operation', poolCount: 10, examWeight: 6 },
  { id: 2, name: 'Traffic Laws', slug: 'traffic-laws', poolCount: 10, examWeight: 5 },
  { id: 3, name: 'Technical & Mechanical', slug: 'technical-mechanical', poolCount: 10, examWeight: 3 },
  { id: 4, name: 'Environmental Awareness', slug: 'environmental-awareness', poolCount: 10, examWeight: 2 },
  { id: 5, name: 'Accident Safety', slug: 'accident-awareness', poolCount: 10, examWeight: 3 },
  { id: 6, name: 'Traffic Signs', slug: 'traffic-signs', poolCount: 10, examWeight: 6 },
];

const createMockQuestions = (): Question[] => {
  const list: Question[] = [];
  let idCounter = 1;
  const counts: Record<number, number> = { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10 };
  for (const [catIdStr, count] of Object.entries(counts)) {
    const catId = Number(catIdStr);
    for (let i = 0; i < count; i++) {
      list.push({
        id: idCounter,
        categoryId: catId,
        question: `Question ${idCounter} for Category ${catId}?`,
        image: null,
        options: [
          { key: 'A', text: `Option A for Q${idCounter}` },
          { key: 'B', text: `Option B for Q${idCounter}` },
          { key: 'C', text: `Option C for Q${idCounter}` },
          { key: 'D', text: `Option D for Q${idCounter}` },
        ],
        correctAnswer: 'A',
      });
      idCounter++;
    }
  }
  return list;
};

const mockMetadata: ExamMetadata = {
  title: 'DoTM Category A & K Exam',
  version: '2082/2083',
  totalQuestions: 60,
  passMark: 60,
  totalMarks: 100,
  examDurationMinutes: 30,
  questionsPerExam: 25,
  marksPerQuestion: 4,
};

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    vi.restoreAllMocks();
  });

  it('renders loading spinner when useQuestions is loading', () => {
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: [],
      categories: [],
      metadata: null,
      loading: true,
      error: null,
    });

    render(<App />);
    expect(screen.getByText(/Loading 500-question exam database/i)).toBeDefined();
  });

  it('renders error state when useQuestions returns an error', () => {
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: [],
      categories: [],
      metadata: null,
      loading: false,
      error: 'Network connection failed',
    });

    render(<App />);
    expect(screen.getByText('Failed to Load Questions')).toBeDefined();
    expect(screen.getByText('Network connection failed')).toBeDefined();
  });

  it('renders main layout with navbar, footer, and default Learn tab', async () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(<App />);

    // Top navigation
    expect(screen.getByText('Nepal License Prep')).toBeDefined();
    expect(screen.getByTestId('nav-tab-learn')).toBeDefined();
    expect(screen.getByTestId('nav-tab-test')).toBeDefined();
    expect(screen.getByTestId('nav-tab-bookmarks')).toBeDefined();

    // Default view is LearnView (Search bar is present)
    expect(screen.getByPlaceholderText(/Search questions/i)).toBeDefined();

    // Footer
    expect(screen.getByText(/Syllabus FY 2082\/83/i)).toBeDefined();
    expect(screen.getByText(/DoTM 500 Question Curriculum/i)).toBeDefined();
  });

  it('navigates between Learn, Test, and Bookmarks tabs', async () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(<App />);

    // Switch to Test tab
    fireEvent.click(screen.getByTestId('nav-tab-test'));
    expect(screen.getByText(/Official DoTM Exam Simulation/i)).toBeDefined();
    expect(screen.queryByPlaceholderText(/Search questions/i)).toBeNull();

    // Switch to Bookmarks tab
    fireEvent.click(screen.getByTestId('nav-tab-bookmarks'));
    expect(screen.getByText('No Bookmarked Questions Yet')).toBeDefined();

    // Switch back to Learn tab
    fireEvent.click(screen.getByTestId('nav-tab-learn'));
    expect(screen.getByPlaceholderText(/Search questions/i)).toBeDefined();
  });

  it('opens and closes Guidelines Modal', () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(<App />);

    // Guidelines modal initially closed
    expect(screen.queryByRole('dialog')).toBeNull();

    // Click Guidelines in navbar
    fireEvent.click(screen.getByTestId('guidelines-button'));
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Official Examination Guidelines')).toBeDefined();

    // Close via Got It button
    fireEvent.click(screen.getByRole('button', { name: /Got It/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('starts official exam simulation, answers, submits, and returns to dashboard', () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(<App />);

    // Go to Test mode
    fireEvent.click(screen.getByTestId('nav-tab-test'));

    // Start official exam
    const startExamBtn = screen.getByTestId('start-official-exam-btn');
    fireEvent.click(startExamBtn);

    // Exam Engine should now be rendered with 25 questions
    expect(screen.getByText(/DoTM Official Exam Simulation/i)).toBeDefined();
    expect(screen.getByTestId('submit-exam-button')).toBeDefined();

    // Submit exam
    const submitBtn = screen.getByTestId('submit-exam-button');
    fireEvent.click(submitBtn);

    // Confirm submission modal
    const confirmSubmitBtn = screen.getByTestId('confirm-submit-button');
    fireEvent.click(confirmSubmitBtn);

    // ExamResultView should now be displayed
    expect(screen.getByTestId('result-banner')).toBeDefined();

    // Click back to dashboard
    const dashboardBtn = screen.getByTestId('back-dashboard-top-btn');
    fireEvent.click(dashboardBtn);

    // Back to TestHome
    expect(screen.getByText(/Official DoTM Exam Simulation/i)).toBeDefined();
  });

  it('safeguards against accidental navigation while an exam is in progress', () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(<App />);

    // Go to Test mode and start exam
    fireEvent.click(screen.getByTestId('nav-tab-test'));
    const startExamBtn = screen.getByTestId('start-official-exam-btn');
    fireEvent.click(startExamBtn);

    expect(screen.getByText(/DoTM Official Exam Simulation/i)).toBeDefined();

    // Try navigating to Learn tab while exam is running
    fireEvent.click(screen.getByTestId('nav-tab-learn'));

    // Should prompt with "Leave Exam in Progress?" safeguard modal
    expect(screen.getByText('Leave Exam in Progress?')).toBeDefined();

    // Cancel leaving
    fireEvent.click(screen.getByTestId('cancel-leave-exam-btn'));
    expect(screen.queryByText('Leave Exam in Progress?')).toBeNull();
    // Still in exam
    expect(screen.getByText(/DoTM Official Exam Simulation/i)).toBeDefined();

    // Try navigating to Bookmarks tab
    fireEvent.click(screen.getByTestId('nav-tab-bookmarks'));
    expect(screen.getByText('Leave Exam in Progress?')).toBeDefined();

    // Confirm leaving
    fireEvent.click(screen.getByTestId('confirm-leave-exam-btn'));
    expect(screen.queryByText('Leave Exam in Progress?')).toBeNull();

    // Should now be on Bookmarks view
    expect(screen.getByText('No Bookmarked Questions Yet')).toBeDefined();
  });

  it('handles beforeunload event when test is active', () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(<App />);

    // Start exam
    fireEvent.click(screen.getByTestId('nav-tab-test'));
    fireEvent.click(screen.getByTestId('start-official-exam-btn'));

    const event = new Event('beforeunload', { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('allows practicing bookmarked questions from Bookmarks tab', () => {
    const mockQuestions = createMockQuestions();
    vi.spyOn(useQuestionsModule, 'useQuestions').mockReturnValue({
      data: null,
      questions: mockQuestions,
      categories: mockCategories,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    // Seed a bookmark in localStorage
    localStorage.setItem('nepal_prep_bookmarks', JSON.stringify([mockQuestions[0].id]));

    render(<App />);

    // Navigate to Bookmarks tab
    fireEvent.click(screen.getByTestId('nav-tab-bookmarks'));

    // Should show 1 saved bookmark
    const badge = screen.getByTestId('bookmarks-count-badge');
    expect(badge.textContent).toContain('1 saved');

    // Click Practice Bookmarks
    const practiceBtn = screen.getByTestId('practice-bookmarks-btn');
    fireEvent.click(practiceBtn);

    // Should transition to ExamEngine with Bookmarked Questions Practice
    expect(screen.getByText('Bookmarked Questions Practice')).toBeDefined();
  });
});
