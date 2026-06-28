import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/theme';

/**
 * Full-screen ambient backdrop: a deep base gradient with two soft, off-screen
 * colored "light blooms" that give every screen a sense of depth and dynamic
 * lighting (the glassmorphism look depends on having color behind the blur).
 */
export function ScreenBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[palette.ink, palette.void]}
        style={StyleSheet.absoluteFill}
      />
      {/* Iris bloom — top right */}
      <View style={[styles.bloom, styles.bloomIris]} />
      {/* Aqua bloom — bottom left */}
      <View style={[styles.bloom, styles.bloomAqua]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.void,
  },
  bloom: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 360,
    opacity: 0.22,
  },
  bloomIris: {
    top: -120,
    right: -100,
    backgroundColor: palette.iris,
  },
  bloomAqua: {
    bottom: -140,
    left: -120,
    backgroundColor: palette.aqua,
    opacity: 0.14,
  },
});
