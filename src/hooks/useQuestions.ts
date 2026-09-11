import { useState, useEffect } from 'react';
import type { QuestionsData, Question, Category, ExamMetadata } from '../types';
import fallbackData from '../../public/data/questions.json';

export interface UseQuestionsResult {
  data: QuestionsData | null;
  questions: Question[];
  categories: Category[];
  metadata: ExamMetadata | null;
  loading: boolean;
  error: string | null;
}

export interface UseQuestionsOptions {
  enabled?: boolean;
}

export function useQuestions(options?: UseQuestionsOptions): UseQuestionsResult {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<QuestionsData | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;

    async function loadQuestions() {
      try {
        const response = await fetch('/data/questions.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
        }
        const json: QuestionsData = await response.json();
        if (isMounted) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          try {
            // Fallback to bundled static questions data
            setData(fallbackData as QuestionsData);
            setError(null);
          } catch (fallbackErr) {
            setError(err instanceof Error ? err.message : 'Failed to load questions data');
          } finally {
            setLoading(false);
          }
        }
      }
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    questions: data?.questions ?? [],
    categories: data?.categories ?? [],
    metadata: data?.metadata ?? null,
    loading,
    error,
  };
}

export default useQuestions;
