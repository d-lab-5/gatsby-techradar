import { QUADRANT_GEOMETRY } from '../constants';
import type { RadarLayout } from '../types';

interface PolarCoord {
  t: number;
  r: number;
}

interface CartesianCoord {
  x: number;
  y: number;
}

export function polar(cartesian: CartesianCoord): PolarCoord {
  return {
    t: Math.atan2(cartesian.y, cartesian.x),
    r: Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y),
  };
}

export function cartesian(p: PolarCoord): CartesianCoord {
  return {
    x: p.r * Math.cos(p.t),
    y: p.r * Math.sin(p.t),
  };
}

function boundedInterval(value: number, min: number, max: number): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}

function boundedRing(p: PolarCoord, rMin: number, rMax: number): PolarCoord {
  return {
    t: p.t,
    r: boundedInterval(p.r, rMin, rMax),
  };
}

function boundedBox(
  point: CartesianCoord,
  min: CartesianCoord,
  max: CartesianCoord
): CartesianCoord {
  return {
    x: boundedInterval(point.x, min.x, max.x),
    y: boundedInterval(point.y, min.y, max.y),
  };
}

export interface Segment {
  clipx: (d: CartesianCoord & { x: number; y: number }) => number;
  clipy: (d: CartesianCoord & { x: number; y: number }) => number;
  random: () => CartesianCoord;
}

export function createSegment(
  quadrant: number,
  ring: number,
  layout: RadarLayout,
  randomFn: () => number
): Segment {
  const q = QUADRANT_GEOMETRY[quadrant];

  const polarMin: PolarCoord = {
    t: q.radial_min * Math.PI,
    r: ring === 0 ? 30 : layout.ringRadii[ring - 1],
  };
  const polarMax: PolarCoord = {
    t: q.radial_max * Math.PI,
    r: layout.ringRadii[ring],
  };
  const cartesianMin: CartesianCoord = {
    x: 15 * q.factor_x,
    y: 15 * q.factor_y,
  };
  const cartesianMax: CartesianCoord = {
    x: layout.ringRadii[3] * q.factor_x,
    y: layout.ringRadii[3] * q.factor_y,
  };

  function randomBetween(min: number, max: number): number {
    return min + randomFn() * (max - min);
  }

  function normalBetween(min: number, max: number): number {
    return min + (randomFn() + randomFn()) * 0.5 * (max - min);
  }

  return {
    clipx(d) {
      const c = boundedBox(d, cartesianMin, cartesianMax);
      const p = boundedRing(polar(c), polarMin.r + 15, polarMax.r - 15);
      d.x = cartesian(p).x;
      return d.x;
    },
    clipy(d) {
      const c = boundedBox(d, cartesianMin, cartesianMax);
      const p = boundedRing(polar(c), polarMin.r + 15, polarMax.r - 15);
      d.y = cartesian(p).y;
      return d.y;
    },
    random() {
      return cartesian({
        t: randomBetween(polarMin.t, polarMax.t),
        r: normalBetween(polarMin.r, polarMax.r),
      });
    },
  };
}
