import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard, GradientButton, Pill, ScreenBackground } from '@/components';
import { palette, radius, spacing, typography } from '@/theme';

type StepKind = 'single' | 'multi';

interface Step {
  key: string;
  title: string;
  subtitle: string;
  kind: StepKind;
  options: string[];
}

const STEPS: Step[] = [
  {
    key: 'goal',
    title: 'What\'s your goal?',
    subtitle: 'We\'ll tune your plan around it.',
    kind: 'single',
    options: ['Lose Fat', 'Build Muscle', 'Recomp', 'Maintain', 'Get Stronger'],
  },
  {
    key: 'experience',
    title: 'Your experience level?',
    subtitle: 'Be honest — we adapt the intensity.',
    kind: 'single',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    key: 'location',
    title: 'Where do you train?',
    subtitle: 'We\'ll match exercises to your setup.',
    kind: 'single',
    options: ['Full Gym', 'Home', 'Both'],
  },
  {
    key: 'equipment',
    title: 'Available equipment',
    subtitle: 'Select everything you have access to.',
    kind: 'multi',
    options: ['Barbell', 'Dumbbells', 'Machines', 'Cables', 'Kettlebell', 'Bands', 'Bodyweight'],
  },
  {
    key: 'days',
    title: 'How many days per week?',
    subtitle: 'Consistency beats perfection.',
    kind: 'single',
    options: ['3 days', '4 days', '5 days', '6 days'],
  },
  {
    key: 'diet',
    title: 'Dietary preference',
    subtitle: 'For your nutrition plan & recipes.',
    kind: 'single',
    options: ['No preference', 'Vegetarian', 'Vegan', 'Keto', 'High protein'],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [generating, setGenerating] = useState(false);

  const step = STEPS[index];
  const selected = answers[step.key] ?? [];
  const isLast = index === STEPS.length - 1;
  const canAdvance = selected.length > 0;

  const progress = useSharedValue((index + 1) / STEPS.length);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const select = (option: string) => {
    setAnswers((prev) => {
      const current = prev[step.key] ?? [];
      if (step.kind === 'single') return { ...prev, [step.key]: [option] };
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [step.key]: next };
    });
  };

  const goNext = () => {
    if (isLast) {
      setGenerating(true);
      // Simulate plan generation; real app calls the AI plan generator.
      setTimeout(() => router.replace('/(tabs)'), 1600);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    progress.value = withTiming((nextIndex + 1) / STEPS.length, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  };

  const goBack = () => {
    if (index === 0) {
      router.back();
      return;
    }
    const prevIndex = index - 1;
    setIndex(prevIndex);
    progress.value = withTiming((prevIndex + 1) / STEPS.length, { duration: 300 });
  };

  const headerLabel = useMemo(
    () => `Step ${index + 1} of ${STEPS.length}`,
    [index],
  );

  if (generating) {
    return (
      <ScreenBackground>
        <View style={styles.generating}>
          <Animated.Text entering={FadeIn} style={styles.genEmoji}>
            🤖
          </Animated.Text>
          <Text style={styles.genTitle}>Building your plan…</Text>
          <Text style={styles.genSub}>
            Analyzing your goal, schedule and equipment to craft a personalized
            program.
          </Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.stepLabel}>{headerLabel}</Text>

        <Animated.View
          key={step.key}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(150)}
          style={styles.body}
        >
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.subtitle}>{step.subtitle}</Text>

          <ScrollView
            contentContainerStyle={styles.options}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.optionWrap}>
              {step.options.map((option) => (
                <Pill
                  key={option}
                  label={option}
                  selected={selected.includes(option)}
                  onPress={() => select(option)}
                />
              ))}
            </View>
            {step.kind === 'multi' && (
              <GlassCard padding="md" style={styles.hint}>
                <Text style={styles.hintText}>
                  💡 You can select multiple options.
                </Text>
              </GlassCard>
            )}
          </ScrollView>
        </Animated.View>

        <View style={styles.footer}>
          <GradientButton
            label="Back"
            variant="ghost"
            onPress={goBack}
            style={styles.backBtn}
          />
          <GradientButton
            label={isLast ? 'Generate Plan' : 'Continue'}
            onPress={goNext}
            disabled={!canAdvance}
            style={styles.nextBtn}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.glassLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.iris,
  },
  stepLabel: {
    ...typography.label,
    color: palette.textTertiary,
    marginTop: spacing.md,
  },
  body: {
    flex: 1,
    marginTop: spacing.xl,
  },
  title: {
    ...typography.title,
    color: palette.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: spacing.sm,
  },
  options: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  hint: {
    marginTop: spacing.xl,
  },
  hintText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
  generating: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.huge,
  },
  genEmoji: {
    fontSize: 72,
    marginBottom: spacing.xl,
  },
  genTitle: {
    ...typography.title,
    color: palette.textPrimary,
    textAlign: 'center',
  },
  genSub: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
