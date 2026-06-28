import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GlassCard,
  GradientButton,
  ScreenBackground,
  SectionHeader,
} from '@/components';
import { gradients, palette, radius, spacing, typography } from '@/theme';
import { MOCK_PROFILE } from '@/data/user';

const TAB_BAR_SPACE = 110;

const ACHIEVEMENTS = [
  { icon: '🔥', label: '7-Day Streak' },
  { icon: '🏋️', label: '50 Workouts' },
  { icon: '💪', label: 'PR Crusher' },
  { icon: '🥗', label: 'Macro Master' },
];

const SETTINGS = [
  { icon: '⌚', label: 'Wearables', detail: 'Apple Health, Garmin' },
  { icon: '🔔', label: 'Notifications', detail: 'Smart reminders' },
  { icon: '🎯', label: 'Goals & Targets', detail: 'Edit your plan' },
  { icon: '🔒', label: 'Privacy & Security' },
  { icon: '❓', label: 'Help & Support' },
];

export default function Profile() {
  const insets = useSafeAreaInsets();
  const xpRatio = MOCK_PROFILE.xp / MOCK_PROFILE.xpToNext;

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing.xl,
          paddingBottom: TAB_BAR_SPACE,
        }}
      >
        {/* Identity */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.identity}>
          <LinearGradient colors={gradients.primary} style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>
              {MOCK_PROFILE.name.charAt(0)}
            </Text>
          </LinearGradient>
          <Text style={styles.name}>{MOCK_PROFILE.name}</Text>
          <Text style={styles.goal}>
            {MOCK_PROFILE.goal} · {MOCK_PROFILE.experience}
          </Text>

          {/* Level / XP bar */}
          <GlassCard style={styles.levelCard}>
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level {MOCK_PROFILE.level}</Text>
              <Text style={styles.xpText}>
                {MOCK_PROFILE.xp} / {MOCK_PROFILE.xpToNext} XP
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <LinearGradient
                colors={gradients.aqua}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.xpFill, { width: `${xpRatio * 100}%` }]}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Premium upsell */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(400)}
          style={styles.section}
        >
          <LinearGradient
            colors={gradients.sunset}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premium}
          >
            <Text style={styles.premiumBadge}>PREMIUM</Text>
            <Text style={styles.premiumTitle}>Unlock FitForge Pro</Text>
            <Text style={styles.premiumText}>
              Unlimited AI coaching, custom programs, advanced analytics, meal
              generator & wearable sync.
            </Text>
            <GradientButton
              label="Go Premium"
              variant="ghost"
              style={styles.premiumBtn}
              onPress={() => {}}
            />
          </LinearGradient>
        </Animated.View>

        {/* Achievements */}
        <Animated.View
          entering={FadeInDown.delay(140).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Achievements" action="See all" />
          <View style={styles.badges}>
            {ACHIEVEMENTS.map((a) => (
              <GlassCard key={a.label} padding="md" style={styles.badge}>
                <Text style={styles.badgeIcon}>{a.icon}</Text>
                <Text style={styles.badgeLabel}>{a.label}</Text>
              </GlassCard>
            ))}
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <SectionHeader title="Settings" />
          <GlassCard padding="md">
            {SETTINGS.map((s, i) => (
              <View
                key={s.label}
                style={[
                  styles.settingRow,
                  i < SETTINGS.length - 1 && styles.settingDivider,
                ]}
              >
                <Text style={styles.settingIcon}>{s.icon}</Text>
                <View style={styles.settingBody}>
                  <Text style={styles.settingLabel}>{s.label}</Text>
                  {s.detail && <Text style={styles.settingDetail}>{s.detail}</Text>}
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </View>
            ))}
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
  },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigAvatarText: {
    ...typography.display,
    color: '#fff',
  },
  name: {
    ...typography.title,
    color: palette.textPrimary,
    marginTop: spacing.md,
  },
  goal: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: 2,
  },
  levelCard: {
    width: '100%',
    marginTop: spacing.xl,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  levelText: {
    ...typography.subheading,
    color: palette.textPrimary,
  },
  xpText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  xpTrack: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: palette.glassLight,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  section: {
    marginTop: spacing.xxl,
  },
  premium: {
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  premiumBadge: {
    ...typography.label,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.5,
  },
  premiumTitle: {
    ...typography.heading,
    color: '#fff',
    marginTop: spacing.xs,
  },
  premiumText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.92)',
    marginTop: spacing.sm,
  },
  premiumBtn: {
    marginTop: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badge: {
    width: '47%',
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  badgeIcon: { fontSize: 26 },
  badgeLabel: {
    ...typography.label,
    color: palette.textPrimary,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  settingDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.glassBorderSoft,
  },
  settingIcon: { fontSize: 20 },
  settingBody: { flex: 1 },
  settingLabel: {
    ...typography.body,
    color: palette.textPrimary,
  },
  settingDetail: {
    ...typography.caption,
    color: palette.textTertiary,
    marginTop: 1,
  },
  settingChevron: {
    fontSize: 24,
    color: palette.textTertiary,
  },
});
