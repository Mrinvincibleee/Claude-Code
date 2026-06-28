import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { palette, radius, shadow, spacing } from '@/theme';

type Props = ViewProps & {
  /** Blur strength; lower = more subtle. */
  intensity?: number;
  /** Inner padding preset. */
  padding?: keyof typeof spacing | number;
  /** Adds a soft brand-colored glow under the card. */
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Frosted-glass surface — the foundational building block of the UI. Uses a
 * real backdrop blur on iOS/Android via expo-blur, with a translucent fill +
 * hairline border so it reads as glass on web too.
 */
export function GlassCard({
  children,
  intensity = 30,
  padding = 'xl',
  glow = false,
  style,
  ...rest
}: Props) {
  const pad = typeof padding === 'number' ? padding : spacing[padding];

  return (
    <View
      style={[styles.shadowWrap, glow ? shadow.glow : shadow.card, style]}
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[styles.glass, { padding: pad }]}
      >
        {/* Subtle top highlight to fake a light edge */}
        <View pointerEvents="none" style={styles.topHighlight} />
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: radius.lg,
    // On web, BlurView clips children oddly without an explicit bg fallback.
    backgroundColor: Platform.OS === 'web' ? palette.glassLight : 'transparent',
  },
  glass: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassLight,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
