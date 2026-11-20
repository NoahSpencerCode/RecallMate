import { StyleSheet, View } from 'react-native';

import { radii, spacing, useTheme } from '@/theme';

import { Logo } from './Logo';
import { Screen } from './Screen';
import { Text } from './Text';

/** Shown in development when the Supabase env vars are missing. */
export function SetupScreen({ missing }: { missing: string[] }) {
  const { colors } = useTheme();
  return (
    <Screen maxWidth={560}>
      <Logo />
      <Text variant="title">Almost there</Text>
      <Text variant="body" tone="muted">
        RecallMate needs its Supabase settings. Copy .env.example to .env.local, fill in these values, and
        restart the dev server:
      </Text>
      <View style={[styles.box, { backgroundColor: colors.surfaceSunken, borderColor: colors.border }]}>
        {missing.map((name) => (
          <Text key={name} variant="smallStrong" selectable>
            {name}
          </Text>
        ))}
      </View>
      <Text variant="small" tone="subtle">
        For local development, run npm run db:start and copy the API URL and publishable key it prints.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { padding: spacing.lg, borderRadius: radii.md, borderWidth: 1.5, gap: spacing.xs },
});
