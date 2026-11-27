import { router } from 'expo-router';
import { useRef } from 'react';

import type { Memory } from '@/features/memories/api';
import { useMemories, useReviewMemory } from '@/features/memories/hooks';
import { categoryLook } from '@/features/packs/categories';
import { usePackIndex } from '@/features/packs/hooks';
import { useToday } from '@/lib/useToday';

import { closeReview, ReviewSession } from './ReviewSession';
import { dueCards } from './session';
import type { FailureHandler } from './types';

/** Reviews the learner's own cards and pack cards, optionally just one pack's. */
export function MemoryReview({ packFilter }: { packFilter?: string }) {
  const today = useToday();
  const memoriesQuery = useMemories();
  const packIndex = usePackIndex();
  const failuresRef = useRef<FailureHandler | null>(null);
  const saveReview = useReviewMemory({ onFailed: (grade, error) => failuresRef.current?.(grade, error) });

  const memories = memoriesQuery.data;
  const initialQueue = memories ? dueCards(memories, today, (m) => !packFilter || m.pack_id === packFilter) : null;

  return (
    <ReviewSession<Memory>
      initialQueue={initialQueue}
      isError={memoriesQuery.isError}
      retrying={memoriesQuery.isFetching}
      onRetry={() => void memoriesQuery.refetch()}
      latest={(id) => memories?.find((m) => m.id === id)}
      decorate={(card) => {
        const pack = card.pack_id ? packIndex.get(card.pack_id) : undefined;
        return { look: categoryLook(pack?.categoryId), label: pack ? pack.title : 'Your card', topic: pack?.title };
      }}
      save={(grade) => saveReview.mutate(grade)}
      failuresRef={failuresRef}
      fallbackHref="/"
      empty={{
        message: packFilter
          ? 'Nothing from this pack is due. New reviews unlock as cards come due.'
          : 'You’re all caught up. New reviews unlock as cards come due.',
        actionTitle: 'Back to Today',
      }}
      messages={{
        gone: 'A card was deleted on another device, so it was skipped.',
        notDue: 'A card was already reviewed on another device, so it wasn’t counted twice.',
      }}
      completeActions={[
        { title: 'Back to Today', icon: 'home-variant', onPress: () => closeReview('/') },
        { title: 'Explore Learn', onPress: () => router.replace('/learn') },
      ]}
    />
  );
}
