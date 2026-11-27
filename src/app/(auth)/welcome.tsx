import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { Text } from '@/components/Text';
import { FLOATING_CARDS_HEIGHT, FloatingCards } from '@/features/auth/FloatingCards';
import { useBrowserThemeColor } from '@/lib/browserChrome';
import { gradients, radii, spacing, useIsWide, useScreenBackground, useTheme } from '@/theme';

const PERKS: { icon: IconName; text: string }[] = [
  { icon: 'calendar-sync-outline', text: 'Reviews spaced on a Fibonacci schedule: 1, 1, 2, 3, 5, 8 days…' },
  { icon: 'school-outline', text: 'Course packs, plus Professions that take a whole field from zero to PhD' },
  { icon: 'fire', text: 'Streaks and progress that make the habit stick' },
];

const LOGO_SIZE = 34;
/** Copy that stays visible under the full-size hero before any scrolling (headline + intro). */
const MIN_COPY_VISIBLE = 200;
/** The card art gets at most this much height, and is skipped if it would get less. */
const MAX_CARDS_ROOM = 300;
const MIN_CARDS_ROOM = 120;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export default function Welcome() {
  return useIsWide() ? <WideWelcome /> : <PhoneWelcome />;
}

/**
 * Phones: the gradient hero floats over the top of the scrolling copy and
 * shrinks as you scroll, tucking the cards away until only the logo bar is
 * left, so the reading area grows. The buttons stay docked at the bottom.
 */
function PhoneWelcome() {
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  useBrowserThemeColor(gradients.brand[0]);

  // Height of the area above the docked buttons: measured, guessed for the first frame.
  const [viewport, setViewport] = useState(windowHeight - 170);

  const heroMin = insets.top + spacing.lg + LOGO_SIZE + spacing.lg;
  const room = clamp(viewport - heroMin - MIN_COPY_VISIBLE, 0, MAX_CARDS_ROOM);
  const cardsRoom = room >= MIN_CARDS_ROOM ? room : 0;
  const heroMax = heroMin + cardsRoom;

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  // 0 with the cards fully out, 1 once they're tucked away.
  const collapse = useDerivedValue(() => (cardsRoom > 0 ? clamp(scrollY.get() / cardsRoom, 0, 1) : 1));
  const heroStyle = useAnimatedStyle(() => ({
    // Shrinks one-for-one with the scroll so the copy stays attached to it;
    // pulling down past the top stretches it rather than opening a gap.
    height: Math.max(heroMin, heroMax - scrollY.get()),
  }));

  return (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      <View style={styles.root} onLayout={(event) => setViewport(Math.round(event.nativeEvent.layout.height))}>
        <Animated.ScrollView
          style={styles.root}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.body,
            // Start below the full-size hero, and leave enough to scroll that it can tuck away completely.
            { paddingTop: heroMax + spacing.xl, minHeight: viewport + cardsRoom },
          ]}>
          <Copy />
          <Perks />
          <Animated.View entering={FadeInUp.delay(440).springify().damping(16)}>
            <HowItWorksButton />
          </Animated.View>
        </Animated.ScrollView>

        <Animated.View style={[styles.hero, heroStyle]}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View entering={FadeInDown.springify().damping(15)} style={{ paddingTop: insets.top + spacing.lg }}>
            <Logo size={LOGO_SIZE} color="#FFFFFF" />
          </Animated.View>
          {cardsRoom > 0 ? <FloatingCards scale={cardsRoom / FLOATING_CARDS_HEIGHT} collapse={collapse} /> : null}
        </Animated.View>
      </View>

      <View
        style={[
          styles.dock,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + spacing.lg },
        ]}>
        <Animated.View entering={FadeInUp.delay(440).springify().damping(16)} style={styles.actions}>
          <PrimaryActions />
        </Animated.View>
      </View>
    </View>
  );
}

/** Tablets and desktop: hero art on the left, copy and buttons on the right. */
function WideWelcome() {
  const screenBackground = useScreenBackground();

  return (
    <View style={[styles.root, styles.row, { backgroundColor: screenBackground }]}>
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroWide}>
        <Animated.View entering={FadeInDown.springify().damping(15)}>
          <Logo size={44} color="#FFFFFF" />
        </Animated.View>
        <FloatingCards />
      </LinearGradient>

      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.body, styles.bodyWide]}
        showsVerticalScrollIndicator={false}>
        <Copy wide />
        <Perks />
        <Animated.View entering={FadeInUp.delay(440).springify().damping(16)} style={styles.actions}>
          <PrimaryActions />
          <HowItWorksButton />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Copy({ wide = false }: { wide?: boolean }) {
  return (
    <Animated.View entering={FadeInUp.delay(200).springify().damping(16)} style={styles.copy}>
      <Text variant="hero" style={!wide && styles.heroTitleSmall}>
        Remember everything you study.
      </Text>
      <Text variant="body" tone="muted">
        RecallMate brings each card back right before you’d forget it, so a few minutes a day turns into knowledge
        you actually keep.
      </Text>
    </Animated.View>
  );
}

function Perks() {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInUp.delay(320).springify().damping(16)} style={styles.perks}>
      {PERKS.map((perk) => (
        <View key={perk.text} style={styles.perk}>
          <View style={[styles.perkIcon, { backgroundColor: colors.primarySoft }]}>
            <Icon name={perk.icon} size={18} color={colors.primary} />
          </View>
          <Text variant="smallStrong" tone="muted" style={styles.perkText}>
            {perk.text}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}

function PrimaryActions() {
  return (
    <>
      <Button title="Get started — it’s free" iconRight="arrow-right" fullWidth onPress={() => router.push('/sign-up')} />
      <Button
        title="I already have an account"
        variant="secondary"
        fullWidth
        onPress={() => router.push('/sign-in')}
      />
    </>
  );
}

function HowItWorksButton() {
  return (
    <Button
      title="How RecallMate works"
      variant="ghost"
      size="sm"
      icon="lightbulb-question-outline"
      onPress={() => router.push('/about')}
      style={styles.howItWorks}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  row: { flexDirection: 'row' },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    overflow: 'hidden',
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    // Decorative: let swipes that start on it scroll the copy underneath.
    pointerEvents: 'none',
  },
  heroWide: {
    flex: 1,
    maxWidth: 620,
    padding: spacing.huge,
    justifyContent: 'center',
    gap: spacing.xxxl,
    overflow: 'hidden',
    borderTopRightRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  body: { padding: spacing.xl, gap: spacing.xl, width: '100%', maxWidth: 520, alignSelf: 'center' },
  bodyWide: { flexGrow: 1, justifyContent: 'center', padding: spacing.huge, gap: spacing.xxl },
  heroTitleSmall: { fontSize: 34, lineHeight: 38 },
  copy: { gap: spacing.md },
  perks: { gap: spacing.md },
  perk: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  perkIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  perkText: { flex: 1 },
  actions: { gap: spacing.md, width: '100%', maxWidth: 520, alignSelf: 'center' },
  howItWorks: { alignSelf: 'center' },
  dock: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 1.5 },
});
