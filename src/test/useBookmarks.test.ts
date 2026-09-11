import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from '../hooks/useBookmarks';

describe('useBookmarks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with empty bookmarks when localStorage is empty', () => {
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.isBookmarked(1)).toBe(false);
  });

  it('loads existing bookmarks from localStorage', () => {
    localStorage.setItem('nepal_prep_bookmarks', JSON.stringify([12, 45, 100]));
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([12, 45, 100]);
    expect(result.current.isBookmarked(45)).toBe(true);
    expect(result.current.isBookmarked(99)).toBe(false);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('nepal_prep_bookmarks', 'invalid-json{[');
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([]);
  });

  it('handles non-array data in localStorage gracefully', () => {
    localStorage.setItem('nepal_prep_bookmarks', JSON.stringify({ notAnArray: true }));
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([]);
  });

  it('toggles bookmark on and off and persists to localStorage', () => {
    const { result } = renderHook(() => useBookmarks());

    // Add bookmark 5
    act(() => {
      result.current.toggleBookmark(5);
    });
    expect(result.current.bookmarks).toEqual([5]);
    expect(result.current.isBookmarked(5)).toBe(true);
    expect(JSON.parse(localStorage.getItem('nepal_prep_bookmarks') || '[]')).toEqual([5]);

    // Add bookmark 10
    act(() => {
      result.current.toggleBookmark(10);
    });
    expect(result.current.bookmarks).toEqual([5, 10]);
    expect(result.current.isBookmarked(10)).toBe(true);
    expect(JSON.parse(localStorage.getItem('nepal_prep_bookmarks') || '[]')).toEqual([5, 10]);

    // Remove bookmark 5
    act(() => {
      result.current.toggleBookmark(5);
    });
    expect(result.current.bookmarks).toEqual([10]);
    expect(result.current.isBookmarked(5)).toBe(false);
    expect(result.current.isBookmarked(10)).toBe(true);
    expect(JSON.parse(localStorage.getItem('nepal_prep_bookmarks') || '[]')).toEqual([10]);
  });

  it('clears all bookmarks from state and localStorage', () => {
    localStorage.setItem('nepal_prep_bookmarks', JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useBookmarks());
    expect(result.current.bookmarks).toEqual([1, 2, 3]);

    act(() => {
      result.current.clearBookmarks();
    });

    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.isBookmarked(1)).toBe(false);
    expect(JSON.parse(localStorage.getItem('nepal_prep_bookmarks') || '[]')).toEqual([]);
  });

  it('handles localStorage setItem failure without throwing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useBookmarks());
    expect(() => {
      act(() => {
        result.current.toggleBookmark(7);
      });
    }).not.toThrow();

    // In-memory state should still update
    expect(result.current.bookmarks).toEqual([7]);
  });
});
