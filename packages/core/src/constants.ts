import type { QuadrantConfig, RingConfig, RadarLayout } from './types';

export const DEFAULT_QUADRANTS: QuadrantConfig[] = [
  { index: 0, name: 'Languages' },
  { index: 1, name: 'Infrastructure' },
  { index: 2, name: 'Datastores' },
  { index: 3, name: 'Data Management' },
];

export const DEFAULT_RINGS: RingConfig[] = [
  { index: 0, name: 'ADOPT', color: '#5ba300' },
  { index: 1, name: 'TRIAL', color: '#009eb0' },
  { index: 2, name: 'ASSESS', color: '#c7ba00' },
  { index: 3, name: 'HOLD', color: '#e09b96' },
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

export const COLORS = {
  background: '#fff',
  grid: '#dddde0',
  inactive: '#ddd',
};
