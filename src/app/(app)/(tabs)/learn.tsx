import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { Text } from '@/components/Text';
import { LoadError } from '@/components/LoadError';
import { categoryLook } from '@/features/packs/categories';
import { useCatalog, usePackProgress } from '@/features/packs/hooks';
import { PackCard } from '@/features/packs/PackCard';
import { useProfessions } from '@/features/professions/hooks';
import { ProfessionTile } from '@/features/professions/ProfessionTile';
import { useToday } from '@/lib/useToday';
import { enterItem, palette, radii, spacing, useIsWide } from '@/theme';

export default function Learn() {
  const isWide = useIsWide();
  const today = useToday();
  const professions = useProfessions(today);
  const catalog = useCatalog();
  const progress = usePackProgress();
  const [selected, setSelected] = useState<string>('all');

  const categories = catalog.data ?? [];
  const progressByPack = new Map((progress.data ?? []).map((p) => [p.packId, p]));
  const shown = selected === 'all' ? categories : categories.filter((c) => c.id === selected);
  const totalPacks = categories.reduce((n, c) => n + c.packs.length, 0);
  const totalCards = categories.reduce((n, c) => n + c.packs.reduce((m, p) => m + p.cardCount, 0), 0);
  const columns = isWide ? 3 : 1;

  return (
    <Screen tabBar>
      <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.intro}>
        <Text variant="title">Learn</Text>
        <Text variant="body" tone="muted">
          Whole fields, from zero to PhD, and course-ready packs for your classes.
        </Text>
      </Animated.View>

      <View style={styles.section}>
        <View style={styles.sectionText}>
          <Text variant="heading">Professions</Text>
          <Text variant="small" tone="muted">
            Learn a whole field, from zero to PhD. Open cards one at a time, as many as you like; review what’s due
            first.
          </Text>
        </View>
        {professions.isPending ? (
          <View style={styles.grid}>
            {[0, 1].map((i) => (
              <Skeleton key={i} height={170} radius={radii.xl} width={isWide ? '48.5%' : '100%'} />
            ))}
          </View>
        ) : professions.isError ? (
          <LoadError title="Couldn’t load professions" onRetry={() => void professions.refetch()} retrying={professions.isFetching} />
        ) : (
          <View style={styles.grid}>
            {(professions.data ?? []).map((profession, index) => (
              <Animated.View key={profession.id} entering={enterItem(index)} style={{ width: isWide ? '48.5%' : '100%' }}>
                <ProfessionTile profession={profession} />
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.sectionText}>
        <Text variant="heading">Study packs</Text>
        <Text variant="small" tone="muted">
          {totalPacks ? `${totalPacks} packs · ${totalCards} cards` : 'Course-ready decks'} written for college
          courses. Add one and RecallMate introduces a few new cards a day.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <Chip label="All" icon="view-grid-outline" selected={selected === 'all'} onPress={() => setSelected('all')} />
        {categories.map((c) => {
          const look = categoryLook(c.id);
          return (
            <Chip
              key={c.id}
              label={c.name}
              icon={look.icon}
              color={look.color}
              selected={selected === c.id}
              onPress={() => setSelected(selected === c.id ? 'all' : c.id)}
            />
          );
        })}
      </ScrollView>

      {catalog.isPending ? (
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={170} radius={radii.xl} />
          ))}
        </View>
      ) : catalog.isError ? (
        <EmptyState icon="wifi-off" color={palette.pink} title="Couldn’t load packs" message="Check your connection and try again.">
          <Button title="Try again" variant="secondary" onPress={() => void catalog.refetch()} />
        </EmptyState>
      ) : (
        shown.map((category) => {
          const look = categoryLook(category.id);
          return (
            <Animated.View key={category.id} entering={FadeIn.duration(250)} style={styles.category}>
              <View style={styles.categoryHeader}>
                <CategoryIcon look={look} size={46} />
                <View style={styles.categoryText}>
                  <Text variant="heading">{category.name}</Text>
                  <Text variant="small" tone="muted">
                    {category.tagline}
                  </Text>
                </View>
              </View>
              <View style={styles.grid}>
                {category.packs.map((pack, index) => (
                  <Animated.View
                    key={pack.id}
                    entering={enterItem(index)}
                    style={{ width: columns === 1 ? '100%' : `${100 / columns - 2}%` }}>
                    <PackCard pack={pack} progress={progressByPack.get(pack.id)} />
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.xs },
  section: { gap: spacing.lg },
  sectionText: { gap: spacing.xs },
  chips: { gap: spacing.sm, paddingRight: spacing.xl },
  category: { gap: spacing.lg, marginTop: spacing.sm },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  categoryText: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
