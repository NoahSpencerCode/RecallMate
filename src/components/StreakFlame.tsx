import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { fonts, palette, radii, useTheme } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

/** A flame that flickers while the streak is alive. */
export function Flame({ size = 28, lit = true }: { size?: number; lit?: boolean }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const flicker = useSharedValue(0);

  useEffect(() => {
    if (!lit || reduceMotion) return;
    flicker.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.inOut(Easing.quad) }),
          withTiming(-1, { duration: 520, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [flicker, lit, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scaleY: 1 + flicker.get() * 0.06 },
      { scaleX: 1 - flicker.get() * 0.03 },
      { rotate: `${flicker.get() * 4}deg` },
    ],
  }));

  return (
    <Animated.View style={[{ transformOrigin: 'bottom' }, style]}>
      <Icon name="fire" size={size} color={lit ? palette.orange : colors.textSubtle} />
    </Animated.View>
  );
}

/** Compact "🔥 12" pill. */
export function StreakPill({ days }: { days: number }) {
  const { scheme } = useTheme();
  const lit = days > 0;
  return (
    <View
      accessibilityLabel={`${days} day streak`}
      style={[
        styles.pill,
        {
          backgroundColor: lit
            ? scheme === 'dark'
              ? 'rgba(255, 159, 28, 0.16)'
              : 'rgba(255, 159, 28, 0.14)'
            : 'transparent',
          borderColor: lit ? 'rgba(255, 159, 28, 0.45)' : 'rgba(128,128,128,0.3)',
        },
      ]}>
      <Flame size={20} lit={lit} />
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 15 }} color={lit ? palette.orange : undefined}>
        {days}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: radii.pill,
    borderWidth: 1.5,
  },
});
