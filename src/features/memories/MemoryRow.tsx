import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import type { PackSummary } from '@/features/packs/api';
import { categoryLook } from '@/features/packs/categories';
import { daysBetween, describeDue, type ISODate } from '@/lib/dates';
import { memoryStatus } from '@/lib/schedule';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { Memory } from './api';

type MemoryRowProps = {
  memory: Memory;
  today: ISODate;
  pack?: PackSummary;
};

export function MemoryRow({ memory, today, pack }: MemoryRowProps) {
  const { colors } = useTheme();
  const look = categoryLook(pack?.categoryId);
  const status = memoryStatus(memory);
  const due = daysBetween(today, memory.due_on) <= 0;

  const pill = due
    ? { text: describeDue(memory.due_on, today), fg: colors.primary, bg: colors.primarySoft }
    : status === 'mastered'
      ? { text: 'Mastered', fg: colors.success, bg: colors.successSoft }
      : { text: describeDue(memory.due_on, today), fg: colors.textMuted, bg: colors.surfaceSunken };

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/memory/[id]', params: { id: memory.id } })}
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={`${memory.title}. ${pill.text}`}
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <CategoryIcon look={look} size={40} />
      <View style={styles.middle}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {memory.title}
        </Text>
        <Text variant="caption" tone="subtle" numberOfLines={1}>
          {pack ? pack.title : 'Your card'}
          {memory.answer ? ' · Typed answer' : ''}
        </Text>
      </View>
      <View style={[styles.pill, { backgroundColor: pill.bg }]}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 12 }} color={pill.fg} numberOfLines={1}>
          {pill.text}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
  },
  middle: { flex: 1, gap: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill, maxWidth: 130 },
});
