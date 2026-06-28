import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GradientName, gradients, palette, typography } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** 0..1 fill amount. */
  progress: number;
  size?: number;
  strokeWidth?: number;
  gradient?: GradientName;
  /** Big number rendered in the middle (e.g. calories). */
  value?: string;
  label?: string;
};

/**
 * Animated circular progress ring (Apple Fitness style). The stroke sweeps in
 * with an ease-out timing whenever `progress` changes.
 */
export function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 12,
  gradient = 'primary',
  value,
  label,
}: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animated = useSharedValue(0);
  useEffect(() => {
    animated.value = withTiming(clamped, {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, animated]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animated.value),
  }));

  const [from, to] = gradients[gradient];
  const gradId = `ring-${gradient}`;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.glassLighter}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          // Start sweep at 12 o'clock.
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {(value || label) && (
        <View style={styles.center} pointerEvents="none">
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.metric,
    color: palette.textPrimary,
  },
  label: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 2,
  },
});
