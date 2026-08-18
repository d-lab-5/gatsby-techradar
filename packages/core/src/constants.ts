import type { QuadrantConfig, RingConfig, RadarLayout, RadarTheme } from './types';

const FONT_STACK = 'Arial, Helvetica, sans-serif';

export const DEFAULT_QUADRANTS: QuadrantConfig[] = [
  { index: 0, name: 'Languages' },
  { index: 1, name: 'Infrastructure' },
  { index: 2, name: 'Datastores' },
  { index: 3, name: 'Data Management' },
];

// Dark variants are lifted in luminance so they stay legible against a dark
// canvas; the light values are the original Thoughtworks-style ring colors.
export const DEFAULT_RINGS: RingConfig[] = [
  { index: 0, name: 'ADOPT', color: { light: '#5ba300', dark: '#8bd346' } },
  { index: 1, name: 'TRIAL', color: { light: '#009eb0', dark: '#3fc9dd' } },
  { index: 2, name: 'ASSESS', color: { light: '#c7ba00', dark: '#e5d63a' } },
  { index: 3, name: 'HOLD', color: { light: '#e09b96', dark: '#f0a9a4' } },
];

export const DEFAULT_LAYOUT: RadarLayout = {
  size: 800,
  ringRadii: [130, 220, 310, 400],
  center: 400,
};

export const QUADRANT_GEOMETRY = [
  { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
  { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
  { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
  { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 },
];

export const LIGHT_THEME: RadarTheme = {
  mode: 'light',
  fontFamily: FONT_STACK,
  background: '#fff',
  grid: '#dddde0',
  inactive: '#ddd',
  text: '#333',
  textMuted: '#666',
  onAccent: '#fff',
  mutedBorder: '#999',
  tooltipBackground: '#333',
  tooltipText: '#fff',
  highlightFill: 'rgba(0, 0, 0, 0.8)',
  highlightText: '#fff',
  rowHighlight: '#eee',
  ringFillOpacity: 0.1,
};

export const DARK_THEME: RadarTheme = {
  mode: 'dark',
  fontFamily: FONT_STACK,
  background: '#111418',
  grid: '#2a2f36',
  inactive: '#4a5058',
  text: '#e6e8eb',
  textMuted: '#9aa0a6',
  // Dark-mode ring colors are bright, so on-accent text goes dark.
  onAccent: '#0b0d10',
  mutedBorder: '#565c66',
  tooltipBackground: '#e6e8eb',
  tooltipText: '#111418',
  highlightFill: 'rgba(255, 255, 255, 0.85)',
  highlightText: '#111418',
  rowHighlight: '#232830',
  // Nudged up: low-alpha fills wash out against a dark canvas.
  ringFillOpacity: 0.14,
};

export const DEFAULT_THEME = LIGHT_THEME;

/**
 * @deprecated Use `LIGHT_THEME` / `DARK_THEME`, or the `theme` prop on
 * `<RadarChart>`. Retained so existing imports keep resolving.
 */
export const COLORS = {
  background: LIGHT_THEME.background,
  grid: LIGHT_THEME.grid,
  inactive: LIGHT_THEME.inactive,
};
