import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  memories: ['memories'] as const,
  packs: ['packs'] as const,
  pack: (id: string) => ['packs', id] as const,
  packProgress: ['pack-progress'] as const,
  progress: (today: string) => ['progress', today] as const,
  // Professions. Invalidate by prefix: ['professions'], ['profession-detail', id], ['profession-module'].
  professions: (today: string) => ['professions', today] as const,
  professionDetail: (id: string, today: string) => ['profession-detail', id, today] as const,
  professionDue: (id: string) => ['profession-due', id] as const,
  professionModule: (moduleId: string) => ['profession-module', moduleId] as const,
  checkpoints: (id: string, belowTier: number) => ['profession-checkpoints', id, belowTier] as const,
};
