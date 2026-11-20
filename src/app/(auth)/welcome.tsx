import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { Text } from '@/components/Text';
import { FloatingCards } from '@/features/auth/FloatingCards';
import { gradients, radii, spacing, useIsWide, useScreenBackground, useTheme } from '@/theme';

const PERKS: { icon: IconName; text: string }[] = [
  { icon: 'calendar-sync-outline', text: 'Reviews spaced on a Fibonacci schedule: 1, 1, 2, 3, 5, 8 days…' },
  { icon: 'layers-triple', text: '40+ ready-made packs for calculus, bio, engineering, CS and more' },
  { icon: 'fire', text: 'Streaks and progress that make the habit stick' },
];

export default function Welcome() {
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();

  const actions = (
    <Animated.View entering={FadeInUp.delay(440).springify().damping(16)} style={styles.actions}>
      <Button title="Get started — it’s free" iconRight="arrow-right" fullWidth onPress={() => router.push('/sign-up')} />
      <Button title="I already have an account" variant="secondary" fullWidth onPress={() => router.push('/sign-in')} />
      <Button
        title="How RecallMate works"
        variant="ghost"
        size="sm"
        icon="lightbulb-question-outline"
        onPress={() => router.push('/about')}
        style={styles.howItWorks}
      />
    </Animated.View>
  );

  return (
    <View style={[styles.root, isWide && styles.row, { backgroundColor: screenBackground }]}>
      <LinearGradient
        colors={gradients.brand}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, isWide ? styles.heroWide : { paddingTop: insets.top + spacing.lg }]}>
        <Animated.View entering={FadeInDown.springify().damping(15)}>
          <Logo size={isWide ? 44 : 34} color="#FFFFFF" />
        </Animated.View>
        <FloatingCards scale={isWide ? 1 : 0.78} />
      </LinearGradient>

      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.body, isWide && styles.bodyWide]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(200).springify().damping(16)} style={styles.copy}>
          <Text variant="hero" style={!isWide && styles.heroTitleSmall}>
            Remember everything you study.
          </Text>
          <Text variant="body" tone="muted">
            RecallMate brings each card back right before you’d forget it, so a few minutes a day turns into
            knowledge you actually keep.
          </Text>
        </Animated.View>

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

        {isWide ? actions : null}
      </ScrollView>

      {!isWide ? (
        <View
          style={[
            styles.dock,
            { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + spacing.lg },
          ]}>
          {actions}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  row: { flexDirection: 'row' },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    overflow: 'hidden',
  },
  heroWide: {
    flex: 1,
    maxWidth: 620,
    padding: spacing.huge,
    justifyContent: 'center',
    gap: spacing.xxxl,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: radii.xl,
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
  howItWorks: { alignSelf: 'center', marginTop: -spacing.xs },
  dock: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 1.5 },
});
