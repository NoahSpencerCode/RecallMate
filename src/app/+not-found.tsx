import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { palette } from '@/theme';

export default function NotFound() {
  return (
    <Screen maxWidth={560}>
      <EmptyState
        icon="map-marker-question-outline"
        color={palette.pink}
        title="This page wandered off"
        message="The link might be old, or the card was deleted.">
        <Button title="Go home" icon="home-variant" onPress={() => router.replace('/')} />
      </EmptyState>
    </Screen>
  );
}
