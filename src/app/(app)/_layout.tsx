import { Stack } from 'expo-router';

import { useScreenBackground } from '@/theme';

export const unstable_settings = { anchor: '(tabs)' };

export default function AppLayout() {
  const background = useScreenBackground();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: background },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="review"
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', gestureEnabled: false }}
      />
      <Stack.Screen name="memory/new" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="memory/[id]" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="pack/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="profession/[id]/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen
        name="profession/[id]/open"
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', gestureEnabled: false }}
      />
      <Stack.Screen
        name="profession/[id]/placement"
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', gestureEnabled: false }}
      />
      <Stack.Screen name="profession/[id]/module/[module]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="account/reset" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
