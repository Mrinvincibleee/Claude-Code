import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GlassCard,
  ProgressRing,
  ScreenBackground,
  SectionHeader,
  StatCard,
} from '@/components';
import { gradients, palette, radius, spacing, typography } from '@/theme';
import { MOCK_GOALS, MOCK_PROFILE, TODAY_HABITS } from '@/data/user';
import { WORKOUTS } from '@/data/workouts';

const TAB_BAR_SPACE = 110;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const todaysWorkout = WORKOUTS[0];

  const calorieProgress = MOCK_GOALS.caloriesConsumed / MOCK_GOALS.calories;
  const caloriesLeft = MOCK_GOALS.calories - MOCK_GOALS.caloriesConsumed;

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing.xl,
          paddingBottom: TAB_BAR_SPACE,
        }}
      >
        {/* Greeting */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{MOCK_PROFILE.name} 👋</Text>
          </View>
          <GlassCard padding="md" style={styles.streakPill}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakText}>{MOCK_PROFILE.streakDays}</Text>
          </GlassCard>
        </Animated.View>

        {/* Calorie ring hero */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <GlassCard style={styles.hero} glow>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>CALORIES LEFT</Text>
              <Text style={styles.heroValue}>{caloriesLeft.toLocaleString()}</Text>
              <Text style={styles.heroSub}>
                {MOCK_GOALS.caloriesConsumed.toLocaleString()} of{' '}
                {MOCK_GOALS.calories.toLocaleString()} kcal
              </Text>
              <View style={styles.macroRow}>
                <Macro label="Protein" value={`${MOCK_GOALS.proteinConsumed}/${MOCK_GOALS.protein}g`} color={palette.aqua} />
              </View>
            </View>
            <ProgressRing
              progress={calorieProgress}
              size={132}
              value={`${Math.round(calorieProgress * 100)}%`}
              label="of goal"
              gradient="aqua"
            />
          </GlassCard>
        </Animated.View>

        {/* Quick stats */}
        <Animated.View
          entering={FadeInDown.delay(140).duration(400)}
          style={styles.statRow}
        >
          <StatCard
            icon="💧"
            label="Water"
            value={`${(MOCK_GOALS.waterConsumedMl / 1000).toFixed(1)}`}
            unit={`/ ${MOCK_GOALS.waterMl / 1000}L`}
            accent={palette.aqua}
          />
          <StatCard
            icon="⚖️"
            label="Weight"
            value={`${MOCK_PROFILE.weightKg}`}
            unit="kg"
            accent={palette.lime}
          />
          <StatCard
            icon="⭐"
            label={`Level ${MOCK_PROFILE.level}`}
            value={`${MOCK_PROFILE.xp}`}
            unit="XP"
            accent={palette.amber}
          />
        </Animated.View>

        {/* Today's workout */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <SectionHeader
            title="Today's Workout"
            action="See all"
            onAction={() => router.push('/(tabs)/workouts')}
          />
          <Pressable onPress={() => router.push(`/workout/${todaysWorkout.id}`)}>
            <View style={styles.workoutCard}>
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.workoutOverlay} />
              <View style={styles.workoutContent}>
                <Text style={styles.workoutCategory}>
                  {todaysWorkout.category.toUpperCase()}
                </Text>
                <Text style={styles.workoutTitle}>{todaysWorkout.title}</Text>
                <View style={styles.workoutMeta}>
                  <Text style={styles.workoutMetaText}>
                    ⏱ {todaysWorkout.durationMin} min
                  </Text>
                  <Text style={styles.workoutMetaText}>
                    🏋️ {todaysWorkout.exerciseIds.length} exercises
                  </Text>
                  <Text style={styles.workoutMetaText}>
                    🔥 {todaysWorkout.difficulty}
                  </Text>
                </View>
              </View>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* AI recommendation */}
        <Animated.View
          entering={FadeInDown.delay(260).duration(400)}
          style={styles.section}
        >
          <Pressable onPress={() => router.push('/(tabs)/coach')}>
            <GlassCard style={styles.aiCard}>
              <Text style={styles.aiEmoji}>✨</Text>
              <View style={styles.aiBody}>
                <Text style={styles.aiTitle}>AI Coach tip</Text>
                <Text style={styles.aiText}>
                  You&apos;re 56g short on protein today. Add a shake or chicken
                  breast to hit your target and maximize recovery.
                </Text>
              </View>
              <Text style={styles.aiChevron}>›</Text>
            </GlassCard>
          </Pressable>
        </Animated.View>

        {/* Today's habits */}
        <Animated.View
          entering={FadeInDown.delay(320).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Today's Habits" />
          <GlassCard padding="md">
            {TODAY_HABITS.map((habit, i) => (
              <View
                key={habit.id}
                style={[
                  styles.habitRow,
                  i < TODAY_HABITS.length - 1 && styles.habitDivider,
                ]}
              >
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text
                  style={[styles.habitLabel, habit.done && styles.habitLabelDone]}
                >
                  {habit.label}
                </Text>
                <View style={[styles.checkbox, habit.done && styles.checkboxDone]}>
                  {habit.done && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
            ))}
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function Macro({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.macro}>
      <View style={[styles.macroDot, { backgroundColor: color }]} />
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.body,
    color: palette.textSecondary,
  },
  name: {
    ...typography.title,
    color: palette.textPrimary,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  streakFire: { fontSize: 18 },
  streakText: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: { flex: 1 },
  heroLabel: {
    ...typography.label,
    color: palette.textTertiary,
  },
  heroValue: {
    ...typography.display,
    color: palette.textPrimary,
    marginTop: 2,
  },
  heroSub: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 2,
  },
  macroRow: {
    marginTop: spacing.md,
  },
  macro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroLabel: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  macroValue: {
    ...typography.caption,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  section: {
    marginTop: spacing.xxl,
  },
  workoutCard: {
    height: 150,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: spacing.xl,
  },
  workoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,15,0.32)',
  },
  workoutContent: {},
  workoutCategory: {
    ...typography.label,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
  },
  workoutTitle: {
    ...typography.heading,
    color: '#fff',
    marginTop: 4,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  workoutMetaText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
  },
  playButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  playIcon: { color: '#fff', fontSize: 16, marginLeft: 2 },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aiEmoji: { fontSize: 28 },
  aiBody: { flex: 1 },
  aiTitle: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  aiText: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 2,
  },
  aiChevron: {
    fontSize: 28,
    color: palette.textTertiary,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  habitDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.glassBorderSoft,
  },
  habitIcon: { fontSize: 20 },
  habitLabel: {
    ...typography.body,
    color: palette.textPrimary,
    flex: 1,
  },
  habitLabelDone: {
    color: palette.textTertiary,
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: palette.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: palette.success,
    borderColor: palette.success,
  },
  checkmark: { color: '#04121A', fontSize: 14, fontWeight: '900' },
});
