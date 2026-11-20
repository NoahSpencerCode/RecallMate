import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Confetti } from '@/components/Confetti';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { Skeleton } from '@/components/Skeleton';
import { Text } from '@/components/Text';
import { useToast } from '@/components/Toast';
import { useMemories } from '@/features/memories/hooks';
import { categoryLook } from '@/features/packs/categories';
import { useAddPack, usePack, usePackProgress, useRemovePack } from '@/features/packs/hooks';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useToday } from '@/lib/useToday';
import { enterItem, fonts, layout, palette, radii, spacing, useIsWide, useTheme } from '@/theme';

const PACES = [
  { perDay: 5, label: '5 a day', hint: 'Steady' },
  { perDay: 10, label: '10 a day', hint: 'Cram-ish' },
  { perDay: 0, label: 'All today', hint: 'Exam tomorrow' },
] as const;

export default function PackDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const toast = useToast();
  const today = useToday();
  const pack = usePack(id);
  const progress = usePackProgress();
  const memories = useMemories();
  const addPack = useAddPack();
  const removePack = useRemovePack();
  const [pace, setPace] = useState<number>(5);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [celebrate, setCelebrate] = useState(0);

  const look = categoryLook(pack.data?.categoryId);
  const mine = progress.data?.find((p) => p.packId === id);
  const added = Boolean(mine && mine.cardCount > 0);
  const dueFromPack = (memories.data ?? []).filter((m) => m.pack_id === id && m.due_on <= today).length;
  const typed = pack.data?.cards.filter((c) => c.hasAnswer).length ?? 0;

  function add() {
    addPack.mutate(
      { packId: id, perDay: pace, today },
      {
        onSuccess: (count) => {
          haptics.success();
          setCelebrate((n) => n + 1);
          const firstBatch = pace === 0 ? count : Math.min(pace, count);
          toast({
            tone: 'success',
            message: count
              ? `Added ${count} cards. ${firstBatch} ready to learn today!`
              : 'You already have every card from this pack.',
          });
        },
        onError: (error) => toast({ tone: 'error', message: friendlyError(error) }),
      },
    );
  }

  function remove() {
    removePack.mutate(id, {
      onSuccess: () => {
        setConfirmRemove(false);
        toast({ tone: 'info', icon: 'delete-outline', message: 'Pack removed from your library.' });
      },
      onError: (error) => {
        setConfirmRemove(false);
        toast({ tone: 'error', message: friendlyError(error) });
      },
    });
  }

  if (pack.isError) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <EmptyState icon="layers-off-outline" color={palette.pink} title="Pack not found" message="It may have been retired.">
          <Button title="Back to packs" variant="secondary" onPress={() => router.replace('/packs')} />
        </EmptyState>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.huge }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={look.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.heroInner}>
            <IconButton
              icon="arrow-left"
              accessibilityLabel="Back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/packs'))}
              background="rgba(255,255,255,0.2)"
              color="#FFFFFF"
              style={styles.back}
            />
            {pack.data ? (
              <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.heroText}>
                <View style={styles.heroIcon}>
                  <Icon name={look.icon} size={34} color="#FFFFFF" />
                </View>
                <Text variant="label" color="rgba(255,255,255,0.9)">
                  {pack.data.categoryName} · {pack.data.course}
                </Text>
                <Text variant="hero" color="#FFFFFF">
                  {pack.data.title}
                </Text>
                <Text variant="body" color="rgba(255,255,255,0.92)">
                  {pack.data.description}
                </Text>
                <View style={styles.heroStats}>
                  <View style={styles.heroStat}>
                    <Icon name="cards-outline" size={16} color="#FFFFFF" />
                    <Text variant="smallStrong" color="#FFFFFF">
                      {pack.data.cardCount} cards
                    </Text>
                  </View>
                  <View style={styles.heroStat}>
                    <Icon name="keyboard-outline" size={16} color="#FFFFFF" />
                    <Text variant="smallStrong" color="#FFFFFF">
                      {typed} typed answers
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ) : (
              <View style={styles.heroText}>
                <Skeleton height={36} width="60%" />
                <Skeleton height={20} width="90%" />
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={[styles.body, { paddingHorizontal: isWide ? spacing.xxxl : spacing.xl }]}>
          {pack.data ? (
            added && mine ? (
              <Animated.View entering={ZoomIn.springify().damping(14)}>
                <Card accent={look.color}>
                  <View style={styles.addedRow}>
                    <View style={[styles.check, { backgroundColor: look.color }]}>
                      <Icon name="check-bold" size={22} color="#FFFFFF" />
                    </View>
                    <View style={styles.flex}>
                      <Text variant="subheading">In your library</Text>
                      <Text variant="small" tone="muted">
                        {mine.cardCount} of {pack.data.cardCount} cards · {mine.startedCount} started ·{' '}
                        {mine.masteredCount} mastered
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
                    <View
                      style={[
                        styles.fill,
                        { backgroundColor: look.color, width: `${(mine.masteredCount / Math.max(1, pack.data.cardCount)) * 100}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.actions}>
                    {dueFromPack > 0 ? (
                      <Button title={`Review ${dueFromPack} due`} icon="play" size="md" onPress={() => router.push('/review')} />
                    ) : null}
                    {mine.cardCount < pack.data.cardCount ? (
                      <Button title="Add missing cards" variant="secondary" size="md" icon="plus" loading={addPack.isPending} onPress={add} />
                    ) : null}
                    <Button title="Remove pack" variant="dangerGhost" size="md" icon="delete-outline" onPress={() => setConfirmRemove(true)} />
                  </View>
                </Card>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn.duration(250)}>
                <Card>
                  <Text variant="subheading">How fast should new cards arrive?</Text>
                  <Text variant="small" tone="muted" style={styles.paceHint}>
                    New cards trickle in so reviews never pile up. You can change your mind later.
                  </Text>
                  <View style={styles.paces}>
                    {PACES.map((option) => {
                      const active = pace === option.perDay;
                      return (
                        <PressableScale
                          key={option.label}
                          onPress={() => {
                            haptics.select();
                            setPace(option.perDay);
                          }}
                          scaleTo={0.95}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: active }}
                          style={[
                            styles.pace,
                            {
                              borderColor: active ? look.color : colors.border,
                              backgroundColor: active ? `${look.color}18` : colors.surface,
                            },
                          ]}>
                          <Text style={{ fontFamily: fonts.extrabold, fontSize: 15 }} color={active ? look.color : colors.text}>
                            {option.label}
                          </Text>
                          <Text variant="caption" tone="subtle">
                            {option.hint}
                          </Text>
                        </PressableScale>
                      );
                    })}
                  </View>
                  <Button
                    title={`Add ${pack.data.cardCount} cards`}
                    icon="plus-circle"
                    fullWidth
                    loading={addPack.isPending}
                    onPress={add}
                  />
                </Card>
              </Animated.View>
            )
          ) : (
            <Skeleton height={180} radius={radii.xl} />
          )}

          {pack.data ? (
            <View style={styles.list}>
              <Text variant="heading">What’s inside</Text>
              {pack.data.cards.map((card, index) => (
                <Animated.View
                  key={card.id}
                  entering={enterItem(index, 100)}
                  style={[styles.cardRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.number, { backgroundColor: `${look.color}1F` }]}>
                    <Text style={{ fontFamily: fonts.extrabold, fontSize: 13 }} color={look.color}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text variant="smallStrong" style={styles.flex}>
                    {card.title}
                  </Text>
                  {card.hasAnswer ? <Icon name="keyboard-outline" size={18} color={colors.textSubtle} /> : null}
                </Animated.View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {celebrate > 0 ? <Confetti key={celebrate} originY={0.35} /> : null}

      <ConfirmDialog
        visible={confirmRemove}
        title="Remove this pack?"
        message="Its cards and their review progress will be deleted from your library. Your streak stays."
        confirmLabel="Remove"
        icon="delete-outline"
        loading={removePack.isPending}
        onConfirm={remove}
        onCancel={() => setConfirmRemove(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  hero: { borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl, paddingBottom: spacing.xxl },
  heroInner: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  back: { borderColor: 'rgba(255,255,255,0.3)' },
  heroText: { gap: spacing.sm },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  body: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', gap: spacing.xxl, marginTop: -spacing.lg },
  addedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  check: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  track: { height: 10, borderRadius: radii.pill, overflow: 'hidden', marginVertical: spacing.lg },
  fill: { height: '100%', borderRadius: radii.pill, minWidth: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  paceHint: { marginTop: 2, marginBottom: spacing.lg },
  paces: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  pace: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radii.md, borderWidth: 2, gap: 2 },
  list: { gap: spacing.sm },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  number: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
