import { useMemo } from 'react';
import type { RadarLayout } from '@gatsby-techradar/core';
import { DEFAULT_LAYOUT } from '@gatsby-techradar/core';

export interface LayoutMetrics {
  layout: RadarLayout;
  legendOffsets: { x: number; y: number }[];
  titleOffset: { x: number; y: number };
  footerOffset: { x: number; y: number };
}

export function useRadarLayout(
  size?: number
): LayoutMetrics {
  return useMemo(() => {
    const layout = size
      ? { ...DEFAULT_LAYOUT, size, center: size / 2 }
      : DEFAULT_LAYOUT;

    const halfW = layout.center * 1.6875; // ~675 at 800 size
    const halfH = layout.center * 1.05;

    return {
      layout,
      legendOffsets: [
        { x: layout.center + 50, y: 90 },
        { x: -halfW, y: 90 },
        { x: -halfW, y: -310 },
        { x: layout.center + 50, y: -310 },
      ],
      titleOffset: { x: -halfW, y: -halfH },
      footerOffset: { x: -halfW, y: halfH },
    };
  }, [size]);
}
