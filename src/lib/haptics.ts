import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const supported = Platform.OS === 'ios' || Platform.OS === 'android';
const ignore = () => {};

/** Fire-and-forget haptics; no-ops on web. */
export const haptics = {
  tap() {
    if (supported) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore);
  },
  pop() {
    if (supported) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(ignore);
  },
  select() {
    if (supported) Haptics.selectionAsync().catch(ignore);
  },
  success() {
    if (supported) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(ignore);
  },
  error() {
    if (supported) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(ignore);
  },
};
