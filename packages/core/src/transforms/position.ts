import type { TechradarEntry, PositionedEntry, RadarLayout, RingConfig } from '../types';
import { createSegment, type Segment } from './segment';
import { DEFAULT_LAYOUT, COLORS } from '../constants';

function createSeededRandom(initialSeed = 42) {
  let seed = initialSeed;
  return function random(): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

export function computePositions(
  entries: TechradarEntry[],
  rings: RingConfig[],
  layout: RadarLayout = DEFAULT_LAYOUT
): PositionedEntry[] {
  const random = createSeededRandom(42);

  const positioned: PositionedEntry[] = entries.map((entry) => {
    const seg = createSegment(entry.quadrant, entry.ring, layout, random);
    const point = seg.random();
    const color = entry.active ? rings[entry.ring].color : COLORS.inactive;

    return {
      ...entry,
      x: point.x,
      y: point.y,
      color,
    };
  });

  return positioned;
}

export function assignSequentialIds(entries: TechradarEntry[]): TechradarEntry[] {
  // Partition entries by quadrant and ring
  const segmented: TechradarEntry[][][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => [])
  );

  for (const entry of entries) {
    segmented[entry.quadrant][entry.ring].push(entry);
  }

  // Assign IDs in specific quadrant order (matches original: bottom-left, bottom-right, top-left, top-right)
  let id = 1;
  for (const quadrant of [2, 3, 1, 0]) {
    for (let ring = 0; ring < 4; ring++) {
      const group = segmented[quadrant][ring];
      group.sort((a, b) => a.label.localeCompare(b.label));
      for (const entry of group) {
        entry.id = String(id++);
      }
    }
  }

  return entries;
}

export function getSegmentForEntry(
  entry: TechradarEntry,
  layout: RadarLayout = DEFAULT_LAYOUT
): Segment {
  const random = createSeededRandom(42);
  return createSegment(entry.quadrant, entry.ring, layout, random);
}
