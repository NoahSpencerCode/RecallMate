import { StyleSheet } from 'react-native';

import { haptics } from '@/lib/haptics';
import { fonts, radii, useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
  /** Fill color when selected (defaults to the primary color). */
  color?: string;
  count?: number;
};

export function Chip({ label, selected = false, onPress, icon, color, count }: ChipProps) {
  const { colors } = useTheme();
  const fill = color ?? colors.primary;
  const fg = selected ? '#FFFFFF' : colors.text;

  return (
    <PressableScale
      onPress={() => {
        haptics.select();
        onPress();
      }}
      scaleTo={0.92}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? fill : colors.surface,
          borderColor: selected ? fill : colors.border,
        },
      ]}>
      {icon ? <Icon name={icon} size={16} color={selected ? '#FFFFFF' : fill} /> : null}
      <Text style={{ fontFamily: fonts.bold, fontSize: 14 }} color={fg}>
        {label}
      </Text>
      {count !== undefined ? (
        <Text
          style={{ fontFamily: fonts.extrabold, fontSize: 12 }}
          color={selected ? 'rgba(255,255,255,0.85)' : colors.textSubtle}>
          {count}
        </Text>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: radii.pill,
    borderWidth: 1.5,
  },
});
