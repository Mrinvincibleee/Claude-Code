/** Shared domain types for FitForge AI. */

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'calves'
  | 'fullbody';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'band';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  defaultSets: number;
  defaultReps: string; // e.g. "8-12"
  notes?: string;
  alternatives?: string[]; // exercise ids
}

export type WorkoutCategory =
  | 'Push Pull Legs'
  | 'Upper Lower'
  | 'Bro Split'
  | 'Full Body'
  | 'Powerlifting'
  | 'Bodybuilding'
  | 'Calisthenics'
  | 'Home Workout'
  | 'HIIT'
  | 'Cardio';

export interface Workout {
  id: string;
  title: string;
  category: WorkoutCategory;
  durationMin: number;
  difficulty: Difficulty;
  focus: MuscleGroup[];
  exerciseIds: string[];
  accent: string; // hex used for the card glow
}

export interface UserGoals {
  calories: number;
  caloriesConsumed: number;
  protein: number; // grams
  proteinConsumed: number;
  waterMl: number;
  waterConsumedMl: number;
}

export interface UserProfile {
  name: string;
  goal: 'Lose Fat' | 'Build Muscle' | 'Recomp' | 'Maintain';
  experience: Difficulty;
  streakDays: number;
  level: number;
  xp: number;
  xpToNext: number;
  weightKg: number;
}
