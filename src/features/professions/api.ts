import type { ReviewCard, ReviewGrade } from '@/features/review/types';
import { localToday, type ISODate } from '@/lib/dates';
import { supabase } from '@/lib/supabase';

export type CardKind =
  | 'definition'
  | 'concept'
  | 'theorem'
  | 'proof-idea'
  | 'example'
  | 'counterexample'
  | 'problem'
  | 'formula'
  | 'code'
  | 'numbers'
  | 'trade-off'
  | 'landmark'
  | 'misconception';

/** One profession and where the signed-in learner stands in it (get_profession_overview). */
export type ProfessionSummary = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  gradient: [string, string];
  planned_cards: number;
  released_cards: number;
  enrolled: boolean;
  started_at: string | null;
  start_position: number;
  opened: number;
  mastered: number;
  due_today: number;
  due_tomorrow: number;
  opened_today: number;
  opened_14d: number;
  /** The next card to open: its module, tier and rank among released cards ("Card N"). */
  next: { module_id: string; module_title: string; tier: number; rank: number } | null;
};

export type PracticeLink = { title: string; url: string };

export type ModuleDetail = {
  id: string;
  title: string;
  summary: string;
  planned_cards: number;
  refs: string[];
  practice: PracticeLink[];
  released: number;
  opened: number;
  mastered: number;
  due: number;
  placed_out: number;
};

export type TierDetail = {
  tier: number;
  slug: string;
  name: string;
  /** The label printed on the bar at this tier's end, e.g. "Bachelor's". */
  milestone: string | null;
  summary: string;
  planned_cards: number;
  released: number;
  opened: number;
  mastered: number;
  placed_out: number;
  modules: ModuleDetail[];
};

export type ProfessionDetail = { start_position: number; tiers: TierDetail[] };

/** A profession card being opened or reviewed: the pack-card text fields plus its place in the curriculum. */
export type ProfessionCard = ReviewCard & {
  module_id: string;
  module_title?: string | null;
  position: number;
  kind: CardKind;
  difficulty: number;
  refs: string[];
  tags: string[];
  as_of: string | null;
};

export type OpenResult =
  | { status: 'opened'; card: ProfessionCard; opened_today: number }
  | { status: 'reviews_due'; due: number }
  | { status: 'done' };

/** A row on a module page; `stage` is null for cards not opened yet. */
export type ModuleCard = {
  id: string;
  position: number;
  kind: CardKind;
  difficulty: number;
  checkpoint: boolean;
  title: string;
  stage: number | null;
  due_on: ISODate | null;
};

export type CheckpointCard = ProfessionCard & { tier: number };

export type ReportReason = 'wrong' | 'unclear' | 'typo' | 'other';

export async function fetchProfessions(today: ISODate): Promise<ProfessionSummary[]> {
  const { data, error } = await supabase.rpc('get_profession_overview', { p_today: today });
  if (error) throw error;
  return (data ?? []) as unknown as ProfessionSummary[];
}

export async function fetchProfessionDetail(id: string, today: ISODate): Promise<ProfessionDetail> {
  const { data, error } = await supabase.rpc('get_profession_detail', { p_profession_id: id, p_today: today });
  if (error) throw error;
  return data as unknown as ProfessionDetail;
}

/** Up to 200 due cards, oldest first. Dated when it runs, like a save. */
export async function fetchDueCards(id: string): Promise<ProfessionCard[]> {
  const { data, error } = await supabase.rpc('profession_due_cards', {
    p_profession_id: id,
    p_today: localToday(),
    p_limit: 200,
  });
  if (error) throw error;
  return (data ?? []) as unknown as ProfessionCard[];
}

export async function fetchModuleCards(moduleId: string): Promise<ModuleCard[]> {
  const { data, error } = await supabase.rpc('profession_module_cards', { p_module_id: moduleId });
  if (error) throw error;
  return (data ?? []) as unknown as ModuleCard[];
}

/** Checkpoint cards of every tier below `belowTier`, for the placement self-check. */
export async function fetchCheckpointCards(id: string, belowTier: number): Promise<CheckpointCard[]> {
  const { data, error } = await supabase
    .from('profession_cards')
    .select(
      'id, module_id, position, kind, difficulty, title, body, answer, accepted_answers, answer_display, search_query, refs, tags, as_of, profession_modules!inner(tier, title)',
    )
    .eq('profession_id', id)
    .eq('checkpoint', true)
    .eq('retired', false)
    .lt('profession_modules.tier', belowTier)
    .order('position');
  if (error) throw error;
  type Row = Omit<CheckpointCard, 'stage' | 'tier' | 'module_title'> & {
    profession_modules: { tier: number; title: string } | { tier: number; title: string }[];
  };
  return ((data ?? []) as unknown as Row[]).map(({ profession_modules, ...card }) => {
    const module = Array.isArray(profession_modules) ? profession_modules[0] : profession_modules;
    return { ...card, stage: 0, tier: module.tier, module_title: module.title };
  });
}

export async function startProfession(id: string, startTier: number): Promise<void> {
  const { error } = await supabase.rpc('start_profession', { p_profession_id: id, p_start_tier: startTier });
  if (error) throw error;
}

/** Opens the next card into the stack (first due tomorrow), unless reviews are due. */
export async function openNextCard(id: string): Promise<OpenResult> {
  const { data, error } = await supabase.rpc('open_next_profession_card', { p_profession_id: id, p_today: localToday() });
  if (error) throw error;
  return data as unknown as OpenResult;
}

export async function reviewProfessionCard({ id, passed, attempts }: ReviewGrade): Promise<void> {
  const { error } = await supabase.rpc('review_profession_card', {
    p_card_id: id,
    p_passed: passed,
    p_today: localToday(),
    p_attempts: attempts,
  });
  if (error) throw error;
}

export async function resetProfession(id: string): Promise<void> {
  const { error } = await supabase.rpc('reset_profession', { p_profession_id: id });
  if (error) throw error;
}

export async function reportCard({ cardId, reason, note }: { cardId: string; reason: ReportReason; note?: string }) {
  const { error } = await supabase
    .from('profession_card_reports')
    .insert({ card_id: cardId, reason, note: note?.trim() ? note.trim().slice(0, 1000) : null });
  if (error) throw error;
}
