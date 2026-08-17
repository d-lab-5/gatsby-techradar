import * as fs from 'fs';
import * as path from 'path';
import { parseCsvToEntries } from '@gatsby-techradar/core';
import type { QuadrantConfig, RingConfig, TechradarEntry } from '@gatsby-techradar/core';

export function loadCsvEntries(
  csvPath: string,
  quadrants: QuadrantConfig[],
  rings: RingConfig[]
): TechradarEntry[] {
  const resolvedPath = path.resolve(csvPath);
  const csvContent = fs.readFileSync(resolvedPath, 'utf-8');
  return parseCsvToEntries(csvContent, quadrants, rings);
}
