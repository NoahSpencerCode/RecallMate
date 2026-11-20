import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import type { ISODate } from '@/lib/dates';
import { queryKeys } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

export type Progress = {
  current_streak: number;
  best_streak: number;
  reviewed_today: number;
  total_reviews: number;
  accuracy_30d: number | null;
  memories: { total: number; due_today: number; fresh: number; learning: number; mastered: number };
  activity: { day: ISODate; count: number }[];
  forecast: { day: ISODate; count: number }[];
};

export async function fetchProgress(today: ISODate): Promise<Progress> {
  const { data, error } = await supabase.rpc('get_progress', { p_today: today });
  if (error) throw error;
  return data as unknown as Progress;
}

export function useProgress(today: ISODate) {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.progress(today),
    queryFn: () => fetchProgress(today),
    enabled: Boolean(session),
  });
}
