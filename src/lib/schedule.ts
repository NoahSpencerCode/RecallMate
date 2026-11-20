/**
 * Fibonacci spaced repetition. Mirrors public.review_memory() in
 * supabase/migrations; keep the two in sync.
 *
 * A new card is due 1 day after it's created. Each successful review moves it
 * one stage up and schedules the next review 1, 2, 3, 5, 8, 13... days out.
 * A miss resets it to stage 0, due tomorrow.
 */

export const MASTERED_STAGE = 5;
const MAX_GAP_DAYS = 3650;

/** fib(1) = 1, fib(2) = 1, fib(3) = 2, fib(4) = 3, fib(5) = 5 ... */
export function fib(n: number): number {
  if (n <= 0) return 0;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= Math.min(n, 90); i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

/** Days until the next review if a card at `stage` is passed or missed now. */
export function nextGapDays(stage: number, passed: boolean): number {
  if (!passed) return 1;
  return Math.min(fib(stage + 2), MAX_GAP_DAYS);
}

export type MemoryStatus = 'new' | 'learning' | 'mastered';

export function memoryStatus(memory: { stage: number; review_count: number }): MemoryStatus {
  if (memory.stage >= MASTERED_STAGE) return 'mastered';
  if (memory.review_count === 0) return 'new';
  return 'learning';
}
