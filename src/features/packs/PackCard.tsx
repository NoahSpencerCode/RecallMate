import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { PackProgress, PackSummary } from './api';
import { categoryLook } from './categories';

type PackCardProps = {
  pack: PackSummary;
  progress?: PackProgress;
  compact?: boolean;
};

export function PackCard({ pack, progress, compact = false }: PackCardProps) {
  const { colors } = useTheme();
  const look = categoryLook(pack.categoryId);
  const added = Boolean(progress && progress.cardCount > 0);
  const mastered = progress ? progress.masteredCount / Math.max(1, pack.cardCount) : 0;

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/pack/[id]', params: { id: pack.id } })}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel={`${pack.title}, ${pack.course}, ${pack.cardCount} cards${added ? ', added' : ''}`}
      style={[
        styles.card,
        compact ? styles.compact : styles.grow,
        { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: look.color },
      ]}>
      <LinearGradient colors={look.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.band}>
        <View style={styles.bandIcon}>
          <Icon name={look.icon} size={20} color="#FFFFFF" />
        </View>
        <Text variant="label" color="#FFFFFF" numberOfLines={1} style={styles.course}>
          {pack.course}
        </Text>
        {added ? (
          <View style={styles.addedBadge}>
            <Icon name="check-bold" size={14} color={look.color} />
          </View>
        ) : null}
      </LinearGradient>
      <View style={styles.body}>
        <Text variant="subheading" numberOfLines={2}>
          {pack.title}
        </Text>
        {!compact ? (
          <Text variant="small" tone="muted" numberOfLines={2}>
            {pack.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} tone="subtle">
            {pack.cardCount} cards
          </Text>
          {added ? (
            <View style={styles.progressWrap}>
              <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
                <View style={[styles.fill, { backgroundColor: look.color, width: `${Math.max(4, mastered * 100)}%` }]} />
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12 }} color={look.color}>
                {Math.round(mastered * 100)}%
              </Text>
            </View>
          ) : (
            <View style={[styles.addPill, { backgroundColor: `${look.color}1F` }]}>
              <Icon name="plus" size={14} color={look.color} />
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 12 }} color={look.color}>
                Add
              </Text>
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 4, overflow: 'hidden' },
  grow: { flexGrow: 1 },
  compact: { width: 230 },
  band: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  bandIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  course: { flex: 1 },
  addedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.lg, gap: spacing.xs, flexGrow: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: spacing.sm, gap: spacing.md },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' },
  track: { height: 8, borderRadius: radii.pill, flex: 1, maxWidth: 90, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
  addPill: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill },
});
