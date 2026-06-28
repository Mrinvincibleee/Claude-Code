import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, palette, radius, spacing, typography } from '@/theme';

/**
 * Selectable chip used for categories, onboarding choices, filters. When
 * `selected`, it fills with the brand gradient.
 */
export function Pill({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const handlePress = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  }, [onPress]);

  if (selected) {
    return (
      <Pressable onPress={handlePress}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pill, styles.pillSelected]}
        >
          <Text style={[styles.label, styles.labelSelected]}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} style={[styles.pill, styles.pillIdle]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillIdle: {
    backgroundColor: palette.glassLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.glassBorder,
  },
  pillSelected: {},
  label: {
    ...typography.label,
    color: palette.textSecondary,
  },
  labelSelected: {
    color: palette.textPrimary,
  },
});
