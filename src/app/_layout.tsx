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
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { SetupScreen } from '@/components/SetupScreen';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { missingEnv } from '@/lib/env';
import { queryClient } from '@/lib/queryClient';
import { useTheme } from '@/theme';

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

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { session, initializing, recovering } = useAuth();
  const theme = useTheme();
  const ready = fontsReady && !initializing;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  // Arriving from a password-reset email: send them to set a new password.
  useEffect(() => {
    if (ready && recovering) router.replace('/reset-password');
  }, [ready, recovering]);

  if (!ready) return null;

  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      {missingEnv.length > 0 ? (
        <SetupScreen missing={missingEnv} />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: theme.colors.background },
          }}>
          <Stack.Protected guard={Boolean(session)} redirectTo="/welcome">
            <Stack.Screen name="(app)" />
          </Stack.Protected>
          <Stack.Protected guard={!session} redirectTo="/">
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        </Stack>
      )}
    </ThemeProvider>
  );
}
