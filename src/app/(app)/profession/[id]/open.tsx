import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { AccessibilityInfo, ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { GradientBlobs } from '@/components/GradientBlobs';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Text } from '@/components/Text';
import type { ProfessionCard } from '@/features/professions/api';
import { useOpenNextCard, useProfession } from '@/features/professions/hooks';
import { kindLabel, professionLook } from '@/features/professions/looks';
import { ReportCardDialog } from '@/features/professions/ReportCardDialog';
import { neural } from '@/features/neural/neuralBus';
import { CardBack, CardFront } from '@/features/review/CardFace';
import { FlipCard } from '@/features/review/FlipCard';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';
import { fonts, layout, palette, spacing, useScreenBackground, useTheme } from '@/theme';

type State =
  | { kind: 'opening' }
  | { kind: 'card'; card: ProfessionCard; openedToday: number }
  | { kind: 'reviews_due'; due: number }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

const showKeyboardTips =
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches);

/** Opens new cards into the stack, one at a time, for as long as the learner likes. */
export default function OpenNextCard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const today = useToday();
  const queryClient = useQueryClient();
  const { profession } = useProfession(id, today);
  const openNext = useOpenNextCard();
  const [state, setState] = useState<State>({ kind: 'opening' });
  const [flipped, setFlipped] = useState(false);
  const [reporting, setReporting] = useState<string | null>(null);
  const cardScroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const started = useRef(false);

  const look = professionLook(profession);
  const name = profession?.name ?? 'this profession';
  const home = { pathname: '/profession/[id]', params: { id } } as const;

  function open() {
    if (openNext.isPending) return;
    openNext.mutate(id, {
      onSuccess: (result) => {
        if (result.status === 'opened') {
          haptics.tap();
          neural.burst({ strength: 0.5 });
          setFlipped(false);
          setState({ kind: 'card', card: result.card, openedToday: result.opened_today });
        } else if (result.status === 'reviews_due') {
          setState({ kind: 'reviews_due', due: result.due });
          AccessibilityInfo.announceForAccessibility(`${result.due} cards are due. Review them before opening more.`);
        } else {
          setState({ kind: 'done' });
        }
      },
      onError: (error) => setState({ kind: 'error', message: friendlyError(error) }),
    });
  }

  // Open the first card as soon as the screen appears (once, even under StrictMode).
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    open();
  });

  // The profession page underneath refreshes its tier counts once, when this closes.
  useEffect(
    () => () => {
      void queryClient.invalidateQueries({ queryKey: ['profession-detail', id] });
      void queryClient.invalidateQueries({ queryKey: ['profession-module'] });
    },
    [queryClient, id],
  );

  useEffect(() => {
    cardScroll.current?.scrollTo({ y: 0, animated: false });
  }, [state, flipped]);

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace(home);
  }

  const card = state.kind === 'card' ? state.card : null;

  // Desktop shortcuts: Space or Enter flips; once flipped, Enter opens the next card.
  useEffect(() => {
    if (Platform.OS !== 'web' || !card) return;
    const onKey = (event: KeyboardEvent) => {
      // A held key repeats; without this, holding Enter would open cards in a burst.
      if (event.repeat || reporting) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!flipped && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        setFlipped(true);
      } else if (flipped && event.key === 'Enter') {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  let content;
  if (state.kind === 'opening' || (openNext.isPending && !card)) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator color={look.color} size="large" />
      </View>
    );
  } else if (state.kind === 'error') {
    content = (
      <View style={styles.center}>
        <EmptyState icon="wifi-off" color={palette.pink} title="Couldn’t open a card" message={state.message}>
          <Button title="Try again" variant="secondary" loading={openNext.isPending} onPress={open} />
        </EmptyState>
      </View>
    );
  } else if (state.kind === 'reviews_due') {
    content = (
      <View style={styles.center}>
        <EmptyState
          icon="clock-outline"
          color={palette.orange}
          title="Review first"
          message={`${state.due} ${state.due === 1 ? 'card' : 'cards'} in ${name} ${state.due === 1 ? 'is' : 'are'} due. Review them, then keep opening new ones.`}>
          <Button
            title={`Review ${state.due} due`}
            icon="play"
            onPress={() => router.replace({ pathname: '/review', params: { profession: id } })}
          />
          <Button title={`Back to ${name}`} variant="ghost" onPress={close} />
        </EmptyState>
      </View>
    );
  } else if (state.kind === 'done') {
    content = (
      <View style={styles.center}>
        <EmptyState
          icon="party-popper"
          color={look.color}
          title="That’s every card so far"
          message="You’ve opened every card released so far. The next tier arrives as soon as it’s written.">
          <Button title={`Back to ${name}`} onPress={close} />
        </EmptyState>
      </View>
    );
  } else if (card) {
    const decoration = {
      look,
      label: card.module_title ?? name,
      topic: card.module_title ?? name,
      badge: kindLabel(card.kind),
    };
    content = (
      <>
        <ScrollView
          ref={cardScroll}
          style={styles.flex}
          contentContainerStyle={styles.cardScroll}
          showsVerticalScrollIndicator={false}>
          <FlipCard
            cardKey={card.id}
            flipped={flipped}
            shakeKey={0}
            popKey={0}
            front={<CardFront card={card} decoration={decoration} typed={false} hint="New card. Think it over, then flip it." />}
            back={
              <CardBack
                card={card}
                decoration={decoration}
                outcome="revealed"
                typed={Boolean(card.answer)}
                bannerText="New card"
                nextLine="In your stack. First review: tomorrow."
              />
            }
          />
        </ScrollView>

        <View style={[styles.dock, { paddingBottom: insets.bottom + spacing.lg }]}>
          {!flipped ? (
            <Animated.View key={`flip-${card.id}`} entering={FadeInDown.springify().damping(16)}>
              <Button title="Show answer" icon="rotate-3d-variant" fullWidth onPress={() => setFlipped(true)} />
              {showKeyboardTips ? (
                <Text variant="caption" tone="subtle" align="center" style={styles.hint}>
                  Tip: press Space to flip, then Enter for the next card
                </Text>
              ) : null}
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.controls}>
              <View style={styles.row}>
                <Button title="Done for now" variant="secondary" onPress={close} style={styles.flex} fullWidth />
                <Button
                  title="Open next card"
                  icon="cards-playing-outline"
                  loading={openNext.isPending}
                  disabled={openNext.isPending}
                  onPress={open}
                  style={styles.flex}
                  fullWidth
                />
              </View>
              <Text variant="caption" tone="subtle" align="center">
                You’ve opened {state.kind === 'card' ? state.openedToday : 0} today, so expect about that many extra
                reviews tomorrow.
              </Text>
              <Button
                title="Report a problem"
                variant="ghost"
                size="sm"
                icon="flag-outline"
                onPress={() => setReporting(card.id)}
                style={styles.report}
              />
            </Animated.View>
          )}
        </View>
      </>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: screenBackground, paddingTop: insets.top + spacing.sm }]}>
      <GradientBlobs />
      <View style={styles.topBar}>
        <IconButton icon="close" accessibilityLabel="Close" onPress={close} />
        <View style={styles.title}>
          <Icon name={look.icon} size={18} color={look.color} />
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 15 }} color={look.color} numberOfLines={1}>
            {name}
          </Text>
        </View>
        {state.kind === 'card' ? (
          <View style={[styles.counter, { backgroundColor: `${look.color}1F` }]}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 13 }} color={look.color}>
              +{state.openedToday} today
            </Text>
          </View>
        ) : null}
      </View>
      <View style={[styles.stage, { borderColor: colors.border }]}>{content}</View>
      <ReportCardDialog cardId={reporting} onClose={() => setReporting(null)} />
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
  title: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  counter: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  stage: { flex: 1, width: '100%', maxWidth: layout.maxReadingWidth + spacing.xl * 2, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  dock: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  controls: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md },
  hint: { marginTop: spacing.sm },
  report: { alignSelf: 'center' },
});
