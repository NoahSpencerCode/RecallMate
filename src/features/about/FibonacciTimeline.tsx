import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, ZoomIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/Text';
import { fib } from '@/lib/schedule';
import { fonts, palette, radii, spacing, useTheme } from '@/theme';

const SEMESTER_DAYS = 112; // 16 weeks
const GAPS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(fib); // 1, 1, 2, 3, 5, 8, 13, 21, 34
const REVIEW_DAYS = GAPS.reduce<number[]>((days, gap) => [...days, (days.at(-1) ?? 0) + gap], []); // 1, 2, 4, 7, 12, 20, 33, 54, 88

/** The Fibonacci gaps, popping in one by one. */
export function FibonacciChips({ active }: { active: boolean }) {
  const { colors } = useTheme();
  if (!active) return <View style={styles.chips} />;
  return (
    <View style={styles.chips} accessibilityLabel="Gaps between reviews: 1, 1, 2, 3, 5, 8, 13, 21, 34 days">
      {GAPS.map((gap, i) => (
        <Animated.View
          key={i}
          entering={ZoomIn.delay(i * 90).springify().damping(12)}
          style={[
            styles.chip,
            {
              backgroundColor: i % 2 ? colors.primarySoft : `${palette.pink}22`,
              paddingHorizontal: 10 + Math.min(i, 6) * 2,
            },
          ]}>
          <Text style={{ fontFamily: fonts.display, fontSize: 15 + Math.min(i, 6) * 1.5 }} color={i % 2 ? colors.primary : palette.pink}>
            {gap}
          </Text>
        </Animated.View>
      ))}
      <Text variant="bodyStrong" tone="subtle">
        …
      </Text>
    </View>
  );
}

/** One fact's reviews across a 16-week semester: frequent at first, then rarer. */
export function SemesterTimeline({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const fill = useSharedValue(0);

  useEffect(() => {
    if (active) fill.set(withTiming(REVIEW_DAYS.at(-1)! / SEMESTER_DAYS, { duration: 1800, easing: Easing.out(Easing.cubic) }));
  }, [active, fill]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }));

  return (
    <View
      accessibilityLabel={`Reviews on days ${REVIEW_DAYS.join(', ')} of a ${SEMESTER_DAYS / 7}-week semester`}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
        <Animated.View style={[styles.fill, { backgroundColor: colors.primarySoft }, fillStyle]} />
        {active && width > 0
          ? REVIEW_DAYS.map((day, i) => (
              <Animated.View
                key={day}
                entering={ZoomIn.delay(200 + i * 160).springify().damping(10)}
                style={[
                  styles.dot,
                  {
                    left: (day / SEMESTER_DAYS) * (width - 16),
                    backgroundColor: i === REVIEW_DAYS.length - 1 ? palette.pink : colors.primary,
                    borderColor: colors.surface,
                  },
                ]}
              />
            ))
          : null}
      </View>
      <View style={styles.labels}>
        <Text variant="caption" tone="subtle">
          Week 1
        </Text>
        <Text variant="caption" tone="subtle">
          Midterms
        </Text>
        <Text variant="caption" tone="subtle">
          Finals
        </Text>
      </View>
    </View>
  );
}

export const REVIEWS_BEFORE_FINALS = REVIEW_DAYS.length;
export const LAST_REVIEW_DAY = REVIEW_DAYS.at(-1);

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  chip: { height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  track: { height: 28, borderRadius: radii.pill, justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: radii.pill },
  dot: { position: 'absolute', width: 16, height: 16, borderRadius: 8, borderWidth: 3 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
});
