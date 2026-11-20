import { describe, expect, it } from '@jest/globals';

import { addDays, daysBetween, describeDue, describeGap, localToday, toISODate } from '../dates';
import { fib, memoryStatus, nextGapDays } from '../schedule';

describe('fib', () => {
  it('follows 1, 1, 2, 3, 5, 8, 13', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(fib)).toEqual([1, 1, 2, 3, 5, 8, 13]);
    expect(fib(0)).toBe(0);
  });
});

describe('nextGapDays', () => {
  it('matches the README: after creation (1 day), reviews come 1, 2, 3, 5, 8 days apart', () => {
    const gaps: number[] = [];
    let stage = 0;
    for (let i = 0; i < 5; i++) {
      gaps.push(nextGapDays(stage, true));
      stage += 1;
    }
    expect(gaps).toEqual([1, 2, 3, 5, 8]);
  });

  it('resets to tomorrow on a miss', () => {
    expect(nextGapDays(6, false)).toBe(1);
  });
});

describe('memoryStatus', () => {
  it('classifies cards', () => {
    expect(memoryStatus({ stage: 0, review_count: 0 })).toBe('new');
    expect(memoryStatus({ stage: 2, review_count: 4 })).toBe('learning');
    expect(memoryStatus({ stage: 5, review_count: 5 })).toBe('mastered');
  });
});

describe('dates', () => {
  it('formats local dates', () => {
    expect(toISODate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(localToday(new Date(2026, 10, 20, 0, 1))).toBe('2026-11-20');
  });

  it('adds days across month and year ends', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('counts whole days across daylight-saving changes', () => {
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2);
    expect(daysBetween('2026-11-02', '2026-10-31')).toBe(-2);
  });

  it('describes due dates relative to today', () => {
    const today = '2026-11-20';
    expect(describeDue('2026-11-20', today)).toBe('Due today');
    expect(describeDue('2026-11-21', today)).toBe('Tomorrow');
    expect(describeDue('2026-11-19', today)).toBe('Overdue · 1 day');
    expect(describeDue('2026-11-17', today)).toBe('Overdue · 3 days');
    expect(describeDue('2026-11-24', today)).toBe('In 4 days');
  });

  it('describes gaps', () => {
    expect(describeGap(1)).toBe('tomorrow');
    expect(describeGap(8)).toBe('in 8 days');
    expect(describeGap(34)).toBe('in 5 weeks');
  });
});
