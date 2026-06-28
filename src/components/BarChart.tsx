import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientName, gradients, palette, radius, spacing, typography } from '@/theme';

export type BarDatum = { label: string; value: number };

/**
 * Lightweight animated bar chart. Bars grow from the baseline with a staggered
 * delay so the chart "draws" itself on mount — no charting dependency needed.
 */
export function BarChart({
  data,
  height = 160,
  gradient = 'primary',
  unit,
}: {
  data: BarDatum[];
  height?: number;
  gradient?: GradientName;
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.row, { height }]}>
      {data.map((d, i) => (
        <Bar
          key={d.label}
          ratio={d.value / max}
          delay={i * 80}
          label={d.label}
          value={unit ? `${d.value}${unit}` : `${d.value}`}
          gradient={gradient}
        />
      ))}
    </View>
  );
}

function Bar({
  ratio,
  delay,
  label,
  value,
  gradient,
}: {
  ratio: number;
  delay: number;
  label: string;
  value: string;
  gradient: GradientName;
}) {
  const grow = useSharedValue(0);
  useEffect(() => {
    grow.value = withDelay(
      delay,
      withTiming(ratio, { duration: 700, easing: Easing.out(Easing.cubic) }),
    );
  }, [ratio, delay, grow]);

  const barStyle = useAnimatedStyle(() => ({
    flex: Math.max(grow.value, 0.02),
  }));
  const spacerStyle = useAnimatedStyle(() => ({
    flex: Math.max(1 - grow.value, 0.001),
  }));

  return (
    <View style={styles.barCol}>
      <Text style={styles.barValue}>{value}</Text>
      <View style={styles.barTrack}>
        <Animated.View style={spacerStyle} />
        <Animated.View style={[styles.barFill, barStyle]}>
          <LinearGradient
            colors={gradients[gradient]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barValue: {
    ...typography.caption,
    color: palette.textTertiary,
    marginBottom: spacing.xs,
  },
  barTrack: {
    flex: 1,
    width: '62%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  barLabel: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: spacing.sm,
  },
});
