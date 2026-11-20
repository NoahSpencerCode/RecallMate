import { useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type RevealProps = {
  scrollY: SharedValue<number>;
  viewportHeight: number;
  /** Plain children, or a function that learns when the block first came into view. */
  children: ReactNode | ((visible: boolean) => ReactNode);
  style?: StyleProp<ViewStyle>;
};

/**
 * Fades and lifts a block into place as it scrolls into view. Must be a direct
 * child of the scroll content so its layout y is in scroll coordinates.
 */
export function Reveal({ scrollY, viewportHeight, children, style }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const top = useSharedValue(Number.MAX_SAFE_INTEGER);
  const [visible, setVisible] = useState(false);

  const progress = (y: number, t: number) => {
    'worklet';
    return interpolate(y + viewportHeight - t, [40, 200], [0, 1], Extrapolation.CLAMP);
  };

  useAnimatedReaction(
    () => progress(scrollY.get(), top.get()) > 0.2,
    (now, before) => {
      if (now && !before) scheduleOnRN(setVisible, true);
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress(scrollY.get(), top.get());
    return { opacity: p, transform: [{ translateY: (1 - p) * 48 }, { scale: 0.96 + 0.04 * p }] };
  });

  const content = typeof children === 'function' ? children(reduceMotion || visible) : children;

  if (reduceMotion) return <View style={style}>{content}</View>;
  return (
    <Animated.View onLayout={(e) => top.set(e.nativeEvent.layout.y)} style={[style, animatedStyle]}>
      {content}
    </Animated.View>
  );
}
