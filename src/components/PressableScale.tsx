import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { springs } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** Scale while pressed. */
  scaleTo?: number;
  haptic?: boolean;
};

/** A pressable that squishes down and springs back. */
export function PressableScale({
  style,
  children,
  scaleTo = 0.96,
  haptic = false,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, scaleTo]) }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(event) => {
        pressed.set(withSpring(1, springs.snappy));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withSpring(0, springs.bouncy));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic) haptics.tap();
        onPress?.(event);
      }}
      style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
