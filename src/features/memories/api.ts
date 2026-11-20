import { addDays, localToday } from '@/lib/dates';
import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Memory = Database['public']['Tables']['memories']['Row'];

export type MemoryInput = {
  title: string;
  body: string;
  answer: string | null;
  acceptedAnswers: string[];
};

const PAGE_SIZE = 1000;

/** Every memory the signed-in user owns (Row Level Security scopes the query). */
export async function fetchMemories(): Promise<Memory[]> {
  const all: Memory[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('due_on', { ascending: true })
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < PAGE_SIZE) return all;
  }
}

function clean(input: MemoryInput) {
  const answer = input.answer?.trim() || null;
  return {
    title: input.title.trim(),
    body: input.body.trim(),
    answer,
    accepted_answers: answer ? input.acceptedAnswers.map((a) => a.trim()).filter(Boolean) : [],
  };
}

/** New memories are first due tomorrow (the local date when it saves). */
export async function createMemory(input: MemoryInput): Promise<Memory> {
  const { data, error } = await supabase
    .from('memories')
    .insert({ ...clean(input), due_on: addDays(localToday(), 1) })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMemory(id: string, input: MemoryInput): Promise<Memory> {
  const { data, error } = await supabase.from('memories').update(clean(input)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase.from('memories').delete().eq('id', id);
  if (error) throw error;
}

export type ReviewInput = { id: string; passed: boolean; attempts: number };

/** Records the review (dated when it saves) and returns the memory with its new schedule. */
export async function reviewMemory({ id, passed, attempts }: ReviewInput): Promise<Memory> {
  const { data, error } = await supabase.rpc('review_memory', {
    p_memory_id: id,
    p_passed: passed,
    p_today: localToday(),
    p_attempts: attempts,
  });
  if (error) throw error;
  return data;
}
