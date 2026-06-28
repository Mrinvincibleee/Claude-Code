/**
 * Consistent 4pt spacing scale + radius + shadow tokens.
 * Keeping these centralized is what makes the layout feel "designed".
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

/** Soft, layered shadows for floating cards (iOS) — Android uses elevation. */
export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  glow: {
    shadowColor: '#6D5DF6',
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  floatingNav: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 20,
  },
} as const;
