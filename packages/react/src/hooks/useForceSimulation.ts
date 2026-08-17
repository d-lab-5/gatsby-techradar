import { useState, useEffect, useRef } from 'react';
import { forceSimulation, forceCollide } from 'd3-force';
import type { PositionedEntry, RadarLayout } from '@gatsby-techradar/core';
import { createSegment } from '@gatsby-techradar/core';

interface SimulatedEntry extends PositionedEntry {
  vx?: number;
  vy?: number;
  index?: number;
}

function createSeededRandom(seed = 42) {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

export function useForceSimulation(
  entries: PositionedEntry[],
  layout: RadarLayout
): PositionedEntry[] {
  const [positions, setPositions] = useState(entries);
  const prevEntriesRef = useRef(entries);

  useEffect(() => {
    if (entries.length === 0) {
      setPositions([]);
      return;
    }

    const nodes: SimulatedEntry[] = entries.map((e) => ({ ...e }));
    const random = createSeededRandom(42);

    // Create segments for clipping
    const segments = nodes.map((node) =>
      createSegment(node.quadrant, node.ring, layout, random)
    );

    const simulation = forceSimulation(nodes)
      .velocityDecay(0.19)
      .force('collision', forceCollide<SimulatedEntry>().radius(12).strength(0.85))
      .on('tick', () => {
        // Clip positions to stay within segments
        nodes.forEach((node, i) => {
          segments[i].clipx(node);
          segments[i].clipy(node);
        });
      })
      .on('end', () => {
        setPositions(nodes.map((n) => ({ ...n })));
      });

    // Run simulation synchronously for faster rendering
    simulation.stop();
    for (let i = 0; i < 120; i++) {
      simulation.tick();
      nodes.forEach((node, j) => {
        segments[j].clipx(node);
        segments[j].clipy(node);
      });
    }
    setPositions(nodes.map((n) => ({ ...n })));

    return () => {
      simulation.stop();
    };
  }, [entries, layout]);

  return positions;
}
