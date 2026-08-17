import { useState, useCallback } from 'react';

export interface RadarInteraction {
  hoveredQuadrant: number | null;
  selectedQuadrant: number | null;
  highlightedEntry: number;
  setHoveredQuadrant: (q: number | null) => void;
  selectQuadrant: (q: number | null) => void;
  setHighlightedEntry: (id: number) => void;
}

export function useRadarInteraction(): RadarInteraction {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<number | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);
  const [highlightedEntry, setHighlightedEntry] = useState(0);

  const selectQuadrant = useCallback((q: number | null) => {
    setSelectedQuadrant(q);
    setHighlightedEntry(0);
  }, []);

  return {
    hoveredQuadrant,
    selectedQuadrant,
    highlightedEntry,
    setHoveredQuadrant,
    selectQuadrant,
    setHighlightedEntry,
  };
}
