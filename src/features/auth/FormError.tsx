import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { radii, spacing, useTheme } from '@/theme';

/** Error banner that shakes each time a new error arrives. */
export function FormError({ message }: { message: string | null }) {
  const { colors } = useTheme();
  const shake = useSharedValue(0);

  useEffect(() => {
    if (!message) return;
    shake.set(
      withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 70 }),
        withTiming(-5, { duration: 60 }),
        withTiming(5, { duration: 60 }),
        withTiming(0, { duration: 50 }),
      ),
    );
  }, [message, shake]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  if (!message) return null;
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: colors.dangerSoft, borderColor: `${colors.danger}55` }, style]}>
      <Icon name="alert-circle" size={20} color={colors.danger} />
      <Text variant="smallStrong" color={colors.danger} style={styles.text}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  text: { flex: 1 },
});
