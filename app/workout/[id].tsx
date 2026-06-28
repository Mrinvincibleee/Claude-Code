import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GlassCard,
  GradientButton,
  RestTimer,
  ScreenBackground,
} from '@/components';
import { palette, radius, spacing, typography } from '@/theme';
import { getWorkout } from '@/data/workouts';
import { getExercise } from '@/data/exercises';
import { Exercise } from '@/data/types';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [resting, setResting] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const workout = useMemo(() => getWorkout(String(id)), [id]);

  if (!workout) {
    return (
      <ScreenBackground>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Workout not found.</Text>
          <GradientButton label="Go back" onPress={() => router.back()} />
        </View>
      </ScreenBackground>
    );
  }

  const exercises = workout.exerciseIds
    .map(getExercise)
    .filter((e): e is Exercise => Boolean(e));

  const doneCount = Object.values(completed).filter(Boolean).length;

  const toggle = (exId: string) =>
    setCompleted((prev) => ({ ...prev, [exId]: !prev[exId] }));

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Hero */}
        <LinearGradient
          colors={[workout.accent, palette.void]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.heroCategory}>{workout.category.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>{workout.title}</Text>
          <View style={styles.heroMeta}>
            <Meta icon="⏱" text={`${workout.durationMin} min`} />
            <Meta icon="🏋️" text={`${exercises.length} exercises`} />
            <Meta icon="🔥" text={workout.difficulty} />
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Warm-up note */}
          <GlassCard padding="md" style={styles.warmup}>
            <Text style={styles.warmupTitle}>🔥 Warm-up (5 min)</Text>
            <Text style={styles.warmupText}>
              5 min light cardio + dynamic stretches for the target muscles, then
              2 ramp-up sets on your first exercise.
            </Text>
          </GlassCard>

          {/* Exercise list */}
          {exercises.map((ex, i) => (
            <Animated.View
              key={ex.id}
              entering={FadeInDown.delay(i * 70).duration(380)}
            >
              <ExerciseCard
                exercise={ex}
                index={i + 1}
                done={!!completed[ex.id]}
                onToggle={() => toggle(ex.id)}
                onRest={() => setResting(true)}
              />
            </Animated.View>
          ))}

          {/* Cool-down */}
          <GlassCard padding="md" style={styles.warmup}>
            <Text style={styles.warmupTitle}>🧘 Cool-down (5 min)</Text>
            <Text style={styles.warmupText}>
              Static stretching for worked muscles, hold each for 30s. Breathe and
              bring the heart rate down.
            </Text>
          </GlassCard>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.md }]}>
        <GradientButton
          label={
            doneCount === exercises.length
              ? 'Finish Workout 🎉'
              : `Start Workout · ${doneCount}/${exercises.length}`
          }
          onPress={() => {
            if (doneCount === exercises.length) router.back();
            else setResting(true);
          }}
        />
      </View>

      {resting && (
        <RestTimer
          seconds={90}
          onDone={() => setResting(false)}
          onSkip={() => setResting(false)}
        />
      )}
    </ScreenBackground>
  );
}

function Meta({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaText}>
        {icon} {text}
      </Text>
    </View>
  );
}

function ExerciseCard({
  exercise,
  index,
  done,
  onToggle,
  onRest,
}: {
  exercise: Exercise;
  index: number;
  done: boolean;
  onToggle: () => void;
  onRest: () => void;
}) {
  const alts = exercise.alternatives
    ?.map(getExercise)
    .filter((e): e is Exercise => Boolean(e));

  return (
    <GlassCard style={styles.exCard}>
      <View style={styles.exHeader}>
        <View style={styles.exNum}>
          <Text style={styles.exNumText}>{index}</Text>
        </View>
        <View style={styles.exTitleWrap}>
          <Text style={styles.exName}>{exercise.name}</Text>
          <Text style={styles.exMuscle}>
            {exercise.primaryMuscle} · {exercise.equipment}
          </Text>
        </View>
        <Pressable onPress={onToggle} style={[styles.exCheck, done && styles.exCheckDone]}>
          {done && <Text style={styles.exCheckMark}>✓</Text>}
        </Pressable>
      </View>

      <View style={styles.setsRow}>
        <SetBadge label="Sets" value={`${exercise.defaultSets}`} />
        <SetBadge label="Reps" value={exercise.defaultReps} />
        <SetBadge label="Rest" value="90s" />
        <Pressable onPress={onRest} style={styles.restBtn}>
          <Text style={styles.restBtnText}>⏱ Rest</Text>
        </Pressable>
      </View>

      {exercise.notes && (
        <View style={styles.notesRow}>
          <Text style={styles.notesText}>💡 {exercise.notes}</Text>
        </View>
      )}

      {alts && alts.length > 0 && (
        <View style={styles.altRow}>
          <Text style={styles.altLabel}>Alternatives:</Text>
          <Text style={styles.altText}>{alts.map((a) => a.name).join(', ')}</Text>
        </View>
      )}
    </GlassCard>
  );
}

function SetBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.setBadge}>
      <Text style={styles.setValue}>{value}</Text>
      <Text style={styles.setLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  notFoundText: {
    ...typography.heading,
    color: palette.textPrimary,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  backIcon: { color: '#fff', fontSize: 28, marginTop: -3 },
  heroCategory: {
    ...typography.label,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.title,
    color: '#fff',
    marginTop: spacing.xs,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  meta: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  metaText: {
    ...typography.caption,
    color: '#fff',
  },
  body: {
    paddingHorizontal: spacing.xl,
    marginTop: -spacing.lg,
    gap: spacing.md,
  },
  warmup: {},
  warmupTitle: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  warmupText: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: spacing.xs,
  },
  exCard: {},
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  exNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.glassLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exNumText: {
    ...typography.subheading,
    color: palette.iris,
  },
  exTitleWrap: { flex: 1 },
  exName: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  exMuscle: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 1,
    textTransform: 'capitalize',
  },
  exCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: palette.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exCheckDone: {
    backgroundColor: palette.success,
    borderColor: palette.success,
  },
  exCheckMark: { color: '#04121A', fontWeight: '900' },
  setsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  setBadge: {
    flex: 1,
    backgroundColor: palette.glassLight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  setValue: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  setLabel: {
    ...typography.caption,
    color: palette.textTertiary,
  },
  restBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.iris,
  },
  restBtnText: {
    ...typography.label,
    color: '#fff',
  },
  notesRow: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.glassLight,
  },
  notesText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  altRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  altLabel: {
    ...typography.caption,
    color: palette.textTertiary,
    fontWeight: '700',
  },
  altText: {
    ...typography.caption,
    color: palette.iris,
    flex: 1,
  },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
});
