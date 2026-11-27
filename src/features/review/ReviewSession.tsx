import { router, type Href } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Confetti } from '@/components/Confetti';
import { EmptyState } from '@/components/EmptyState';
import { GradientBlobs } from '@/components/GradientBlobs';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { LoadError } from '@/components/LoadError';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { neural } from '@/features/neural/neuralBus';
import { checkAnswer } from '@/features/review/answerMatch';
import { describeGap } from '@/lib/dates';
import { friendlyError, isGoneError, isNotDueError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { nextGapDays } from '@/lib/schedule';
import { useKeyboardInset } from '@/lib/useKeyboardInset';
import { fonts, layout, palette, radii, spacing, springs, useScreenBackground, useTheme } from '@/theme';

import { CardBack, CardFront } from './CardFace';
import { FlipCard } from './FlipCard';
import { SessionComplete } from './SessionComplete';
import { attemptsFor, requeue, withoutLast } from './session';
import type { CardDecoration, FailureHandler, ReviewCard, ReviewGrade, SessionAction } from './types';

const MAX_TRIES = 3;

type Outcome = null | 'correct' | 'failed' | 'revealed';

// Keyboard tips only help with a mouse and keyboard, not on touch phones.
const showKeyboardTips =
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches);

/** Leaves the review: back where it was opened from, or to `fallback` after a deep link. */
export function closeReview(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export type ReviewSessionProps<C extends ReviewCard> = {
  /** The cards to review. Captured once, the first time it isn't null, so the order never shifts. */
  initialQueue: C[] | null;
  isError: boolean;
  retrying: boolean;
  onRetry: () => void;
  /** The latest copy of a card, so an answer fixed on another device applies mid-session. */
  latest: (id: string) => C | undefined;
  decorate: (card: C) => CardDecoration;
  /** Saves a grade. Failures come back through `failuresRef`. */
  save: (grade: ReviewGrade) => void;
  /** The session puts its failure handler here; the source's save hook calls it. */
  failuresRef: RefObject<FailureHandler | null>;
  /** Where "close" goes when there's no screen to go back to. */
  fallbackHref: Href;
  empty: { message: string; actionTitle: string };
  messages: { gone: string; notDue: string };
  completeActions: SessionAction[];
};

/** The review screen itself: a queue of cards, flipped or typed, graded one at a time. */
export function ReviewSession<C extends ReviewCard>({
  initialQueue,
  isError,
  retrying,
  onRetry,
  latest,
  decorate,
  save,
  failuresRef,
  fallbackHref,
  empty,
  messages,
  completeActions,
}: ReviewSessionProps<C>) {
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [queue, setQueue] = useState<C[] | null>(null);
  if (queue === null && initialQueue) setQueue(initialQueue);

  const [index, setIndex] = useState(0);
  // Counted as soon as they're graded; a review that fails to save is taken back out.
  const [results, setResults] = useState<{ id: string; passed: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [lastTry, setLastTry] = useState('');
  const [misses, setMisses] = useState(0);
  const [overridden, setOverridden] = useState(false);
  const [closeUsed, setCloseUsed] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'close' | 'wrong' | 'empty'; text: string } | null>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [burst, setBurst] = useState(0);
  const cardScroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const keyboardInset = useKeyboardInset();

  useEffect(() => {
    failuresRef.current = (failed, error) => {
      setResults((list) => withoutLast(list, failed.id));
      if (isGoneError(error)) {
        toast({ tone: 'info', icon: 'card-remove-outline', message: messages.gone });
      } else if (isNotDueError(error)) {
        toast({ tone: 'info', message: messages.notDue });
      } else {
        setQueue((list) => requeue(list, failed.id));
        toast({ tone: 'error', message: `A review didn’t save, so that card is back in your queue. ${friendlyError(error)}` });
      }
    };
  });

  const snapshot = queue?.[index];
  const card = (snapshot && latest(snapshot.id)) || snapshot;
  const typed = Boolean(card?.answer);
  const total = queue?.length ?? 0;
  const decoration = card ? decorate(card) : null;

  const bar = useSharedValue(0);
  useEffect(() => {
    bar.set(withSpring(total ? index / total : 0, springs.gentle));
  }, [bar, index, total]);
  const barStyle = useAnimatedStyle(() => ({ width: `${bar.get() * 100}%` }));

  useEffect(() => {
    cardScroll.current?.scrollTo({ y: 0, animated: false });
  }, [index, outcome]);

  const close = () => closeReview(fallbackHref);

  function check() {
    if (!card || outcome) return;
    if (!input.trim()) {
      setFeedback({ tone: 'empty', text: 'Type an answer first, or tap “I don’t know”.' });
      return;
    }
    const verdict = checkAnswer(input, card.answer, card.accepted_answers);
    if (verdict === 'correct') {
      haptics.success();
      neural.burst({ strength: 1 });
      setFeedback(null);
      setOutcome('correct');
      setPopKey((k) => k + 1);
      setBurst((b) => b + 1);
      return;
    }
    setShakeKey((k) => k + 1);
    setLastTry(input.trim());
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
    save({ id: card.id, passed, attempts: attemptsFor({ typed, misses, passed, overridden }) });
    setResults((r) => [...r, { id: card.id, passed }]);
    setIndex((i) => i + 1);
    setInput('');
    setLastTry('');
    setMisses(0);
    setOverridden(false);
    setCloseUsed(false);
    setFeedback(null);
    setOutcome(null);
  }

  // Desktop shortcuts: Enter/Space to flip or continue, 1/2 to grade.
  useEffect(() => {
    if (Platform.OS !== 'web' || !card) return;
    const onKey = (event: KeyboardEvent) => {
      // A held key repeats: without this, holding Enter would flip and pass every card in turn.
      if (event.repeat) return;
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
        {isError ? <LoadError onRetry={onRetry} retrying={retrying} /> : <ActivityIndicator color={colors.primary} size="large" />}
      </View>
    );
  } else if (total === 0) {
    content = (
      <View style={styles.center}>
        <EmptyState icon="check-decagram" color={palette.mint} title="Nothing due right now" message={empty.message}>
          <Button title={empty.actionTitle} onPress={close} />
        </EmptyState>
      </View>
    );
  } else if (!card || !decoration) {
    content = (
      <SessionComplete
        reviewed={results.length}
        correct={results.filter((r) => r.passed).length}
        actions={completeActions}
      />
    );
  } else {
    const passedPreview = outcome === 'correct';
    const front = <CardFront card={card} decoration={decoration} typed={typed} />;
    const back = (
      <CardBack
        card={card}
        decoration={decoration}
        outcome={outcome ?? 'revealed'}
        typed={typed}
        lastTry={typed && lastTry && (outcome === 'failed' || overridden) ? lastTry : undefined}
        nextLine={
          typed && outcome
            ? `Next review ${describeGap(nextGapDays(card.stage, passedPreview))}${outcome === 'failed' ? ' (schedule reset)' : ''}`
            : null
        }
      />
    );

    // The card scrolls on its own, so a long explanation never pushes the buttons off screen.
    content = (
      <>
        <ScrollView
          ref={cardScroll}
          style={styles.flex}
          contentContainerStyle={styles.cardScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <FlipCard cardKey={card.id} flipped={outcome !== null} shakeKey={shakeKey} popKey={popKey} front={front} back={back} />
        </ScrollView>

        <View style={[styles.controls, styles.dock, { paddingBottom: (keyboardInset || insets.bottom) + spacing.lg }]}>
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
                // react-native-web ignores submitBehavior and would drop the keyboard after every try.
                blurOnSubmit={false}
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
              {outcome === 'failed' && lastTry ? (
                <Button
                  title="I was right, count it"
                  variant="ghost"
                  size="sm"
                  icon="check-circle-outline"
                  onPress={() => {
                    haptics.success();
                    setOverridden(true);
                    setOutcome('correct');
                  }}
                  style={styles.override}
                />
              ) : null}
            </Animated.View>
          ) : null}

          {!typed && !outcome ? (
            <Animated.View key={`flip-${card.id}`} entering={FadeInDown.springify().damping(16)}>
              <Button title="Show answer" icon="rotate-3d-variant" fullWidth onPress={() => setOutcome('revealed')} />
              {showKeyboardTips ? (
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
                    neural.burst({ strength: 0.7 });
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
      </>
    );
  }

  const inSession = Boolean(card);

  return (
    <View style={[styles.root, { backgroundColor: screenBackground, paddingTop: insets.top + spacing.sm }]}>
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
  cardScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  dock: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  controls: { gap: spacing.md },
  answerArea: { gap: spacing.md },
  feedback: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  tries: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  tryDot: { width: 10, height: 10, borderRadius: 5 },
  row: { flexDirection: 'row', gap: spacing.md },
  gradeArea: { gap: spacing.sm },
  hint: { marginTop: spacing.sm },
  override: { alignSelf: 'center', marginTop: spacing.xs },
});
