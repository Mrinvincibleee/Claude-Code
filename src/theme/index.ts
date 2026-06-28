import { palette } from './colors';

export { palette, gradients } from './colors';
export type { GradientName } from './colors';
export { spacing, radius, shadow } from './spacing';
export { typography, fonts } from './typography';

/** Convenience aggregate consumed by some components. */
export const theme = {
  colors: palette,
} as const;
