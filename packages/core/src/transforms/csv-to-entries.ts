import type { TechradarEntry, QuadrantConfig, RingConfig } from '../types';
import { DEFAULT_QUADRANTS, DEFAULT_RINGS } from '../constants';

interface CsvRow {
  name?: string;
  label?: string;
  ring?: string;
  quadrant?: string;
  isNew?: string;
  moved?: string;
  active?: string;
  description?: string;
  link?: string;
}

export function parseCsvToEntries(
  csvContent: string,
  quadrants: QuadrantConfig[] = DEFAULT_QUADRANTS,
  rings: RingConfig[] = DEFAULT_RINGS
): TechradarEntry[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const entries: TechradarEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length === 0) continue;

    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      (row as Record<string, string>)[header] = values[idx]?.trim() ?? '';
    });

    const label = row.name || row.label || '';
    if (!label) continue;

    const quadrantName = row.quadrant ?? '';
    const ringName = row.ring ?? '';

    const quadrantIndex = quadrants.findIndex(
      (q) => q.name.toLowerCase() === quadrantName.toLowerCase()
    );
    const ringIndex = rings.findIndex(
      (r) => r.name.toLowerCase() === ringName.toLowerCase()
    );

    if (quadrantIndex === -1 || ringIndex === -1) continue;

    let moved = 0;
    if (row.moved !== undefined && row.moved !== '') {
      moved = parseInt(row.moved, 10);
    } else if (row.isNew !== undefined) {
      moved = row.isNew.toLowerCase() === 'true' ? 1 : 0;
    }

    const active = row.active !== undefined
      ? row.active.toLowerCase() !== 'false'
      : true;

    entries.push({
      id: String(i),
      label,
      quadrant: quadrantIndex,
      ring: ringIndex,
      moved: Math.max(-1, Math.min(1, moved)),
      active,
      link: row.link || undefined,
      description: row.description || undefined,
    });
  }

  return entries;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
