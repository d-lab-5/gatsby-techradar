import React from 'react';
import { arc as d3Arc } from 'd3-shape';
import { useRadarTheme } from '../theme-context';

interface ArcProps {
  minRadius: number;
  maxRadius: number;
  startAngle: number;
  /** Resolved color of the ring this arc belongs to. */
  color: string;
  center: number;
}

const Arc: React.FC<ArcProps> = ({ minRadius, maxRadius, startAngle, color, center }) => {
  const theme = useRadarTheme();

  const arcPath = d3Arc<void, void>()
    .innerRadius(minRadius)
    .outerRadius(maxRadius)
    .startAngle(startAngle)
    .endAngle(startAngle - Math.PI / 2);

  return (
    <path
      d={arcPath(undefined as never) ?? ''}
      fill={color}
      fillOpacity={theme.ringFillOpacity}
      transform={`translate(${center}, ${center})`}
    />
  );
};

export default Arc;
