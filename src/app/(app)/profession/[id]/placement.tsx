import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GradientBlobs } from '@/components/GradientBlobs';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { LoadError } from '@/components/LoadError';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import { useToast } from '@/components/Toast';
import type { CheckpointCard } from '@/features/professions/api';
import { useCheckpointCards, useProfession, useProfessionDetail, useStartProfession } from '@/features/professions/hooks';
import { kindLabel, professionLook } from '@/features/professions/looks';
import { buildPlacementPlan, passesTier } from '@/features/professions/placement';
import { CardBack, CardFront } from '@/features/review/CardFace';
import { FlipCard } from '@/features/review/FlipCard';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';
import { fonts, layout, radii, spacing, useScreenBackground, useTheme } from '@/theme';

type Check = { stage: number; card: number; knew: number };

/** A fresh shuffle for each check. Only ever called from an event handler. */
function newSeed() {
  return Math.random();
}

/**
 * Choose where to start. Skipping tiers takes a short self-check: flip 10 of
 * each skipped tier's checkpoint cards and know at least 8.
 */
export default function Placement() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const today = useToday();
  const { profession } = useProfession(id, today);
  const detail = useProfessionDetail(id, today);
  const start = useStartProfession();

  const [target, setTarget] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);
  const [check, setCheck] = useState<Check>({ stage: 0, card: 0, knew: 0 });
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const checkpoints = useCheckpointCards(id, target ?? 0);

  const look = professionLook(profession);
  const tiers = detail.data?.tiers ?? [];
  const enrolled = Boolean(profession?.enrolled);
  const currentStartTier = Math.floor((detail.data?.start_position ?? 0) / 1_000_000);
  const plan = useMemo(
    () => (target != null && checkpoints.data ? buildPlacementPlan<CheckpointCard>(checkpoints.data, target, seed) : null),
    [checkpoints.data, target, seed],
  );
  // Nothing to check (no checkpoint cards below the target): the choice stands.
  const outcome = result ?? (plan && plan.length === 0 ? target : null);

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/profession/[id]', params: { id } });
  }

  function choose(tier: number) {
    haptics.select();
    // Starting earlier never needs a check.
    if (tier === 0 || (enrolled && tier <= currentStartTier)) {
      commit(tier);
      return;
    }
    setSeed(newSeed());
    setTarget(tier);
    setCheck({ stage: 0, card: 0, knew: 0 });
    setFlipped(false);
    setResult(null);
  }

  function answer(knew: boolean) {
    if (!plan) return;
    if (knew) haptics.success();
    else haptics.tap();
    const stage = plan[check.stage];
    const knewSoFar = check.knew + (knew ? 1 : 0);
    setFlipped(false);
    if (check.card + 1 < stage.cards.length) {
      setCheck({ stage: check.stage, card: check.card + 1, knew: knewSoFar });
    } else if (!passesTier(knewSoFar, stage.cards.length)) {
      setResult(stage.tier);
    } else if (check.stage + 1 < plan.length) {
      setCheck({ stage: check.stage + 1, card: 0, knew: 0 });
    } else {
      setResult(target);
    }
  }

  function commit(tier: number) {
    start.mutate(
      { id, startTier: tier },
      {
        onSuccess: () => {
          haptics.success();
          const tierName = tiers.find((t) => t.tier === tier)?.name ?? 'the beginning';
          if (enrolled) {
            toast({ tone: 'success', message: `You now start at ${tierName}.` });
            close();
          } else {
            router.replace({ pathname: '/profession/[id]/open', params: { id } });
          }
        },
        onError: (error) => toast({ tone: 'error', message: friendlyError(error) }),
      },
    );
  }

  let content;
  if (detail.isError && !detail.data) {
    content = <LoadError title="Couldn’t load the path" onRetry={() => void detail.refetch()} retrying={detail.isFetching} />;
  } else if (!detail.data) {
    content = <ActivityIndicator color={look.color} size="large" style={styles.center} />;
  } else if (outcome != null) {
    const tier = tiers.find((t) => t.tier === outcome);
    const skipped = tiers.filter((t) => t.tier < outcome).reduce((n, t) => n + t.released, 0);
    content = (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.result}>
          <View style={[styles.resultIcon, { backgroundColor: `${look.color}1F` }]}>
            <Icon name={outcome === target ? 'trophy' : 'flag-checkered'} size={40} color={look.color} />
          </View>
          <Text variant="title" align="center">
            {outcome === 0 ? 'Start from the beginning' : `Start at ${tier?.name ?? 'this tier'}`}
          </Text>
          <Text variant="body" tone="muted" align="center">
            {outcome === 0
              ? 'The check found gaps in the very first tier, so starting from the beginning will serve you best.'
              : outcome === target
                ? `You passed every check. You’ll skip ${skipped.toLocaleString()} cards you already know. You can always go back and learn them later.`
                : `You know the earlier material, but ${tier?.name ?? 'this tier'} had gaps, so you’ll start there and skip ${skipped.toLocaleString()} cards.`}
          </Text>
          <View style={styles.resultActions}>
            <Button title="Start here" icon="play" fullWidth loading={start.isPending} onPress={() => commit(outcome)} />
            <Button title="Choose again" variant="secondary" fullWidth onPress={() => setTarget(null)} />
          </View>
        </Animated.View>
      </ScrollView>
    );
  } else if (target != null) {
    if (checkpoints.isError) {
      content = (
        <LoadError title="Couldn’t load the check" onRetry={() => void checkpoints.refetch()} retrying={checkpoints.isFetching} />
      );
    } else if (!plan || plan.length === 0) {
      content = <ActivityIndicator color={look.color} size="large" style={styles.center} />;
    } else {
      const stage = plan[check.stage];
      const card = stage.cards[check.card];
      const tierName = tiers.find((t) => t.tier === stage.tier)?.name ?? '';
      const decoration = { look, label: card.module_title ?? tierName, topic: card.module_title, badge: kindLabel(card.kind) };
      content = (
        <>
          <View style={styles.checkHead}>
            <Text variant="label" color={look.color}>
              Check {check.stage + 1} of {plan.length} · {tierName}
            </Text>
            <Text variant="caption" tone="subtle">
              Card {check.card + 1} of {stage.cards.length}. Know at least {Math.ceil(stage.cards.length * 0.8)} to skip this tier.
            </Text>
          </View>
          <ScrollView style={styles.flex} contentContainerStyle={styles.cardScroll} showsVerticalScrollIndicator={false}>
            <FlipCard
              cardKey={card.id}
              flipped={flipped}
              shakeKey={0}
              popKey={0}
              front={<CardFront card={card} decoration={decoration} typed={false} hint="Answer it in your head, then flip it." />}
              back={<CardBack card={card} decoration={decoration} outcome="revealed" typed={Boolean(card.answer)} />}
            />
          </ScrollView>
          <View style={[styles.dock, { paddingBottom: insets.bottom + spacing.lg }]}>
            {!flipped ? (
              <Button title="Show answer" icon="rotate-3d-variant" fullWidth onPress={() => setFlipped(true)} />
            ) : (
              <Animated.View entering={FadeIn.duration(200)} style={styles.row}>
                <Button title="I didn’t know" variant="secondary" icon="close" onPress={() => answer(false)} style={styles.flex} fullWidth />
                <Button title="I knew it" variant="success" icon="check-bold" onPress={() => answer(true)} style={styles.flex} fullWidth />
              </Animated.View>
            )}
          </View>
        </>
      );
    }
  } else {
    content = (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.intro}>
          <Text variant="title">Where should you start?</Text>
          <Text variant="body" tone="muted">
            Pick the level you think you’ve reached. To skip a tier you’ll flip 10 of its key cards and need to know 8.
            Answer honestly: skipped cards never reach your stack.
          </Text>
        </Animated.View>
        <View style={styles.options}>
          {tiers.map((tier, index) => {
            const available = tier.released > 0;
            const current = enrolled && tier.tier === currentStartTier;
            return (
              <PressableScale
                key={tier.tier}
                disabled={!available || start.isPending}
                onPress={() => choose(tier.tier)}
                scaleTo={0.98}
                accessibilityRole="button"
                accessibilityLabel={`${index === 0 ? 'From the beginning' : `Start at ${tier.name}`}${available ? '' : ', coming soon'}`}
                style={[
                  styles.option,
                  {
                    backgroundColor: colors.surface,
                    borderColor: current ? look.color : colors.border,
                    opacity: available ? 1 : 0.5,
                  },
                ]}>
                <View style={[styles.optionNumber, { backgroundColor: `${look.color}1F` }]}>
                  <Text style={{ fontFamily: fonts.extrabold, fontSize: 14 }} color={look.color}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{index === 0 ? `From the beginning: ${tier.name}` : tier.name}</Text>
                  <Text variant="caption" tone="subtle" numberOfLines={3}>
                    {index === 0
                      ? 'Start with the basics.'
                      : `Skip what comes before: you already ${tiers[index - 1].summary.charAt(0).toLowerCase()}${tiers[index - 1].summary.slice(1)}`}
                  </Text>
                </View>
                {current ? (
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12 }} color={look.color}>
                    Current
                  </Text>
                ) : (
                  <Icon name="chevron-right" size={20} color={colors.textSubtle} />
                )}
              </PressableScale>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: screenBackground, paddingTop: insets.top + spacing.sm }]}>
      <GradientBlobs />
      <View style={styles.topBar}>
        <IconButton icon="close" accessibilityLabel="Close" onPress={close} />
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 15 }} color={look.color} numberOfLines={1}>
          {profession?.name ?? ''}
        </Text>
      </View>
      <View style={styles.stage}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  center: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    maxWidth: layout.maxReadingWidth + spacing.xl * 2,
    alignSelf: 'center',
  },
  stage: { flex: 1, width: '100%', maxWidth: layout.maxReadingWidth + spacing.xl * 2, alignSelf: 'center' },
  scroll: { padding: spacing.xl, gap: spacing.xl },
  intro: { gap: spacing.sm },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  optionNumber: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  checkHead: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: 2 },
  cardScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  dock: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md },
  result: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.xxl },
  resultIcon: { width: 88, height: 88, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  resultActions: { gap: spacing.sm, alignSelf: 'stretch' },
});
