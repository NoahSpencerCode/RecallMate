import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Text } from '@/components/Text';
import { spacing, useTheme } from '@/theme';

import type { ProfessionSummary } from './api';
import { professionLook } from './looks';

/** A started profession on Today: what's due, or a nudge to open more. */
export function ProfessionTodayRow({ profession }: { profession: ProfessionSummary }) {
  const { colors } = useTheme();
  const look = professionLook(profession);
  const due = profession.due_today;
  const finished = !profession.next;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: due > 0 ? colors.danger : look.color },
      ]}>
      <CategoryIcon look={look} size={44} />
      <View style={styles.text}>
        <Text variant="subheading" numberOfLines={1}>
          {profession.name}
        </Text>
        <Text variant="small" tone="muted" numberOfLines={2}>
          {due > 0
            ? `${due} ${due === 1 ? 'card is' : 'cards are'} due. Review them to keep opening new ones.`
            : finished
              ? 'You’ve opened every card released so far.'
              : profession.opened_today > 0
                ? `${profession.opened_today} opened today. Up next: ${profession.next?.module_title}.`
                : `Ready for new cards. Up next: ${profession.next?.module_title}.`}
        </Text>
      </View>
      {due > 0 ? (
        <Button
          title={`Review ${due}`}
          size="sm"
          icon="play"
          onPress={() => router.push({ pathname: '/review', params: { profession: profession.id } })}
        />
      ) : (
        <Button
          title={finished ? 'View' : 'Open next'}
          size="sm"
          variant="secondary"
          onPress={() =>
            finished
              ? router.push({ pathname: '/profession/[id]', params: { id: profession.id } })
              : router.push({ pathname: '/profession/[id]/open', params: { id: profession.id } })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  text: { flex: 1, gap: 2 },
});
