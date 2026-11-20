import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBlobs } from '@/components/GradientBlobs';
import { IconButton } from '@/components/IconButton';
import { Logo } from '@/components/Logo';
import { Text } from '@/components/Text';
import { gradients, radii, spacing, useIsWide, useScreenBackground } from '@/theme';

import { FloatingCards } from './FloatingCards';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showBack?: boolean;
};

/** Layout for sign-in/up screens: hero art beside the form on wide screens. */
export function AuthShell({ title, subtitle, children, showBack = true }: AuthShellProps) {
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();

  const form = (
    <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.form}>
      {!isWide ? <Logo size={36} /> : null}
      <View style={styles.heading}>
        <Text variant="title">{title}</Text>
        <Text variant="body" tone="muted">
          {subtitle}
        </Text>
      </View>
      {children}
    </Animated.View>
  );

  return (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      {isWide ? (
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Logo size={44} color="#FFFFFF" />
          <FloatingCards />
          <Text variant="heading" color="#FFFFFF" style={styles.heroLine}>
            Learn it once. Keep it for good.
          </Text>
        </LinearGradient>
      ) : (
        <GradientBlobs />
      )}
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxl },
          ]}>
          {showBack ? (
            <IconButton
              icon="arrow-left"
              accessibilityLabel="Back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
              style={styles.back}
            />
          ) : null}
          {form}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  hero: {
    flex: 1,
    maxWidth: 560,
    padding: spacing.huge,
    justifyContent: 'space-between',
    borderTopRightRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  heroLine: { fontSize: 28, lineHeight: 34, maxWidth: 360 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  back: { position: 'absolute', top: spacing.xl, left: spacing.xl, zIndex: 2 },
  form: { width: '100%', maxWidth: 420, alignSelf: 'center', gap: spacing.xl, paddingTop: spacing.huge },
  heading: { gap: spacing.xs },
});
