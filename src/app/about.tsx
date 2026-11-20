import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { Linking, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GradientBlobs } from '@/components/GradientBlobs';
import { Icon, type IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { BrainGlyph } from '@/components/Logo';
import { Text } from '@/components/Text';
import { useAuth } from '@/features/auth/AuthProvider';
import { FibonacciChips, LAST_REVIEW_DAY, REVIEWS_BEFORE_FINALS, SemesterTimeline } from '@/features/about/FibonacciTimeline';
import { MemoryCurveChart } from '@/features/about/MemoryCurveChart';
import { Reveal } from '@/features/about/Reveal';
import { gradients, palette, radii, spacing, useIsWide, useTheme } from '@/theme';

const PLAYBOOK: { icon: IconName; color: string; title: string; text: string }[] = [
  {
    icon: 'notebook-edit-outline',
    color: palette.violet,
    title: 'Add everything you learn',
    text: 'After each lecture or homework set, turn the key ideas into cards, or add a ready-made pack for your course. Every formula, definition and “the professor said this will be on the test”.',
  },
  {
    icon: 'gesture-swipe-vertical',
    color: palette.pink,
    title: 'Doomscroll your notes instead',
    text: 'Waiting for the bus, standing in line, lying in bed: open RecallMate instead of your feed and casually flick through whatever is due. A few minutes a day, and only the cards that need you today.',
  },
  {
    icon: 'trophy-outline',
    color: palette.orange,
    title: 'Walk into the final already knowing it',
    text: 'By finals week you have seen every card again and again, right when it was starting to fade. No all-nighter: you know the answers on the final exam, and you still know them years later in your career.',
  },
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text variant="label" tone="primary">
        {eyebrow}
      </Text>
      <Text variant="title" accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

function Panel({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: colors.borderStrong }]}>
      {children}
    </View>
  );
}

