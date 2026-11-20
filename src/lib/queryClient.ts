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
};
