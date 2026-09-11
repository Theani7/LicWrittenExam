import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Question, Category } from '../types';
import { LearnView } from '../components/learn/LearnView';
import { CategoryPills } from '../components/learn/CategoryPills';
import { SearchBar } from '../components/learn/SearchBar';
import { QuestionCard } from '../components/learn/QuestionCard';
import { FlashcardView } from '../components/learn/FlashcardView';

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Vehicle Operation',
    slug: 'vehicle-operation',
    poolCount: 2,
    examWeight: 6,
  },
  {
    id: 6,
    name: 'Traffic Signs',
    slug: 'traffic-signs',
    poolCount: 2,
    examWeight: 6,
  },
];

const mockQuestions: Question[] = [
  {
    id: 1,
    categoryId: 1,
    question: 'When should you check vehicle engine oil?',
    image: null,
    options: [
      { key: 'A', text: 'Before starting the engine' },
      { key: 'B', text: 'While driving fast' },
      { key: 'C', text: 'Only during rain' },
      { key: 'D', text: 'Never check it' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 2,
    categoryId: 1,
    question: 'What color is the high beam indicator light?',
    image: null,
    options: [
      { key: 'A', text: 'Red' },
      { key: 'B', text: 'Blue' },
      { key: 'C', text: 'Green' },
      { key: 'D', text: 'Yellow' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 400,
    categoryId: 6,
    question: 'What does this triangular sign mean?',
    image: '/signs/sign_400.png',
    options: [
      { key: 'A', text: 'Stop' },
      { key: 'B', text: 'Yield / Give way' },
      { key: 'C', text: 'No entry' },
      { key: 'D', text: 'Speed limit' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 401,
    categoryId: 6,
    question: 'What does an octagonal red sign mean?',
    image: '/signs/sign_401.png',
    options: [
      { key: 'A', text: 'Go' },
      { key: 'B', text: 'Slow down' },
      { key: 'C', text: 'Stop' },
      { key: 'D', text: 'Park' },
    ],
    correctAnswer: 'C',
  },
];

describe('CategoryPills Component', () => {
  it('renders "All Questions" and category names with counts', () => {
    const handleSelect = vi.fn();
    render(
      <CategoryPills
        categories={mockCategories}
        selectedCategoryId={null}
        onSelectCategory={handleSelect}
        totalQuestionsCount={4}
      />
    );

    expect(screen.getByText('All Questions')).toBeDefined();
    expect(screen.getByText('Vehicle Operation')).toBeDefined();
    expect(screen.getByText('Traffic Signs')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
  });

  it('calls onSelectCategory with null when "All Questions" is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <CategoryPills
        categories={mockCategories}
        selectedCategoryId={1}
        onSelectCategory={handleSelect}
        totalQuestionsCount={4}
      />
    );

    fireEvent.click(screen.getByText('All Questions'));
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('calls onSelectCategory with category id when category is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <CategoryPills
        categories={mockCategories}
        selectedCategoryId={null}
        onSelectCategory={handleSelect}
        totalQuestionsCount={4}
      />
    );

    fireEvent.click(screen.getByText('Vehicle Operation'));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });
});

describe('SearchBar Component', () => {
  it('renders input and calls onSearchChange on typing', () => {
    const handleSearch = vi.fn();
    const handleFilter = vi.fn();
    render(
      <SearchBar
        searchQuery=""
        onSearchChange={handleSearch}
        activeFilter="all"
        onFilterChange={handleFilter}
        bookmarkedCount={3}
      />
    );

    const input = screen.getByPlaceholderText(/search questions/i);
    fireEvent.change(input, { target: { value: 'engine' } });
    expect(handleSearch).toHaveBeenCalledWith('engine');
  });

  it('renders clear button when query is present and clicking clears query', () => {
    const handleSearch = vi.fn();
    const handleFilter = vi.fn();
    render(
      <SearchBar
        searchQuery="oil"
        onSearchChange={handleSearch}
        activeFilter="all"
        onFilterChange={handleFilter}
      />
    );

    const clearButton = screen.getByLabelText(/clear search input/i);
    fireEvent.click(clearButton);
    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('calls onFilterChange when quick filter chip is clicked', () => {
    const handleSearch = vi.fn();
    const handleFilter = vi.fn();
    render(
      <SearchBar
        searchQuery=""
        onSearchChange={handleSearch}
        activeFilter="all"
        onFilterChange={handleFilter}
        bookmarkedCount={2}
      />
    );

    fireEvent.click(screen.getByText('Bookmarked'));
    expect(handleFilter).toHaveBeenCalledWith('bookmarked');

    fireEvent.click(screen.getByText('Traffic Signs'));
    expect(handleFilter).toHaveBeenCalledWith('signs');
  });
});

describe('QuestionCard Component', () => {
  it('renders question details and options', () => {
    const handleBookmark = vi.fn();
    render(
      <QuestionCard
        question={mockQuestions[0]}
        categoryName="Vehicle Operation"
        isBookmarked={false}
        onToggleBookmark={handleBookmark}
      />
    );

    expect(screen.getByText('Q1')).toBeDefined();
    expect(screen.getByText('Vehicle Operation')).toBeDefined();
    expect(screen.getByText('When should you check vehicle engine oil?')).toBeDefined();
    expect(screen.getByText('Before starting the engine')).toBeDefined();
    expect(screen.getByText('While driving fast')).toBeDefined();
  });

  it('toggles bookmark when bookmark icon is clicked', () => {
    const handleBookmark = vi.fn();
    render(
      <QuestionCard
        question={mockQuestions[0]}
        isBookmarked={false}
        onToggleBookmark={handleBookmark}
      />
    );

    const bookmarkBtn = screen.getByLabelText(/bookmark question 1/i);
    fireEvent.click(bookmarkBtn);
    expect(handleBookmark).toHaveBeenCalledWith(1);
  });

  it('provides feedback when selecting correct answer', () => {
    const handleAnswerSelected = vi.fn();
    render(
      <QuestionCard
        question={mockQuestions[0]}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
        onAnswerSelected={handleAnswerSelected}
      />
    );

    // Option A is correct
    const optionA = screen.getByText('Before starting the engine');
    fireEvent.click(optionA);

    expect(handleAnswerSelected).toHaveBeenCalledWith(1, 'A', true);
    expect(screen.getByText('Correct! ✓')).toBeDefined();
  });

  it('provides feedback when selecting incorrect answer and highlights correct answer', () => {
    const handleAnswerSelected = vi.fn();
    render(
      <QuestionCard
        question={mockQuestions[0]}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
        onAnswerSelected={handleAnswerSelected}
      />
    );

    // Option B is incorrect
    const optionB = screen.getByText('While driving fast');
    fireEvent.click(optionB);

    expect(handleAnswerSelected).toHaveBeenCalledWith(1, 'B', false);
    expect(screen.getByText(/incorrect \(correct: a\)/i)).toBeDefined();
  });

  it('reveals answer when "Show Answer" button is clicked and allows reset', () => {
    render(
      <QuestionCard
        question={mockQuestions[0]}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
      />
    );

    const showAnswerBtn = screen.getByText('Show Answer');
    fireEvent.click(showAnswerBtn);

    expect(screen.getByText('Hide Answer')).toBeDefined();

    // Reset button should now be available
    const resetBtn = screen.getByText('Reset');
    fireEvent.click(resetBtn);
    expect(screen.getByText('Show Answer')).toBeDefined();
  });

  it('renders image when question has image and opens modal on click', () => {
    render(
      <QuestionCard
        question={mockQuestions[2]}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
      />
    );

    const img = screen.getByAltText('Traffic sign for question 400');
    expect(img).toBeDefined();

    // Click image container
    fireEvent.click(img);

    // Dialog should open
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Question #400 — Sign Detail')).toBeDefined();

    // Close button
    const closeBtn = screen.getByLabelText(/close enlarged image/i);
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('syncs revealed state when initialShowAnswer prop updates', () => {
    const { rerender } = render(
      <QuestionCard
        question={mockQuestions[0]}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
        initialShowAnswer={false}
      />
    );

    const optionA = screen.getByText('Before starting the engine').closest('button')!;
    expect(optionA.className).not.toContain('border-emerald-500');

    rerender(
      <QuestionCard
        question={mockQuestions[0]}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
        initialShowAnswer={true}
      />
    );

    expect(optionA.className).toContain('border-emerald-500');
  });
});

describe('FlashcardView Component', () => {
  it('renders current flashcard and navigates next and prev', () => {
    const handleBookmark = vi.fn();
    render(
      <FlashcardView
        questions={mockQuestions}
        categories={mockCategories}
        isBookmarked={() => false}
        onToggleBookmark={handleBookmark}
      />
    );

    expect(screen.getByText('Flashcard 1')).toBeDefined();
    expect(screen.getByText('of 4 (25%)')).toBeDefined();
    expect(screen.getByText('When should you check vehicle engine oil?')).toBeDefined();

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /next question/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Flashcard 2')).toBeDefined();
    expect(screen.getByText('What color is the high beam indicator light?')).toBeDefined();

    // Click Prev
    const prevBtn = screen.getByRole('button', { name: /previous question/i });
    fireEvent.click(prevBtn);

    expect(screen.getByText('Flashcard 1')).toBeDefined();
  });

  it('responds to keyboard arrow navigation and space to reveal', () => {
    render(
      <FlashcardView
        questions={mockQuestions}
        categories={mockCategories}
        isBookmarked={() => false}
        onToggleBookmark={vi.fn()}
      />
    );

    expect(screen.getByText('Flashcard 1')).toBeDefined();

    const optionAButton = screen.getByText('Before starting the engine').closest('button')!;
    expect(optionAButton.className).not.toContain('border-emerald-500');

    // Press ArrowRight
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Flashcard 2')).toBeDefined();

    // Press ArrowLeft
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Flashcard 1')).toBeDefined();

    // Press Space to reveal answer
    fireEvent.keyDown(window, { key: ' ', code: 'Space' });
    expect(screen.getByText('Hide Answer')).toBeDefined();

    // Re-query the current card's option A button: it is now highlighted in emerald
    const activeOptionAButton = screen.getByText('Before starting the engine').closest('button')!;
    expect(activeOptionAButton.className).toContain('border-emerald-500');
  });

  it('hides duplicate Show Answer button inside QuestionCard when in FlashcardView', () => {
    render(
      <FlashcardView
        questions={mockQuestions}
        categories={mockCategories}
        isBookmarked={() => false}
        onToggleBookmark={vi.fn()}
      />
    );

    // QuestionCard's internal "Show Answer" button is hidden in flashcard mode
    expect(screen.queryByText('Show Answer')).toBeNull();

    // The single FlashcardView reveal button is present
    expect(screen.getByRole('button', { name: /toggle answer reveal/i })).toBeDefined();
    expect(screen.getByText('Reveal Answer')).toBeDefined();
  });

  it('toggles shuffle mode', () => {
    render(
      <FlashcardView
        questions={mockQuestions}
        categories={mockCategories}
        isBookmarked={() => false}
        onToggleBookmark={vi.fn()}
      />
    );

    const shuffleBtn = screen.getByRole('button', { name: /toggle shuffle mode/i });
    expect(screen.getByText('Shuffle OFF')).toBeDefined();

    fireEvent.click(shuffleBtn);
    expect(screen.getByText('Shuffle ON')).toBeDefined();
  });
});

describe('LearnView Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all questions initially in list view', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    expect(screen.getByText('Learn Mode')).toBeDefined();
    expect(screen.getByText(/matched:/i)).toBeDefined();
    expect(screen.getByText('When should you check vehicle engine oil?')).toBeDefined();
    expect(screen.getByText('What color is the high beam indicator light?')).toBeDefined();
  });

  it('switches between List View and Flashcard View', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    // Click Flashcards
    fireEvent.click(screen.getByRole('button', { name: /flashcards/i }));
    expect(screen.getByText(/flashcard 1/i)).toBeDefined();

    // Click List View
    fireEvent.click(screen.getByRole('button', { name: /list view/i }));
    expect(screen.queryByText(/flashcard 1/i)).toBeNull();
    expect(screen.getByText('When should you check vehicle engine oil?')).toBeDefined();
  });

  it('filters questions by category pill selection', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    // Click Traffic Signs pill
    fireEvent.click(screen.getByRole('tab', { name: /traffic signs/i }));

    // Category 6 questions should be shown
    expect(screen.getByText('What does this triangular sign mean?')).toBeDefined();
    expect(screen.getByText('What does an octagonal red sign mean?')).toBeDefined();

    // Category 1 questions should NOT be shown
    expect(screen.queryByText('When should you check vehicle engine oil?')).toBeNull();
  });

  it('searches questions by keyword', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText(/search questions/i);
    fireEvent.change(searchInput, { target: { value: 'beam' } });

    expect(screen.getByText('What color is the high beam indicator light?')).toBeDefined();
    expect(screen.queryByText('When should you check vehicle engine oil?')).toBeNull();
  });

  it('searches questions by Question ID (e.g. Q400)', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText(/search questions/i);
    fireEvent.change(searchInput, { target: { value: 'Q400' } });

    expect(screen.getByText('What does this triangular sign mean?')).toBeDefined();
    expect(screen.queryByText('When should you check vehicle engine oil?')).toBeNull();
  });

  it('filters by Bookmarked Only chip', () => {
    localStorage.setItem('nepal_prep_bookmarks', JSON.stringify([2]));
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    // Click Bookmarked chip
    fireEvent.click(screen.getByRole('button', { name: /bookmarked/i }));

    expect(screen.getByText('What color is the high beam indicator light?')).toBeDefined();
    expect(screen.queryByText('When should you check vehicle engine oil?')).toBeNull();
  });

  it('filters by Traffic Signs Only chip', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    // Click Traffic Signs chip
    fireEvent.click(screen.getByRole('button', { name: /^Traffic Signs/ }));

    expect(screen.getByText('What does this triangular sign mean?')).toBeDefined();
    expect(screen.queryByText('When should you check vehicle engine oil?')).toBeNull();
  });

  it('shows empty state when no questions match and resets on button click', () => {
    render(<LearnView questions={mockQuestions} categories={mockCategories} />);

    const searchInput = screen.getByPlaceholderText(/search questions/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent-query-xyz' } });

    expect(screen.getByText('No questions match your search')).toBeDefined();

    // Click Reset All Filters
    const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText('When should you check vehicle engine oil?')).toBeDefined();
  });
});
