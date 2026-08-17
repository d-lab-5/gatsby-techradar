import React from 'react';
import type { QuadrantConfig, RingConfig } from '@gatsby-techradar/core';

interface QuadrantButtonProps {
  quadrant: QuadrantConfig;
  rings: RingConfig[];
  isSelected: boolean;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

const QuadrantButton: React.FC<QuadrantButtonProps> = ({
  quadrant,
  rings,
  isSelected,
  onClick,
  onMouseOver,
  onMouseOut,
}) => {
  return (
    <button
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        padding: '8px 16px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
        fontWeight: isSelected ? 'bold' : 'normal',
        border: `2px solid ${rings[0].color}`,
        borderRadius: '4px',
        backgroundColor: isSelected ? rings[0].color : 'transparent',
        color: isSelected ? '#fff' : '#333',
        cursor: 'pointer',
        marginRight: '8px',
        marginBottom: '8px',
      }}
    >
      {quadrant.name}
    </button>
  );
};

export default QuadrantButton;
