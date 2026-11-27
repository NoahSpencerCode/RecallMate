import { describe, expect, it } from '@jest/globals';

import { buildPlacementPlan, passesTier } from '../placement';

const cards = [
  ...Array.from({ length: 14 }, (_, i) => ({ id: `t0-${i}`, tier: 0 })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `t1-${i}`, tier: 1 })),
  ...Array.from({ length: 12 }, (_, i) => ({ id: `t3-${i}`, tier: 3 })),
];

describe('buildPlacementPlan', () => {
  it('checks each tier below the target, in order, up to 10 cards each', () => {
    const plan = buildPlacementPlan(cards, 4, 0.42);
    expect(plan.map((s) => [s.tier, s.cards.length])).toEqual([
      [0, 10],
      [1, 6],
      [3, 10],
    ]);
  });

  it('only uses cards from the tier being checked', () => {
    for (const stage of buildPlacementPlan(cards, 4, 0.1)) {
      expect(stage.cards.every((c) => c.tier === stage.tier)).toBe(true);
    }
  });

  it('is stable for a seed and varies across seeds', () => {
    const ids = (seed: number) => buildPlacementPlan(cards, 1, seed)[0].cards.map((c) => c.id);
    expect(ids(0.5)).toEqual(ids(0.5));
    expect(ids(0.5)).not.toEqual(ids(0.9));
  });

  it('checks nothing when starting at the beginning', () => {
    expect(buildPlacementPlan(cards, 0, 0.3)).toEqual([]);
  });
});

describe('passesTier', () => {
  it('needs 8 of 10', () => {
    expect(passesTier(8, 10)).toBe(true);
    expect(passesTier(7, 10)).toBe(false);
  });

  it('scales to smaller samples', () => {
    expect(passesTier(5, 6)).toBe(true);
    expect(passesTier(4, 6)).toBe(false);
  });

  it('passes a tier with nothing to check', () => {
    expect(passesTier(0, 0)).toBe(true);
  });
});
