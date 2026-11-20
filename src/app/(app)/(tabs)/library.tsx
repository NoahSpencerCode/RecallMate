import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { GradientBlobs } from '@/components/GradientBlobs';
import { IconButton } from '@/components/IconButton';
import { Skeleton } from '@/components/Skeleton';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import type { Memory } from '@/features/memories/api';
import { useMemories } from '@/features/memories/hooks';
import { MemoryRow } from '@/features/memories/MemoryRow';
import { categoryLook, personalLook } from '@/features/packs/categories';
import { useCatalog, usePackIndex } from '@/features/packs/hooks';
import { memoryStatus, type MemoryStatus } from '@/lib/schedule';
import { useToday } from '@/lib/useToday';
import { layout, palette, radii, spacing, useIsWide, useScreenBackground, useTheme } from '@/theme';

type StatusFilter = 'all' | 'due' | MemoryStatus;

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'due', label: 'Due' },
  { key: 'new', label: 'New' },
  { key: 'learning', label: 'Learning' },
  { key: 'mastered', label: 'Mastered' },
];

const MINE = 'mine';

export default function Library() {
  const { colors } = useTheme();
  const screenBackground = useScreenBackground();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const today = useToday();
  const query = useMemories();
  const catalog = useCatalog();
  const packIndex = usePackIndex();

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [source, setSource] = useState<string>('all');

  const memories = query.data ?? [];
  const categoryOf = (m: Memory) => (m.pack_id ? (packIndex.get(m.pack_id)?.categoryId ?? MINE) : MINE);

  // Only offer source chips the user actually has cards for.
  const sourceCounts = new Map<string, number>();
  for (const m of memories) sourceCounts.set(categoryOf(m), (sourceCounts.get(categoryOf(m)) ?? 0) + 1);
  const sources = [
    ...(sourceCounts.has(MINE) ? [{ id: MINE, name: 'My cards' }] : []),
    ...(catalog.data ?? []).filter((c) => sourceCounts.has(c.id)).map((c) => ({ id: c.id, name: c.name })),
  ];

  const needle = deferredSearch.trim().toLowerCase();
  const visible = memories.filter((m) => {
    if (status === 'due' && m.due_on > today) return false;
    if (status !== 'all' && status !== 'due' && memoryStatus(m) !== status) return false;
    if (source !== 'all' && categoryOf(m) !== source) return false;
    if (!needle) return true;
    return (
      m.title.toLowerCase().includes(needle) ||
      m.body.toLowerCase().includes(needle) ||
      (m.answer ?? '').toLowerCase().includes(needle)
    );
  });

  const header = (
    <View style={styles.header}>
      <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.titleRow}>
        <View>
          <Text variant="title">Library</Text>
          <Text variant="small" tone="muted">
            {memories.length} {memories.length === 1 ? 'card' : 'cards'} in your collection
          </Text>
        </View>
        <IconButton icon="plus" accessibilityLabel="New card" onPress={() => router.push('/memory/new')} />
      </Animated.View>
      <TextField
        icon="magnify"
        placeholder="Search cards, answers, notes…"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {STATUS_FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} selected={status === f.key} onPress={() => setStatus(f.key)} />
        ))}
      </ScrollView>
      {sources.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Everything" icon="infinity" selected={source === 'all'} onPress={() => setSource('all')} />
          {sources.map((s) => {
            const look = s.id === MINE ? personalLook : categoryLook(s.id);
            return (
              <Chip
                key={s.id}
                label={s.name}
                icon={look.icon}
                color={look.color}
                count={sourceCounts.get(s.id)}
                selected={source === s.id}
                onPress={() => setSource(source === s.id ? 'all' : s.id)}
              />
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );

  let empty = null;
  if (query.isPending) {
    empty = (
      <View style={styles.skeletons}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={68} />
        ))}
      </View>
    );
  } else if (memories.length === 0) {
    empty = (
      <EmptyState
        icon="cards-outline"
        color={palette.violet}
        title="Your library is empty"
        message="Cards you write and packs you add will live here.">
        <Button title="Browse packs" icon="layers-triple" onPress={() => router.navigate('/packs')} />
        <Button title="Write a card" variant="secondary" icon="plus" onPress={() => router.push('/memory/new')} />
      </EmptyState>
    );
  } else {
    empty = (
      <EmptyState
        icon="magnify-close"
        color={palette.sky}
        title="No cards match"
        message="Try a different search or clear the filters."
      >
        <Button
          title="Clear filters"
          variant="secondary"
          onPress={() => {
            setSearch('');
            setStatus('all');
            setSource('all');
          }}
        />
      </EmptyState>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      <GradientBlobs />
      <Animated.FlatList
        data={visible}
        keyExtractor={(m) => m.id}
        itemLayoutAnimation={LinearTransition.springify().damping(18)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={
          <RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor={colors.primary} />
        }
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (isWide ? spacing.xxxl : spacing.md),
            paddingBottom: isWide ? spacing.xxxl : layout.tabBarHeight + insets.bottom + 40,
            paddingHorizontal: isWide ? spacing.xxxl : spacing.xl,
          },
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={index < 12 ? FadeInDown.delay(index * 35).springify().damping(16) : undefined}>
            <MemoryRow memory={item} today={today} pack={item.pack_id ? packIndex.get(item.pack_id) : undefined} />
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  header: { gap: spacing.lg, marginBottom: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { gap: spacing.sm, paddingRight: spacing.xl },
  separator: { height: spacing.sm },
  skeletons: { gap: spacing.sm, borderRadius: radii.lg },
});
