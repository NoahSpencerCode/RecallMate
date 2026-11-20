import { localToday } from '@/lib/dates';
import { supabase } from '@/lib/supabase';

export type PackSummary = {
  id: string;
  categoryId: string;
  title: string;
  course: string;
  description: string;
  cardCount: number;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  packs: PackSummary[];
};

export type PackDetail = PackSummary & {
  categoryName: string;
  cards: { id: string; title: string; hasAnswer: boolean }[];
};

export type PackProgress = {
  packId: string;
  cardCount: number;
  startedCount: number;
  masteredCount: number;
};

/** All categories with their packs, in display order. */
export async function fetchCatalog(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('pack_categories')
    .select('id, name, tagline, packs(id, category_id, title, course, description, position, pack_cards(count))')
    .order('position')
    .order('position', { referencedTable: 'packs' });
  if (error) throw error;
  return data.map((category) => ({
    id: category.id,
    name: category.name,
    tagline: category.tagline,
    packs: category.packs.map((pack) => ({
      id: pack.id,
      categoryId: pack.category_id,
      title: pack.title,
      course: pack.course,
      description: pack.description,
      cardCount: pack.pack_cards[0]?.count ?? 0,
    })),
  }));
}

export async function fetchPack(id: string): Promise<PackDetail> {
  const { data, error } = await supabase
    .from('packs')
    .select('id, category_id, title, course, description, pack_categories(name), pack_cards(id, title, position, answer)')
    .eq('id', id)
    .order('position', { referencedTable: 'pack_cards' })
    .single();
  if (error) throw error;
  return {
    id: data.id,
    categoryId: data.category_id,
    categoryName: data.pack_categories?.name ?? '',
    title: data.title,
    course: data.course,
    description: data.description,
    cardCount: data.pack_cards.length,
    cards: data.pack_cards.map((card) => ({ id: card.id, title: card.title, hasAnswer: card.answer !== null })),
  };
}

export async function fetchPackProgress(): Promise<PackProgress[]> {
  const { data, error } = await supabase.from('my_pack_progress').select('*');
  if (error) throw error;
  return data
    .filter((row) => row.pack_id !== null)
    .map((row) => ({
      packId: row.pack_id ?? '',
      cardCount: row.card_count ?? 0,
      startedCount: row.started_count ?? 0,
      masteredCount: row.mastered_count ?? 0,
    }));
}

/** Copies the pack's cards into the user's memories; returns how many were added. */
/** Adds the pack's cards, the first batch due today (the local date when it saves). */
export async function addPack(packId: string, perDay: number): Promise<number> {
  const { data, error } = await supabase.rpc('add_pack', {
    p_pack_id: packId,
    p_per_day: perDay,
    p_today: localToday(),
  });
  if (error) throw error;
  return data;
}

/** Deletes the user's cards from this pack (and with them, their progress). */
export async function removePack(packId: string): Promise<void> {
  const { error } = await supabase.from('memories').delete().eq('pack_id', packId);
  if (error) throw error;
}
