import { useEffect, useId } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useTheme } from '@/theme';

type BlobProps = {
  color: string;
  opacity: number;
  size: number;
  top: number | `${number}%`;
  left: number | `${number}%`;
  drift: number;
  duration: number;
};

function Blob({ color, opacity, size, top, left, drift, duration }: BlobProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    t.set(withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [duration, reduceMotion, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift * (t.get() - 0.5) },
      { translateY: drift * 0.6 * (0.5 - t.get()) },
      { scale: 1 + 0.08 * t.get() },
    ],
  }));

  return (
    <Animated.View style={[styles.blob, { top, left, width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** Soft, slowly drifting color pools behind a screen. */
export function GradientBlobs() {
  const { colors } = useTheme();
  // On web the root-level neuron field provides the backdrop.
  if (Platform.OS === 'web') return null;
  const [a, b, c] = colors.blobs;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip]}>
      <Blob color={a[0]} opacity={a[1]} size={420} top={-140} left={-160} drift={60} duration={9000} />
      <Blob color={b[0]} opacity={b[1]} size={480} top="30%" left="55%" drift={80} duration={12000} />
      <Blob color={c[0]} opacity={c[1]} size={360} top="70%" left={-120} drift={50} duration={10000} />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  blob: { position: 'absolute' },
});
