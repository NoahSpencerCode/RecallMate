// The 0 → PhD bar: pure math, kept apart from the drawing so it can be tested.
import { daysBetween, type ISODate } from '@/lib/dates';

import type { TierDetail } from './api';

export type TierProgress = {
  tier: number;
  name: string;
  /** Printed on the bar at this tier's end, e.g. "Bachelor's". */
  milestone: string | null;
  planned: number;
  released: number;
  opened: number;
  mastered: number;
  /** Cards skipped by placement and not opened since. */
  placedOut: number;
};

export type BarSegment = {
  tier: number;
  name: string;
  milestone: string | null;
  /** Where the segment starts and how wide it is, as shares of the whole bar. */
  start: number;
  width: number;
  /** Shares of this segment, drawn left to right: placed out (hatched), then opened. */
  placedOut: number;
  opened: number;
  /** Share of this segment mastered (a part of `opened`, drawn darker). */
  mastered: number;
  /** False until any of the tier's cards are out ("coming soon"). */
  released: boolean;
};

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

/** The tier counts from get_profession_detail, in the shape the bar math takes. */
export function tiersFromDetail(tiers: readonly TierDetail[]): TierProgress[] {
  return tiers.map((t) => ({
    tier: t.tier,
    name: t.name,
    milestone: t.milestone,
    planned: t.planned_cards,
    released: t.released,
    opened: t.opened,
    mastered: t.mastered,
    placedOut: t.placed_out,
  }));
}

/**
 * What a tier's fill is measured against. Tiers ship whole, so once at least
 * 90% of the planned cards are out the tier counts as complete and fills
 * against what shipped; before that it fills against the plan, so a partly
 * released tier never looks finished.
 */
export function tierDenominator(tier: Pick<TierProgress, 'planned' | 'released'>): number {
  return Math.max(1, tier.released >= 0.9 * tier.planned ? tier.released : tier.planned);
}

/**
 * Lays the tiers along the bar. Each tier's width is its planned share of the
 * whole path, so milestone ticks stay put as content ships.
 */
export function barSegments(tiers: readonly TierProgress[]): BarSegment[] {
  const total = tiers.reduce((sum, t) => sum + Math.max(0, t.planned), 0) || 1;
  let start = 0;
  return [...tiers]
    .sort((a, b) => a.tier - b.tier)
    .map((t) => {
      const width = Math.max(0, t.planned) / total;
      const denominator = tierDenominator(t);
      const placedOut = clamp01(t.placedOut / denominator);
      const opened = Math.min(clamp01(t.opened / denominator), 1 - placedOut);
      const mastered = Math.min(clamp01(t.mastered / denominator), opened);
      const segment = {
        tier: t.tier,
        name: t.name,
        milestone: t.milestone,
        start,
        width,
        placedOut,
        opened,
        mastered,
        released: t.released > 0,
      };
      start += width;
      return segment;
    });
}

/** Shares of the whole bar: opened, mastered, placed out, and "done" (opened or placed out). */
export function barTotals(segments: readonly BarSegment[]) {
  let opened = 0;
  let mastered = 0;
  let placedOut = 0;
  for (const s of segments) {
    opened += s.width * s.opened;
    mastered += s.width * s.mastered;
    placedOut += s.width * s.placedOut;
  }
  return { opened, mastered, placedOut, done: Math.min(1, opened + placedOut) };
}

export type MilestoneLabel = {
  label: string;
  /** Share of the bar's width where the label points. */
  at: number;
  align: 'start' | 'center' | 'end';
  /** Labels that would collide drop to a second row. */
  row: 0 | 1;
};

/**
 * Labels under the bar: "Start", then each milestone at the end of its tier.
 * Widths are estimated from character counts; a label that would touch the
 * one before it on its row moves to the other row.
 */
export function milestoneLabels(segments: readonly BarSegment[], barWidth: number, charWidth = 6.6, gap = 10): MilestoneLabel[] {
  const raw = [
    { label: 'Start', at: 0 },
    ...segments.filter((s) => s.milestone).map((s) => ({ label: s.milestone as string, at: s.start + s.width })),
  ];
  const rowEnds = [-Infinity, -Infinity];
  return raw.map(({ label, at }) => {
    const width = label.length * charWidth;
    const center = at * barWidth;
    const align: MilestoneLabel['align'] = center - width / 2 < 0 ? 'start' : center + width / 2 > barWidth ? 'end' : 'center';
    const left = align === 'start' ? center : align === 'end' ? center - width : center - width / 2;
    const row: 0 | 1 = left >= rowEnds[0] + gap ? 0 : 1;
    rowEnds[row] = left + width;
    return { label, at, align, row };
  });
}

/** The tier the learner is in: the next card's tier, or the last tier with any progress. */
export function currentTier(segments: readonly BarSegment[], nextTier?: number | null): BarSegment | undefined {
  if (nextTier != null) {
    const found = segments.find((s) => s.tier === nextTier);
    if (found) return found;
  }
  const started = segments.filter((s) => s.opened > 0 || s.placedOut > 0);
  return started[started.length - 1] ?? segments[0];
}

/**
 * Cards opened per day over the last 14 days (or since starting, if sooner),
 * and how long the rest would take at that pace.
 */
export function paceEstimate({
  openedLast14,
  startedAt,
  today,
  remaining,
}: {
  openedLast14: number;
  startedAt: ISODate | null;
  today: ISODate;
  remaining: number;
}): { perDay: number; days: number | null } {
  const sinceStart = startedAt ? daysBetween(startedAt.slice(0, 10), today) + 1 : 14;
  const window = Math.max(1, Math.min(14, sinceStart));
  const perDay = openedLast14 / window;
  return { perDay, days: perDay > 0 && remaining > 0 ? Math.ceil(remaining / perDay) : null };
}

/** "38%", or "<1%" for a start that would otherwise round to nothing. */
export function formatPercent(share: number): string {
  if (share > 0 && share < 0.01) return '<1%';
  return `${Math.round(share * 100)}%`;
}

/** "about 3 weeks", "about 16 months", "about 2.5 years". */
export function describeDuration(days: number): string {
  if (days < 14) return days <= 1 ? 'about a day' : `about ${days} days`;
  if (days < 60) return `about ${Math.round(days / 7)} weeks`;
  const months = days / 30.44;
  if (months < 24) return `about ${Math.round(months)} months`;
  const years = Math.round((days / 365.25) * 2) / 2;
  return `about ${years % 1 === 0 ? years.toFixed(0) : years.toFixed(1)} years`;
}
