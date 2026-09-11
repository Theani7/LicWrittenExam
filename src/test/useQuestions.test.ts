import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuestions } from '../hooks/useQuestions';

describe('useQuestions', () => {
  it('loads questions data successfully', async () => {
    const { result } = renderHook(() => useQuestions());

    // Initially it might be loading
    expect(result.current.loading).toBeDefined();

    // Wait until loading finishes
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questions.length).toBe(500);
    expect(result.current.categories.length).toBe(6);
    expect(result.current.metadata?.totalQuestions).toBe(500);
    expect(result.current.error).toBeNull();
  });
});
