import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import type { ISODate } from '@/lib/dates';
import { queryKeys } from '@/lib/queryClient';

import { addPack, fetchCatalog, fetchPack, fetchPackProgress, removePack, type PackSummary } from './api';

export function useCatalog() {
  return useQuery({ queryKey: queryKeys.packs, queryFn: fetchCatalog, staleTime: 10 * 60_000 });
}

export function usePack(id: string) {
  return useQuery({ queryKey: queryKeys.pack(id), queryFn: () => fetchPack(id), staleTime: 10 * 60_000 });
}

export function usePackProgress() {
  const { session } = useAuth();
  return useQuery({
    queryKey: queryKeys.packProgress,
    queryFn: fetchPackProgress,
    enabled: Boolean(session),
  });
}

/** pack id → pack summary, for labeling memories with their pack/category. */
export function usePackIndex(): Map<string, PackSummary> {
  const { data } = useCatalog();
  const index = new Map<string, PackSummary>();
  for (const category of data ?? []) {
    for (const pack of category.packs) index.set(pack.id, pack);
  }
  return index;
}

function useRefreshAfterPackChange() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.memories });
    void queryClient.invalidateQueries({ queryKey: queryKeys.packProgress });
    void queryClient.invalidateQueries({ queryKey: ['progress'] });
  };
}

export function useAddPack() {
  const refresh = useRefreshAfterPackChange();
  return useMutation({
    mutationFn: ({ packId, perDay, today }: { packId: string; perDay: number; today: ISODate }) =>
      addPack(packId, perDay, today),
    onSuccess: refresh,
  });
}

export function useRemovePack() {
  const refresh = useRefreshAfterPackChange();
  return useMutation({
    mutationFn: (packId: string) => removePack(packId),
    onSuccess: refresh,
  });
}
