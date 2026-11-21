import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LogoMark } from '@/components/Logo';
import { NeuralBackground } from '@/components/neural/NeuralBackground';
import { SetupScreen } from '@/components/SetupScreen';
import { ToastProvider, useToast } from '@/components/Toast';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { missingEnv } from '@/lib/env';
import { queryClient } from '@/lib/queryClient';
import { palette, spacing, useTheme } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    JetBrainsMono_500Medium,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RootNavigator fontsReady={fontsLoaded || Boolean(fontError)} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/** Pages anyone can open; anything else needs an account. */
const PUBLIC_PATHS = new Set(['/', '/welcome', '/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/confirm', '/about']);

// The address the web app was opened at, read before any sign-in redirect replaces it.
const openedAt =
  Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.pathname + window.location.search : null;

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { session, initializing, offline, retry, recovering, notice, clearNotice, lostSession } = useAuth();
  const theme = useTheme();
  const toast = useToast();
  const ready = fontsReady && !initializing;

  // Opened a signed-in page (a bookmark, a shared link) while signed out: go there after sign-in.
  // Decided once the session is known; dropped if they sign out again.
  const [returnTo, setReturnTo] = useState<string | null | undefined>(undefined);
  const [previousSession, setPreviousSession] = useState(session);
  if (ready && returnTo === undefined) {
    setReturnTo(!session && openedAt && !PUBLIC_PATHS.has(openedAt.split('?')[0]) ? openedAt : null);
  }
  if (session !== previousSession) {
    setPreviousSession(session);
    if (!session && previousSession && returnTo) setReturnTo(null);
  }

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  // Arriving from a password-reset email: send them to set a new password.
  useEffect(() => {
    if (ready && recovering) router.replace('/reset-password');
  }, [ready, recovering]);

  // Tell them, once, about things that happened to their session.
  useEffect(() => {
    if (!ready || !notice) return;
    clearNotice();
    if (notice === 'link-expired') {
      toast({
        tone: 'info',
        icon: 'link-variant-off',
        message: 'That email link has expired or was already used. Sign in, or ask for a new link.',
      });
    } else {
      toast({ tone: 'info', icon: 'logout', message: 'You’ve been signed out. Sign in again to pick up where you left off.' });
    }
  }, [ready, notice, clearNotice, toast]);

  if (!ready) return Platform.OS === 'web' ? <BootScreen color={theme.colors.background} /> : null;

  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const screenBackground = Platform.OS === 'web' ? 'transparent' : theme.colors.background;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: screenBackground,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <NeuralBackground />
      {missingEnv.length > 0 ? (
        <SetupScreen missing={missingEnv} />
      ) : offline ? (
        <View style={styles.center}>
          <EmptyState
            icon="wifi-off"
            color={palette.pink}
            title="You’re offline"
            message="RecallMate needs a connection to sign you back in. Your cards are safe, and this retries by itself once you’re back online.">
            <Button title="Try again" icon="refresh" onPress={retry} />
          </EmptyState>
        </View>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: screenBackground },
          }}>
          {/* Signed out without asking: straight to sign-in (email filled in), not the welcome pitch. */}
          <Stack.Protected guard={Boolean(session)} redirectTo={lostSession ? '/sign-in' : '/welcome'}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
          <Stack.Protected guard={!session} redirectTo={(returnTo ?? '/') as Href}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="confirm" />
          <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        </Stack>
      )}
      </View>
    </ThemeProvider>
  );
}

/**
 * While the stored session is restored (on the web; native keeps its splash screen).
 * Blank for a moment, then a quiet logo, so a slow network doesn't look like a broken page.
 */
function BootScreen({ color }: { color: string }) {
  return (
    <View style={[styles.center, { backgroundColor: color }]}>
      <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.boot}>
        <LogoMark size={64} />
        <ActivityIndicator color={palette.violet} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  boot: { alignItems: 'center', gap: spacing.lg },
});
