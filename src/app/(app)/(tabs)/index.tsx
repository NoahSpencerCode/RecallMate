import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ForecastBars } from '@/components/ForecastBars';
import { Icon } from '@/components/Icon';
import { BrainGlyph } from '@/components/Logo';
import { ProgressRing } from '@/components/ProgressRing';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { LoadError } from '@/components/LoadError';
import { Skeleton } from '@/components/Skeleton';
import { StatTile } from '@/components/StatTile';
import { StreakPill } from '@/components/StreakFlame';
import { Text } from '@/components/Text';
import { displayName, useAuth } from '@/features/auth/AuthProvider';
import { useMemories } from '@/features/memories/hooks';
import { MemoryRow } from '@/features/memories/MemoryRow';
import { useCatalog, usePackIndex, usePackProgress } from '@/features/packs/hooks';
import { PackCard } from '@/features/packs/PackCard';
import { useProfessions } from '@/features/professions/hooks';
import { ProfessionTodayRow } from '@/features/professions/ProfessionTodayRow';
import { allCards, useProgress } from '@/features/progress/hooks';
import { addDays, formatDay } from '@/lib/dates';
import { useToday } from '@/lib/useToday';
import { enterItem, gradients, palette, radii, spacing, useIsWide, useTheme } from '@/theme';

