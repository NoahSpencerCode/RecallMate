import { describe, expect, it } from '@jest/globals';

import { attemptsFor, dueCards, requeue, withoutLast } from '../session';

describe('dueCards', () => {
  const cards = [
    { id: 'a', due_on: '2026-11-20', pack_id: 'p1' },
    { id: 'b', due_on: '2026-11-24', pack_id: 'p2' },
    { id: 'c', due_on: '2026-11-25', pack_id: 'p1' },
  ];

  it('keeps cards due today or earlier, in order', () => {
    expect(dueCards(cards, '2026-11-24').map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('applies an extra filter', () => {
    expect(dueCards(cards, '2026-11-25', (c) => c.pack_id === 'p1').map((c) => c.id)).toEqual(['a', 'c']);
  });
});

describe('withoutLast', () => {
  it('removes only the most recent entry for the id', () => {
    const list = [
      { id: 'a', passed: true },
      { id: 'b', passed: false },
      { id: 'a', passed: false },
    ];
    expect(withoutLast(list, 'a')).toEqual([
      { id: 'a', passed: true },
      { id: 'b', passed: false },
    ]);
  });

  it('returns the same list when the id is missing', () => {
    const list = [{ id: 'a' }];
    expect(withoutLast(list, 'z')).toBe(list);
  });
});

describe('requeue', () => {
  it('appends the original card again', () => {
    const queue = [{ id: 'a' }, { id: 'b' }];
    expect(requeue(queue, 'a')).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'a' }]);
  });

  it('leaves the queue alone when the card is unknown or there is no queue', () => {
    const queue = [{ id: 'a' }];
    expect(requeue(queue, 'z')).toBe(queue);
    expect(requeue(null, 'a')).toBeNull();
  });
});

describe('attemptsFor', () => {
  it('counts one try for flip cards', () => {
    expect(attemptsFor({ typed: false, misses: 0, passed: true, overridden: false })).toBe(1);
    expect(attemptsFor({ typed: false, misses: 0, passed: false, overridden: false })).toBe(1);
  });

  it('counts misses plus the try that got it for typed cards', () => {
    expect(attemptsFor({ typed: true, misses: 0, passed: true, overridden: false })).toBe(1);
    expect(attemptsFor({ typed: true, misses: 2, passed: true, overridden: false })).toBe(3);
    expect(attemptsFor({ typed: true, misses: 3, passed: false, overridden: false })).toBe(3);
  });

  it('adds no try for "I was right, count it"', () => {
    expect(attemptsFor({ typed: true, misses: 3, passed: true, overridden: true })).toBe(3);
  });

  it('never reports zero tries', () => {
    expect(attemptsFor({ typed: true, misses: 0, passed: false, overridden: false })).toBe(1);
  });
});
