import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ScreenBackground } from '@/components';
import { palette, typography } from '@/theme';

/**
 * Splash screen. A logo mark scales + fades in, a "liquid" pulse loops, then we
 * route to onboarding. (Auth gating would slot in here once Supabase is wired.)
 */
export default function Splash() {
  const router = useRouter();
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.4)) });
    pulse.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1.12, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );

    const t = setTimeout(() => router.replace('/onboarding'), 2400);
    return () => clearTimeout(t);
  }, [opacity, scale, pulse, router]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
    transform: [{ scale: pulse.value }],
  }));

  return (
    <ScreenBackground>
      <View style={styles.center}>
        <Animated.View style={[styles.halo, haloStyle]} />
        <Animated.View style={markStyle}>
          <Text style={styles.mark}>⚡</Text>
          <Text style={styles.wordmark}>FitForge</Text>
          <Text style={styles.tagline}>AI-Powered Training</Text>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: palette.iris,
    opacity: 0.4,
  },
  mark: {
    fontSize: 64,
    textAlign: 'center',
  },
  wordmark: {
    ...typography.display,
    color: palette.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  tagline: {
    ...typography.subheading,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
