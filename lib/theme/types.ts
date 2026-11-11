export const COLOR_KEYS = ['bg', 'surface', 'primary', 'primaryInk', 'secondary', 'accent', 'ink', 'muted'] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];
export type Palette = Record<ColorKey, string>;

export type ThemeFonts = { heading: string; body: string; headingAr: string; bodyAr: string };
export type MotionLevel = 'off' | 'subtle' | 'playful';

export type Theme = {
  id?: string;
  name: string;
  is_preset?: boolean;
  is_active?: boolean;
  colors: { light: Palette; dark: Palette };
  fonts: ThemeFonts;
  radius: string;
  motion_level: MotionLevel;
  cursor_glow: boolean;
};

export const COLOR_LABELS: Record<ColorKey, { label: string; help: string }> = {
  bg: { label: 'Background', help: 'Page background' },
  surface: { label: 'Surface', help: 'Cards and panels' },
  primary: { label: 'Primary', help: 'Gradients, blobs, highlights' },
  primaryInk: { label: 'Primary text', help: 'Links and buttons — must stay readable' },
  secondary: { label: 'Secondary', help: 'Supporting pastel' },
  accent: { label: 'Accent', help: 'Little pops of color' },
  ink: { label: 'Text', help: 'Main body text' },
  muted: { label: 'Muted text', help: 'Captions, dates, secondary text' },
};
