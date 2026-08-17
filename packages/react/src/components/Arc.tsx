import React from 'react';
import { arc as d3Arc } from 'd3-shape';

interface ArcProps {
  minRadius: number;
  maxRadius: number;
  startAngle: number;
  ringIndex: number;
  center: number;
}

const RING_FILLS = [
  'rgba(91, 163, 0, 0.1)',
  'rgba(0, 158, 176, 0.1)',
  'rgba(199, 186, 0, 0.1)',
  'rgba(224, 155, 150, 0.1)',
];

const Arc: React.FC<ArcProps> = ({ minRadius, maxRadius, startAngle, ringIndex, center }) => {
  const arcPath = d3Arc<void, void>()
    .innerRadius(minRadius)
    .outerRadius(maxRadius)
    .startAngle(startAngle)
    .endAngle(startAngle - Math.PI / 2);

  return (
    <path
      d={arcPath(undefined as never) ?? ''}
      fill={RING_FILLS[ringIndex] ?? RING_FILLS[0]}
      transform={`translate(${center}, ${center})`}
    />
  );
};

export default Arc;
