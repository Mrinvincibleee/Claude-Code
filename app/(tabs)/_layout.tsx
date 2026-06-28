import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { palette, radius, shadow, spacing } from '@/theme';

const ICONS: Record<string, string> = {
  index: '🏠',
  workouts: '💪',
  coach: '✨',
  progress: '📈',
  profile: '👤',
};

const LABELS: Record<string, string> = {
  index: 'Home',
  workouts: 'Train',
  coach: 'Coach',
  progress: 'Progress',
  profile: 'Profile',
};

/**
 * Floating, frosted-glass tab bar that hovers above the content rather than
 * sitting flush to the edge — a hallmark of the premium look.
 */
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{ICONS[name]}</Text>
      <Text style={[styles.label, focused && styles.labelActive]}>{LABELS[name]}</Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint="dark"
            style={[StyleSheet.absoluteFill, styles.barBlur]}
          />
        ),
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="workouts" />
      <Tabs.Screen name="coach" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: Platform.OS === 'ios' ? 28 : 18,
    height: 68,
    borderRadius: radius.xl,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.sm,
    ...shadow.floatingNav,
  },
  barBlur: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassLight,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    paddingTop: spacing.sm,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.textTertiary,
    marginTop: 2,
  },
  labelActive: {
    color: palette.textPrimary,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.iris,
    marginTop: 3,
  },
});
