import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

/**
 * Tints the phone browser's bars (theme-color) while a screen is in front, e.g.
 * to match a hero that runs to the top edge. Screens stay mounted underneath
 * the ones pushed over them, so this follows focus rather than mount. The
 * light/dark defaults live in public/index.html.
 */
export function useBrowserThemeColor(color: string) {
  useFocusEffect(
    useCallback(() => {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      // Browsers use the first matching theme-color, so go ahead of the defaults.
      document.head.prepend(meta);
      return () => meta.remove();
    }, [color]),
  );
}
