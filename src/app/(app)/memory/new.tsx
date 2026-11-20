import { router } from 'expo-router';

import { useToast } from '@/components/Toast';
import { useCreateMemory } from '@/features/memories/hooks';
import { MemoryForm } from '@/features/memories/MemoryForm';
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
