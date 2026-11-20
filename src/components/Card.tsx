import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { edge, radii, spacing, useTheme } from '@/theme';

import { PressableScale } from './PressableScale';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Tints the chunky bottom edge, e.g. with a category color. */
  accent?: string;
  padded?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Surface with a chunky bottom edge. Pressable when `onPress` is set. */
export function Card({ children, style, accent, padded = true, onPress, accessibilityLabel }: CardProps) {
  const { colors } = useTheme();
  const cardStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: colors.surface,
      borderRadius: radii.xl,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderBottomWidth: edge.card,
      borderBottomColor: accent ?? colors.borderStrong,
      padding: padded ? spacing.lg : 0,
    },
    style,
  ];

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        scaleTo={0.975}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={cardStyle}>
        {children}
      </PressableScale>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}
