import { router } from 'expo-router';
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/AuthProvider';
import { useProgress } from '@/features/progress/hooks';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';
import { fonts, gradients, layout, radii, spacing, springs, useTheme } from '@/theme';

import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Logo } from '../Logo';
import { PressableScale } from '../PressableScale';
import { StreakPill } from '../StreakFlame';
import { Text } from '../Text';

type NavButtonProps = TabTriggerSlotProps & {
  icon: IconName;
  label: string;
  variant: 'bar' | 'sidebar';
};

/** A tab: the active one gets a springy colored pill. */
export function NavButton({
  icon,
  label,
  variant,
  isFocused = false,
  href: _href,
  ref: _ref,
  onPress,
  ...rest
}: NavButtonProps) {
  const { colors } = useTheme();
  const active = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    active.set(withSpring(isFocused ? 1 : 0, springs.bouncy));
  }, [active, isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: active.get(),
    transform: [{ scale: interpolate(active.get(), [0, 1], [0.6, 1]) }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: variant === 'bar' ? interpolate(active.get(), [0, 1], [0, -2]) : 0 }],
  }));

  const tint = isFocused ? (variant === 'bar' ? '#FFFFFF' : colors.primary) : colors.textSubtle;

  return (
    <Pressable
      {...rest}
      onPress={(event) => {
        haptics.select();
        onPress?.(event);
      }}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={variant === 'bar' ? styles.barButton : styles.sideButton}>
      {variant === 'bar' ? (
        <>
          <View style={styles.barIconWrap}>
            <Animated.View style={[styles.barPill, { backgroundColor: colors.primary }, pillStyle]} />
            <Animated.View style={iconStyle}>
              <Icon name={icon} size={22} color={tint} />
            </Animated.View>
          </View>
          <Text
            style={{ fontFamily: isFocused ? fonts.extrabold : fonts.semibold, fontSize: 11 }}
            color={isFocused ? colors.primary : colors.textSubtle}>
            {label}
          </Text>
        </>
      ) : (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, styles.sidePill, { backgroundColor: colors.primarySoft }, pillStyle]} />
          <Icon name={icon} size={22} color={tint} />
          <Text style={{ fontFamily: isFocused ? fonts.extrabold : fonts.semibold, fontSize: 15 }} color={isFocused ? colors.primary : colors.textMuted}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

/** The big gradient "+" in the middle of the tab bar. */
function CreateButton() {
  return (
    <PressableScale
      haptic
      scaleTo={0.88}
      onPress={() => router.push('/memory/new')}
      accessibilityRole="button"
      accessibilityLabel="Write a new card"
      style={styles.createWrap}>
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.create}>
        <Icon name="plus" size={30} color="#FFFFFF" />
      </LinearGradient>
    </PressableScale>
  );
}

/** Phone navigation: a floating pill bar. Children are the TabTriggers. */
export function FloatingTabBar({ children, style: _style, ...rest }: TabListProps & { children?: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const items = Array.isArray(children) ? children : [children];
  const middle = Math.ceil(items.length / 2);

  return (
    <View {...rest} style={[styles.barHost, { bottom: Math.max(insets.bottom, spacing.md) }]} pointerEvents="box-none">
      <View
        style={[
          styles.bar,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border, shadowColor: colors.shadow },
        ]}>
        {items.slice(0, middle)}
        <CreateButton />
        {items.slice(middle)}
      </View>
    </View>
  );
}

/** Desktop/tablet navigation down the left side. */
export function Sidebar({ children, style: _style, ...rest }: TabListProps & { children?: ReactNode }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const today = useToday();
  const { data: progress } = useProgress(today);
  const initial = (user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <View
      {...rest}
      style={[
        styles.sidebar,
        // Slightly see-through on web so the neuron field glows behind it.
        { backgroundColor: Platform.OS === 'web' ? `${colors.backgroundAlt}CC` : colors.backgroundAlt, borderRightColor: colors.border },
      ]}>
      <View style={styles.sideLogo}>
        <Logo size={38} />
      </View>
      <View style={styles.sideNav}>{children}</View>
      <Button title="New card" icon="plus" fullWidth onPress={() => router.push('/memory/new')} />
      <Button
        title="How it works"
        variant="ghost"
        size="sm"
        icon="lightbulb-question-outline"
        onPress={() => router.push('/about')}
        style={styles.sideAbout}
      />
      <View style={styles.sideSpacer} />
      <View style={styles.sideFooter}>
        <StreakPill days={progress?.current_streak ?? 0} />
        <PressableScale
          onPress={() => router.navigate('/progress')}
          accessibilityRole="button"
          accessibilityLabel="Account and progress"
          style={[styles.account, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 14 }} color="#FFFFFF">
              {initial}
            </Text>
          </View>
          <Text variant="caption" tone="muted" numberOfLines={1} style={styles.email}>
            {user?.email}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barHost: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: spacing.lg },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 480,
    height: layout.tabBarHeight,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  barButton: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' },
  barIconWrap: { width: 48, height: 30, alignItems: 'center', justifyContent: 'center' },
  barPill: { ...StyleSheet.absoluteFill, borderRadius: radii.pill },
  createWrap: { marginHorizontal: spacing.xs, marginTop: -26 },
  create: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  sidebar: {
    width: 248,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    borderRightWidth: 1.5,
    gap: spacing.lg,
  },
  sideLogo: { paddingHorizontal: spacing.sm, marginBottom: spacing.md },
  sideNav: { gap: spacing.xs },
  sideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  sidePill: { borderRadius: radii.md },
  sideSpacer: { flex: 1 },
  sideAbout: { alignSelf: 'center', marginTop: -spacing.sm },
  sideFooter: { gap: spacing.md, alignItems: 'flex-start' },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignSelf: 'stretch',
  },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  email: { flex: 1 },
});
