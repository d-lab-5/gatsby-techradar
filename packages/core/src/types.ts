export interface TechradarEntry {
  id: string;
  label: string;
  quadrant: number;
  ring: number;
  moved: number;
  active: boolean;
  link?: string;
  description?: string;
}

export interface QuadrantConfig {
  index: number;
  name: string;
}

export type ThemeMode = 'light' | 'dark';

/**
 * A color that may resolve differently per theme mode. A bare string is used
 * as-is in both modes.
 */
export type ThemeColor = string | { light: string; dark: string };

export interface RingConfig {
  index: number;
  name: string;
  color: ThemeColor;
}

/** A RingConfig whose color has been resolved for one specific mode. */
export interface ResolvedRingConfig {
  index: number;
  name: string;
  color: string;
}

/**
 * The flattened ring shape used by the Gatsby GraphQL schema, which cannot
 * express a string-or-object union. Convert with `ringsFromFlat`.
 */
export interface FlatRingConfig {
  index: number;
  name: string;
  color: string;
  colorDark?: string | null;
}

/**
 * Every color the radar draws that is not supplied by the radar data itself.
 * Ring colors live on RingConfig; everything else lives here.
 */
export interface RadarTheme {
  mode: ThemeMode;
  fontFamily: string;
  /** Canvas behind the radar. */
  background: string;
  /** Ring circles and cross-hairs. */
  grid: string;
  /** Blip fill for entries with active: false. */
  inactive: string;
  /** Primary label and body text. */
  text: string;
  /** Secondary text, e.g. entry descriptions. */
  textMuted: string;
  /** Text drawn on top of a ring color, e.g. blip ids, selected buttons. */
  onAccent: string;
  /** Borders that must not compete with ring colors. */
  mutedBorder: string;
  tooltipBackground: string;
  tooltipText: string;
  /** Backdrop painted behind a highlighted legend label. */
  highlightFill: string;
  /** Legend label text while highlighted. */
  highlightText: string;
  /** Row background in the quadrant table while highlighted. */
  rowHighlight: string;
  /** Opacity applied to ring-colored quadrant arcs. */
  ringFillOpacity: number;
}

export interface TechradarConfig {
  title: string;
  date?: string;
  quadrants: QuadrantConfig[];
  rings: RingConfig[];
  entries: TechradarEntry[];
}

export interface PositionedEntry extends TechradarEntry {
  x: number;
  y: number;
  color: string;
}

export interface RadarLayout {
  size: number;
  ringRadii: number[];
  center: number;
}

export interface TechradarPluginOptions {
  source: 'csv' | 'amplify';
  csvPath?: string;
  radarId?: string;
  radarName?: string;
  quadrants?: QuadrantConfig[];
  rings?: RingConfig[];
}
