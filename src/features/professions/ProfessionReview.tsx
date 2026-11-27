import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { closeReview, ReviewSession } from '@/features/review/ReviewSession';
import type { FailureHandler, SessionAction } from '@/features/review/types';
import { useToday } from '@/lib/useToday';

import type { ProfessionCard } from './api';
import { useDueProfessionCards, useProfession, useReviewProfessionCard } from './hooks';
import { kindLabel, professionLook } from './looks';

/** Reviews one profession's due cards (up to 200 per session). */
export function ProfessionReview({ professionId }: { professionId: string }) {
  const today = useToday();
  const queryClient = useQueryClient();
  const dueQuery = useDueProfessionCards(professionId);
  const { profession } = useProfession(professionId, today);
  const failuresRef = useRef<FailureHandler | null>(null);
  const saveReview = useReviewProfessionCard({
    professionId,
    onFailed: (grade, error) => failuresRef.current?.(grade, error),
  });
  const savesInFlight = useIsMutating({ mutationKey: ['review-profession-card'] });

  // The profession page underneath refreshes its tier counts once, when this closes.
  useEffect(
    () => () => {
      void queryClient.invalidateQueries({ queryKey: ['profession-detail', professionId] });
      void queryClient.invalidateQueries({ queryKey: ['profession-module'] });
    },
    [queryClient, professionId],
  );

  // Only a fresh fetch: a cached queue could hold cards already reviewed elsewhere.
  const initialQueue = dueQuery.isFetchedAfterMount && dueQuery.data ? dueQuery.data : null;
  const look = professionLook(profession);
  const name = profession?.name ?? 'this profession';
  const home = `/profession/${professionId}` as const;
  const stillDue = profession?.due_today ?? 0;

  const next: SessionAction =
    stillDue > 0
      ? {
          title: `Review ${stillDue} more`,
          icon: 'refresh',
          disabled: savesInFlight > 0,
          onPress: () => router.replace({ pathname: '/review', params: { profession: professionId, round: String(Date.now()) } }),
        }
      : {
          title: 'Open a new card',
          icon: 'cards-playing-outline',
          disabled: savesInFlight > 0,
          onPress: () => router.replace(`/profession/${professionId}/open`),
        };

  return (
    <ReviewSession<ProfessionCard>
      initialQueue={initialQueue}
      isError={dueQuery.isError}
      retrying={dueQuery.isFetching}
      onRetry={() => void dueQuery.refetch()}
      latest={() => undefined}
      decorate={(card) => ({
        look,
        label: card.module_title ?? name,
        topic: card.module_title ?? name,
        badge: kindLabel(card.kind),
      })}
      save={(grade) => saveReview.mutate(grade)}
      failuresRef={failuresRef}
      fallbackHref={home}
      empty={{ message: `Nothing in ${name} is due. You can open new cards from its page.`, actionTitle: `Back to ${name}` }}
      messages={{
        gone: 'A card is no longer in your stack (it may have been reset on another device), so it was skipped.',
        notDue: 'A card was already reviewed on another device, so it wasn’t counted twice.',
      }}
      completeActions={[next, { title: `Back to ${name}`, onPress: () => closeReview(home) }]}
    />
  );
}
