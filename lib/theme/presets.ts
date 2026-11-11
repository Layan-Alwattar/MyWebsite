/**
 * Built-in theme presets. Mirrors supabase/migrations/…_defaults.sql and
 * powers the "Reset to original" button in the theme editor.
 */
import type { Theme, ThemeFonts } from './types';

const DEFAULT_FONTS: ThemeFonts = {
  heading: 'Fraunces',
  body: 'Plus Jakarta Sans',
  headingAr: 'El Messiri',
  bodyAr: 'IBM Plex Sans Arabic',
};

export const PRESETS: Theme[] = [
  {
    name: 'Blush Pink',
    colors: {
      light: { bg: '#FFF7F9', surface: '#FFFFFF', primary: '#E05A8E', primaryInk: '#A8275E', secondary: '#B9A3F5', accent: '#FFB38A', ink: '#2B1B2E', muted: '#6E5A70' },
      dark: { bg: '#1A1220', surface: '#251A2D', primary: '#FF8DB8', primaryInk: '#FFB3CF', secondary: '#B9A3F5', accent: '#FFB38A', ink: '#F7EDF3', muted: '#C3B2C6' },
    },
    fonts: DEFAULT_FONTS,
    radius: '1.25rem',
    motion_level: 'subtle',
    cursor_glow: false,
  },
  {
    name: 'Lavender Dream',
    colors: {
      light: { bg: '#F8F6FF', surface: '#FFFFFF', primary: '#8B6CF0', primaryInk: '#5B3FC4', secondary: '#F2A7D0', accent: '#9EE6CF', ink: '#1F1A33', muted: '#625C78' },
      dark: { bg: '#16132A', surface: '#211C3A', primary: '#A992FF', primaryInk: '#C9BBFF', secondary: '#F2A7D0', accent: '#9EE6CF', ink: '#F1EEFF', muted: '#B7B1D1' },
    },
    fonts: DEFAULT_FONTS,
    radius: '1.25rem',
    motion_level: 'subtle',
    cursor_glow: false,
  },
  {
    name: 'Peach Sunset',
    colors: {
      light: { bg: '#FFF8F2', surface: '#FFFFFF', primary: '#FF8A65', primaryInk: '#B4441F', secondary: '#F7A8C4', accent: '#FFD976', ink: '#2E1D16', muted: '#715D55' },
      dark: { bg: '#1F1512', surface: '#2B1E19', primary: '#FFA382', primaryInk: '#FFC3AC', secondary: '#F7A8C4', accent: '#FFD976', ink: '#FBF0EA', muted: '#C9B5AC' },
    },
    fonts: DEFAULT_FONTS,
    radius: '1.25rem',
    motion_level: 'subtle',
    cursor_glow: false,
  },
];

export const DEFAULT_THEME = PRESETS[0];

export function findPreset(name: string) {
  return PRESETS.find((p) => p.name === name);
}
