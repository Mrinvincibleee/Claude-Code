import { BarDatum } from '@/components';
import { UserGoals, UserProfile } from './types';

/** Demo user shown before auth / Supabase sync is wired up. */
export const MOCK_PROFILE: UserProfile = {
  name: 'Alex',
  goal: 'Build Muscle',
  experience: 'intermediate',
  streakDays: 12,
  level: 7,
  xp: 1840,
  xpToNext: 2500,
  weightKg: 78.4,
};

export const MOCK_GOALS: UserGoals = {
  calories: 2600,
  caloriesConsumed: 1740,
  protein: 180,
  proteinConsumed: 124,
  waterMl: 3000,
  waterConsumedMl: 1900,
};

/** Weekly training volume (in thousands of kg) for the progress chart. */
export const WEEKLY_VOLUME: BarDatum[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 0 },
  { label: 'Wed', value: 16 },
  { label: 'Thu', value: 9 },
  { label: 'Fri', value: 18 },
  { label: 'Sat', value: 14 },
  { label: 'Sun', value: 0 },
];

/** Bodyweight trend (kg) for the progress screen. */
export const WEIGHT_TREND: BarDatum[] = [
  { label: 'W1', value: 80 },
  { label: 'W2', value: 79 },
  { label: 'W3', value: 79 },
  { label: 'W4', value: 78 },
];

export const TODAY_HABITS = [
  { id: 'water', label: 'Drink 3L water', icon: '💧', done: true },
  { id: 'protein', label: 'Hit protein target', icon: '🍗', done: false },
  { id: 'steps', label: '10,000 steps', icon: '👟', done: false },
  { id: 'sleep', label: 'Sleep 8 hours', icon: '😴', done: true },
  { id: 'stretch', label: '10 min stretch', icon: '🧘', done: false },
];
