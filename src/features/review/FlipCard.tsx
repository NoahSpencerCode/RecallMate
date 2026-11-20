import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type FlipCardProps = {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Changing this resets the card to its front without animating. */
  cardKey: string;
  /** Bump to play a "nope" shake. */
  shakeKey: number;
  /** Bump to play a happy pop. */
  popKey: number;
};

/**
 * A study card that turns over in 3D. The content swaps at the halfway point
 * (edge-on), so front and back can be different heights.
 */
export function FlipCard({ flipped, front, back, style, cardKey, shakeKey, popKey }: FlipCardProps) {
  const reduceMotion = useReducedMotion();
  const turn = useSharedValue(0); // 0 front, 0.5 edge-on, 1 back
  const shake = useSharedValue(0);
  const pop = useSharedValue(0);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [prevKey, setPrevKey] = useState(cardKey);

  // New card: snap back to the front.
  if (prevKey !== cardKey) {
    setPrevKey(cardKey);
    setSide('front');
  }

  useEffect(() => {
    turn.set(0);
  }, [cardKey, turn]);

  useEffect(() => {
    if (!flipped || reduceMotion) return;
    turn.set(
      withTiming(0.5, { duration: 170, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) scheduleOnRN(setSide, 'back');
      }),
    );
  }, [flipped, reduceMotion, turn]);

  useEffect(() => {
    if (side === 'back' && !reduceMotion) {
      turn.set(withSpring(1, { damping: 13, stiffness: 160 }));
    }
  }, [side, reduceMotion, turn]);

  useEffect(() => {
    if (!shakeKey) return;
    shake.set(
      withSequence(
        withTiming(-12, { duration: 55 }),
        withTiming(12, { duration: 80 }),
        withTiming(-8, { duration: 70 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 55 }),
      ),
    );
  }, [shake, shakeKey]);

  useEffect(() => {
    if (!popKey) return;
    pop.set(withSequence(withTiming(1, { duration: 120 }), withSpring(0, { damping: 8, stiffness: 180 })));
  }, [pop, popKey]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = turn.get();
    const degrees = t <= 0.5 ? t * 180 : (t - 1) * 180;
    const lift = interpolate(Math.abs(degrees), [0, 90], [1, 1.05]);
    return {
      transform: [
        { perspective: 1400 },
        { translateX: shake.get() },
        { rotateY: `${degrees}deg` },
        { scale: lift + pop.get() * 0.04 },
      ],
    };
  });

  // With reduced motion there's no turn animation: show the back as soon as it's flipped.
  const shownSide = reduceMotion ? (flipped ? 'back' : 'front') : side;

  return (
    <Animated.View layout={LinearTransition.springify().damping(18)} style={[styles.card, style, animatedStyle]}>
      {shownSide === 'front' ? (
        <Animated.View key={`${cardKey}-front`} entering={reduceMotion ? FadeIn : undefined}>
          {front}
        </Animated.View>
      ) : (
        <Animated.View key={`${cardKey}-back`} entering={reduceMotion ? FadeIn : undefined}>
          {back}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { backfaceVisibility: 'hidden' },
});
