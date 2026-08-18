import React from 'react';
import type { QuadrantConfig, ResolvedRingConfig } from '@gatsby-techradar/core';
import { useRadarTheme } from '../theme-context';

interface QuadrantButtonProps {
  quadrant: QuadrantConfig;
  rings: ResolvedRingConfig[];
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
  const theme = useRadarTheme();

  return (
    <button
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        padding: '8px 16px',
        fontFamily: theme.fontFamily,
        fontSize: '14px',
        fontWeight: isSelected ? 'bold' : 'normal',
        border: `2px solid ${rings[0].color}`,
        borderRadius: '4px',
        backgroundColor: isSelected ? rings[0].color : 'transparent',
        color: isSelected ? theme.onAccent : theme.text,
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
