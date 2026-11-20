import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import type { ISODate } from '@/lib/dates';
import { queryKeys } from '@/lib/queryClient';

import {
  createMemory,
  deleteMemory,
  fetchMemories,
  reviewMemory,
  updateMemory,
  type Memory,
  type MemoryInput,
  type ReviewInput,
} from './api';

export function useMemories() {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.memories,
    queryFn: fetchMemories,
    enabled: Boolean(session),
  });
}

export function useMemory(id: string | undefined) {
  const query = useMemories();
  return { ...query, memory: query.data?.find((m) => m.id === id) };
}

/** Progress stats depend on memories, so refresh them after any change. */
function useInvalidateStats() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['progress'] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.packProgress });
  };
}

function replaceMemory(list: Memory[] | undefined, next: Memory): Memory[] {
  return (list ?? []).map((m) => (m.id === next.id ? next : m));
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();
  return useMutation({
    mutationFn: ({ input, today }: { input: MemoryInput; today: ISODate }) => createMemory(input, today),
    onSuccess: (memory) => {
      queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => [...(old ?? []), memory]);
      invalidateStats();
    },
  });
}

export function useUpdateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MemoryInput }) => updateMemory(id, input),
    onSuccess: (memory) => {
      queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => replaceMemory(old, memory));
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();
  return useMutation({
    mutationFn: (id: string) => deleteMemory(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => (old ?? []).filter((m) => m.id !== id));
      invalidateStats();
    },
  });
}

export function useReviewMemory() {
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();
  return useMutation({
    mutationFn: (input: ReviewInput) => reviewMemory(input),
    onSuccess: (memory) => {
      queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => replaceMemory(old, memory));
      invalidateStats();
    },
  });
}
