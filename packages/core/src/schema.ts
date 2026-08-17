import { z } from 'zod';

export const TechradarEntrySchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  quadrant: z.number().int().min(0).max(3),
  ring: z.number().int().min(0).max(3),
  moved: z.number().int().min(-1).max(1).default(0),
  active: z.boolean().default(true),
  link: z.string().url().optional(),
  description: z.string().optional(),
});

export const QuadrantConfigSchema = z.object({
  index: z.number().int().min(0).max(3),
  name: z.string().min(1),
});

export const RingConfigSchema = z.object({
  index: z.number().int().min(0).max(3),
  name: z.string().min(1),
  color: z.string(),
});

export const TechradarConfigSchema = z.object({
  title: z.string().min(1),
  date: z.string().optional(),
  quadrants: z.array(QuadrantConfigSchema).length(4),
  rings: z.array(RingConfigSchema).length(4),
  entries: z.array(TechradarEntrySchema),
});
