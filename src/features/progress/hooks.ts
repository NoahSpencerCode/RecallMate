import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import type { ISODate } from '@/lib/dates';
import { queryKeys } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

export type CardCounts = { total: number; due_today: number; fresh: number; learning: number; mastered: number };

export type Progress = {
  current_streak: number;
  best_streak: number;
  reviewed_today: number;
  /** Today's reviews of the learner's own and pack cards (the Today ring compares these with memories due). */
  reviewed_today_memories: number;
  total_reviews: number;
  accuracy_30d: number | null;
  memories: CardCounts;
  profession_cards: CardCounts;
  activity: { day: ISODate; count: number }[];
  forecast: { day: ISODate; count: number }[];
};

const NO_CARDS: CardCounts = { total: 0, due_today: 0, fresh: 0, learning: 0, mastered: 0 };

/** Memories and profession cards together, for the card mix and "mastered" totals. */
export function allCards(progress: Progress): CardCounts {
  const a = progress.memories ?? NO_CARDS;
  const b = progress.profession_cards ?? NO_CARDS;
  return {
    total: a.total + b.total,
    due_today: a.due_today + b.due_today,
    fresh: a.fresh + b.fresh,
    learning: a.learning + b.learning,
    mastered: a.mastered + b.mastered,
  };
}

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
