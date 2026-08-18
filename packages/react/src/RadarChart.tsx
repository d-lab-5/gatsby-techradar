import React, { useMemo, useState, useCallback } from 'react';
import type {
  TechradarConfig,
  PositionedEntry,
  RadarLayout,
} from '@gatsby-techradar/core';
import {
  computePositions,
  assignSequentialIds,
  resolveRings,
  DEFAULT_LAYOUT,
} from '@gatsby-techradar/core';
import {
  RadarThemeProvider,
  useRadarTheme,
  type ThemeInput,
} from './theme-context';
import { useForceSimulation } from './hooks/useForceSimulation';
import { useRadarInteraction } from './hooks/useRadarInteraction';
import Arc from './components/Arc';
import Blip from './components/Blip';
import GridLines from './components/GridLines';
import Tooltip from './components/Tooltip';
import Legend from './components/Legend';
import QuadrantButton from './components/QuadrantButton';
import QuadrantTable from './components/QuadrantTable';

interface RadarChartProps {
  config: TechradarConfig;
  size?: number;
  showLegend?: boolean;
  showTable?: boolean;
  /**
   * 'light' | 'dark', a partial token set, or a complete RadarTheme.
   * The chart is controlled: it never reads prefers-color-scheme itself, so
   * that server-rendered markup matches the first client render. Detect the
   * user's preference in the host app and pass the result down.
   */
  theme?: ThemeInput;
}

// Quadrant start angles for arc rendering (in radians)
const QUADRANT_START_ANGLES = [
  Math.PI / 2,     // Q0: top-right
  Math.PI,         // Q1: top-left
  -Math.PI,        // Q2: bottom-left (same as PI, wraps)
  -Math.PI / 2,    // Q3: bottom-right
];

