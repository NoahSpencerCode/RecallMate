// Pure helpers for a review session, kept apart from the screen so they can be tested.

/** Cards due today or earlier, optionally narrowed (for example to one pack). */
export function dueCards<C extends { due_on: string }>(cards: readonly C[], today: string, keep?: (card: C) => boolean): C[] {
  return cards.filter((card) => card.due_on <= today && (!keep || keep(card)));
}

/** Drops the most recent entry for a card, e.g. a result whose save failed. */
export function withoutLast<T extends { id: string }>(list: T[], id: string): T[] {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].id === id) return [...list.slice(0, i), ...list.slice(i + 1)];
  }
  return list;
}

/** Puts a card whose review didn't save back at the end of the queue, so the review isn't lost. */
export function requeue<C extends { id: string }>(queue: C[] | null, id: string): C[] | null {
  const original = queue?.find((card) => card.id === id);
  return queue && original ? [...queue, original] : queue;
}

/**
 * Tries spent on a card. Typed cards count every miss plus the try that got it
 * ("I was right, count it" adds none); flip cards always count one.
 */
export function attemptsFor({
  typed,
  misses,
  passed,
  overridden,
}: {
  typed: boolean;
  misses: number;
  passed: boolean;
  overridden: boolean;
}): number {
  return typed ? Math.max(1, misses + (passed && !overridden ? 1 : 0)) : 1;
}
