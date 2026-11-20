import { createContext, use, useCallback, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOutUp, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptics } from '@/lib/haptics';
import { palette, radii, spacing, useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type ToastTone = 'success' | 'error' | 'info';
type ToastInput = { message: string; tone?: ToastTone; icon?: IconName };
type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

/** Show a short message at the top of the screen. */
export function useToast() {
  return use(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((input: ToastInput) => {
    if (timer.current) clearTimeout(timer.current);
    if (input.tone === 'error') haptics.error();
    setToast({ ...input, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext value={show}>
      {children}
      {toast ? <ToastView key={toast.id} toast={toast} /> : null}
    </ToastContext>
  );
}

function ToastView({ toast }: { toast: ToastItem }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tone = toast.tone ?? 'info';
  const accent = tone === 'success' ? colors.success : tone === 'error' ? colors.danger : palette.violet;
  const icon: IconName =
    toast.icon ?? (tone === 'success' ? 'check-circle' : tone === 'error' ? 'alert-circle' : 'information');

  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      <Animated.View
        entering={SlideInUp.springify().damping(16).stiffness(200)}
        exiting={FadeOutUp.duration(200)}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[
          styles.toast,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderBottomColor: accent },
        ]}>
        <Icon name={icon} size={22} color={accent} />
        <Text variant="smallStrong" style={styles.message}>
          {toast.message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: spacing.lg },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 480,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  message: { flexShrink: 1 },
});
