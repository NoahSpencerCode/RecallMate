import { Platform, useColorScheme, useWindowDimensions } from 'react-native';

import { darkColors, layout, lightColors, type ColorScheme, type ThemeColors } from './tokens';

export * from './tokens';
export * from './motion';

export type Theme = {
  scheme: ColorScheme;
  colors: ThemeColors;
};

const themes: Record<ColorScheme, Theme> = {
  light: { scheme: 'light', colors: lightColors },
  dark: { scheme: 'dark', colors: darkColors },
};

/** The current theme; follows the system light/dark setting. */
export function useTheme(): Theme {
  return themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}

/**
 * Background for full screens. Transparent on web so the animated neuron
 * field (mounted once at the root) shows through; solid on native.
 */
export function useScreenBackground(): string {
  const { colors } = useTheme();
  return Platform.OS === 'web' ? 'transparent' : colors.background;
}

/** True when there's room for the desktop sidebar layout. */
export function useIsWide(): boolean {
  return useWindowDimensions().width >= layout.wideBreakpoint;
}
