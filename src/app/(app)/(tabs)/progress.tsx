import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ForecastBars } from '@/components/ForecastBars';
import { Heatmap } from '@/components/Heatmap';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { LoadError } from '@/components/LoadError';
import { Skeleton } from '@/components/Skeleton';
import { StatTile } from '@/components/StatTile';
import { Flame } from '@/components/StreakFlame';
import { Text } from '@/components/Text';
import { useToast } from '@/components/Toast';
import { signOut as signOutOfThisDevice, useAuth } from '@/features/auth/AuthProvider';
import { allCards, useProgress } from '@/features/progress/hooks';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { useToday } from '@/lib/useToday';
import { gradients, palette, radii, spacing, useTheme } from '@/theme';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const toast = useToast();
  const today = useToday();
  const query = useProgress(today);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const p = query.data;
  const mix = p ? allCards(p) : undefined;
  const mixTotal = mix ? Math.max(1, mix.fresh + mix.learning + mix.mastered) : 1;
  const streakLine = !p
    ? ''
    : p.current_streak === 0
      ? 'Review one card today to start a streak.'
      : p.reviewed_today > 0
        ? 'Today counts. See you tomorrow!'
        : 'Review today to keep it alive!';

  async function signOut() {
    setSigningOut(true);
    // Just this device, and it works offline (say, on a library computer).
    await signOutOfThisDevice();
    setSigningOut(false);
  }

  async function deleteAccount() {
    setDeleting(true);
    const { error } = await supabase.rpc('delete_account');
    if (error) {
      setDeleting(false);
      setConfirmDelete(false);
      toast({ tone: 'error', message: friendlyError(error) });
      return;
    }
    toast({ tone: 'info', icon: 'account-remove-outline', message: 'Your account and all its cards have been deleted.' });
    await signOutOfThisDevice();
  }

  return (
    <Screen
      tabBar
      refreshControl={
        <RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor={colors.primary} />
      }>
      <Animated.View entering={FadeInDown.springify().damping(16)}>
        <Text variant="title">Progress</Text>
      </Animated.View>

      {!p && query.isError ? (
        <LoadError title="Couldn’t load your progress" onRetry={() => void query.refetch()} retrying={query.isFetching} />
      ) : !p ? (
        <>
          <Skeleton height={150} radius={radii.xl} />
          <Skeleton height={110} radius={radii.xl} />
          <Skeleton height={220} radius={radii.xl} />
        </>
      ) : (
        <>
          <Animated.View entering={FadeInDown.delay(60).springify().damping(15)}>
            <LinearGradient colors={gradients.sunrise} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streak}>
              <View style={styles.flameBadge}>
                <Flame size={60} lit={p.current_streak > 0} />
              </View>
              <View style={styles.streakText}>
                <View style={styles.streakNumber}>
                  <AnimatedNumber value={p.current_streak} variant="hero" color="#FFFFFF" style={styles.bigNumber} />
                  <Text variant="subheading" color="#FFFFFF">
                    day streak
                  </Text>
                </View>
                <Text variant="small" color="rgba(255,255,255,0.92)">
                  {streakLine} Best: {p.best_streak} {p.best_streak === 1 ? 'day' : 'days'}.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.tiles}>
            <StatTile index={0} icon="lightning-bolt" color={colors.primary} value={p.total_reviews} label="Total reviews" />
            <StatTile
              index={1}
              icon="bullseye-arrow"
              color={colors.success}
              value={p.accuracy_30d === null ? 0 : p.accuracy_30d * 100}
              format={(n) => (p.accuracy_30d === null ? '—' : `${Math.round(n)}%`)}
              label="Accuracy (30d)"
            />
          </View>
          <View style={styles.tiles}>
            <StatTile index={2} icon="trophy-outline" color={palette.yellow} value={mix?.mastered ?? 0} label="Mastered" />
            <StatTile index={3} icon="sprout-outline" color={palette.sky} value={mix?.learning ?? 0} label="Learning" />
          </View>

          <Card>
            <Text variant="subheading" style={styles.cardTitle}>
              Last 12 weeks
            </Text>
            <Heatmap activity={p.activity} today={today} />
          </Card>

          <Card>
            <Text variant="subheading" style={styles.cardTitle}>
              Coming up
            </Text>
            <ForecastBars forecast={p.forecast} />
          </Card>

          {mix && mix.total > 0 ? (
            <Card>
              <Text variant="subheading" style={styles.cardTitle}>
                Card mix · {mix.total}
              </Text>
              <View style={styles.mixBar}>
                {[
                  { value: mix.fresh, color: colors.textSubtle },
                  { value: mix.learning, color: palette.sky },
                  { value: mix.mastered, color: palette.yellow },
                ].map((seg, i) =>
                  seg.value > 0 ? (
                    <View key={i} style={{ flex: seg.value / mixTotal, backgroundColor: seg.color, height: '100%' }} />
                  ) : null,
                )}
              </View>
              <View style={styles.legend}>
                <LegendDot color={colors.textSubtle} label={`New ${mix.fresh}`} />
                <LegendDot color={palette.sky} label={`Learning ${mix.learning}`} />
                <LegendDot color={palette.yellow} label={`Mastered ${mix.mastered}`} />
              </View>
            </Card>
          ) : null}
        </>
      )}

      <Card onPress={() => router.push('/about')} accessibilityLabel="How RecallMate works">
        <View style={styles.aboutRow}>
          <View style={[styles.aboutIcon, { backgroundColor: colors.primarySoft }]}>
            <Icon name="lightbulb-question-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.aboutText}>
            <Text variant="subheading">How RecallMate works</Text>
            <Text variant="small" tone="muted">
              The science behind the Fibonacci schedule, and how to ace your finals with it.
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSubtle} />
        </View>
      </Card>

      <Card>
        <Text variant="subheading">Account</Text>
        <Text variant="small" tone="muted" style={styles.email}>
          Signed in as {user?.email}
        </Text>
        <View style={styles.accountActions}>
          <Button title="Sign out" variant="secondary" size="md" icon="logout" loading={signingOut} onPress={signOut} />
          <Button title="Delete account" variant="dangerGhost" size="md" icon="delete-outline" onPress={() => setConfirmDelete(true)} />
        </View>
        <Button
          title="Reset account…"
          variant="ghost"
          size="sm"
          icon="restart"
          accessibilityLabel="Reset account: erase all cards and start fresh"
          onPress={() => router.push('/account/reset')}
          style={styles.resetLink}
        />
      </Card>

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete your account?"
        message="This permanently deletes your account, every card and all review history. It can’t be undone."
        confirmLabel="Delete forever"
        icon="account-remove-outline"
        loading={deleting}
        onConfirm={deleteAccount}
        onCancel={() => setConfirmDelete(false)}
      />
    </Screen>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, padding: spacing.xl, borderRadius: radii.xl },
  flameBadge: {
    width: 92,
    height: 92,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: { flex: 1, gap: spacing.xs },
  streakNumber: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  bigNumber: { fontSize: 52, lineHeight: 56 },
  tiles: { flexDirection: 'row', gap: spacing.md },
  cardTitle: { marginBottom: spacing.lg },
  mixBar: { flexDirection: 'row', height: 16, borderRadius: radii.pill, overflow: 'hidden', gap: 3 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  email: { marginTop: 2, marginBottom: spacing.lg },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  aboutIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  aboutText: { flex: 1, gap: 2 },
  accountActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  resetLink: { alignSelf: 'flex-start', marginTop: spacing.md },
});
