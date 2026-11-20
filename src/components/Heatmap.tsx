import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { addDays, parseISODate, type ISODate } from '@/lib/dates';
import { spacing, useTheme } from '@/theme';

import { Text } from './Text';

type HeatmapProps = {
  activity: { day: ISODate; count: number }[];
  today: ISODate;
  weeks?: number;
};

const GAP = 4;

/** GitHub-style grid of reviews per day, columns = weeks (Sun–Sat). */
export function Heatmap({ activity, today, weeks = 12 }: HeatmapProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const counts = new Map(activity.map((a) => [a.day, a.count]));

  // Last column ends with this week's Saturday; today sits somewhere in it.
  const weekday = parseISODate(today).getDay();
  const lastDay = addDays(today, 6 - weekday);
  const firstDay = addDays(lastDay, -(weeks * 7 - 1));
  const cell = width ? Math.min(26, Math.floor((width - 28 - GAP * (weeks - 1)) / weeks)) : 0;

  const shade = (count: number) => {
    if (count === 0) return colors.surfaceSunken;
    if (count < 3) return `${colors.primary}55`;
    if (count < 6) return `${colors.primary}8C`;
    if (count < 11) return `${colors.primary}C4`;
    return colors.primary;
  };

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityLabel="Review activity, last 12 weeks">
      {cell > 0 ? (
        <View style={[styles.row, styles.center]}>
          <View style={[styles.dayLabels, { gap: GAP }]}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} variant="caption" tone="subtle" style={{ height: cell, lineHeight: cell }}>
                {i % 2 === 1 ? d : ' '}
              </Text>
            ))}
          </View>
          <View style={[styles.row, { gap: GAP }]}>
            {Array.from({ length: weeks }, (_, w) => (
              <View key={w} style={{ gap: GAP }}>
                {Array.from({ length: 7 }, (_, d) => {
                  const day = addDays(firstDay, w * 7 + d);
                  const future = day > today;
                  const count = counts.get(day) ?? 0;
                  return (
                    <Animated.View
                      key={d}
                      entering={FadeIn.delay(w * 35 + d * 8).duration(260)}
                      style={{
                        width: cell,
                        height: cell,
                        borderRadius: cell / 3.5,
                        backgroundColor: future ? 'transparent' : shade(count),
                        borderWidth: day === today ? 2 : 0,
                        borderColor: colors.secondary,
                      }}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ height: 7 * 18 }} />
      )}
      <View style={styles.legend}>
        <Text variant="caption" tone="subtle">
          Less
        </Text>
        {[0, 2, 5, 8, 12].map((n) => (
          <View key={n} style={[styles.legendCell, { backgroundColor: shade(n) }]} />
        ))}
        <Text variant="caption" tone="subtle">
          More
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  center: { alignSelf: 'center' },
  dayLabels: { width: 24, marginRight: 4 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.md, alignSelf: 'center' },
  legendCell: { width: 12, height: 12, borderRadius: 4 },
});
