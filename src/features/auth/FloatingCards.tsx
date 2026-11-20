import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Text } from '@/components/Text';
import { categoryLook } from '@/features/packs/categories';
import { fonts, radii, spacing } from '@/theme';

const SAMPLES = [
  { category: 'calculus', label: 'Calculus I', prompt: 'd/dx [sin x] = ?', answer: 'cos x', x: -26, y: 0, tilt: -7 },
  { category: 'biology', label: 'Intro Biology', prompt: 'Where does the Krebs cycle happen?', answer: 'Mitochondrial matrix', x: 30, y: 104, tilt: 6 },
  { category: 'software', label: 'Git Essentials', prompt: 'Shelve uncommitted work for later?', answer: 'git stash', x: -14, y: 216, tilt: -3 },
] as const;

function FloatingCard({ sample, index }: { sample: (typeof SAMPLES)[number]; index: number }) {
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

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: sample.x },
      { translateY: sample.y - 10 * float.get() },
      { rotate: `${sample.tilt + 2.5 * float.get()}deg` },
    ],
  }));

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
        <Text style={styles.prompt} color="#150F2E">
          {sample.prompt}
        </Text>
        <View style={[styles.answer, { backgroundColor: `${look.color}1A` }]}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} color={look.color}>
            {sample.answer}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

/** Three study cards bobbing in space: the welcome screen's hero art. */
export function FloatingCards({ scale = 1 }: { scale?: number }) {
  return (
    <View
      style={[styles.stage, { height: STAGE_HEIGHT * scale, transform: [{ scale }] }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {SAMPLES.map((sample, index) => (
        <FloatingCard key={sample.prompt} sample={sample} index={index} />
      ))}
    </View>
  );
}

const STAGE_HEIGHT = 350;

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
