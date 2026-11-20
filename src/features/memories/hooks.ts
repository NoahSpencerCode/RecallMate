import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { isGoneError, isNetworkError, isNotDueError } from '@/lib/errors';
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

function dropMemory(list: Memory[] | undefined, id: string): Memory[] {
  return (list ?? []).filter((m) => m.id !== id);
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();
  return useMutation({
    mutationFn: (input: MemoryInput) => createMemory(input),
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
    // Deleted on another device: drop it here too, so the editor says so.
    onError: (error, { id }) => {
      if (isGoneError(error)) queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => dropMemory(old, id));
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();
  return useMutation({
    mutationFn: (id: string) => deleteMemory(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => dropMemory(old, id));
      invalidateStats();
    },
  });
}

/**
 * Saves a review. `onFailed` is given here rather than to mutate() because
 * callbacks passed to mutate() are dropped once the next card's save starts or
 * the screen closes, which would lose the failure silently.
 */
export function useReviewMemory({ onFailed }: { onFailed?: (input: ReviewInput, error: unknown) => void } = {}) {
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();
  return useMutation({
    mutationFn: (input: ReviewInput) => reviewMemory(input),
    // A dropped connection shouldn't cost a review: retry it a couple of times.
    retry: (failures, error) => failures < 2 && isNetworkError(error),
    retryDelay: (attempt) => 1000 * 2 ** attempt,
    onSuccess: (memory) => {
      queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => replaceMemory(old, memory));
      invalidateStats();
    },
    onError: (error, input) => {
      // Changed on another device: deleted, or already reviewed there.
      if (isGoneError(error)) queryClient.setQueryData<Memory[]>(queryKeys.memories, (old) => dropMemory(old, input.id));
      else if (isNotDueError(error)) void queryClient.invalidateQueries({ queryKey: queryKeys.memories });
      onFailed?.(input, error);
    },
  });
}
