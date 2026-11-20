import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { fonts, useTheme } from '@/theme';

export type TextVariant =
  | 'hero'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'small'
  | 'smallStrong'
  | 'caption'
  | 'label'
  | 'number';

export type TextTone = 'default' | 'muted' | 'subtle' | 'primary' | 'onAccent' | 'success' | 'danger';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Overrides `tone`. */
  color?: string;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', tone = 'default', color, align, style, ...rest }: TextProps) {
  const { colors } = useTheme();
  const toneColor: Record<TextTone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    subtle: colors.textSubtle,
    primary: colors.primary,
    onAccent: colors.onAccent,
    success: colors.success,
    danger: colors.danger,
  };
  return (
    <RNText
      {...rest}
      style={[
        variants[variant],
        { color: color ?? toneColor[tone] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}

const variants = StyleSheet.create({
  hero: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44, letterSpacing: -1.2 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 35, letterSpacing: -0.8 },
  heading: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27, letterSpacing: -0.4 },
  subheading: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 23 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
  label: {
    fontFamily: fonts.extrabold,
    fontSize: 11.5,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  number: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
});
