import { useEffect } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Button } from '@/components/Button';
import { Confetti } from '@/components/Confetti';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { neural } from '@/features/neural/neuralBus';
import { useProgress } from '@/features/progress/hooks';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';
import { palette, radii, spacing, useTheme } from '@/theme';

import type { SessionAction } from './types';

type SessionCompleteProps = {
  reviewed: number;
  correct: number;
  /** The buttons under the stats; the first is the main one. */
  actions: SessionAction[];
};

export function SessionComplete({ reviewed, correct, actions }: SessionCompleteProps) {
  const { colors } = useTheme();
  const today = useToday();
  const { data: progress } = useProgress(today);
  const reduceMotion = useReducedMotion();
  // Short screens (an iPhone SE in Safari, phones in landscape) get a smaller trophy.
  const compact = useWindowDimensions().height < 700;
  const wobble = useSharedValue(0);
  const accuracy = reviewed ? Math.round((correct / reviewed) * 100) : 0;

  useEffect(() => {
    haptics.success();
    neural.burst({ strength: 1.6 });
    if (reduceMotion) return;
    wobble.set(
      withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(-1, { duration: 700 })), -1, true),
    );
  }, [reduceMotion, wobble]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wobble.get() * 6}deg` }, { translateY: -4 * Math.abs(wobble.get()) }],
  }));

  const headline =
    accuracy === 100 ? 'Flawless!' : accuracy >= 80 ? 'Nailed it!' : accuracy >= 50 ? 'Solid session!' : 'Every rep counts!';

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.wrap, compact && styles.wrapCompact]}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={ZoomIn.springify().damping(10).stiffness(140)}
          style={[styles.trophyBadge, compact && styles.trophyCompact, { backgroundColor: `${palette.yellow}33` }]}>
          <Animated.View style={trophyStyle}>
            <Icon name="trophy" size={compact ? 52 : 72} color={palette.yellow} />
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(150).springify()} style={styles.copy}>
          <Text variant="hero" align="center">
            {headline}
          </Text>
          <Text variant="body" tone="muted" align="center">
            {reviewed === 1 ? 'You reviewed 1 card.' : `You reviewed ${reviewed} cards.`} Misses come back tomorrow,
            and everything you got right moves further out.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(280).springify()} style={styles.stats}>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AnimatedNumber value={reviewed} variant="number" />
            <Text variant="caption" tone="muted">
              Reviewed
            </Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AnimatedNumber value={accuracy} variant="number" format={(n) => `${Math.round(n)}%`} color={colors.success} />
            <Text variant="caption" tone="muted">
              Accuracy
            </Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AnimatedNumber value={progress?.current_streak ?? 0} variant="number" color={palette.orange} />
            <Text variant="caption" tone="muted">
              Day streak
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.actions}>
          {actions.map((action, i) => (
            <Button
              key={action.title}
              title={action.title}
              icon={action.icon}
              variant={action.variant ?? (i === 0 ? 'primary' : 'secondary')}
              disabled={action.disabled}
              fullWidth
              onPress={action.onPress}
            />
          ))}
        </Animated.View>
      </ScrollView>

      <Confetti originY={0.25} count={48} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xxl, padding: spacing.xl },
  wrapCompact: { gap: spacing.lg, paddingVertical: spacing.md },
  trophyBadge: { width: 140, height: 140, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  trophyCompact: { width: 100, height: 100, borderRadius: 34 },
  copy: { gap: spacing.sm, maxWidth: 440 },
  stats: { flexDirection: 'row', gap: spacing.md, width: '100%', maxWidth: 440 },
  stat: { flex: 1, alignItems: 'center', padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1.5, borderBottomWidth: 4 },
  actions: { gap: spacing.md, width: '100%', maxWidth: 440 },
});
