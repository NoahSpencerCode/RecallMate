import { useEffect } from 'react';
import type { DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { radii, useTheme } from '@/theme';

type SkeletonProps = {
  height: number;
  width?: DimensionValue;
  radius?: number;
};

/** Pulsing placeholder shown while data loads. */
export function Skeleton({ height, width = '100%', radius = radii.lg }: SkeletonProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(withRepeat(withTiming(1, { duration: 850 }), -1, true));
  }, [pulse, reduceMotion]);

  const style = useAnimatedStyle(() => ({ opacity: 0.55 + 0.45 * pulse.get() }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ height, width, borderRadius: radius, backgroundColor: colors.surfaceRaised }, style]}
    />
  );
}
