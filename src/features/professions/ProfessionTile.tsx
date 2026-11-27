import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { MilestoneBar } from '@/components/MilestoneBar';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import { useToday } from '@/lib/useToday';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { ProfessionSummary } from './api';
import { useProfessionDetail } from './hooks';
import { professionLook } from './looks';
import { barSegments, barTotals, formatPercent, tiersFromDetail } from './progress';

/** A profession on the Learn tab: its look, pitch and, once started, a small 0 → PhD bar. */
export function ProfessionTile({ profession }: { profession: ProfessionSummary }) {
  const { colors } = useTheme();
  const today = useToday();
  const look = professionLook(profession);
  const detail = useProfessionDetail(profession.id, today);
  const segments = detail.data ? barSegments(tiersFromDetail(detail.data.tiers)) : [];
  const done = barTotals(segments).done;
  const percent = formatPercent(done);
  const started = profession.enrolled;

  const status = !started
    ? `${profession.planned_cards.toLocaleString()} cards, from zero to PhD`
    : profession.due_today > 0
      ? `${profession.due_today} due`
      : 'Ready for new cards';

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/profession/[id]', params: { id: profession.id } })}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel={`${profession.name}. ${profession.tagline}. ${
        started ? `${percent} to PhD. ${status}.` : 'Not started.'
      }`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: look.color }]}>
      <LinearGradient colors={look.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.band}>
        <View style={styles.bandIcon}>
          <Icon name={look.icon} size={28} color="#FFFFFF" />
        </View>
        <View style={styles.bandText}>
          <Text variant="heading" color="#FFFFFF" numberOfLines={2}>
            {profession.name}
          </Text>
          <Text variant="small" color="rgba(255,255,255,0.92)" numberOfLines={2}>
            {profession.tagline}
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        {started && segments.length ? (
          <MilestoneBar segments={segments} color={look.color} height={10} accessibilityLabel={`${percent} to PhD`} />
        ) : null}
        <View style={styles.footer}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} tone={started ? 'default' : 'subtle'} numberOfLines={1}>
            {started ? `${percent} to PhD · ${profession.opened.toLocaleString()} cards opened` : status}
          </Text>
          {started ? (
            <View
              style={[
                styles.pill,
                { backgroundColor: profession.due_today > 0 ? colors.dangerSoft : `${look.color}1F` },
              ]}>
              <Icon
                name={profession.due_today > 0 ? 'clock-outline' : 'cards-playing-outline'}
                size={14}
                color={profession.due_today > 0 ? colors.danger : look.color}
              />
              <Text
                style={{ fontFamily: fonts.extrabold, fontSize: 12 }}
                color={profession.due_today > 0 ? colors.danger : look.color}>
                {profession.due_today > 0 ? `${profession.due_today} due` : 'Open next'}
              </Text>
            </View>
          ) : (
            <View style={[styles.pill, { backgroundColor: `${look.color}1F` }]}>
              <Icon name="play" size={14} color={look.color} />
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 12 }} color={look.color}>
                Start
              </Text>
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 5, overflow: 'hidden', flexGrow: 1 },
  band: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  bandIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandText: { flex: 1, gap: 2 },
  body: { padding: spacing.lg, gap: spacing.md },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
});
