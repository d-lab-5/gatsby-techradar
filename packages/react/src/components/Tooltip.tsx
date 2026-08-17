import React from 'react';

interface TooltipProps {
  label: string;
  x: number;
  y: number;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ label, x, y, visible }) => {
  if (!visible) return null;

  // Estimate text width (rough: 6px per char)
  const textWidth = label.length * 6.5 + 10;

  return (
    <g
      className="tooltip"
      transform={`translate(${x - textWidth / 2}, ${y - 16})`}
      style={{ opacity: 0.8, pointerEvents: 'none' }}
    >
      <rect
        x={-5}
        y={-14}
        width={textWidth + 10}
        height={18}
        rx={4}
        ry={4}
        fill="#333"
      />
      <text
        x={textWidth / 2}
        y={-1}
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="10px"
        fill="#fff"
      >
        {label}
      </text>
      <path
        d={`M ${textWidth / 2 - 5},4 ${textWidth / 2 + 5},4 ${textWidth / 2},12 z`}
        fill="#333"
      />
    </g>
  );
};

export default Tooltip;
