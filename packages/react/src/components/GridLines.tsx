import React from 'react';
import type { RadarLayout, RingConfig } from '@gatsby-techradar/core';
import { COLORS } from '@gatsby-techradar/core';

interface GridLinesProps {
  layout: RadarLayout;
  rings: RingConfig[];
  showLabels?: boolean;
}

const GridLines: React.FC<GridLinesProps> = ({ layout, rings, showLabels = true }) => {
  const maxR = layout.ringRadii[3];

  return (
    <g className="grid">
      {/* Cross-hair lines */}
      <line
        x1={0} y1={-maxR}
        x2={0} y2={maxR}
        stroke={COLORS.grid} strokeWidth={1}
      />
      <line
        x1={-maxR} y1={0}
        x2={maxR} y2={0}
        stroke={COLORS.grid} strokeWidth={1}
      />

      {/* Ring circles */}
      {layout.ringRadii.map((radius, i) => (
        <React.Fragment key={`ring-${i}`}>
          <circle
            cx={0} cy={0} r={radius}
            fill="none"
            stroke={COLORS.grid} strokeWidth={1}
          />
          {showLabels && (
            <text
              y={-radius + 62}
              textAnchor="middle"
              fill={rings[i].color}
              opacity={0.35}
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="42px"
              fontWeight="bold"
              pointerEvents="none"
              style={{ userSelect: 'none' }}
            >
              {rings[i].name}
            </text>
          )}
        </React.Fragment>
      ))}
    </g>
  );
};

export default GridLines;
