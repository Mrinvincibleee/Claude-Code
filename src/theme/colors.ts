/**
 * FitForge AI — Color system.
 *
 * Dark-mode-first palette tuned for a glassmorphism UI: deep near-black
 * backgrounds, translucent surfaces, and vivid gradient accents that read as
 * "dynamic lighting" when layered over blur.
 */

export const palette = {
  // Base canvas
  void: '#0A0A0F',
  ink: '#101018',
  carbon: '#16161F',

  // Translucent surfaces (used with expo-blur / rgba fills)
  glassLight: 'rgba(255, 255, 255, 0.08)',
  glassLighter: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.14)',
  glassBorderSoft: 'rgba(255, 255, 255, 0.08)',

  // Brand accents — used in gradients for buttons, rings, highlights.
  iris: '#6D5DF6', // primary
  irisDeep: '#4C3FD8',
  aqua: '#22D3EE',
  lime: '#A3E635',
  amber: '#FBBF24',
  rose: '#FB7185',
  magenta: '#E879F9',

  // Semantic
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#FB7185',

  // Text
  textPrimary: '#F5F6FA',
  textSecondary: 'rgba(245, 246, 250, 0.66)',
  textTertiary: 'rgba(245, 246, 250, 0.40)',
} as const;

/** Reusable gradient stops (left→right or top→bottom). */
export const gradients = {
  primary: ['#6D5DF6', '#9D7BFF'] as const,
  iris: ['#6D5DF6', '#4C3FD8'] as const,
  aqua: ['#22D3EE', '#6D5DF6'] as const,
  sunset: ['#FB7185', '#FBBF24'] as const,
  lime: ['#A3E635', '#22D3EE'] as const,
  magenta: ['#E879F9', '#6D5DF6'] as const,
  // Ambient screen background glow.
  ambient: ['#16121F', '#0A0A0F'] as const,
} as const;

export type GradientName = keyof typeof gradients;
