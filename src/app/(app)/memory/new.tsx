import { router } from 'expo-router';

import { useToast } from '@/components/Toast';
import { useCreateMemory } from '@/features/memories/hooks';
import { MemoryForm } from '@/features/memories/MemoryForm';
import { neural } from '@/features/neural/neuralBus';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';

export default function NewMemory() {
  const today = useToday();
  const toast = useToast();
  const create = useCreateMemory();

  return (
    <MemoryForm
      heading="New card"
      submitLabel="Save card"
      saving={create.isPending}
      onSubmit={(input) =>
        create.mutate(
          { input, today },
          {
            onSuccess: () => {
              haptics.success();
              neural.burst({ strength: 1.3 });
              toast({ tone: 'success', message: 'Saved! It’s due for its first review tomorrow.' });
              if (router.canGoBack()) router.back();
              else router.replace('/');
            },
            onError: (error) => toast({ tone: 'error', message: friendlyError(error) }),
          },
        )
      }
    />
  );
}
