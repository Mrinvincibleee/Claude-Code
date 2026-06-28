import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { GradientName, gradients, palette, radius, shadow, spacing, typography } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  onPress?: () => void;
  gradient?: GradientName;
  loading?: boolean;
  disabled?: boolean;
  /** Outline / ghost style instead of filled gradient. */
  variant?: 'solid' | 'ghost';
  icon?: React.ReactNode;
  style?: ViewStyle;
};

/**
 * Elastic, haptic gradient button. Springs on press-in for the tactile
 * "micro-interaction on every tap" the PRD calls for.
 */
export function GradientButton({
  label,
  onPress,
  gradient = 'primary',
  loading = false,
  disabled = false,
  variant = 'solid',
  icon,
  style,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 14, stiffness: 320 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 260 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  }, [disabled, loading, onPress]);

  const isGhost = variant === 'ghost';
  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={palette.textPrimary} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, isGhost && styles.labelGhost]}>{label}</Text>
        </>
      )}
    </>
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }, style]}
    >
      {isGhost ? (
        <Animated.View style={[styles.base, styles.ghost]}>{content}</Animated.View>
      ) : (
        <LinearGradient
          colors={gradients[gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, shadow.glow]}
        >
          {content}
        </LinearGradient>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xxl,
  },
  ghost: {
    backgroundColor: palette.glassLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.glassBorder,
  },
  label: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  labelGhost: {
    color: palette.textPrimary,
  },
});
