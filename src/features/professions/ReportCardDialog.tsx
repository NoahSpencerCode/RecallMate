import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { friendlyError } from '@/lib/errors';
import { radii, spacing, useTheme } from '@/theme';

import type { ReportReason } from './api';
import { useReportCard } from './hooks';

const REASONS: { reason: ReportReason; label: string }[] = [
  { reason: 'wrong', label: 'It’s wrong' },
  { reason: 'unclear', label: 'It’s unclear' },
  { reason: 'typo', label: 'Typo or formatting' },
  { reason: 'other', label: 'Something else' },
];

type ReportCardDialogProps = {
  /** The card being reported, or null when the dialog is closed. */
  cardId: string | null;
  onClose: () => void;
};

/** "Report a problem" for a profession card: a reason and an optional note. */
export function ReportCardDialog({ cardId, onClose }: ReportCardDialogProps) {
  const { colors } = useTheme();
  const toast = useToast();
  const report = useReportCard();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');

  function close() {
    if (report.isPending) return;
    setReason(null);
    setNote('');
    onClose();
  }

  function send() {
    if (!cardId || !reason) return;
    report.mutate(
      { cardId, reason, note },
      {
        onSuccess: () => {
          toast({ tone: 'success', icon: 'flag-checkered', message: 'Thanks! This card will be checked and fixed.' });
          setReason(null);
          setNote('');
          onClose();
        },
        onError: (error) => toast({ tone: 'error', message: friendlyError(error) }),
      },
    );
  }

  return (
    <Modal visible={cardId !== null} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(180)} style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Dismiss" />
        <Animated.View
          entering={ZoomIn.springify().damping(14).stiffness(220)}
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
              <Icon name="flag-outline" size={30} color={colors.primary} />
            </View>
            <Text variant="heading" align="center">
              Report a problem
            </Text>
            <Text variant="body" tone="muted" align="center">
              What’s wrong with this card? Reports go into the next content update.
            </Text>
            <View style={styles.reasons} accessibilityRole="radiogroup">
              {REASONS.map((r) => (
                <Chip key={r.reason} label={r.label} selected={reason === r.reason} onPress={() => setReason(r.reason)} />
              ))}
            </View>
            <View style={styles.note}>
              <TextField
                placeholder="Add a note (optional)"
                value={note}
                onChangeText={(text) => setNote(text.slice(0, 1000))}
                multiline
                minHeight={72}
                accessibilityLabel="Note"
              />
            </View>
            <View style={styles.actions}>
              <Button title="Cancel" variant="secondary" size="md" onPress={close} style={styles.action} fullWidth />
              <Button
                title="Send"
                size="md"
                icon="send"
                disabled={!reason}
                loading={report.isPending}
                onPress={send}
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
  card: { width: '100%', maxWidth: 440, maxHeight: '100%', borderRadius: radii.xl, borderWidth: 1.5, overflow: 'hidden' },
  content: { padding: spacing.xxl, gap: spacing.md, alignItems: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  reasons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  note: { alignSelf: 'stretch' },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, alignSelf: 'stretch' },
  action: { flex: 1 },
});
