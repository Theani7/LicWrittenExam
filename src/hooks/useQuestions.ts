import { useState, useEffect } from 'react';
import type { QuestionsData, Question, Category, ExamMetadata } from '../types';
import fallbackEnglishData from '../../public/data/questions.json';
import fallbackNepaliData from '../../public/data/questions_ne.json';
import { useLanguage } from '../context/LanguageContext';

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
  const { language } = useLanguage();
  const [data, setData] = useState<QuestionsData | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    setLoading(true);

    async function loadQuestions() {
      const filePath = language === 'ne' ? '/data/questions_ne.json' : '/data/questions.json';
      const fallback = language === 'ne' ? fallbackNepaliData : fallbackEnglishData;

      try {
        const response = await fetch(filePath);
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
            setData(fallback as unknown as QuestionsData);
            setError(null);
          } catch {
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
  }, [enabled, language]);

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