function greeting(hour: number) {
  if (hour < 5) return 'Up late';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Today() {
  const { colors } = useTheme();
  const isWide = useIsWide();
  const { user } = useAuth();
  const today = useToday();
  const memoriesQuery = useMemories();
  const progressQuery = useProgress(today);
  const catalog = useCatalog();
  const packProgress = usePackProgress();
  const packIndex = usePackIndex();
  const professionsQuery = useProfessions(today);

  const memories = memoriesQuery.data ?? [];
  const progress = progressQuery.data;
  const due = memories.filter((m) => m.due_on <= today);
  const tomorrow = memories.filter((m) => m.due_on === addDays(today, 1)).length;
  const reviewedToday = progress?.reviewed_today ?? 0;
  // The ring is about memories, so it counts memory reviews only.
  const memoryReviewsToday = progress?.reviewed_today_memories ?? reviewedToday;
  const dayTotal = memoryReviewsToday + due.length;
  const ringProgress = dayTotal === 0 ? 0 : memoryReviewsToday / dayTotal;
  const started = (professionsQuery.data ?? []).filter((p) => p.enrolled);
  const professionDue = started.reduce((n, p) => n + p.due_today, 0);
  const firstDue = started.find((p) => p.due_today > 0);
  const minutes = Math.max(1, Math.round((due.length * 9) / 60));
  const addedPacks = new Set((packProgress.data ?? []).map((p) => p.packId));
  const suggestions = (catalog.data ?? [])
    .map((category) => category.packs.find((pack) => !addedPacks.has(pack.id)))
    .filter((pack) => pack !== undefined)
    .slice(0, 6);

  const loading = memoriesQuery.isPending;
  // A failed first load mustn't look like an empty account.
  const loadFailed = memoriesQuery.isError && !memoriesQuery.data;

  return (
    <Screen
      tabBar
      refreshControl={
        <RefreshControl
          refreshing={memoriesQuery.isRefetching}
          onRefresh={() => {
            void memoriesQuery.refetch();
            void progressQuery.refetch();
            void professionsQuery.refetch();
          }}
          tintColor={colors.primary}
        />
      }>
      <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="label" tone="subtle">
            {formatDay(today, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text variant="title">
            {greeting(new Date().getHours())}, {displayName(user)}
          </Text>
        </View>
        {!isWide ? <StreakPill days={progress?.current_streak ?? 0} /> : null}
      </Animated.View>

      {loading ? (
        <Skeleton height={210} radius={radii.xl} />
      ) : loadFailed ? (
        <LoadError
          onRetry={() => {
            void memoriesQuery.refetch();
            void progressQuery.refetch();
          }}
          retrying={memoriesQuery.isFetching}
        />
      ) : (
        <Animated.View entering={FadeInDown.delay(80).springify().damping(15)}>
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <ProgressRing
              progress={memories.length === 0 ? 0 : due.length === 0 ? 1 : ringProgress}
              size={128}
              stroke={13}
              color="#FFFFFF"
              trackColor="rgba(255,255,255,0.22)">
              {due.length > 0 ? (
                <>
                  <AnimatedNumber value={due.length} variant="number" color="#FFFFFF" />
                  <Text variant="caption" color="rgba(255,255,255,0.85)">
                    to review
                  </Text>
                </>
              ) : (
                memories.length ? (
                  <Icon name="check-bold" size={44} color="#FFFFFF" />
                ) : (
                  <BrainGlyph size={58} />
                )
              )}
            </ProgressRing>
            <View style={styles.heroCopy}>
              {memories.length === 0 && started.length === 0 ? (
                <>
                  <Text variant="heading" color="#FFFFFF">
                    Let’s fill that brain.
                  </Text>
                  <Text variant="small" color="rgba(255,255,255,0.88)">
                    Start a profession, add a study pack or write your first card.
                  </Text>
                  <Button title="Explore Learn" variant="light" size="md" icon="school-outline" onPress={() => router.navigate('/learn')} />
                </>
              ) : memories.length === 0 ? (
                <>
                  <Text variant="heading" color="#FFFFFF">
                    {professionDue > 0 ? `${professionDue} profession ${professionDue === 1 ? 'card is' : 'cards are'} due` : 'All caught up!'}
                  </Text>
                  <Text variant="small" color="rgba(255,255,255,0.88)">
                    {professionDue > 0 ? 'Review them, then keep opening new cards.' : 'Open new cards below, or write one of your own.'}
                  </Text>
                  {firstDue ? (
                    <Button
                      title={`Review ${firstDue.name}`}
                      variant="light"
                      size="md"
                      icon="play"
                      onPress={() => router.push({ pathname: '/review', params: { profession: firstDue.id } })}
                    />
                  ) : (
                    <Button title="Write a card" variant="light" size="md" icon="plus" onPress={() => router.push('/memory/new')} />
                  )}
                </>
              ) : due.length > 0 ? (
                <>
                  <Text variant="heading" color="#FFFFFF">
                    {due.length === 1 ? '1 card is ready' : `${due.length} cards are ready`}
                  </Text>
                  <Text variant="small" color="rgba(255,255,255,0.88)">
                    About {minutes} min.{reviewedToday ? ` ${reviewedToday} done already. Keep going!` : ' Keep your streak alive.'}
                  </Text>
                  <Button title="Start review" variant="light" size="md" icon="play" onPress={() => router.push('/review')} />
                </>
              ) : (
                <>
                  <Text variant="heading" color="#FFFFFF">
                    {professionDue > 0 ? 'Your cards are done' : 'All caught up!'}
                  </Text>
                  <Text variant="small" color="rgba(255,255,255,0.88)">
                    {professionDue > 0
                      ? `${professionDue} profession ${professionDue === 1 ? 'card is' : 'cards are'} due below.`
                      : `${reviewedToday ? `You reviewed ${reviewedToday} today. ` : ''}${
                          tomorrow ? `${tomorrow} coming up tomorrow.` : 'Nothing due tomorrow. Add a pack to keep learning.'
                        }`}
                  </Text>
                  <Button title="Write a card" variant="light" size="md" icon="plus" onPress={() => router.push('/memory/new')} />
                </>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {started.length > 0 ? (
        <View style={styles.section}>
          {started.map((profession, index) => (
            <Animated.View key={profession.id} entering={enterItem(index, 120)}>
              <ProfessionTodayRow profession={profession} />
            </Animated.View>
          ))}
        </View>
      ) : null}

      <View style={[styles.stats, loadFailed && styles.hidden]}>
        <StatTile index={0} icon="fire" color={palette.orange} value={progress?.current_streak ?? 0} label="Day streak" />
        <StatTile index={1} icon="check-circle-outline" color={colors.success} value={reviewedToday} label="Done today" />
        <StatTile index={2} icon="trophy-outline" color={palette.yellow} value={progress ? allCards(progress).mastered : 0} label="Mastered" />
      </View>

      {due.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Due today"
            action={
              due.length > 5 ? (
                <Button title="See all" variant="ghost" size="sm" iconRight="chevron-right" onPress={() => router.navigate('/library')} />
              ) : null
            }
          />
          {due.slice(0, 5).map((memory, index) => (
            <Animated.View key={memory.id} entering={enterItem(index, 160)}>
              <MemoryRow memory={memory} today={today} pack={memory.pack_id ? packIndex.get(memory.pack_id) : undefined} />
            </Animated.View>
          ))}
        </View>
      ) : null}

      {progress && (memories.length > 0 || started.length > 0) ? (
        <Card>
          <View style={styles.cardHeader}>
            <Text variant="subheading">Next 7 days</Text>
            <Text variant="caption" tone="subtle">
              {progress.forecast.reduce((sum, f) => sum + f.count, 0)} reviews
            </Text>
          </View>
          <ForecastBars forecast={progress.forecast} />
        </Card>
      ) : null}

      {suggestions.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Try a pack"
            action={<Button title="All packs" variant="ghost" size="sm" iconRight="chevron-right" onPress={() => router.navigate('/learn')} />}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions}>
            {suggestions.map((pack, index) => (
              <Animated.View key={pack.id} entering={enterItem(index, 200)}>
                <PackCard pack={pack} compact />
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  headerText: { flex: 1, gap: 2 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xl,
    padding: spacing.xl,
    borderRadius: radii.xl,
  },
  heroCopy: { flex: 1, minWidth: 190, gap: spacing.sm, alignItems: 'flex-start' },
  stats: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  hidden: { display: 'none' },
  section: { gap: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.lg },
  suggestions: { gap: spacing.md, paddingVertical: spacing.xs, paddingRight: spacing.xl },
});
