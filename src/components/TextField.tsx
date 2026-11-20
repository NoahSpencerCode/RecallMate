import { useState, type ComponentRef, type Ref } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps, type TextStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { fonts, radii, spacing, useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  hint?: string;
  error?: string | null;
  icon?: IconName;
  /** Adds a show/hide toggle for passwords. */
  secureToggle?: boolean;
  inputRef?: Ref<ComponentRef<typeof TextInput>>;
  minHeight?: number;
};

export function TextField({
  label,
  hint,
  error,
  icon,
  secureToggle = false,
  inputRef,
  minHeight,
  multiline,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const { colors, scheme } = useTheme();
  const [hidden, setHidden] = useState(secureToggle);
  const focus = useSharedValue(0);

  const frameStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? colors.danger
      : interpolateColor(focus.get(), [0, 1], [colors.border, colors.primary]),
  }));

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="smallStrong" tone="muted" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <Animated.View
        style={[
          styles.frame,
          { backgroundColor: colors.surfaceSunken, minHeight: minHeight ?? 54 },
          multiline && styles.multilineFrame,
          frameStyle,
        ]}>
        {icon ? <Icon name={icon} size={20} color={colors.textSubtle} /> : null}
        <TextInput
          {...rest}
          ref={inputRef}
          multiline={multiline}
          secureTextEntry={hidden}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          keyboardAppearance={scheme}
          onFocus={(event) => {
            focus.set(withTiming(1, { duration: 160 }));
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focus.set(withTiming(0, { duration: 160 }));
            onBlur?.(event);
          }}
          style={[
            styles.input,
            webNoOutline,
            { color: colors.text },
            multiline && { minHeight: (minHeight ?? 54) - 24, textAlignVertical: 'top' },
          ]}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={10}>
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textSubtle} />
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? (
        <Text variant="caption" tone="danger" style={styles.below}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="subtle" style={styles.below}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

// The animated frame is the focus indicator; drop the browser's default ring.
// (RN's types only allow solid/dotted/dashed, but react-native-web passes it through.)
const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null;

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { marginLeft: 4 },
  frame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
  },
  multilineFrame: { alignItems: 'flex-start', paddingVertical: spacing.md },
  input: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 16,
    paddingVertical: 12,
    outlineWidth: 0,
  },
  below: { marginLeft: 4 },
});
