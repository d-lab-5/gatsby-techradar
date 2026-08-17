import React, { useState } from 'react';
import type { RingConfig, PositionedEntry } from '@gatsby-techradar/core';

interface QuadrantTableProps {
  quadrantName: string;
  quadrantIndex: number;
  rings: RingConfig[];
  entries: PositionedEntry[];
  visible: boolean;
  highlightedEntry: number;
  onEntryMouseOver: (id: number) => void;
  onEntryMouseOut: () => void;
}

const QuadrantTable: React.FC<QuadrantTableProps> = ({
  quadrantName,
  quadrantIndex,
  rings,
  entries,
  visible,
  highlightedEntry,
  onEntryMouseOver,
  onEntryMouseOut,
}) => {
  const [expandedItem, setExpandedItem] = useState<number>(0);

  if (!visible) return null;

  const quadrantEntries = entries.filter((e) => e.quadrant === quadrantIndex);

  return (
    <div className="quadrant-table" style={{ marginTop: '1rem' }}>
      <h2 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '18px' }}>
        {quadrantName}
      </h2>
      {rings.map((ring) => {
        const ringEntries = quadrantEntries
          .filter((e) => e.ring === ring.index)
          .sort((a, b) => a.label.localeCompare(b.label));

        if (ringEntries.length === 0) return null;

        return (
          <React.Fragment key={`table-ring-${ring.index}`}>
            <h3
              style={{
                color: ring.color,
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '14px',
              }}
            >
              {ring.name}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {ringEntries.map((entry) => {
                const numId = parseInt(entry.id, 10);
                const isHighlighted = highlightedEntry === numId;
                const isExpanded = expandedItem === numId;

                return (
                  <li key={entry.id} style={{ marginBottom: '4px' }}>
                    <div
                      onClick={() => setExpandedItem(isExpanded ? 0 : numId)}
                      onMouseOver={() => onEntryMouseOver(numId)}
                      onMouseOut={onEntryMouseOut}
                      style={{
                        cursor: 'pointer',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '13px',
                        fontWeight: isHighlighted ? 'bold' : 'normal',
                        backgroundColor: isHighlighted ? '#eee' : 'transparent',
                        padding: '2px 4px',
                        borderRadius: '2px',
                      }}
                    >
                      {entry.id}. {entry.label}
                    </div>
                    {isExpanded && entry.description && (
                      <div
                        style={{
                          padding: '4px 8px 8px 20px',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          fontSize: '12px',
                          color: '#666',
                        }}
                        dangerouslySetInnerHTML={{ __html: entry.description }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default QuadrantTable;
