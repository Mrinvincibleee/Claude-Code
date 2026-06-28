import { Platform, TextStyle } from 'react-native';

/**
 * Typography scale. We lean on the platform system font (SF Pro on iOS,
 * Roboto on Android) for an Apple-grade default; Inter can be loaded via
 * expo-font and swapped into `fontFamily` without touching call sites.
 */

const systemFont = Platform.select({
  ios: 'System',
  default: 'sans-serif',
});

export const fonts = {
  regular: systemFont,
  medium: systemFont,
  bold: systemFont,
} as const;

type Variant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'label'
  | 'caption'
  | 'metric';

export const typography: Record<Variant, TextStyle> = {
  display: { fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  subheading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '600', letterSpacing: 0.2 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  // Big tabular numbers for rings, timers, PRs.
  metric: { fontSize: 34, lineHeight: 38, fontWeight: '800', letterSpacing: -0.5 },
};
