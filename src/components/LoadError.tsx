import { palette } from '@/theme';

import { Button } from './Button';
import { EmptyState } from './EmptyState';

type LoadErrorProps = {
  title?: string;
  onRetry: () => void;
  retrying?: boolean;
};

/**
 * For data that didn't load. Use it instead of the empty state, which would
 * tell someone with hundreds of cards that they have none.
 */
export function LoadError({ title = 'Couldn’t load your cards', onRetry, retrying = false }: LoadErrorProps) {
  return (
    <EmptyState
      icon="wifi-off"
      color={palette.pink}
      title={title}
      message="Check your connection and try again. Nothing has been lost.">
      <Button title="Try again" variant="secondary" icon="refresh" loading={retrying} onPress={onRetry} />
    </EmptyState>
  );
}
