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
    </Stack>
  );
}
