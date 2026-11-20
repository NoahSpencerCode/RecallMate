import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/Text';
import { palette, radii, springs, useTheme } from '@/theme';

export function passwordScore(password: string): 0 | 1 | 2 | 3 {
  if (password.length < 8) return password.length ? 1 : 0;
  let variety = 0;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) variety++;
  if (/\d/.test(password)) variety++;
  if (/[^a-zA-Z0-9]/.test(password)) variety++;
  return password.length >= 12 || variety >= 2 ? 3 : 2;
}

const LABELS = ['', 'Too short', 'Good', 'Strong'] as const;

/** Three-step meter that springs as the password improves. */
export function PasswordStrength({ password }: { password: string }) {
  const { colors } = useTheme();
  const score = passwordScore(password);
  const fill = useSharedValue(0);
  const color = [colors.border, colors.danger, palette.orange, colors.success][score];

  useEffect(() => {
    fill.set(withSpring(score / 3, springs.bouncy));
  }, [fill, score]);

  const barStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }));

  if (!password) return null;
  return (
    <View style={styles.row} accessibilityLabel={`Password strength: ${LABELS[score]}`}>
      <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
        <Animated.View style={[styles.bar, { backgroundColor: color }, barStyle]} />
      </View>
      <Text variant="caption" color={color} style={styles.label}>
        {LABELS[score]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -6, paddingHorizontal: 4 },
  track: { flex: 1, height: 8, borderRadius: radii.pill, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: radii.pill },
  label: { width: 64, textAlign: 'right' },
});
