import { palette } from '@/theme';
import { Workout, WorkoutCategory } from './types';

export const WORKOUT_CATEGORIES: WorkoutCategory[] = [
  'Push Pull Legs',
  'Upper Lower',
  'Bro Split',
  'Full Body',
  'Powerlifting',
  'Bodybuilding',
  'Calisthenics',
  'Home Workout',
  'HIIT',
  'Cardio',
];

export const WORKOUTS: Workout[] = [
  {
    id: 'push-day',
    title: 'Push Day — Chest, Shoulders, Triceps',
    category: 'Push Pull Legs',
    durationMin: 55,
    difficulty: 'intermediate',
    focus: ['chest', 'shoulders', 'triceps'],
    exerciseIds: [
      'bench-press',
      'incline-db-press',
      'overhead-press',
      'lateral-raise',
      'tricep-pushdown',
    ],
    accent: palette.iris,
  },
  {
    id: 'pull-day',
    title: 'Pull Day — Back & Biceps',
    category: 'Push Pull Legs',
    durationMin: 50,
    difficulty: 'intermediate',
    focus: ['back', 'biceps'],
    exerciseIds: ['pullup', 'barbell-row', 'lat-pulldown', 'bicep-curl'],
    accent: palette.aqua,
  },
  {
    id: 'leg-day',
    title: 'Leg Day — Quads, Hams, Glutes',
    category: 'Push Pull Legs',
    durationMin: 60,
    difficulty: 'advanced',
    focus: ['legs', 'glutes', 'calves'],
    exerciseIds: ['back-squat', 'rdl', 'leg-press', 'calf-raise'],
    accent: palette.lime,
  },
  {
    id: 'home-fullbody',
    title: 'Home Full Body — No Equipment',
    category: 'Home Workout',
    durationMin: 30,
    difficulty: 'beginner',
    focus: ['fullbody'],
    exerciseIds: ['pushup', 'goblet-squat', 'plank', 'burpee'],
    accent: palette.amber,
  },
  {
    id: 'hiit-burn',
    title: 'HIIT Fat Burner',
    category: 'HIIT',
    durationMin: 22,
    difficulty: 'intermediate',
    focus: ['fullbody'],
    exerciseIds: ['burpee', 'kettlebell-swing', 'pushup', 'plank'],
    accent: palette.rose,
  },
  {
    id: 'core-crusher',
    title: 'Core Crusher',
    category: 'Calisthenics',
    durationMin: 18,
    difficulty: 'beginner',
    focus: ['core'],
    exerciseIds: ['plank', 'hanging-leg-raise'],
    accent: palette.magenta,
  },
];

export function getWorkout(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id);
}
