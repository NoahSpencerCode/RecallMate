/**
 * Calendar-day helpers. Due dates are plain local dates ("YYYY-MM-DD"), so a
 * card due "today" is reviewable all day, whatever time it was created.
 */

export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar date of a Date, as YYYY-MM-DD. */
export function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function localToday(now: Date = new Date()): ISODate {
  return toISODate(now);
}

/** Parses YYYY-MM-DD as local midnight. */
export function parseISODate(value: ISODate): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(value: ISODate, days: number): ISODate {
  const date = parseISODate(value);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Whole days from `from` to `to` (positive when `to` is later). DST-safe. */
export function daysBetween(from: ISODate, to: ISODate): number {
  const ms = parseISODate(to).getTime() - parseISODate(from).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDay(value: ISODate, options: Intl.DateTimeFormatOptions): string {
  return parseISODate(value).toLocaleDateString(undefined, options);
}

/** "Due today", "Tomorrow", "In 3 days", "Overdue · 2 days", "Mar 4". */
export function describeDue(due: ISODate, today: ISODate): string {
  const days = daysBetween(today, due);
  if (days < 0) return `Overdue · ${-days} ${days === -1 ? 'day' : 'days'}`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  return formatDay(due, { month: 'short', day: 'numeric' });
}

/** "in 1 day", "in 13 days", "in 3 weeks", "in 4 months". */
export function describeGap(days: number): string {
  if (days <= 1) return 'tomorrow';
  if (days < 21) return `in ${days} days`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  if (days < 365) return `in ${Math.round(days / 30)} months`;
  const years = Math.round(days / 365);
  return `in ${years} ${years === 1 ? 'year' : 'years'}`;
}

/** Milliseconds until the next local midnight (plus a small buffer). */
export function msUntilMidnight(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  return next.getTime() - now.getTime();
}
