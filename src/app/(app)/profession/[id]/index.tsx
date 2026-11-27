import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { Icon, type IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { LoadError } from '@/components/LoadError';
import { MilestoneBar } from '@/components/MilestoneBar';
import { Skeleton } from '@/components/Skeleton';
import { Text } from '@/components/Text';
import { useToast } from '@/components/Toast';
import { CurriculumMap } from '@/features/professions/CurriculumMap';
import { useProfession, useProfessionDetail, useResetProfession, useStartProfession } from '@/features/professions/hooks';
import { professionLook } from '@/features/professions/looks';
import {
  barSegments,
  barTotals,
  currentTier,
  describeDuration,
  formatPercent,
  paceEstimate,
  tiersFromDetail,
} from '@/features/professions/progress';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';
import { fonts, layout, palette, radii, spacing, useIsWide, useScreenBackground, useTheme } from '@/theme';

export default function ProfessionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const toast = useToast();
  const today = useToday();
  const overview = useProfession(id, today);
  const detail = useProfessionDetail(id, today);
  const start = useStartProfession();
  const reset = useResetProfession();
  const [confirmReset, setConfirmReset] = useState(false);

  const profession = overview.profession;
  const look = professionLook(profession);
  const tiers = detail.data?.tiers ?? [];
  const segments = barSegments(tiersFromDetail(tiers));
  const totals = barTotals(segments);
  const percent = formatPercent(totals.done);
  const current = currentTier(segments, profession?.next?.tier);
  const placedOut = tiers.reduce((n, t) => n + t.placed_out, 0);
  const enrolled = Boolean(profession?.enrolled);
  const due = profession?.due_today ?? 0;
  const remaining = profession ? Math.max(0, profession.planned_cards - profession.opened - placedOut) : 0;
  const pace =
    profession && enrolled
      ? paceEstimate({ openedLast14: profession.opened_14d, startedAt: profession.started_at, today, remaining })
      : null;

  // Tell screen readers when the main button flips to "Review N due".
  const lastDue = useRef(due);
  useEffect(() => {
    if (enrolled && due > 0 && lastDue.current === 0) {
      AccessibilityInfo.announceForAccessibility(`${due} cards are due. Review them before opening more.`);
    }
    lastDue.current = due;
  }, [due, enrolled]);

  const back = () => (router.canGoBack() ? router.back() : router.replace('/learn'));

  function begin() {
    start.mutate(
      { id, startTier: 0 },
      {
        onSuccess: () => {
          haptics.success();
          router.push({ pathname: '/profession/[id]/open', params: { id } });
        },
        onError: (error) => toast({ tone: 'error', message: friendlyError(error) }),
      },
    );
  }

  function resetProgress() {
    reset.mutate(id, {
      onSuccess: () => {
        setConfirmReset(false);
        toast({ tone: 'info', icon: 'restart', message: `${profession?.name ?? 'This profession'} was reset. Your streak stays.` });
      },
      onError: (error) => {
        setConfirmReset(false);
        toast({ tone: 'error', message: friendlyError(error) });
      },
    });
  }

  if (!profession && (overview.isError || (overview.data && !overview.isFetching))) {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: screenBackground, paddingTop: insets.top }]}>
        {overview.isError ? (
          <LoadError title="Couldn’t load this profession" onRetry={() => void overview.refetch()} retrying={overview.isFetching} />
        ) : (
          <EmptyState icon="school-outline" color={palette.pink} title="Profession not found" message="It may not be available yet.">
            <Button title="Back to Learn" variant="secondary" onPress={() => router.replace('/learn')} />
          </EmptyState>
        )}
      </View>
    );
  }

  let action;
  if (!profession) {
    action = <Skeleton height={58} radius={radii.xl} />;
  } else if (!enrolled) {
    action = (
      <View style={styles.actions}>
        <Button title="Start from the beginning" icon="play" fullWidth loading={start.isPending} onPress={begin} />
        <Button
          title="I already know some of this"
          variant="secondary"
          icon="debug-step-over"
          fullWidth
          onPress={() => router.push({ pathname: '/profession/[id]/placement', params: { id } })}
        />
      </View>
    );
  } else if (due > 0) {
    action = (
      <View style={styles.actions}>
        <Button
          title={`Review ${due} due ${due === 1 ? 'card' : 'cards'}`}
          icon="play"
          fullWidth
          onPress={() => router.push({ pathname: '/review', params: { profession: id } })}
        />
        <Text variant="caption" tone="subtle" align="center">
          Review what’s due, then you can keep opening new cards.
        </Text>
      </View>
    );
  } else if (profession.next) {
    action = (
      <Button
        title="Open next card"
        icon="cards-playing-outline"
        fullWidth
        onPress={() => router.push({ pathname: '/profession/[id]/open', params: { id } })}
      />
    );
  } else {
    action = (
      <View style={[styles.doneNote, { backgroundColor: `${look.color}14`, borderColor: `${look.color}55` }]}>
        <Icon name="party-popper" size={22} color={look.color} />
        <Text variant="small" style={styles.flex}>
          You’ve opened every card released so far. The next tier arrives as soon as it’s written.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.huge }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={look.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.heroInner}>
            <IconButton
              icon="arrow-left"
              accessibilityLabel="Back"
              onPress={back}
              background="rgba(255,255,255,0.2)"
              color="#FFFFFF"
              style={styles.backButton}
            />
            {profession ? (
              <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.heroText}>
                <View style={styles.heroIcon}>
                  <Icon name={look.icon} size={34} color="#FFFFFF" />
                </View>
                <Text variant="label" color="rgba(255,255,255,0.9)">
                  Profession · zero to PhD
                </Text>
                <Text variant="hero" color="#FFFFFF">
                  {profession.name}
                </Text>
                <Text variant="body" color="rgba(255,255,255,0.92)">
                  {profession.tagline}
                </Text>
              </Animated.View>
            ) : (
              <View style={styles.heroText}>
                <Skeleton height={36} width="60%" />
                <Skeleton height={20} width="90%" />
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={[styles.body, { paddingHorizontal: isWide ? spacing.xxxl : spacing.xl }]}>
          <Card accent={look.color}>
            <View style={styles.progressHead}>
              <Text variant="subheading">{enrolled ? `${percent} of the way to PhD` : 'Your road to PhD'}</Text>
              {enrolled && current ? (
                <Text variant="small" tone="muted">
                  {profession?.next ? `Card ${profession.next.rank.toLocaleString()} of ${profession.planned_cards.toLocaleString()} · ` : ''}
                  {current.name}
                </Text>
              ) : (
                <Text variant="small" tone="muted">
                  {profession ? `${profession.planned_cards.toLocaleString()} cards across ${tiers.length || '…'} tiers` : ' '}
                </Text>
              )}
            </View>
            {segments.length ? (
              <MilestoneBar
                segments={segments}
                color={look.color}
                labels
                accessibilityLabel={`${percent} of the way to PhD${current ? `, ${current.name}` : ''}`}
                style={styles.bar}
              />
            ) : (
              <View style={styles.bar}>
                <Skeleton height={14} radius={radii.pill} />
              </View>
            )}
            {enrolled && profession ? (
              <View style={styles.stats}>
                <Stat icon="cards-outline" label="Opened" value={profession.opened} color={look.color} />
                <Stat icon="star-four-points" label="Mastered" value={profession.mastered} color={palette.yellow} />
                <Stat icon="clock-outline" label="Due today" value={due} color={due > 0 ? colors.danger : colors.textSubtle} />
              </View>
            ) : null}
            <View style={styles.legend} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <LegendDot color={look.color} opacity={0.42} label="Opened" />
              <LegendDot color={look.color} opacity={1} label="Mastered" />
              {placedOut > 0 ? <LegendDot color={colors.borderStrong} opacity={1} label="Placed out" hatched /> : null}
            </View>
          </Card>

          <Animated.View entering={FadeIn.duration(250)} style={styles.actionArea}>
            {action}
            {enrolled && profession?.next ? (
              <InfoLine icon="arrow-right-circle-outline" text={`Up next: ${profession.next.module_title}`} />
            ) : null}
            {enrolled && profession && profession.opened_today > 0 ? (
              <InfoLine
                icon="calendar-arrow-right"
                text={`You’ve opened ${profession.opened_today} today, so expect about ${profession.due_tomorrow} ${
                  profession.due_tomorrow === 1 ? 'review' : 'reviews'
                } tomorrow.`}
              />
            ) : null}
            {enrolled ? (
              <InfoLine
                icon="speedometer"
                text={
                  pace?.days
                    ? `At your pace (${pace.perDay >= 10 ? Math.round(pace.perDay) : pace.perDay.toFixed(1)} a day) you’d reach PhD in ${describeDuration(pace.days)}.`
                    : 'Open a few cards a day and a pace estimate shows up here.'
                }
              />
            ) : null}
          </Animated.View>

          <View style={styles.section}>
            <Text variant="heading">The path</Text>
            {detail.isError && !detail.data ? (
              <LoadError title="Couldn’t load the curriculum" onRetry={() => void detail.refetch()} retrying={detail.isFetching} />
            ) : tiers.length ? (
              <CurriculumMap professionId={id} tiers={tiers} color={look.color} currentTier={current?.tier} />
            ) : (
              <Skeleton height={240} radius={radii.xl} />
            )}
          </View>

          {profession ? (
            <View style={styles.section}>
              <Text variant="heading">About</Text>
              <Card>
                <Text variant="body">{profession.description}</Text>
                <View style={[styles.note, { backgroundColor: colors.surfaceSunken }]}>
                  <Icon name="school-outline" size={20} color={look.color} />
                  <Text variant="small" tone="muted" style={styles.flex}>
                    <Text variant="smallStrong">What “PhD level” means here. </Text>
                    By the last card you’ll know what a PhD candidate who has passed the field’s qualifying exams
                    knows, and you’ll be able to read current research. A PhD also requires original research, which
                    no set of cards can give you.
                  </Text>
                </View>
              </Card>
              {enrolled ? (
                <View style={styles.settings}>
                  <Button
                    title="Change where you start"
                    variant="ghost"
                    size="sm"
                    icon="debug-step-over"
                    onPress={() => router.push({ pathname: '/profession/[id]/placement', params: { id } })}
                  />
                  <Button
                    title="Reset this profession"
                    variant="dangerGhost"
                    size="sm"
                    icon="restart"
                    onPress={() => setConfirmReset(true)}
                  />
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmReset}
        title={`Reset ${profession?.name ?? 'this profession'}?`}
        message="Every card you’ve opened here leaves your stack and your place in the path starts over. Your review history and streak stay."
        confirmLabel="Reset"
        icon="restart"
        loading={reset.isPending}
        onConfirm={resetProgress}
        onCancel={() => setConfirmReset(false)}
      />
    </View>
  );
}

function Stat({ icon, label, value, color }: { icon: IconName; label: string; value: number; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surfaceSunken }]}>
      <Icon name={icon} size={18} color={color} />
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 18 }}>{value.toLocaleString()}</Text>
      <Text variant="caption" tone="subtle">
        {label}
      </Text>
    </View>
  );
}

function LegendDot({ color, opacity, label, hatched }: { color: string; opacity: number; label: string; hatched?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color, opacity },
          hatched ? { borderWidth: 2, borderStyle: 'dashed', backgroundColor: 'transparent', borderColor: color } : null,
        ]}
      />
      <Text variant="caption" tone="subtle">
        {label}
      </Text>
    </View>
  );
}

function InfoLine({ icon, text }: { icon: IconName; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoLine}>
      <Icon name={icon} size={18} color={colors.textSubtle} />
      <Text variant="small" tone="muted" style={styles.flex}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  hero: { borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl, paddingBottom: spacing.xxl },
  heroInner: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  backButton: { borderColor: 'rgba(255,255,255,0.3)' },
  heroText: { gap: spacing.sm },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  body: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', gap: spacing.xxl, marginTop: -spacing.lg },
  progressHead: { gap: 2 },
  bar: { marginTop: spacing.lg },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  stat: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.md, borderRadius: radii.md },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 4 },
  actionArea: { gap: spacing.md },
  actions: { gap: spacing.sm },
  doneNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
  },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  section: { gap: spacing.md },
  note: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderRadius: radii.md, marginTop: spacing.md },
  settings: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
