import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';

import { Text } from '@/components/Text';
import { fonts, spacing, useTheme } from '@/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const W = 320;
const H = 170;
const TOP = 24; // 100% remembered
const FLOOR = 140; // forgotten
const END = 308;
const DASH = 1400;

/** One study session, then the forgetting curve. */
const CRAM = `M 14 ${TOP} C 40 96 92 122 ${END} 134`;

/** Reviews at growing intervals; each one resets the curve, and it decays more slowly every time. */
function spacedPath() {
  const reviews = [14, 30, 50, 78, 118, 176, 258];
  const lows = [86, 68, 54, 44, 36, 31, 28];
  let d = `M ${reviews[0]} ${TOP}`;
  reviews.forEach((x, i) => {
    const next = reviews[i + 1] ?? END;
    const low = lows[i];
    const span = next - x;
    d += ` C ${x + span * 0.18} ${TOP + (low - TOP) * 0.8} ${x + span * 0.45} ${low} ${next} ${low}`;
    if (i < reviews.length - 1) d += ` L ${next} ${TOP}`;
  });
  return d;
}
const SPACED = spacedPath();

function DrawnPath({ d, color, width, delay, dashed, active }: { d: string; color: string; width: number; delay: number; dashed?: boolean; active: boolean }) {
  const offset = useSharedValue(DASH);

  useEffect(() => {
    if (active) offset.set(withDelay(delay, withTiming(0, { duration: 1700, easing: Easing.out(Easing.cubic) })));
  }, [active, delay, offset]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: offset.get() }));

  return (
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={dashed ? undefined : `${DASH} ${DASH}`}
      opacity={dashed ? 0.9 : 1}
      animatedProps={dashed ? undefined : animatedProps}
    />
  );
}

/** Illustration of the forgetting curve vs. spaced reviews (not real data). */
export function MemoryCurveChart({ active }: { active: boolean }) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="image" accessibilityLabel="Illustration: memory of a crammed fact drops off quickly, while spaced reviews keep it near 100 percent.">
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line x1={14} y1={FLOOR} x2={END} y2={FLOOR} stroke={colors.border} strokeWidth={2} />
        <Line x1={14} y1={TOP} x2={END} y2={TOP} stroke={colors.border} strokeWidth={1} strokeDasharray="4 6" />
        <SvgText x={14} y={TOP - 8} fill={colors.textSubtle} fontSize={10} fontFamily={fonts.bold}>
          Remembered
        </SvgText>
        <SvgText x={14} y={FLOOR + 16} fill={colors.textSubtle} fontSize={10} fontFamily={fonts.bold}>
          Day 1
        </SvgText>
        <SvgText x={END} y={FLOOR + 16} fill={colors.textSubtle} fontSize={10} fontFamily={fonts.bold} textAnchor="end">
          Finals
        </SvgText>
        <DrawnPath d={CRAM} color={colors.danger} width={3} delay={0} active={active} />
        <DrawnPath d={SPACED} color={colors.primary} width={4} delay={250} active={active} />
      </Svg>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.danger }]} />
          <Text variant="caption" tone="muted">
            Crammed once
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
          <Text variant="caption" tone="muted">
            Reviewed with RecallMate
          </Text>
        </View>
        <Text variant="caption" tone="subtle" style={styles.note}>
          Illustration
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 4, borderRadius: 2 },
  note: { marginLeft: 'auto' },
});
