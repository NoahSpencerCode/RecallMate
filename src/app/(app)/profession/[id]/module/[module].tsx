import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { LoadError } from '@/components/LoadError';
import { PressableScale } from '@/components/PressableScale';
import { RichText } from '@/components/rich/RichText';
import { Skeleton } from '@/components/Skeleton';
import { Text } from '@/components/Text';
import type { ModuleCard } from '@/features/professions/api';
import { useModuleCards, useProfession, useProfessionDetail } from '@/features/professions/hooks';
import { kindLabel, professionLook } from '@/features/professions/looks';
import { openLink } from '@/lib/openLink';
import { useToday } from '@/lib/useToday';
import { enterItem, fonts, layout, palette, radii, spacing, useIsWide, useScreenBackground, useTheme } from '@/theme';

/** One module: what it covers, its hands-on projects, and every card with the learner's status. */
export default function ModulePage() {
  const { id, module: slug } = useLocalSearchParams<{ id: string; module: string }>();
  const moduleId = `${id}/${slug}`;
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const today = useToday();
  const { profession } = useProfession(id, today);
  const detail = useProfessionDetail(id, today);
  const cards = useModuleCards(moduleId);

  const look = professionLook(profession);
  const tier = detail.data?.tiers.find((t) => t.modules.some((m) => m.id === moduleId));
  const module = tier?.modules.find((m) => m.id === moduleId);
  const list = cards.data ?? [];
  const opened = list.filter((c) => c.stage != null).length;

  const back = () =>
    router.canGoBack() ? router.back() : router.replace({ pathname: '/profession/[id]', params: { id } });

  return (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.huge, paddingHorizontal: isWide ? spacing.xxxl : spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={back} />

        <View style={styles.header}>
          <Text variant="label" color={look.color}>
            {profession?.name ?? ''}
            {tier ? ` · ${tier.name}` : ''}
          </Text>
          {module ? (
            <>
              <Text variant="title">{module.title}</Text>
              <Text variant="body" tone="muted">
                {module.summary}
              </Text>
            </>
          ) : (
            <Skeleton height={34} width="70%" />
          )}
        </View>

        {module ? (
          <Card accent={look.color}>
            <Text variant="subheading">
              {opened} of {module.released} cards opened · {module.mastered} mastered
            </Text>
            <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
              <View
                style={[
                  styles.fill,
                  { backgroundColor: look.color, width: `${Math.min(100, ((opened + module.placed_out) / Math.max(1, module.released)) * 100)}%` },
                ]}
              />
            </View>
            {module.refs.length ? (
              <Text variant="caption" tone="subtle">
                Follows: {module.refs.join(' · ')}
              </Text>
            ) : null}
          </Card>
        ) : null}

        {module?.practice.length ? (
          <View style={styles.section}>
            <Text variant="heading">Hands-on projects</Text>
            <Text variant="small" tone="muted">
              Cards build the knowledge; these build the skill. Try them alongside this module.
            </Text>
            {module.practice.map((p) => (
              <PressableScale
                key={p.url}
                onPress={() => openLink(p.url)}
                scaleTo={0.98}
                accessibilityRole="link"
                accessibilityLabel={`${p.title}, opens in a new tab`}
                style={[styles.practice, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon name="hammer-wrench" size={20} color={look.color} />
                <Text variant="bodyStrong" style={styles.flex}>
                  {p.title}
                </Text>
                <Icon name="open-in-new" size={18} color={colors.textSubtle} />
              </PressableScale>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text variant="heading">Cards</Text>
          {cards.isError && !cards.data ? (
            <LoadError title="Couldn’t load the cards" onRetry={() => void cards.refetch()} retrying={cards.isFetching} />
          ) : cards.isPending ? (
            <Skeleton height={200} radius={radii.lg} />
          ) : (
            list.map((card, index) => (
              <Animated.View key={card.id} entering={enterItem(index, 60)}>
                <CardRow card={card} index={index} color={look.color} today={today} />
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function CardRow({ card, index, color, today }: { card: ModuleCard; index: number; color: string; today: string }) {
  const { colors } = useTheme();
  const status: { icon: IconName; tint: string; label: string } =
    card.stage == null
      ? { icon: 'lock-outline', tint: colors.textSubtle, label: 'Not opened yet' }
      : card.stage >= 5
        ? { icon: 'star-four-points', tint: palette.yellow, label: 'Mastered' }
        : card.due_on && card.due_on <= today
          ? { icon: 'clock-outline', tint: colors.danger, label: 'Due' }
          : { icon: 'check-circle-outline', tint: color, label: 'In your stack' };

  return (
    <View
      accessible
      accessibilityLabel={`Card ${index + 1}, ${kindLabel(card.kind)}. ${status.label}.`}
      style={[styles.cardRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.number, { backgroundColor: `${color}1F` }]}>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 12 }} color={color}>
          {index + 1}
        </Text>
      </View>
      <View style={styles.flex}>
        <Text variant="caption" tone="subtle">
          {kindLabel(card.kind)}
          {card.checkpoint ? ' · checkpoint' : ''}
        </Text>
        <RichText variant="smallStrong" numberOfLines={2} inline>
          {card.title}
        </RichText>
      </View>
      <Icon name={status.icon} size={20} color={status.tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', gap: spacing.xl },
  header: { gap: spacing.sm },
  track: { height: 10, borderRadius: radii.pill, overflow: 'hidden', marginVertical: spacing.md },
  fill: { height: '100%', borderRadius: radii.pill },
  section: { gap: spacing.sm },
  practice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  number: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
