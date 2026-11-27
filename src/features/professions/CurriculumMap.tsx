import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { ModuleDetail, TierDetail } from './api';

type CurriculumMapProps = {
  professionId: string;
  tiers: TierDetail[];
  color: string;
  /** The tier to show open at first (the learner's current one). */
  currentTier?: number;
};

/** Every tier of a profession, each opening up into its modules. */
export function CurriculumMap({ professionId, tiers, color, currentTier }: CurriculumMapProps) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(currentTier != null ? [currentTier] : []));

  return (
    <View style={styles.map}>
      {tiers.map((tier, index) => (
        <TierSection
          key={tier.tier}
          professionId={professionId}
          tier={tier}
          index={index}
          color={color}
          current={tier.tier === currentTier}
          expanded={open.has(tier.tier)}
          onToggle={() =>
            setOpen((prev) => {
              const next = new Set(prev);
              if (next.has(tier.tier)) next.delete(tier.tier);
              else next.add(tier.tier);
              return next;
            })
          }
        />
      ))}
    </View>
  );
}

type TierSectionProps = {
  professionId: string;
  tier: TierDetail;
  index: number;
  color: string;
  current: boolean;
  expanded: boolean;
  onToggle: () => void;
};

function TierSection({ professionId, tier, index, color, current, expanded, onToggle }: TierSectionProps) {
  const { colors } = useTheme();
  const done = tier.opened + tier.placed_out;
  const total = Math.max(tier.released, 1);
  const finished = tier.released > 0 && done >= tier.released;
  const comingSoon = tier.released === 0;

  return (
    <View
      style={[
        styles.tier,
        { backgroundColor: colors.surface, borderColor: current ? color : colors.border, borderBottomColor: current ? color : colors.borderStrong },
      ]}>
      <PressableScale
        onPress={onToggle}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${tier.name}. ${comingSoon ? 'Coming soon' : `${done} of ${tier.released} cards`}${
          tier.milestone ? `. Ends at ${tier.milestone}` : ''
        }`}
        style={styles.tierHeader}>
        <View
          style={[
            styles.tierNumber,
            { backgroundColor: finished ? color : `${color}1F` },
          ]}>
          {finished ? (
            <Icon name="check-bold" size={18} color="#FFFFFF" />
          ) : (
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 15 }} color={color}>
              {index + 1}
            </Text>
          )}
        </View>
        <View style={styles.flex}>
          <Text variant="subheading" numberOfLines={2}>
            {tier.name}
          </Text>
          <Text variant="caption" tone="subtle">
            {comingSoon
              ? `${tier.planned_cards.toLocaleString()} cards · coming soon`
              : `${done.toLocaleString()} of ${tier.released.toLocaleString()} cards · ${tier.modules.length} ${
                  tier.modules.length === 1 ? 'module' : 'modules'
                }`}
          </Text>
        </View>
        {tier.milestone ? (
          <View style={[styles.milestone, { backgroundColor: `${color}1F` }]}>
            <Icon name="flag-checkered" size={13} color={color} />
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 11 }} color={color}>
              {tier.milestone}
            </Text>
          </View>
        ) : null}
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color={colors.textSubtle} />
      </PressableScale>

      {!comingSoon ? (
        <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
          <View style={[styles.fill, { backgroundColor: color, width: `${Math.min(100, (done / total) * 100)}%` }]} />
        </View>
      ) : null}

      {expanded ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.tierBody}>
          <Text variant="small" tone="muted">
            {tier.summary}
          </Text>
          {tier.modules.map((module) => (
            <ModuleRow key={module.id} professionId={professionId} module={module} color={color} />
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}

function ModuleRow({ professionId, module, color }: { professionId: string; module: ModuleDetail; color: string }) {
  const { colors } = useTheme();
  const slug = module.id.split('/')[1] ?? module.id;
  const done = module.opened + module.placed_out;
  const comingSoon = module.released === 0;

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/profession/[id]/module/[module]', params: { id: professionId, module: slug } })}
      scaleTo={0.98}
      disabled={comingSoon}
      accessibilityRole="button"
      accessibilityLabel={`${module.title}. ${comingSoon ? 'Coming soon' : `${done} of ${module.released} cards`}`}
      style={[styles.module, { borderColor: colors.border, opacity: comingSoon ? 0.6 : 1 }]}>
      <View style={styles.flex}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {module.title}
        </Text>
        <Text variant="caption" tone="subtle" numberOfLines={2}>
          {module.summary}
        </Text>
        {!comingSoon ? (
          <View style={[styles.moduleTrack, { backgroundColor: colors.surfaceSunken }]}>
            <View
              style={[styles.fill, { backgroundColor: color, width: `${Math.min(100, (done / Math.max(1, module.released)) * 100)}%` }]}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.moduleMeta}>
        {module.due > 0 ? (
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 12 }} color={colors.danger}>
            {module.due} due
          </Text>
        ) : null}
        <Text style={{ fontFamily: fonts.bold, fontSize: 12 }} tone="subtle">
          {comingSoon ? 'Soon' : `${done}/${module.released}`}
        </Text>
        {module.practice.length ? <Icon name="hammer-wrench" size={16} color={colors.textSubtle} /> : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  map: { gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  tier: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 4, padding: spacing.lg, gap: spacing.md },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tierNumber: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill },
  track: { height: 8, borderRadius: radii.pill, overflow: 'hidden' },
  moduleTrack: { height: 6, borderRadius: radii.pill, overflow: 'hidden', marginTop: spacing.xs },
  fill: { height: '100%', borderRadius: radii.pill },
  tierBody: { gap: spacing.sm },
  module: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  moduleMeta: { alignItems: 'flex-end', gap: 4 },
});
