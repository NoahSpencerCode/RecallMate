import { Linking, Platform } from 'react-native';

/** Opens a link without leaving the app (a new tab on the web). */
export function openLink(url: string) {
  if (Platform.OS === 'web') window.open(url, '_blank', 'noopener,noreferrer');
  else void Linking.openURL(url);
}
