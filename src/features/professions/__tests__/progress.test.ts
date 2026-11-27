import { describe, expect, it } from '@jest/globals';

import {
  barSegments,
  barTotals,
  currentTier,
  describeDuration,
  formatPercent,
  milestoneLabels,
  paceEstimate,
  tierDenominator,
  type TierProgress,
} from '../progress';

const tier = (over: Partial<TierProgress> & Pick<TierProgress, 'tier'>): TierProgress => ({
  name: `Tier ${over.tier}`,
  milestone: null,
  planned: 100,
  released: 100,
  opened: 0,
  mastered: 0,
  placedOut: 0,
  ...over,
});

describe('tierDenominator', () => {
  it('measures a fully shipped tier against what shipped', () => {
    expect(tierDenominator({ planned: 100, released: 92 })).toBe(92);
    expect(tierDenominator({ planned: 100, released: 108 })).toBe(108);
  });

  it('measures a partly shipped tier against the plan', () => {
    expect(tierDenominator({ planned: 100, released: 40 })).toBe(100);
    expect(tierDenominator({ planned: 100, released: 0 })).toBe(100);
  });
});

describe('barSegments', () => {
  it('sizes tiers by their planned share, so ticks never move', () => {
    const segments = barSegments([
      tier({ tier: 0, planned: 100 }),
      tier({ tier: 1, planned: 300, released: 0 }),
    ]);
    expect(segments.map((s) => [s.start, s.width])).toEqual([
      [0, 0.25],
      [0.25, 0.75],
    ]);
    expect(segments[1].released).toBe(false);
  });

  it('fills each tier by its share of opened, mastered and placed-out cards', () => {
    const [segment] = barSegments([tier({ tier: 0, released: 100, opened: 40, mastered: 10, placedOut: 20 })]);
    expect(segment.placedOut).toBeCloseTo(0.2);
    expect(segment.opened).toBeCloseTo(0.4);
    expect(segment.mastered).toBeCloseTo(0.1);
  });

  it('never overfills', () => {
    const [segment] = barSegments([tier({ tier: 0, released: 50, planned: 50, opened: 60, mastered: 80, placedOut: 0 })]);
    expect(segment.opened).toBe(1);
    expect(segment.mastered).toBe(1);
  });

  it('sorts tiers into order', () => {
    expect(barSegments([tier({ tier: 2 }), tier({ tier: 0 }), tier({ tier: 1 })]).map((s) => s.tier)).toEqual([0, 1, 2]);
  });
});

describe('barTotals', () => {
  it('weights each tier by its width', () => {
    const segments = barSegments([
      tier({ tier: 0, planned: 100, released: 100, opened: 100, mastered: 50 }),
      tier({ tier: 1, planned: 300, released: 300, opened: 30 }),
    ]);
    const totals = barTotals(segments);
    expect(totals.opened).toBeCloseTo(0.25 + 0.75 * 0.1);
    expect(totals.mastered).toBeCloseTo(0.125);
    expect(totals.done).toBeCloseTo(totals.opened);
  });

  it('counts placed-out cards as done', () => {
    const totals = barTotals(barSegments([tier({ tier: 0, placedOut: 100 }), tier({ tier: 1 })]));
    expect(totals.done).toBeCloseTo(0.5);
    expect(totals.opened).toBe(0);
  });
});

describe('milestoneLabels', () => {
  const segments = barSegments([
    tier({ tier: 0, planned: 460, milestone: 'High school' }),
    tier({ tier: 1, planned: 2100, milestone: "Bachelor's" }),
    tier({ tier: 2, planned: 1600, milestone: 'Quals' }),
    tier({ tier: 3, planned: 1840, milestone: 'PhD' }),
  ]);

  it('starts with "Start" and ends with the last milestone aligned to the right edge', () => {
    const labels = milestoneLabels(segments, 600);
    expect(labels[0]).toMatchObject({ label: 'Start', at: 0, align: 'start', row: 0 });
    expect(labels[labels.length - 1]).toMatchObject({ label: 'PhD', align: 'end' });
  });

  it('drops a crowded label to the second row on a narrow bar', () => {
    const labels = milestoneLabels(segments, 320);
    expect(labels.find((l) => l.label === 'High school')?.row).toBe(1);
  });
});

describe('currentTier', () => {
  const segments = barSegments([tier({ tier: 0, opened: 100 }), tier({ tier: 1, opened: 10 }), tier({ tier: 2 })]);

  it('prefers the next card’s tier', () => {
    expect(currentTier(segments, 2)?.tier).toBe(2);
  });

  it('falls back to the last tier with progress', () => {
    expect(currentTier(segments)?.tier).toBe(1);
  });
});

describe('paceEstimate', () => {
  it('averages over 14 days', () => {
    expect(paceEstimate({ openedLast14: 140, startedAt: '2026-01-01', today: '2026-11-24', remaining: 1000 })).toEqual({
      perDay: 10,
      days: 100,
    });
  });

  it('averages over the days since starting when that is shorter', () => {
    expect(paceEstimate({ openedLast14: 30, startedAt: '2026-11-22', today: '2026-11-24', remaining: 30 }).perDay).toBe(10);
  });

  it('gives no estimate without recent opens', () => {
    expect(paceEstimate({ openedLast14: 0, startedAt: '2026-11-01', today: '2026-11-24', remaining: 100 }).days).toBeNull();
  });
});

describe('formatPercent', () => {
  it('never shows 0% once there is progress', () => {
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(0.0007)).toBe('<1%');
    expect(formatPercent(0.384)).toBe('38%');
  });
});

describe('describeDuration', () => {
  it('reads naturally at every scale', () => {
    expect(describeDuration(1)).toBe('about a day');
    expect(describeDuration(10)).toBe('about 10 days');
    expect(describeDuration(21)).toBe('about 3 weeks');
    expect(describeDuration(487)).toBe('about 16 months');
    expect(describeDuration(913)).toBe('about 2.5 years');
    expect(describeDuration(1100)).toBe('about 3 years');
  });
});
