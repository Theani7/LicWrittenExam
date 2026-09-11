import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarksView } from '../components/bookmarks/BookmarksView';
import type { Question, Category } from '../types';

const mockCategories: Category[] = [
  { id: 1, name: 'Vehicle Operation', slug: 'vehicle-operation', poolCount: 130, examWeight: 6 },
  { id: 6, name: 'Traffic Signs', slug: 'traffic-signs', poolCount: 110, examWeight: 6 },
];

const mockQuestions: Question[] = [
  {
    id: 10,
    categoryId: 1,
    question: 'When should you check the motorcycle tyre pressure?',
    image: null,
    options: [
      { key: 'A', text: 'When tyres are cold' },
      { key: 'B', text: 'After a 50km ride' },
      { key: 'C', text: 'Never check it' },
      { key: 'D', text: 'Only during puncture' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 20,
    categoryId: 1,
    question: 'What is the function of the clutch lever?',
    image: null,
    options: [
      { key: 'A', text: 'To brake the front wheel' },
      { key: 'B', text: 'To disconnect engine power to gearbox' },
      { key: 'C', text: 'To accelerate faster' },
      { key: 'D', text: 'To turn on headlights' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 300,
    categoryId: 6,
    question: 'What does a red octagon sign mean?',
    image: '/signs/stop.png',
    options: [
      { key: 'A', text: 'Give Way' },
      { key: 'B', text: 'Stop' },
      { key: 'C', text: 'No Entry' },
      { key: 'D', text: 'Speed Limit' },
    ],
    correctAnswer: 'B',
  },
];

describe('BookmarksView', () => {
  const mockToggleBookmark = vi.fn();
  const mockClearBookmarks = vi.fn();
  const mockPracticeBookmarks = vi.fn();
  const mockExploreQuestions = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when there are no bookmarks', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[]}
        onExploreQuestions={mockExploreQuestions}
      />
    );

    expect(screen.getByText('No Bookmarked Questions Yet')).toBeDefined();
    expect(
      screen.getByText(/Bookmark tricky or important questions during your study/i)
    ).toBeDefined();

    const exploreBtn = screen.getByRole('button', { name: /Explore Questions in Learn Mode/i });
    expect(exploreBtn).toBeDefined();
    fireEvent.click(exploreBtn);
    expect(mockExploreQuestions).toHaveBeenCalledTimes(1);
  });

  it('renders bookmarked questions and displays correct count badge', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[10, 300]}
        onToggleBookmark={mockToggleBookmark}
        onClearBookmarks={mockClearBookmarks}
        onPracticeBookmarks={mockPracticeBookmarks}
      />
    );

    expect(screen.getByText('Bookmarked Questions')).toBeDefined();
    const badge = screen.getByTestId('bookmarks-count-badge');
    expect(badge.textContent).toContain('2 saved');

    // Both questions should be rendered
    expect(
      screen.getByText('When should you check the motorcycle tyre pressure?')
    ).toBeDefined();
    expect(screen.getByText('What does a red octagon sign mean?')).toBeDefined();
    // Question 20 was not bookmarked
    expect(screen.queryByText('What is the function of the clutch lever?')).toBeNull();
  });

  it('filters bookmarked questions using the search bar', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[10, 20, 300]}
        onToggleBookmark={mockToggleBookmark}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search within bookmarked questions/i);
    fireEvent.change(searchInput, { target: { value: 'tyre' } });

    expect(
      screen.getByText('When should you check the motorcycle tyre pressure?')
    ).toBeDefined();
    expect(screen.queryByText('What is the function of the clutch lever?')).toBeNull();
    expect(screen.queryByText('What does a red octagon sign mean?')).toBeNull();
    expect(screen.getByText(/Found 1 of 3 bookmarks/i)).toBeDefined();
  });

  it('shows empty filter state when search has no matches, and resets on clear', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[10, 20]}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search within bookmarked questions/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent-query-xyz' } });

    expect(
      screen.getByText(/No bookmarked questions match your search/i)
    ).toBeDefined();

    const clearBtn = screen.getByText('Clear search filter');
    fireEvent.click(clearBtn);

    expect(
      screen.getByText('When should you check the motorcycle tyre pressure?')
    ).toBeDefined();
  });

  it('calls onPracticeBookmarks with bookmarked questions when Practice Bookmarks is clicked', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[10, 20]}
        onPracticeBookmarks={mockPracticeBookmarks}
      />
    );

    const practiceBtn = screen.getByTestId('practice-bookmarks-btn');
    fireEvent.click(practiceBtn);

    expect(mockPracticeBookmarks).toHaveBeenCalledTimes(1);
    expect(mockPracticeBookmarks).toHaveBeenCalledWith([mockQuestions[0], mockQuestions[1]]);
  });

  it('opens confirmation modal and handles cancel and clear all actions', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[10, 20]}
        onClearBookmarks={mockClearBookmarks}
      />
    );

    const clearBtn = screen.getByTestId('clear-all-bookmarks-btn');
    fireEvent.click(clearBtn);

    // Modal should be visible
    expect(screen.getByText('Clear All Bookmarks?')).toBeDefined();

    // Cancel first
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(mockClearBookmarks).not.toHaveBeenCalled();
    expect(screen.queryByText('Clear All Bookmarks?')).toBeNull();

    // Reopen and confirm
    fireEvent.click(clearBtn);
    const confirmBtn = screen.getByTestId('confirm-clear-bookmarks');
    fireEvent.click(confirmBtn);

    expect(mockClearBookmarks).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Clear All Bookmarks?')).toBeNull();
  });

  it('calls onToggleBookmark when bookmark button on a question card is clicked', () => {
    render(
      <BookmarksView
        questions={mockQuestions}
        categories={mockCategories}
        bookmarks={[10]}
        onToggleBookmark={mockToggleBookmark}
      />
    );

    const bookmarkToggleBtn = screen.getByLabelText('Remove bookmark for question 10');
    fireEvent.click(bookmarkToggleBtn);

    expect(mockToggleBookmark).toHaveBeenCalledWith(10);
  });
});
