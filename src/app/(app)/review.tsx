import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Confetti } from '@/components/Confetti';
import { EmptyState } from '@/components/EmptyState';
import { GradientBlobs } from '@/components/GradientBlobs';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import type { Memory } from '@/features/memories/api';
import { useMemories, useReviewMemory } from '@/features/memories/hooks';
import { categoryLook } from '@/features/packs/categories';
import { usePackIndex } from '@/features/packs/hooks';
import { checkAnswer } from '@/features/review/answerMatch';
import { prettyMath } from '@/features/review/prettyMath';
import { FlipCard } from '@/features/review/FlipCard';
import { SessionComplete } from '@/features/review/SessionComplete';
import { describeGap } from '@/lib/dates';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { nextGapDays } from '@/lib/schedule';
import { useToday } from '@/lib/useToday';
import { fonts, layout, palette, radii, spacing, springs, useTheme } from '@/theme';

const MAX_TRIES = 3;

type Outcome = null | 'correct' | 'failed' | 'revealed';

export default function Review() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const today = useToday();
  const toast = useToast();
  const memoriesQuery = useMemories();
  const packIndex = usePackIndex();
  const saveReview = useReviewMemory();

  // Snapshot the due cards once so the order doesn't shift as reviews save.
  const [queue, setQueue] = useState<Memory[] | null>(null);
  if (queue === null && memoriesQuery.data) {
    setQueue(memoriesQuery.data.filter((m) => m.due_on <= today));
  }

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [input, setInput] = useState('');
  const [misses, setMisses] = useState(0);
  const [closeUsed, setCloseUsed] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'close' | 'wrong' | 'empty'; text: string } | null>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [burst, setBurst] = useState(0);

  const card = queue?.[index];
  const typed = Boolean(card?.answer);
  const total = queue?.length ?? 0;
  const pack = card?.pack_id ? packIndex.get(card.pack_id) : undefined;
  const look = categoryLook(pack?.categoryId);

  const bar = useSharedValue(0);
  useEffect(() => {
    bar.set(withSpring(total ? index / total : 0, springs.gentle));
  }, [bar, index, total]);
  const barStyle = useAnimatedStyle(() => ({ width: `${bar.get() * 100}%` }));

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  function check() {
    if (!card || outcome) return;
    if (!input.trim()) {
      setFeedback({ tone: 'empty', text: 'Type an answer first, or tap “I don’t know”.' });
      return;
    }
    const verdict = checkAnswer(input, card.answer, card.accepted_answers);
    if (verdict === 'correct') {
      haptics.success();
      setFeedback(null);
      setOutcome('correct');
      setPopKey((k) => k + 1);
      setBurst((b) => b + 1);
      return;
    }
    setShakeKey((k) => k + 1);
    if (verdict === 'close' && !closeUsed) {
      haptics.tap();
      setCloseUsed(true);
      setFeedback({ tone: 'close', text: 'So close! Check your spelling — this one’s free.' });
      return;
    }
    haptics.error();
    const nextMisses = misses + 1;
    setMisses(nextMisses);
    if (nextMisses >= MAX_TRIES) {
      setFeedback(null);
      setOutcome('failed');
    } else {
      const left = MAX_TRIES - nextMisses;
      setFeedback({ tone: 'wrong', text: `Not quite. ${left} ${left === 1 ? 'try' : 'tries'} left.` });
    }
  }

  function finishCard(passed: boolean) {
    if (!card) return;
    saveReview.mutate(
      { id: card.id, passed, today, attempts: typed ? misses + (passed ? 1 : 0) : 1 },
      { onError: (error) => toast({ tone: 'error', message: `A review didn’t save: ${friendlyError(error)}` }) },
    );
    setResults((r) => [...r, passed]);
    setIndex((i) => i + 1);
    setInput('');
    setMisses(0);
    setCloseUsed(false);
    setFeedback(null);
    setOutcome(null);
  }

  // Desktop shortcuts: Enter/Space to flip or continue, 1/2 to grade.
  useEffect(() => {
    if (Platform.OS !== 'web' || !card) return;
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (typed) {
        if (outcome && event.key === 'Enter') {
          event.preventDefault();
          finishCard(outcome === 'correct');
        }
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!outcome && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        setOutcome('revealed');
      } else if (outcome === 'revealed' && (event.key === '1' || event.key === '2' || event.key === 'Enter')) {
        event.preventDefault();
        finishCard(event.key !== '1');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  let content;
  if (!queue) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  } else if (total === 0) {
    content = (
      <View style={styles.center}>
        <EmptyState
          icon="check-decagram"
          color={palette.mint}
          title="Nothing due right now"
          message="You’re all caught up. New reviews unlock as cards come due.">
          <Button title="Back to Today" onPress={close} />
        </EmptyState>
      </View>
    );
  } else if (!card) {
    content = <SessionComplete reviewed={results.length} correct={results.filter(Boolean).length} />;
  } else {
    const passedPreview = outcome === 'correct';
    const front = (
      <View style={[styles.face, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: look.color }]}>
        <View style={styles.faceHeader}>
          <CategoryIcon look={look} size={30} />
          <Text variant="label" color={look.color} numberOfLines={1} style={styles.flex}>
            {pack ? pack.title : 'Your card'}
          </Text>
          {typed ? (
            <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
              <Icon name="keyboard-outline" size={14} color={colors.primary} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 11 }} color={colors.primary}>
                Type it
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant={card.title.length > 90 ? 'heading' : 'title'} style={styles.prompt}>
          {card.title}
        </Text>
        <Text variant="small" tone="subtle">
          {typed ? 'Type your answer below.' : 'Answer it in your head, then flip the card.'}
        </Text>
      </View>
    );

    const banner =
      outcome === 'correct'
        ? { icon: 'check-circle' as const, text: 'Correct!', fg: colors.success, bg: colors.successSoft }
        : outcome === 'failed'
          ? { icon: 'close-circle' as const, text: 'The answer was', fg: colors.danger, bg: colors.dangerSoft }
          : { icon: 'lightbulb-on' as const, text: 'Answer', fg: colors.primary, bg: colors.primarySoft };

    const back = (
      <View style={[styles.face, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: banner.fg }]}>
        <View style={[styles.banner, { backgroundColor: banner.bg }]}>
          <Icon name={banner.icon} size={20} color={banner.fg} />
          <Text variant="smallStrong" color={banner.fg}>
            {banner.text}
          </Text>
        </View>
        <Text variant="small" tone="subtle" numberOfLines={3}>
          {card.title}
        </Text>
        {typed ? (
          <Text variant="title" color={outcome === 'failed' ? colors.danger : colors.text}>
            {prettyMath(card.answer ?? '')}
          </Text>
        ) : null}
        {card.body ? (
          <Text variant="body" style={styles.body}>
            {card.body}
          </Text>
        ) : null}
        {typed && outcome ? (
          <View style={styles.nextLine}>
            <Icon name="calendar-arrow-right" size={16} color={colors.textSubtle} />
            <Text variant="caption" tone="subtle">
              Next review {describeGap(nextGapDays(card.stage, passedPreview))}
              {outcome === 'failed' ? ' (schedule reset)' : ''}
            </Text>
          </View>
        ) : null}
      </View>
    );

    content = (
      <ScrollView
        contentContainerStyle={[styles.sessionScroll, { paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <FlipCard
          cardKey={card.id}
          flipped={outcome !== null}
          shakeKey={shakeKey}
          popKey={popKey}
          front={front}
          back={back}
        />

        <View style={styles.controls}>
          {typed && !outcome ? (
            <Animated.View key={`answer-${card.id}`} entering={FadeInDown.springify().damping(16)} style={styles.answerArea}>
              <TextField
                placeholder="Your answer"
                value={input}
                onChangeText={(text) => {
                  setInput(text);
                  if (feedback?.tone === 'empty') setFeedback(null);
                }}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                returnKeyType="done"
                submitBehavior="submit"
                onSubmitEditing={check}
                accessibilityLabel="Your answer"
              />
              {feedback ? (
                <Animated.View key={feedback.text} entering={FadeIn.duration(150)} style={styles.feedback}>
                  <Icon
                    name={feedback.tone === 'close' ? 'emoticon-wink-outline' : 'alert-circle-outline'}
                    size={18}
                    color={feedback.tone === 'close' ? palette.orange : colors.danger}
                  />
                  <Text variant="smallStrong" color={feedback.tone === 'close' ? palette.orange : colors.danger}>
                    {feedback.text}
                  </Text>
                </Animated.View>
              ) : (
                <View style={styles.tries}>
                  {Array.from({ length: MAX_TRIES }, (_, i) => (
                    <View
                      key={i}
                      style={[styles.tryDot, { backgroundColor: i < misses ? colors.danger : colors.borderStrong }]}
                    />
                  ))}
                  <Text variant="caption" tone="subtle">
                    {MAX_TRIES - misses} {MAX_TRIES - misses === 1 ? 'try' : 'tries'}
                  </Text>
                </View>
              )}
              <View style={styles.row}>
                <Button
                  title="I don’t know"
                  variant="secondary"
                  size="md"
                  onPress={() => {
                    haptics.tap();
                    setFeedback(null);
                    setOutcome('failed');
                  }}
                  style={styles.flex}
                  fullWidth
                />
                <Button title="Check" icon="check" size="md" onPress={check} style={styles.flex} fullWidth />
              </View>
            </Animated.View>
          ) : null}

          {typed && outcome ? (
            <Animated.View entering={FadeInDown.delay(250).springify()}>
              <Button
                title={index + 1 === total ? 'Finish' : 'Next card'}
                variant={outcome === 'correct' ? 'success' : 'primary'}
                iconRight="arrow-right"
                fullWidth
                onPress={() => finishCard(outcome === 'correct')}
              />
            </Animated.View>
          ) : null}

          {!typed && !outcome ? (
            <Animated.View key={`flip-${card.id}`} entering={FadeInDown.springify().damping(16)}>
              <Button title="Show answer" icon="rotate-3d-variant" fullWidth onPress={() => setOutcome('revealed')} />
              {Platform.OS === 'web' ? (
                <Text variant="caption" tone="subtle" align="center" style={styles.hint}>
                  Tip: press Space to flip, then 1 or 2
                </Text>
              ) : null}
            </Animated.View>
          ) : null}

          {!typed && outcome === 'revealed' ? (
            <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.gradeArea}>
              <View style={styles.row}>
              <Button
                title="Still learning"
                variant="secondary"
                icon="refresh"
                onPress={() => {
                  haptics.tap();
                  finishCard(false);
                }}
                style={styles.flex}
                fullWidth
              />
              <Button
                title="Got it"
                variant="success"
                icon="check-bold"
                onPress={() => {
                  haptics.success();
                  setBurst((b) => b + 1);
                  finishCard(true);
                }}
                style={styles.flex}
                fullWidth
              />
              </View>
              <Text variant="caption" tone="subtle" align="center">
                Got it: next review {describeGap(nextGapDays(card.stage, true))}. Still learning: tomorrow.
              </Text>
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    );
  }

  const inSession = Boolean(card);

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top + spacing.sm }]}>
      <GradientBlobs />
      <View style={styles.topBar}>
        <IconButton icon="close" accessibilityLabel="End review" onPress={close} />
        {inSession ? (
          <>
            <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
              <Animated.View style={[styles.fill, { backgroundColor: colors.primary }, barStyle]} />
            </View>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 14 }} tone="muted">
              {index + 1}/{total}
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.stage}>{content}</View>
      {burst > 0 ? <Confetti key={burst} originY={0.32} count={26} spread={Math.PI * 0.7} duration={1200} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    maxWidth: layout.maxReadingWidth + spacing.xl * 2,
    alignSelf: 'center',
  },
  track: { flex: 1, height: 12, borderRadius: radii.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
  stage: { flex: 1, width: '100%', maxWidth: layout.maxReadingWidth + spacing.xl * 2, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sessionScroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  face: {
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderBottomWidth: 6,
    padding: spacing.xxl,
    gap: spacing.md,
    minHeight: 260,
  },
  faceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill },
  prompt: { marginTop: spacing.sm },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill },
  body: { marginTop: spacing.xs },
  nextLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  controls: { gap: spacing.md },
  answerArea: { gap: spacing.md },
  feedback: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  tries: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  tryDot: { width: 10, height: 10, borderRadius: 5 },
  row: { flexDirection: 'row', gap: spacing.md },
  gradeArea: { gap: spacing.sm },
  hint: { marginTop: spacing.sm },
});
