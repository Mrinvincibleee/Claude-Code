import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard, Pill, ScreenBackground } from '@/components';
import { palette, radius, spacing, typography } from '@/theme';
import { WORKOUTS, WORKOUT_CATEGORIES } from '@/data/workouts';
import { Workout } from '@/data/types';

const TAB_BAR_SPACE = 110;
const ALL = 'All';

export default function Workouts() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<string>(ALL);

  const filtered = useMemo(
    () => (category === ALL ? WORKOUTS : WORKOUTS.filter((w) => w.category === category)),
    [category],
  );

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: TAB_BAR_SPACE,
        }}
      >
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Train</Text>
          <Text style={styles.subtitle}>500+ exercises · pick your split</Text>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {[ALL, ...WORKOUT_CATEGORIES].map((cat) => (
            <Pill
              key={cat}
              label={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </ScrollView>

        <View style={styles.list}>
          {filtered.map((workout, i) => (
            <Animated.View
              key={workout.id}
              entering={FadeInDown.delay(i * 60).duration(380)}
            >
              <WorkoutRow
                workout={workout}
                onPress={() => router.push(`/workout/${workout.id}`)}
              />
            </Animated.View>
          ))}
          {filtered.length === 0 && (
            <GlassCard style={styles.empty}>
              <Text style={styles.emptyText}>
                No workouts in this category yet — more coming soon.
              </Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function WorkoutRow({ workout, onPress }: { workout: Workout; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.rowPressable}>
      <GlassCard padding="lg" style={styles.row}>
        <View style={[styles.accentBar, { backgroundColor: workout.accent }]} />
        <View style={styles.rowBody}>
          <Text style={styles.rowCategory}>{workout.category.toUpperCase()}</Text>
          <Text style={styles.rowTitle}>{workout.title}</Text>
          <View style={styles.rowMeta}>
            <Text style={styles.rowMetaText}>⏱ {workout.durationMin} min</Text>
            <Text style={styles.rowMetaText}>
              🏋️ {workout.exerciseIds.length}
            </Text>
            <Text style={styles.rowMetaText}>🔥 {workout.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.rowChevron}>›</Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: palette.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: 2,
  },
  chips: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  rowPressable: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentBar: {
    width: 4,
    height: 48,
    borderRadius: radius.pill,
    marginRight: spacing.lg,
  },
  rowBody: { flex: 1 },
  rowCategory: {
    ...typography.caption,
    color: palette.textTertiary,
    letterSpacing: 0.8,
  },
  rowTitle: {
    ...typography.subheading,
    color: palette.textPrimary,
    marginTop: 2,
  },
  rowMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  rowMetaText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  rowChevron: {
    fontSize: 28,
    color: palette.textTertiary,
    marginLeft: spacing.sm,
  },
  empty: {
    marginTop: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});
