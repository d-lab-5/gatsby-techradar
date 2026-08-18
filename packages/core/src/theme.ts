import type {
  FlatRingConfig,
  RadarTheme,
  ResolvedRingConfig,
  RingConfig,
  ThemeColor,
  ThemeMode,
} from './types';
import { DARK_THEME, LIGHT_THEME } from './constants';

/** Pick the built-in theme for a mode. */
export function themeForMode(mode: ThemeMode): RadarTheme {
  return mode === 'dark' ? DARK_THEME : LIGHT_THEME;
}

/**
 * Build a theme from a mode plus optional token overrides. Passing a bare mode
 * returns the built-in theme unchanged.
 */
export function createTheme(
  mode: ThemeMode = 'light',
  overrides: Partial<RadarTheme> = {}
): RadarTheme {
  return { ...themeForMode(mode), ...overrides, mode };
}

/** Resolve a ThemeColor for one mode. Bare strings apply to both modes. */
export function resolveThemeColor(color: ThemeColor, mode: ThemeMode): string {
  return typeof color === 'string' ? color : color[mode];
}

export function resolveRing(ring: RingConfig, mode: ThemeMode): ResolvedRingConfig {
  return {
    index: ring.index,
    name: ring.name,
    color: resolveThemeColor(ring.color, mode),
  };
}

export function resolveRings(
  rings: RingConfig[],
  mode: ThemeMode
): ResolvedRingConfig[] {
  return rings.map((ring) => resolveRing(ring, mode));
}

/**
 * Flatten a ring for transports that cannot express a union, such as the
 * Gatsby GraphQL schema.
 */
export function ringToFlat(ring: RingConfig): Required<FlatRingConfig> {
  return {
    index: ring.index,
    name: ring.name,
    color: resolveThemeColor(ring.color, 'light'),
    colorDark: resolveThemeColor(ring.color, 'dark'),
  };
}

export function ringsToFlat(rings: RingConfig[]): Required<FlatRingConfig>[] {
  return rings.map(ringToFlat);
}

/**
 * Rebuild a RingConfig from its flattened form. A missing, null, or identical
 * `colorDark` collapses back to a single color, so flatten/rebuild round-trips
 * without changing the shape a caller originally wrote.
 */
export function ringFromFlat(ring: FlatRingConfig): RingConfig {
  const singleColor = !ring.colorDark || ring.colorDark === ring.color;

  return {
    index: ring.index,
    name: ring.name,
    color: singleColor ? ring.color : { light: ring.color, dark: ring.colorDark! },
  };
}

export function ringsFromFlat(rings: FlatRingConfig[]): RingConfig[] {
  return rings.map(ringFromFlat);
}
