import { useId, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, G, Line, Pattern, Rect } from 'react-native-svg';

import { barTotals, milestoneLabels, type BarSegment } from '@/features/professions/progress';
import { fonts, useTheme } from '@/theme';

import { Text } from './Text';

type MilestoneBarProps = {
  segments: BarSegment[];
  /** The fill colour; opened cards use it lighter, mastered cards full strength. */
  color: string;
  height?: number;
  /** Print the milestone names under the bar. */
  labels?: boolean;
  /** Spoken summary, e.g. "38 percent to PhD, Undergraduate core". */
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const pct = (share: number) => `${(share * 100).toFixed(3)}%`;

/**
 * A long progress bar split into tiers. Placed-out cards are hatched, opened
 * cards are a light fill, mastered cards a solid one, and tiers whose cards
 * haven't shipped yet are dotted.
 */
export function MilestoneBar({ segments, color, height = 14, labels = false, accessibilityLabel, style }: MilestoneBarProps) {
  const { colors } = useTheme();
  // SVG ids are global on the web, so each bar needs its own.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [width, setWidth] = useState(0);
  const totals = barTotals(segments);
  const radius = height / 2;

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);
  const labelRows = labels && width > 0 ? milestoneLabels(segments, width) : [];
  const twoRows = labelRows.some((l) => l.row === 1);

  return (
    <View
      style={style}
      onLayout={onLayout}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(totals.done * 100) }}>
      <Svg width="100%" height={height}>
        <Defs>
          <ClipPath id={`clip-${uid}`}>
            <Rect x={0} y={0} width="100%" height={height} rx={radius} ry={radius} />
          </ClipPath>
          <Pattern id={`hatch-${uid}`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <Rect x={0} y={0} width={6} height={6} fill={colors.surfaceSunken} />
            <Line x1={0} y1={0} x2={0} y2={6} stroke={color} strokeWidth={3} strokeOpacity={0.5} />
          </Pattern>
          <Pattern id={`dots-${uid}`} width={6} height={height} patternUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={6} height={height} fill={colors.surfaceSunken} />
            <Rect x={2} y={height / 2 - 1} width={2} height={2} fill={colors.borderStrong} />
          </Pattern>
        </Defs>
        <G clipPath={`url(#clip-${uid})`}>
          <Rect x={0} y={0} width="100%" height={height} fill={colors.surfaceSunken} />
          {segments.map((s) => (
            <G key={s.tier}>
              {!s.released ? <Rect x={pct(s.start)} y={0} width={pct(s.width)} height={height} fill={`url(#dots-${uid})`} /> : null}
              {s.placedOut > 0 ? (
                <Rect x={pct(s.start)} y={0} width={pct(s.width * s.placedOut)} height={height} fill={`url(#hatch-${uid})`} />
              ) : null}
              {s.opened > 0 ? (
                <Rect
                  x={pct(s.start + s.width * s.placedOut)}
                  y={0}
                  width={pct(s.width * s.opened)}
                  height={height}
                  fill={color}
                  fillOpacity={0.42}
                />
              ) : null}
              {s.mastered > 0 ? (
                <Rect
                  x={pct(s.start + s.width * s.placedOut)}
                  y={0}
                  width={pct(s.width * s.mastered)}
                  height={height}
                  fill={color}
                />
              ) : null}
            </G>
          ))}
          {/* Thin gaps between tiers. */}
          {segments.slice(1).map((s) => (
            <Rect key={`tick-${s.tier}`} x={pct(s.start)} y={0} width={2} height={height} fill={colors.surface} />
          ))}
        </G>
      </Svg>

      {labels ? (
        <View
          style={[styles.labels, { height: twoRows ? 34 : 18 }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          {labelRows.map((l) => (
            <Text
              key={l.label}
              numberOfLines={1}
              style={[
                styles.label,
                { top: l.row * 16, fontFamily: fonts.bold },
                l.align === 'start'
                  ? { left: pct(l.at) as `${number}%` }
                  : l.align === 'end'
                    ? { right: pct(1 - l.at) as `${number}%` }
                    : { left: pct(l.at) as `${number}%`, transform: [{ translateX: '-50%' }] },
              ]}
              color={colors.textMuted}>
              {l.label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { marginTop: 6, position: 'relative' },
  label: { position: 'absolute', fontSize: 11 },
});