export default function About() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  const bob = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    bob.set(withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [bob, reduceMotion]);
  const brainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -10 * bob.get() }, { rotate: `${-3 + 6 * bob.get()}deg` }],
  }));

  const pad = isWide ? spacing.xxxl : spacing.xl;
  const reveal = { scrollY, viewportHeight: height };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <GradientBlobs />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
          <View style={[styles.heroInner, { paddingHorizontal: pad }]}>
            <IconButton
              icon="arrow-left"
              accessibilityLabel="Back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              background="rgba(255,255,255,0.2)"
              color="#FFFFFF"
              style={styles.back}
            />
            <Animated.View style={[styles.brain, brainStyle]}>
              <BrainGlyph size={isWide ? 150 : 120} />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(100).springify().damping(16)} style={styles.heroCopy}>
              <Text variant="label" color="rgba(255,255,255,0.85)">
                How RecallMate works
              </Text>
              <Text variant="hero" color="#FFFFFF" style={isWide ? styles.heroTitleWide : undefined}>
                Learn it once. Keep it for life.
              </Text>
              <Text variant="body" color="rgba(255,255,255,0.92)">
                RecallMate turns what you study into long-term memory, a few minutes at a time, so you stop
                relearning the same things every semester.
              </Text>
            </Animated.View>
          </View>
        </LinearGradient>

        <View style={[styles.body, { paddingHorizontal: pad, paddingBottom: insets.bottom + spacing.huge }]}>
          <Reveal {...reveal} style={styles.section}>
            {(visible) => (
              <>
                <SectionTitle eyebrow="The problem" title="Your brain is built to forget" />
                <Text variant="body" tone="muted">
                  In the 1880s, psychologist Hermann Ebbinghaus measured how quickly new information fades. Unless
                  you revisit it, most of it slips away within days. It’s called the forgetting curve, and it’s
                  why an all-night cram is gone a week after the exam.
                </Text>
                <Panel>
                  <MemoryCurveChart active={visible} />
                </Panel>
              </>
            )}
          </Reveal>

          <Reveal {...reveal} style={styles.section}>
            <SectionTitle eyebrow="The fix" title="Review right before you’d forget" />
            <Text variant="body" tone="muted">
              Every time you pull a fact out of memory just as it starts to fade, the memory comes back stronger
              and lasts longer than the time before. That’s spaced repetition, one of the most reliable study
              techniques in learning science. Recalling the answer yourself (or typing it, in RecallMate) works far
              better than re-reading your notes. Researchers call that the testing effect.
            </Text>
          </Reveal>

          <Reveal {...reveal} style={styles.section}>
            {(visible) => (
              <>
                <SectionTitle eyebrow="The schedule" title="Spaced by Fibonacci" />
                <Text variant="body" tone="muted">
                  Every card you get right comes back a little later than last time. The gaps follow the Fibonacci
                  sequence, where each number is the sum of the two before it:
                </Text>
                <FibonacciChips active={visible} />
                <Text variant="body" tone="muted">
                  Miss a card and it starts over tomorrow, so the hard stuff gets more practice while the stuff
                  you know gets out of your way.
                </Text>
                <Panel>
                  <Text variant="subheading">One fact, one semester</Text>
                  <Text variant="small" tone="muted" style={styles.panelText}>
                    Add a fact in week 1 and it comes back on days 1, 2, 4, 7, 12, 20, 33, 54 and {LAST_REVIEW_DAY}.
                    That’s {REVIEWS_BEFORE_FINALS} quick reviews, each a few seconds, and it’s locked in before the
                    final. After that the gaps keep growing: 55, 89, 144 days…
                  </Text>
                  <SemesterTimeline active={visible} />
                </Panel>
              </>
            )}
          </Reveal>

          <Reveal {...reveal} style={styles.section}>
            <SectionTitle eyebrow="The playbook" title="Ace the final without cramming" />
            <View style={[styles.steps, isWide && styles.stepsWide]}>
              {PLAYBOOK.map((step, index) => (
                <View
                  key={step.title}
                  style={[
                    styles.step,
                    isWide && styles.stepWide,
                    { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: step.color },
                  ]}>
                  <View style={styles.stepTop}>
                    <View style={[styles.stepIcon, { backgroundColor: `${step.color}22` }]}>
                      <Icon name={step.icon} size={24} color={step.color} />
                    </View>
                    <Text variant="label" color={step.color}>
                      Step {index + 1}
                    </Text>
                  </View>
                  <Text variant="subheading">{step.title}</Text>
                  <Text variant="small" tone="muted">
                    {step.text}
                  </Text>
                </View>
              ))}
            </View>
          </Reveal>

          <Reveal {...reveal} style={styles.section}>
            <LinearGradient colors={gradients.sunrise} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
              <Text variant="heading" color="#FFFFFF">
                Minutes a day. Knowledge for good.
              </Text>
              <Text variant="body" color="rgba(255,255,255,0.92)">
                A typical day is a handful of cards: about the time it takes to scroll past a few videos.
              </Text>
              <View style={styles.ctaButtons}>
                {session ? (
                  <>
                    <Button title="Browse study packs" variant="light" icon="layers-triple" onPress={() => router.navigate('/packs')} />
                    <Button title="Write a card" variant="light" icon="plus" onPress={() => router.push('/memory/new')} />
                  </>
                ) : (
                  <>
                    <Button title="Start remembering" variant="light" iconRight="arrow-right" onPress={() => router.push('/sign-up')} />
                    <Button title="Sign in" variant="light" onPress={() => router.push('/sign-in')} />
                  </>
                )}
              </View>
            </LinearGradient>
            <Button
              title="Read more about spaced repetition"
              variant="ghost"
              size="sm"
              iconRight="open-in-new"
              onPress={() =>
                void Linking.openURL(
                  'https://www.kpu.ca/sites/default/files/Learning%20Centres/Think_SpacedRepetition_LA.pdf',
                )
              }
              style={styles.more}
            />
          </Reveal>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl, paddingBottom: spacing.xxxl },
  heroInner: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: spacing.lg },
  back: { borderColor: 'rgba(255,255,255,0.3)' },
  brain: { alignSelf: 'center', marginVertical: spacing.md },
  heroCopy: { gap: spacing.sm },
  heroTitleWide: { fontSize: 48, lineHeight: 52 },
  body: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: spacing.huge, paddingTop: spacing.xxxl },
  section: { gap: spacing.lg },
  sectionTitle: { gap: spacing.xs },
  panel: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 4, padding: spacing.lg, gap: spacing.md },
  panelText: { marginBottom: spacing.sm },
  steps: { gap: spacing.md },
  stepsWide: { flexDirection: 'row' },
  step: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 4, padding: spacing.lg, gap: spacing.sm },
  stepWide: { flex: 1 },
  stepTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  stepIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cta: { borderRadius: radii.xl, padding: spacing.xxl, gap: spacing.md },
  ctaButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
  more: { alignSelf: 'center' },
});
