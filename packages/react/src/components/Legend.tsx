import React from 'react';
import type { QuadrantConfig, RingConfig, PositionedEntry } from '@gatsby-techradar/core';

interface LegendProps {
  quadrant: QuadrantConfig;
  rings: RingConfig[];
  entries: PositionedEntry[];
  offset: { x: number; y: number };
  highlightedEntry: number;
  onEntryMouseOver: (id: number) => void;
  onEntryMouseOut: () => void;
}

const Legend: React.FC<LegendProps> = ({
  quadrant,
  rings,
  entries,
  offset,
  highlightedEntry,
  onEntryMouseOver,
  onEntryMouseOut,
}) => {
  // Group entries by ring
  const byRing = rings.map((ring) =>
    entries
      .filter((e) => e.quadrant === quadrant.index && e.ring === ring.index)
      .sort((a, b) => a.label.localeCompare(b.label))
  );

  let yPos = 0;

  return (
    <g className="legend" transform={`translate(${offset.x}, ${offset.y})`}>
      {/* Quadrant title */}
      <text
        y={-45}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="18px"
        fontWeight="bold"
      >
        {quadrant.name}
      </text>

      {rings.map((ring, ringIdx) => {
        const dx = ringIdx < 2 ? 0 : 140;
        const ringEntries = byRing[ringIdx];

        // Reset y for right column
        if (ringIdx === 2) yPos = 0;

        const ringY = yPos;

        // Ring header
        const headerEl = (
          <React.Fragment key={`legend-ring-${ringIdx}`}>
            <text
              x={dx}
              y={ringY - 16}
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="12px"
              fontWeight="bold"
              fill={ring.color}
            >
              {ring.name}
            </text>
            {ringEntries.map((entry, i) => {
              const entryY = ringY + i * 12;
              const isHighlighted = highlightedEntry === parseInt(entry.id, 10);
              return (
                <text
                  key={`legend-entry-${entry.id}`}
                  x={dx}
                  y={entryY}
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="11px"
                  fill={isHighlighted ? '#fff' : undefined}
                  filter={isHighlighted ? 'url(#solid)' : undefined}
                  style={{ cursor: 'pointer' }}
                  onMouseOver={() => onEntryMouseOver(parseInt(entry.id, 10))}
                  onMouseOut={onEntryMouseOut}
                >
                  {entry.id}. {entry.label}
                </text>
              );
            })}
          </React.Fragment>
        );

        yPos += ringEntries.length * 12 + 36;
        return headerEl;
      })}
    </g>
  );
};

export default Legend;
