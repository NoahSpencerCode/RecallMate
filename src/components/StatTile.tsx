import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { enterItem, radii, spacing, useTheme } from '@/theme';

import { AnimatedNumber } from './AnimatedNumber';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type StatTileProps = {
  icon: IconName;
  color: string;
  value: number;
  label: string;
  index?: number;
  format?: (value: number) => string;
};

export function StatTile({ icon, color, value, label, index = 0, format }: StatTileProps) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={enterItem(index, 120)}
      style={[
        styles.tile,
        { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: `${color}AA` },
      ]}>
      <View style={[styles.icon, { backgroundColor: `${color}22` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <AnimatedNumber value={value} variant="number" style={styles.value} format={format} />
      <Text variant="caption" tone="muted" numberOfLines={1}>
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 96,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    gap: 2,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: { fontSize: 28, lineHeight: 32 },
});
