import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { friendlyError } from '@/lib/errors';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { layout, spacing, useIsWide, useScreenBackground, useTheme } from '@/theme';

const CONFIRM_WORD = 'RESET';

type Item = { icon: IconName; text: string };

const ERASED: Item[] = [
  { icon: 'cards-outline', text: 'Every card in your library, including the study packs you added' },
  { icon: 'chart-timeline-variant', text: 'All review history, so your streak, heatmap and stats start from zero' },
  { icon: 'school-outline', text: 'Your progress and starting point in every profession' },
];

const KEPT: Item[] = [
  { icon: 'account-check-outline', text: 'Your account, email and sign-in' },
  { icon: 'flag-outline', text: 'Problem reports you sent about cards' },
];

/**
 * Reset account: erases every card and all learning history but keeps the
 * account, for a fresh start. Deliberately tucked away (Progress › Account ›
 * Reset account) and guarded by typing a confirmation word.
 */
export default function ResetAccountScreen() {
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const toast = useToast();
  const [typed, setTyped] = useState('');
  const [resetting, setResetting] = useState(false);
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const back = () => (router.canGoBack() ? router.back() : router.replace('/progress'));

  async function reset() {
    if (!confirmed || resetting) return;
    setResetting(true);
    const { error } = await supabase.rpc('reset_account');
    if (error) {
      setResetting(false);
      toast({ tone: 'error', message: friendlyError(error) });
      return;
    }
    // Drop every cached list and count and refetch what's on screen, so no tab still shows erased cards.
    await queryClient.resetQueries();
    toast({ tone: 'success', icon: 'restart', message: 'Fresh start! Your cards and history are erased.' });
    back();
  }

  return (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.huge,
            paddingHorizontal: isWide ? spacing.xxxl : spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={back} />

        <View style={styles.header}>
          <Text variant="label" tone="muted">
            Account
          </Text>
          <Text variant="title">Reset account</Text>
          <Text variant="body" tone="muted">
            Start over with a clean slate. You stay signed in with the same email, but everything you’ve learned in
            RecallMate so far is erased.
          </Text>
        </View>

        <Card>
          <Text variant="subheading" style={styles.cardTitle}>
            What gets erased
          </Text>
          <View style={styles.list}>
            {ERASED.map((item) => (
              <Row key={item.text} item={item} color={colors.danger} />
            ))}
          </View>
        </Card>

        <Card>
          <Text variant="subheading" style={styles.cardTitle}>
            What stays
          </Text>
          <View style={styles.list}>
            {KEPT.map((item) => (
              <Row key={item.text} item={item} color={colors.success} />
            ))}
          </View>
        </Card>

        <Card>
          <Text variant="subheading">This can’t be undone</Text>
          <Text variant="small" tone="muted" style={styles.warning}>
            There’s no backup to restore from. To confirm, type {CONFIRM_WORD} below.
          </Text>
          <TextField
            label={`Type ${CONFIRM_WORD} to confirm`}
            accessibilityLabel={`Type ${CONFIRM_WORD} to confirm`}
            placeholder={CONFIRM_WORD}
            value={typed}
            onChangeText={setTyped}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            editable={!resetting}
            accessibilityHint={`Type ${CONFIRM_WORD} to enable the erase button`}
          />
          <Button
            title="Erase everything"
            variant="danger"
            icon="restart"
            loading={resetting}
            disabled={!confirmed}
            fullWidth
            onPress={() => void reset()}
            style={styles.button}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

function Row({ item, color }: { item: Item; color: string }) {
  return (
    <View style={styles.row}>
      <Icon name={item.icon} size={22} color={color} />
      <Text variant="body" style={styles.rowText}>
        {item.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', gap: spacing.xl },
  header: { gap: spacing.sm },
  cardTitle: { marginBottom: spacing.md },
  list: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  rowText: { flex: 1 },
  warning: { marginTop: 2, marginBottom: spacing.lg },
  button: { marginTop: spacing.lg },
});
