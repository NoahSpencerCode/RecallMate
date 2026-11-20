import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { radii, spacing, useTheme } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  icon?: IconName;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'danger',
  icon = 'alert-circle-outline',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors } = useTheme();
  const accent = tone === 'danger' ? colors.danger : colors.primary;
  // Once confirmed, the action can't be called back, so don't pretend Cancel can.
  const cancel = loading ? () => {} : onCancel;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={cancel} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(180)} style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={cancel} accessibilityLabel="Dismiss" />
        <Animated.View
          entering={ZoomIn.springify().damping(14).stiffness(220)}
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.iconWrap, { backgroundColor: `${accent}1F` }]}>
              <Icon name={icon} size={30} color={accent} />
            </View>
            <Text variant="heading" align="center">
              {title}
            </Text>
            <Text variant="body" tone="muted" align="center">
              {message}
            </Text>
            <View style={styles.actions}>
              <Button
                title={cancelLabel}
                variant="secondary"
                size="md"
                disabled={loading}
                onPress={cancel}
                style={styles.action}
                fullWidth
              />
              <Button
                title={confirmLabel}
                variant={tone === 'danger' ? 'danger' : 'primary'}
                size="md"
                loading={loading}
                onPress={onConfirm}
                style={styles.action}
                fullWidth
              />
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '100%',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardContent: { padding: spacing.xxl, alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, alignSelf: 'stretch' },
  action: { flex: 1 },
});
