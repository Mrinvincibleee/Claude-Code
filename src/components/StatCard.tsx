import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { palette, spacing, typography } from '@/theme';

/**
 * Compact metric tile used across the dashboard (water, protein, weight…).
 */
export function StatCard({
  icon,
  label,
  value,
  unit,
  accent = palette.iris,
  style,
}: {
  icon?: string;
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  style?: ViewStyle;
}) {
  return (
    <GlassCard padding="lg" style={[styles.card, style]}>
      <View style={styles.headerRow}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <View style={[styles.accentDot, { backgroundColor: accent }]} />
      </View>
      <Text style={styles.value}>
        {value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 22,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    ...typography.heading,
    color: palette.textPrimary,
    marginTop: spacing.md,
  },
  unit: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  label: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 2,
  },
});
