import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  BarChart,
  GlassCard,
  ScreenBackground,
  SectionHeader,
} from '@/components';
import { palette, spacing, typography } from '@/theme';
import { WEEKLY_VOLUME, WEIGHT_TREND } from '@/data/user';

const TAB_BAR_SPACE = 110;

const MEASUREMENTS = [
  { label: 'Weight', value: '78.4', unit: 'kg', delta: '-1.6', good: true },
  { label: 'Body Fat', value: '16.2', unit: '%', delta: '-0.8', good: true },
  { label: 'Chest', value: '104', unit: 'cm', delta: '+1.2', good: true },
  { label: 'Waist', value: '81', unit: 'cm', delta: '-2.0', good: true },
  { label: 'Arms', value: '38.5', unit: 'cm', delta: '+0.5', good: true },
  { label: 'Legs', value: '59', unit: 'cm', delta: '+0.9', good: true },
];

export default function Progress() {
  const insets = useSafeAreaInsets();

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
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Your transformation, measured.</Text>

        {/* Weekly volume */}
        <Animated.View
          entering={FadeInDown.delay(60).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Weekly Volume" action="This week" />
          <GlassCard>
            <View style={styles.chartHeader}>
              <Text style={styles.chartBig}>69k</Text>
              <Text style={styles.chartUnit}>kg lifted</Text>
            </View>
            <BarChart data={WEEKLY_VOLUME} unit="k" gradient="aqua" />
          </GlassCard>
        </Animated.View>

        {/* Weight trend */}
        <Animated.View
          entering={FadeInDown.delay(120).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Bodyweight Trend" action="4 weeks" />
          <GlassCard>
            <View style={styles.chartHeader}>
              <Text style={styles.chartBig}>78.4</Text>
              <Text style={styles.chartUnit}>kg · down 1.6 this month</Text>
            </View>
            <BarChart data={WEIGHT_TREND} unit="kg" gradient="lime" height={120} />
          </GlassCard>
        </Animated.View>

        {/* Measurements grid */}
        <Animated.View
          entering={FadeInDown.delay(180).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Measurements" action="Log new" />
          <View style={styles.grid}>
            {MEASUREMENTS.map((m) => (
              <GlassCard key={m.label} padding="lg" style={styles.measureCard}>
                <Text style={styles.measureLabel}>{m.label}</Text>
                <Text style={styles.measureValue}>
                  {m.value}
                  <Text style={styles.measureUnit}> {m.unit}</Text>
                </Text>
                <Text style={[styles.delta, m.good ? styles.deltaGood : styles.deltaBad]}>
                  {m.delta} {m.unit}
                </Text>
              </GlassCard>
            ))}
          </View>
        </Animated.View>

        {/* Progress photos */}
        <Animated.View
          entering={FadeInDown.delay(240).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Transformation" action="Add photo" />
          <View style={styles.photoRow}>
            <PhotoSlot label="Week 1" />
            <PhotoSlot label="Today" highlight />
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function PhotoSlot({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <GlassCard
      padding="md"
      style={[styles.photo, highlight && styles.photoHighlight]}
      glow={highlight}
    >
      <Text style={styles.photoIcon}>📷</Text>
      <Text style={styles.photoLabel}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: palette.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: spacing.xxl,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chartBig: {
    ...typography.title,
    color: palette.textPrimary,
  },
  chartUnit: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  measureCard: {
    width: '47%',
    flexGrow: 1,
  },
  measureLabel: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  measureValue: {
    ...typography.heading,
    color: palette.textPrimary,
    marginTop: spacing.xs,
  },
  measureUnit: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  delta: {
    ...typography.caption,
    marginTop: spacing.xs,
    fontWeight: '700',
  },
  deltaGood: { color: palette.success },
  deltaBad: { color: palette.danger },
  photoRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photo: {
    flex: 1,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: palette.glassBorder,
  },
  photoHighlight: {
    borderStyle: 'solid',
  },
  photoIcon: { fontSize: 32, marginBottom: spacing.sm },
  photoLabel: {
    ...typography.label,
    color: palette.textSecondary,
  },
});
