import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/layout/Navbar';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Navbar', () => {
  const mockOnSelectTab = vi.fn();
  const mockOnOpenGuidelines = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders branding title and badge', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    expect(screen.getByText('Nepal License Prep')).toBeDefined();
    expect(screen.getByText('Cat A & K 2082/83')).toBeDefined();
  });

  it('renders desktop navigation tabs and highlights active tab', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    const learnTab = screen.getByTestId('nav-tab-learn');
    const testTab = screen.getByTestId('nav-tab-test');
    const bookmarksTab = screen.getByTestId('nav-tab-bookmarks');

    expect(learnTab.className).toContain('bg-blue-50');
    expect(testTab.className).not.toContain('bg-blue-50');
    expect(bookmarksTab.className).not.toContain('bg-blue-50');
  });

  it('calls onSelectTab when a navigation tab is clicked', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    fireEvent.click(screen.getByTestId('nav-tab-test'));
    expect(mockOnSelectTab).toHaveBeenCalledWith('test');

    fireEvent.click(screen.getByTestId('nav-tab-bookmarks'));
    expect(mockOnSelectTab).toHaveBeenCalledWith('bookmarks');
  });

  it('displays bookmarks count badge when count is greater than zero', () => {
    const { rerender } = renderWithTheme(
      <Navbar
        activeTab="learn"
        bookmarkCount={5}
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    const badge = screen.getByTestId('nav-bookmark-count');
    expect(badge.textContent).toContain('5');

    // Rerender with 0
    rerender(
      <ThemeProvider>
        <Navbar
          activeTab="learn"
          bookmarkCount={0}
          onSelectTab={mockOnSelectTab}
          onOpenGuidelines={mockOnOpenGuidelines}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('nav-bookmark-count')).toBeNull();
  });

  it('calls onOpenGuidelines when Guidelines button is clicked', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    fireEvent.click(screen.getByTestId('guidelines-button'));
    expect(mockOnOpenGuidelines).toHaveBeenCalledTimes(1);
  });

  it('toggles theme when theme button is clicked', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('opens mobile menu, supports mobile navigation, and closes on item click', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        bookmarkCount={3}
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    // Mobile drawer should initially not be visible
    expect(screen.queryByTestId('mobile-menu-drawer')).toBeNull();

    // Click mobile hamburger menu toggle
    const hamburgerBtn = screen.getByTestId('mobile-menu-toggle-btn');
    fireEvent.click(hamburgerBtn);

    // Now mobile menu drawer should be in document
    const mobileDrawer = screen.getByTestId('mobile-menu-drawer');
    expect(mobileDrawer).toBeDefined();

    // Click mobile test tab
    const mobileTestTab = screen.getByTestId('mobile-nav-tab-test');
    fireEvent.click(mobileTestTab);

    expect(mockOnSelectTab).toHaveBeenCalledWith('test');
    // Mobile drawer should be closed after clicking tab
    expect(screen.queryByTestId('mobile-menu-drawer')).toBeNull();
  });

  it('triggers guidelines from mobile menu and closes the drawer', () => {
    renderWithTheme(
      <Navbar
        activeTab="learn"
        onSelectTab={mockOnSelectTab}
        onOpenGuidelines={mockOnOpenGuidelines}
      />
    );

    // Open mobile menu
    fireEvent.click(screen.getByTestId('mobile-menu-toggle-btn'));

    // Click mobile guidelines button
    const mobileGuidelinesBtn = screen.getByTestId('mobile-guidelines-button');
    fireEvent.click(mobileGuidelinesBtn);

    expect(mockOnOpenGuidelines).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('mobile-menu-drawer')).toBeNull();
  });
});
