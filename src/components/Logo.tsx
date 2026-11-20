import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { palette } from '@/theme';

import { BRAIN_BOUNDS, BRAIN_PATH } from './brainPath';
import { Text } from './Text';

/**
 * Brand mark: the RecallMate brain on a violet→pink tile. The same drawing is
 * exported as the app icon by scripts/build-icons.mjs.
 */
export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Defs>
        <LinearGradient id="rm-bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={palette.violet} />
          <Stop offset="0.55" stopColor="#A34DFF" />
          <Stop offset="1" stopColor={palette.pink} />
        </LinearGradient>
      </Defs>
      <Rect width="1024" height="1024" rx="232" fill="url(#rm-bg)" />
      <Path d={BRAIN_PATH} fill="#FFFFFF" fillRule="evenodd" />
    </Svg>
  );
}

/** The brain on its own, e.g. inside a colored hero. `size` is its width. */
export function BrainGlyph({ size = 48, color = '#FFFFFF' }: { size?: number; color?: string }) {
  const { x, y, width, height } = BRAIN_BOUNDS;
  return (
    <Svg width={size} height={(size * height) / width} viewBox={`${x} ${y} ${width} ${height}`}>
      <Path d={BRAIN_PATH} fill={color} fillRule="evenodd" />
    </Svg>
  );
}

type LogoProps = { size?: number; showName?: boolean; color?: string };

export function Logo({ size = 40, showName = true, color }: LogoProps) {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="RecallMate">
      <LogoMark size={size} />
      {showName ? (
        <Text variant="heading" color={color} style={{ fontSize: size * 0.58, lineHeight: size * 0.7 }}>
          RecallMate
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
