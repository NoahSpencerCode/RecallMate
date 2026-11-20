import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { edge, fonts, radii, springs, useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'dangerGhost' | 'light';
type ButtonSize = 'lg' | 'md' | 'sm';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const HEIGHT: Record<ButtonSize, number> = { lg: 58, md: 48, sm: 38 };
const PAD: Record<ButtonSize, number> = { lg: 26, md: 20, sm: 14 };
const FONT: Record<ButtonSize, number> = { lg: 17, md: 16, sm: 14 };

/**
 * Chunky, tactile button: the face sits on a solid edge and sinks into it
 * when pressed, like a physical key.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const flat = variant === 'ghost' || variant === 'dangerGhost';
  const edgeHeight = flat ? 0 : size === 'sm' ? 3 : edge.button;

  const looks: Record<ButtonVariant, { face: string; edge: string; text: string; border?: string }> = {
    primary: { face: colors.primary, edge: colors.primaryEdge, text: colors.onAccent },
    secondary: { face: colors.surface, edge: colors.borderStrong, text: colors.text, border: colors.borderStrong },
    success: { face: colors.success, edge: colors.successEdge, text: colors.onAccent },
    danger: { face: colors.danger, edge: colors.dangerEdge, text: colors.onAccent },
    ghost: { face: 'transparent', edge: 'transparent', text: colors.primary },
    dangerGhost: { face: 'transparent', edge: 'transparent', text: colors.danger },
    light: { face: '#FFFFFF', edge: 'rgba(21, 15, 46, 0.22)', text: '#150F2E' },
  };
  const look = looks[variant];
  const inactive = disabled || loading;

  const press = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.get() * edgeHeight }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPressIn={() => press.set(withSpring(1, springs.snappy))}
      onPressOut={() => press.set(withSpring(0, springs.bouncy))}
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      style={[
        { alignSelf: fullWidth ? 'stretch' : 'flex-start', opacity: disabled ? 0.45 : 1 },
        style,
      ]}>
      <View style={{ paddingBottom: edgeHeight }}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { top: edgeHeight, borderRadius: radii.lg, backgroundColor: look.edge },
          ]}
        />
        <Animated.View
          style={[
            styles.face,
            {
              height: HEIGHT[size],
              paddingHorizontal: PAD[size],
              backgroundColor: look.face,
              borderColor: look.border ?? 'transparent',
              borderWidth: look.border ? 2 : 0,
            },
            faceStyle,
          ]}>
          {loading ? (
            <ActivityIndicator color={look.text} />
          ) : (
            <>
              {icon ? <Icon name={icon} size={FONT[size] + 4} color={look.text} /> : null}
              <Text style={{ fontFamily: fonts.extrabold, fontSize: FONT[size] }} color={look.text}>
                {title}
              </Text>
              {iconRight ? <Icon name={iconRight} size={FONT[size] + 4} color={look.text} /> : null}
            </>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: {
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
