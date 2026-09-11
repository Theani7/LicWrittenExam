import { useState, useCallback } from 'react';

const BOOKMARKS_STORAGE_KEY = 'nepal_prep_bookmarks';

function getStoredBookmarks(): number[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is number => typeof item === 'number');
        }
      }
    }
  } catch {
    // Storage access or JSON parse error fallback
  }
  return [];
}

function saveStoredBookmarks(bookmarks: number[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    }
  } catch {
    // Storage quota or restriction fallback
  }
}

export interface UseBookmarksReturn {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<number[]>(getStoredBookmarks);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      saveStoredBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: number): boolean => {
      return bookmarks.includes(id);
    },
    [bookmarks]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    saveStoredBookmarks([]);
  }, []);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
}
