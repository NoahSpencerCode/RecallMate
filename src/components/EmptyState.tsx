import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { spacing } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type EmptyStateProps = {
  icon: IconName;
  color: string;
  title: string;
  message: string;
  children?: ReactNode;
};

/** Friendly placeholder with a gently bobbing icon. */
export function EmptyState({ icon, color, title, message, children }: EmptyStateProps) {
  const reduceMotion = useReducedMotion();
  const bob = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    bob.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [bob, reduceMotion]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 * bob.get() }, { rotate: `${-4 + 8 * bob.get()}deg` }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.wrap}>
      <Animated.View style={[styles.badge, { backgroundColor: `${color}22` }, iconStyle]}>
        <View style={[styles.inner, { backgroundColor: color }]}>
          <Icon name={icon} size={34} color="#FFFFFF" />
        </View>
      </Animated.View>
      <Text variant="heading" align="center">
        {title}
      </Text>
      <Text variant="body" tone="muted" align="center" style={styles.message}>
        {message}
      </Text>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg, gap: spacing.sm },
  badge: {
    width: 104,
    height: 104,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  inner: { width: 72, height: 72, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  message: { maxWidth: 360 },
  actions: { marginTop: spacing.lg, gap: spacing.md, alignItems: 'center' },
});
