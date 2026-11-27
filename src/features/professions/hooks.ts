import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import type { ReviewGrade } from '@/features/review/types';
import type { ISODate } from '@/lib/dates';
import { isNetworkError, isNotDueError } from '@/lib/errors';
import { queryKeys } from '@/lib/queryClient';

import {
  fetchCheckpointCards,
  fetchDueCards,
  fetchModuleCards,
  fetchProfessionDetail,
  fetchProfessions,
  openNextCard,
  reportCard,
  resetProfession,
  reviewProfessionCard,
  startProfession,
  type ReportReason,
} from './api';

/** Every profession with the learner's standing in each. */
export function useProfessions(today: ISODate) {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.professions(today),
    queryFn: () => fetchProfessions(today),
    enabled: Boolean(session),
  });
}

/** One profession's summary, from the same query as the list. */
export function useProfession(id: string, today: ISODate) {
  const query = useProfessions(today);
  return { ...query, profession: query.data?.find((p) => p.id === id) };
}

export function useProfessionDetail(id: string, today: ISODate) {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.professionDetail(id, today),
    queryFn: () => fetchProfessionDetail(id, today),
    enabled: Boolean(session),
  });
}

/**
 * The due cards for a review session. Never served from cache: a stale queue
 * would show cards already reviewed on another device.
 */
export function useDueProfessionCards(id: string) {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.professionDue(id),
    queryFn: () => fetchDueCards(id),
    enabled: Boolean(session),
    staleTime: 0,
    gcTime: 0,
  });
}

export function useModuleCards(moduleId: string) {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.professionModule(moduleId),
    queryFn: () => fetchModuleCards(moduleId),
    enabled: Boolean(session),
  });
}

export function useCheckpointCards(id: string, belowTier: number) {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.checkpoints(id, belowTier),
    queryFn: () => fetchCheckpointCards(id, belowTier),
    enabled: Boolean(session) && belowTier > 0,
    staleTime: 10 * 60_000,
  });
}

/** Refreshes what a change to the learner's stack affects. The heavier detail query is opt-in. */
function useRefreshProfessions() {
  const queryClient = useQueryClient();
  return ({ detail = false }: { detail?: boolean } = {}) => {
    void queryClient.invalidateQueries({ queryKey: ['professions'] });
    void queryClient.invalidateQueries({ queryKey: ['progress'] });
    if (detail) {
      void queryClient.invalidateQueries({ queryKey: ['profession-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['profession-module'] });
    }
  };
}

export function useStartProfession() {
  const refresh = useRefreshProfessions();
  return useMutation({
    mutationFn: ({ id, startTier }: { id: string; startTier: number }) => startProfession(id, startTier),
    onSuccess: () => refresh({ detail: true }),
  });
}

/**
 * Opens the next card. The profession page underneath refreshes its detail
 * when the open screen closes, not after every card.
 */
export function useOpenNextCard() {
  const refresh = useRefreshProfessions();
  return useMutation({
    mutationFn: (id: string) => openNextCard(id),
    onSuccess: () => refresh(),
  });
}

/** Saves a profession review. As with memories, `onFailed` is given here so it survives the next save. */
export function useReviewProfessionCard({
  professionId,
  onFailed,
}: {
  professionId: string;
  onFailed?: (grade: ReviewGrade, error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const refresh = useRefreshProfessions();
  return useMutation({
    mutationKey: ['review-profession-card'],
    mutationFn: (grade: ReviewGrade) => reviewProfessionCard(grade),
    // A dropped connection shouldn't cost a review: retry it a couple of times.
    retry: (failures, error) => failures < 2 && isNetworkError(error),
    retryDelay: (attempt) => 1000 * 2 ** attempt,
    onSuccess: () => refresh(),
    onError: (error, grade) => {
      if (isNotDueError(error)) void queryClient.invalidateQueries({ queryKey: queryKeys.professionDue(professionId) });
      onFailed?.(grade, error);
    },
  });
}

export function useResetProfession() {
  const refresh = useRefreshProfessions();
  return useMutation({
    mutationFn: (id: string) => resetProfession(id),
    onSuccess: () => refresh({ detail: true }),
  });
}

export function useReportCard() {
  return useMutation({
    mutationFn: (input: { cardId: string; reason: ReportReason; note?: string }) => reportCard(input),
  });
}
