import type { TechradarEntry } from '../types';

interface AmplifyRecord {
  id: string;
  label?: string | null;
  quadrant?: number | null;
  ring?: number | null;
  moved?: number | null;
  active?: boolean | null;
  link?: string | null;
  description?: string | null;
  [key: string]: unknown;
}

export function parseAmplifyRecords(records: AmplifyRecord[]): TechradarEntry[] {
  return records
    .filter((r) => r.label && r.quadrant != null && r.ring != null)
    .map((r) => ({
      id: r.id,
      label: r.label!,
      quadrant: r.quadrant!,
      ring: r.ring!,
      moved: r.moved ?? 0,
      active: r.active ?? true,
      link: r.link ?? undefined,
      description: r.description ?? undefined,
    }));
}
