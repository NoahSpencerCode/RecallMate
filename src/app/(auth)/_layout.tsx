import { Stack } from 'expo-router';

import { useScreenBackground } from '@/theme';

export const unstable_settings = { anchor: 'welcome' };

export default function AuthLayout() {
  const background = useScreenBackground();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: background },
      }}
    />
  );
}
