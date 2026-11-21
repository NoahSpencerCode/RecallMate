/**
 * RecallMate design tokens: bold, playful, high-contrast.
 * Chunky shapes with a solid "pressable edge", saturated accents, and a warm
 * cream (light) or deep indigo (dark) canvas.
 */

export const palette = {
  violet: '#6C4DFF',
  violetBright: '#8B73FF',
  violetDeep: '#4A2FD9',
  pink: '#FF4FA3',
  pinkDeep: '#D62F82',
  coral: '#FF6B57',
  orange: '#FF9F1C',
  yellow: '#FFD23F',
  mint: '#2ED9A3',
  mintDeep: '#14A87A',
  teal: '#16C2C2',
  sky: '#38B6FF',
  indigo: '#4C6FFF',
  red: '#FF4D6D',
  ink: '#150F2E',
  cream: '#FFF6EC',
  white: '#FFFFFF',
} as const;

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  onAccent: string;
  primary: string;
  primaryEdge: string;
  primarySoft: string;
  secondary: string;
  secondaryEdge: string;
  success: string;
  successEdge: string;
  successSoft: string;
  danger: string;
  dangerEdge: string;
  dangerSoft: string;
  warning: string;
  overlay: string;
  shadow: string;
  /** Soft background color pools: [color, opacity]. */
  blobs: readonly (readonly [string, number])[];
};

export const lightColors: ThemeColors = {
  background: palette.cream,
  backgroundAlt: '#FFEEDB',
  surface: palette.white,
  surfaceRaised: palette.white,
  surfaceSunken: '#F6EEE4',
  border: 'rgba(21, 15, 46, 0.09)',
  borderStrong: 'rgba(21, 15, 46, 0.18)',
  text: palette.ink,
  textMuted: '#5B557D',
  textSubtle: '#8D88A8',
  onAccent: palette.white,
  primary: palette.violet,
  primaryEdge: palette.violetDeep,
  primarySoft: 'rgba(108, 77, 255, 0.12)',
  secondary: palette.pink,
  secondaryEdge: palette.pinkDeep,
  success: '#16B886',
  successEdge: '#0E8F67',
  successSoft: 'rgba(22, 184, 134, 0.14)',
  danger: '#F03E5E',
  dangerEdge: '#C2223F',
  dangerSoft: 'rgba(240, 62, 94, 0.12)',
  warning: '#F5A700',
  overlay: 'rgba(21, 15, 46, 0.45)',
  shadow: 'rgba(21, 15, 46, 0.12)',
  blobs: [
    [palette.pink, 0.22],
    [palette.violet, 0.2],
    [palette.yellow, 0.32],
  ],
};

export const darkColors: ThemeColors = {
  background: '#0F0B1E',
  backgroundAlt: '#140F2A',
  surface: '#1B1538',
  surfaceRaised: '#251D4B',
  surfaceSunken: '#130E29',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  text: '#FFFFFF',
  textMuted: '#BDB6E2',
  textSubtle: '#8A82B6',
  onAccent: palette.white,
  primary: palette.violetBright,
  primaryEdge: palette.violetDeep,
  primarySoft: 'rgba(139, 115, 255, 0.18)',
  secondary: palette.pink,
  secondaryEdge: palette.pinkDeep,
  success: palette.mint,
  successEdge: palette.mintDeep,
  successSoft: 'rgba(46, 217, 163, 0.16)',
  danger: palette.red,
  dangerEdge: '#C9264A',
  dangerSoft: 'rgba(255, 77, 109, 0.16)',
  warning: palette.yellow,
  overlay: 'rgba(5, 3, 14, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.45)',
  blobs: [
    [palette.pink, 0.24],
    [palette.violet, 0.34],
    [palette.sky, 0.18],
  ],
};

export const gradients = {
  brand: [palette.violet, '#A34DFF', palette.pink] as const,
  sunrise: [palette.pink, palette.coral, palette.orange] as const,
  mint: [palette.teal, palette.mint] as const,
  night: ['#2A1F66', '#170F3A'] as const,
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

/** Height of the solid "edge" under chunky buttons and cards. */
export const edge = {
  button: 5,
  card: 4,
} as const;

export const fonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  displayBold: 'BricolageGrotesque_700Bold',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
  /** Code on cards. */
  mono: 'JetBrainsMono_500Medium',
} as const;

export const layout = {
  /** Width at which the app switches to the sidebar layout. */
  wideBreakpoint: 900,
  maxContentWidth: 980,
  maxReadingWidth: 640,
  tabBarHeight: 64,
} as const;
