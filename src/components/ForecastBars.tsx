import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { formatDay, type ISODate } from '@/lib/dates';
import { fonts, radii, springs, useTheme } from '@/theme';

import { Text } from './Text';

const MAX_HEIGHT = 110;

function Bar({ count, max, index, highlight }: { count: number; max: number; index: number; highlight: boolean }) {
  const { colors } = useTheme();
  const grow = useSharedValue(0);
  const target = max > 0 ? Math.max(count > 0 ? 8 : 4, (count / max) * MAX_HEIGHT) : 4;

  useEffect(() => {
    grow.set(withDelay(index * 60, withSpring(target, springs.bouncy)));
  }, [grow, index, target]);

  const style = useAnimatedStyle(() => ({ height: grow.get() }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: highlight ? colors.primary : count > 0 ? `${colors.secondary}AA` : colors.surfaceSunken },
        style,
      ]}
    />
  );
}

/** Seven bars: cards coming due today (including overdue) and the next 6 days. */
export function ForecastBars({ forecast }: { forecast: { day: ISODate; count: number }[] }) {
  const max = Math.max(0, ...forecast.map((f) => f.count));
  return (
    <View style={styles.row} accessibilityLabel="Cards due over the next 7 days">
      {forecast.map((f, i) => (
        <View key={f.day} style={styles.column}>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 13 }} tone={f.count ? 'default' : 'subtle'}>
            {f.count}
          </Text>
          <View style={styles.track}>
            <Bar count={f.count} max={max} index={i} highlight={i === 0} />
          </View>
          <Text variant="caption" tone={i === 0 ? 'primary' : 'subtle'}>
            {i === 0 ? 'Today' : formatDay(f.day, { weekday: 'short' })}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  column: { flex: 1, alignItems: 'center', gap: 6 },
  track: { height: MAX_HEIGHT, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  bar: { width: '70%', maxWidth: 34, borderRadius: radii.sm },
});
