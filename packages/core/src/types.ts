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

export interface RingConfig {
  index: number;
  name: string;
  color: string;
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