const RadarChartInner: React.FC<Omit<RadarChartProps, 'theme'>> = ({
  config,
  size,
  showLegend = true,
  showTable = true,
}) => {
  const theme = useRadarTheme();

  // Ring colors are theme-dependent; resolve them once here so every child
  // works with plain color strings.
  const rings = useMemo(
    () => resolveRings(config.rings, theme.mode),
    [config.rings, theme.mode]
  );

  const layout: RadarLayout = useMemo(
    () =>
      size
        ? { ...DEFAULT_LAYOUT, size, center: size / 2 }
        : DEFAULT_LAYOUT,
    [size]
  );

  // Compute positions for all entries
  const positionedEntries = useMemo(() => {
    const withIds = assignSequentialIds([...config.entries]);
    return computePositions(withIds, config.rings, layout, theme);
  }, [config.entries, config.rings, layout, theme]);

  // Apply force simulation for collision avoidance
  const simulatedEntries = useForceSimulation(positionedEntries, layout);

  const {
    hoveredQuadrant,
    selectedQuadrant,
    highlightedEntry,
    setHoveredQuadrant,
    selectQuadrant,
    setHighlightedEntry,
  } = useRadarInteraction();

  const [tooltipEntry, setTooltipEntry] = useState<PositionedEntry | null>(null);

  const handleBlipMouseOver = useCallback(
    (entry: PositionedEntry) => {
      setTooltipEntry(entry);
      setHighlightedEntry(parseInt(entry.id, 10));
    },
    [setHighlightedEntry]
  );

  const handleBlipMouseOut = useCallback(() => {
    setTooltipEntry(null);
    setHighlightedEntry(0);
  }, [setHighlightedEntry]);

  const svgWidth = layout.size * 1.8125; // ~1450 at 800
  const svgHeight = layout.size * 1.25;  // ~1000 at 800

  // Legend offsets
  const legendOffsets = [
    { x: 450, y: 90 },
    { x: -675, y: 90 },
    { x: -675, y: -310 },
    { x: 450, y: -310 },
  ];

  return (
    <div className="techradar">
      {/* Quadrant navigation buttons */}
      <div className="techradar-buttons" style={{ marginBottom: '8px' }}>
        {config.quadrants.map((q) => (
          <QuadrantButton
            key={q.index}
            quadrant={q}
            rings={rings}
            isSelected={selectedQuadrant === q.index}
            onClick={() =>
              selectQuadrant(selectedQuadrant === q.index ? null : q.index)
            }
            onMouseOver={() => setHoveredQuadrant(q.index)}
            onMouseOut={() => setHoveredQuadrant(null)}
          />
        ))}
        {selectedQuadrant !== null && (
          <button
            onClick={() => selectQuadrant(null)}
            style={{
              padding: '8px 16px',
              fontFamily: theme.fontFamily,
              fontSize: '14px',
              border: `2px solid ${theme.mutedBorder}`,
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: theme.text,
              cursor: 'pointer',
            }}
          >
            Show All
          </button>
        )}
      </div>

      {/* SVG Radar */}
      <svg
        id="radar"
        width={svgWidth}
        height={svgHeight}
        style={{ backgroundColor: theme.background }}
      >
        <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
          {/* Filter for legend highlight */}
          <defs>
            <filter id="solid" x="0" y="0" width="1" height="1">
              <feFlood floodColor={theme.highlightFill} />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>

          {/* Grid lines and ring labels */}
          <GridLines layout={layout} rings={rings} />

          {/* Ring arcs per quadrant */}
          {config.quadrants.map((q) =>
            rings.map((ring) => (
              <Arc
                key={`arc-${q.index}-${ring.index}`}
                minRadius={ring.index === 0 ? 0 : layout.ringRadii[ring.index - 1]}
                maxRadius={layout.ringRadii[ring.index]}
                startAngle={QUADRANT_START_ANGLES[q.index]}
                color={ring.color}
                center={0}
              />
            ))
          )}

          {/* Blips */}
          {simulatedEntries.map((entry) => {
            const quadrantOpacity =
              hoveredQuadrant === null || hoveredQuadrant === entry.quadrant
                ? 1
                : 0.3;
            const isHighlighted = highlightedEntry === parseInt(entry.id, 10);

            if (selectedQuadrant !== null && selectedQuadrant !== entry.quadrant) {
              return null;
            }

            return (
              <g key={entry.id} style={{ opacity: quadrantOpacity }}>
                <Blip
                  x={entry.x}
                  y={entry.y}
                  id={entry.id}
                  label={entry.label}
                  color={entry.color}
                  moved={entry.moved}
                  active={entry.active}
                  highlighted={isHighlighted}
                  onMouseOver={() => handleBlipMouseOver(entry)}
                  onMouseOut={handleBlipMouseOut}
                />
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltipEntry && (
            <Tooltip
              label={tooltipEntry.label}
              x={tooltipEntry.x}
              y={tooltipEntry.y}
              visible
            />
          )}

          {/* Title */}
          <text
            transform="translate(-675, -420)"
            fill={theme.text}
            fontFamily={theme.fontFamily}
            fontSize="30"
            fontWeight="bold"
          >
            {config.title}
          </text>

          {/* Date */}
          {config.date && (
            <text
              transform="translate(-675, -400)"
              fontFamily={theme.fontFamily}
              fontSize="14"
              fill={theme.mutedBorder}
            >
              {config.date}
            </text>
          )}

          {/* Footer */}
          <text
            transform="translate(-675, 420)"
            fill={theme.text}
            fontFamily={theme.fontFamily}
            fontSize="10"
          >
            ▲ moved up     ▼ moved down
          </text>

          {/* Legends */}
          {showLegend &&
            config.quadrants.map((q, i) => (
              <Legend
                key={`legend-${q.index}`}
                quadrant={q}
                rings={rings}
                entries={simulatedEntries}
                offset={legendOffsets[i]}
                highlightedEntry={highlightedEntry}
                onEntryMouseOver={setHighlightedEntry}
                onEntryMouseOut={() => setHighlightedEntry(0)}
              />
            ))}
        </g>
      </svg>

      {/* Quadrant detail tables */}
      {showTable &&
        config.quadrants.map((q) => (
          <QuadrantTable
            key={`table-${q.index}`}
            quadrantName={q.name}
            quadrantIndex={q.index}
            rings={rings}
            entries={simulatedEntries}
            visible={selectedQuadrant === q.index}
            highlightedEntry={highlightedEntry}
            onEntryMouseOver={setHighlightedEntry}
            onEntryMouseOut={() => setHighlightedEntry(0)}
          />
        ))}
    </div>
  );
};

const RadarChart: React.FC<RadarChartProps> = ({ theme, ...props }) => (
  <RadarThemeProvider theme={theme}>
    <RadarChartInner {...props} />
  </RadarThemeProvider>
);

export default RadarChart;
