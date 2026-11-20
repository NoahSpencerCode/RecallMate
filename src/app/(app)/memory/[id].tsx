import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { Icon, type IconName } from '@/components/Icon';
import { LoadError } from '@/components/LoadError';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useToast } from '@/components/Toast';
import { clearDraft } from '@/features/memories/drafts';
import { useDeleteMemory, useMemory, useUpdateMemory } from '@/features/memories/hooks';
import { MemoryForm } from '@/features/memories/MemoryForm';
import { neural } from '@/features/neural/neuralBus';
import { usePackIndex } from '@/features/packs/hooks';
import { describeDue, formatDay } from '@/lib/dates';
import { friendlyError } from '@/lib/errors';
import { memoryStatus, nextGapDays } from '@/lib/schedule';
import { useToday } from '@/lib/useToday';
import { palette, radii, spacing, useTheme } from '@/theme';

export default function EditMemory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const today = useToday();
  const toast = useToast();
  const { memory, isPending, isError, isFetching, refetch } = useMemory(id);
  const packIndex = usePackIndex();
  const update = useUpdateMemory();
  const remove = useDeleteMemory();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isPending) {
    return (
      <Screen scroll={false} contentStyle={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Screen>
    );
  }

  if (!memory && isError) {
    return (
      <Screen maxWidth={560}>
        <LoadError title="Couldn’t load this card" onRetry={() => void refetch()} retrying={isFetching} />
      </Screen>
    );
  }

  if (!memory) {
    return (
      <Screen maxWidth={560}>
        <EmptyState icon="card-remove-outline" color={palette.pink} title="Card not found" message="It may have been deleted.">
          <Button title="Go to Library" onPress={() => router.replace('/library')} />
        </EmptyState>
      </Screen>
    );
  }

  const pack = memory.pack_id ? packIndex.get(memory.pack_id) : undefined;
  const status = memoryStatus(memory);
  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: 'calendar-clock', label: 'Next review', value: `${describeDue(memory.due_on, today)} · ${formatDay(memory.due_on, { weekday: 'short', month: 'short', day: 'numeric' })}` },
    { icon: 'stairs-up', label: 'Stage', value: `${memory.stage} · next gap ${nextGapDays(memory.stage, true)} days if you get it` },
    { icon: 'history', label: 'Reviews', value: `${memory.review_count} total · ${memory.lapse_count} missed` },
    { icon: 'tag-outline', label: 'Source', value: pack ? `${pack.title} pack` : 'Written by you' },
  ];

  return (
    <MemoryForm
      key={memory.id}
      draftKey={`edit:${memory.id}`}
      heading={status === 'mastered' ? 'Mastered card' : 'Edit card'}
      submitLabel="Save changes"
      saving={update.isPending}
      initial={{
        title: memory.title,
        body: memory.body,
        answer: memory.answer,
        acceptedAnswers: memory.accepted_answers,
      }}
      onSubmit={(input) =>
        update.mutate(
          { id: memory.id, input },
          {
            onSuccess: () => {
              clearDraft(`edit:${memory.id}`);
              neural.burst({ strength: 0.8 });
              toast({ tone: 'success', message: 'Card updated.' });
              if (router.canGoBack()) router.back();
            },
            onError: (error) => toast({ tone: 'error', message: friendlyError(error) }),
          },
        )
      }>
      <View style={[styles.facts, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {facts.map((fact) => (
          <View key={fact.label} style={styles.fact}>
            <Icon name={fact.icon} size={20} color={colors.primary} />
            <Text variant="smallStrong" style={styles.factLabel}>
              {fact.label}
            </Text>
            <Text variant="small" tone="muted" style={styles.factValue}>
              {fact.value}
            </Text>
          </View>
        ))}
      </View>

      <Button title="Delete card" variant="dangerGhost" icon="delete-outline" onPress={() => setConfirmDelete(true)} />

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete this card?"
        message="It’ll be removed from your library along with its schedule. Past reviews still count toward your streak."
        confirmLabel="Delete"
        icon="delete-outline"
        loading={remove.isPending}
        onConfirm={() =>
          remove.mutate(memory.id, {
            onSuccess: () => {
              clearDraft(`edit:${memory.id}`);
              setConfirmDelete(false);
              toast({ tone: 'info', icon: 'delete-outline', message: 'Card deleted.' });
              if (router.canGoBack()) router.back();
              else router.replace('/library');
            },
            onError: (error) => {
              setConfirmDelete(false);
              toast({ tone: 'error', message: friendlyError(error) });
            },
          })
        }
        onCancel={() => setConfirmDelete(false)}
      />
    </MemoryForm>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  facts: { borderRadius: radii.lg, borderWidth: 1.5, padding: spacing.lg, gap: spacing.md },
  fact: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  factLabel: { width: 100 },
  factValue: { flex: 1, minWidth: 160 },
});
