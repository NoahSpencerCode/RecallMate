import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { CategoryIcon } from '@/components/CategoryIcon';
import { RichText } from '@/components/rich/RichText';
import { Text } from '@/components/Text';
import { categoryLook } from '@/features/packs/categories';
import { fonts, radii, spacing } from '@/theme';

const SAMPLES = [
  { category: 'calculus', label: 'Calculus I', prompt: '$\\dfrac{d}{dx}\\left[\\sin x\\right] = \\,?$', answer: '$\\cos x$', x: -26, y: 0, tilt: -7 },
  { category: 'biology', label: 'Intro Biology', prompt: 'Where does the Krebs cycle happen?', answer: 'Mitochondrial matrix', x: 30, y: 104, tilt: 6 },
  { category: 'software', label: 'Git Essentials', prompt: 'Shelve uncommitted work for later?', answer: '`git stash`', x: -14, y: 216, tilt: -3 },
] as const;

type Collapse = SharedValue<number> | undefined;

function FloatingCard({ sample, index, collapse }: { sample: (typeof SAMPLES)[number]; index: number; collapse: Collapse }) {
  const reduceMotion = useReducedMotion();
  const float = useSharedValue(0);
  const look = categoryLook(sample.category);

  useEffect(() => {
    if (reduceMotion) return;
    float.set(
      withDelay(
        index * 400,
        withRepeat(withTiming(1, { duration: 2600 + index * 500, easing: Easing.inOut(Easing.sin) }), -1, true),
      ),
    );
  }, [float, index, reduceMotion]);

  const style = useAnimatedStyle(() => {
    // Tucking away gathers the fanned-out cards into a neat stack.
    const spread = 1 - 0.7 * (collapse ? collapse.get() : 0);
    const bob = float.get();
    return {
      transform: [
        { translateX: sample.x * spread },
        { translateY: sample.y * spread - 10 * bob },
        { rotate: `${sample.tilt * spread + 2.5 * bob}deg` },
      ],
    };
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(250 + index * 160).springify().damping(13).stiffness(120)}
      style={[styles.cardPosition, { zIndex: index }]}>
      <Animated.View style={[styles.card, { borderBottomColor: look.color }, style]}>
        <View style={styles.cardHeader}>
          <CategoryIcon look={look} size={28} />
          <Text variant="label" color={look.color}>
            {sample.label}
          </Text>
        </View>
        <RichText style={styles.prompt} color="#150F2E" inline>
          {sample.prompt}
        </RichText>
        <View style={[styles.answer, { backgroundColor: `${look.color}1A` }]}>
          <RichText style={{ fontFamily: fonts.bold, fontSize: 13 }} color={look.color} inline>
            {sample.answer}
          </RichText>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

/** Height of the card art at scale 1 (the last card's bottom edge). */
export const FLOATING_CARDS_HEIGHT = 370;

type FloatingCardsProps = {
  scale?: number;
  /** 0 = fanned out, 1 = tucked away. Drives the welcome screen's collapsing hero. */
  collapse?: SharedValue<number>;
};

/** Three study cards bobbing in space: the welcome screen's hero art. */
export function FloatingCards({ scale = 1, collapse }: FloatingCardsProps) {
  const stageStyle = useAnimatedStyle(() => {
    const progress = collapse ? collapse.get() : 0;
    return {
      opacity: interpolate(progress, [0.35, 0.9], [1, 0], Extrapolation.CLAMP),
      transform: [{ scale: scale * interpolate(progress, [0, 1], [1, 0.75], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Animated.View
      style={[styles.stage, { height: FLOATING_CARDS_HEIGHT * scale }, stageStyle]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {SAMPLES.map((sample, index) => (
        <FloatingCard key={sample.prompt} sample={sample} index={index} collapse={collapse} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: { width: 320, alignSelf: 'center', transformOrigin: 'top' },
  cardPosition: { position: 'absolute', left: 30, top: 0 },
  card: {
    width: 260,
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 5,
    shadowColor: '#150F2E',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prompt: { fontFamily: fonts.displayBold, fontSize: 18, lineHeight: 23 },
  answer: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
});
