import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { GlassCard } from './GlassCard';
import { palette, spacing, typography } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 220;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/**
 * Full-screen-ish rest timer with a circular countdown that visually drains.
 * Fires a light haptic each second in the final countdown and a success haptic
 * when it completes.
 */
export function RestTimer({
  seconds,
  onDone,
  onSkip,
}: {
  seconds: number;
  onDone: () => void;
  onSkip: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const sweep = useSharedValue(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    sweep.value = withTiming(0, {
      duration: seconds * 1000,
      easing: Easing.linear,
    });

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 3 && next > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        if (next <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
            () => {},
          );
          onDone();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - sweep.value),
  }));

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const adjust = (delta: number) => {
    Haptics.selectionAsync().catch(() => {});
    setRemaining((r) => Math.max(0, r + delta));
  };

  return (
    <View style={styles.overlay}>
      <GlassCard style={styles.card} intensity={50}>
        <Text style={styles.title}>REST</Text>
        <View style={styles.ringWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={palette.glassLighter}
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={palette.iris}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={C}
              animatedProps={animatedProps}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>
          <View style={styles.timeCenter} pointerEvents="none">
            <Text style={styles.time}>
              {mins}:{secs.toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={() => adjust(-15)} style={styles.adjustBtn}>
            <Text style={styles.adjustText}>-15s</Text>
          </Pressable>
          <Pressable onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
          <Pressable onPress={() => adjust(15)} style={styles.adjustBtn}>
            <Text style={styles.adjustText}>+15s</Text>
          </Pressable>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,15,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    zIndex: 100,
  },
  card: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...typography.label,
    color: palette.textSecondary,
    letterSpacing: 3,
    marginBottom: spacing.lg,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
  },
  timeCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 56,
    fontWeight: '800',
    color: palette.textPrimary,
    letterSpacing: -1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  adjustBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 999,
    backgroundColor: palette.glassLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.glassBorder,
  },
  adjustText: {
    ...typography.label,
    color: palette.textPrimary,
  },
  skipBtn: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 999,
    backgroundColor: palette.iris,
  },
  skipText: {
    ...typography.subheading,
    color: '#fff',
  },
});
