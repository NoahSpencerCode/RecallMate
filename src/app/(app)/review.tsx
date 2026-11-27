import { useLocalSearchParams } from 'expo-router';

import { ProfessionReview } from '@/features/professions/ProfessionReview';
import { MemoryReview } from '@/features/review/MemoryReview';

/**
 * The review session. `?pack=` narrows it to one pack's due cards;
 * `?profession=` reviews one profession's due cards instead of memories.
 */
export default function Review() {
  const { pack, profession, round } = useLocalSearchParams<{ pack?: string; profession?: string; round?: string }>();
  // A new `round` starts a fresh session (e.g. "Review 40 more").
  if (profession) return <ProfessionReview key={round ?? 'first'} professionId={profession} />;
  return <MemoryReview packFilter={pack} />;
}
