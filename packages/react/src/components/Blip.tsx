import React from 'react';

interface BlipProps {
  x: number;
  y: number;
  id: string;
  label: string;
  color: string;
  moved: number;
  active: boolean;
  highlighted: boolean;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

const Blip: React.FC<BlipProps> = ({
  x,
  y,
  id,
  label,
  color,
  moved,
  active,
  highlighted,
  onMouseOver,
  onMouseOut,
}) => {
  const opacity = highlighted ? 1 : 0.7;

  return (
    <g
      className="blip"
      transform={`translate(${x}, ${y})`}
      style={{ opacity, cursor: active ? 'pointer' : 'default' }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {moved > 0 ? (
        <path d="M -11,5 11,5 0,-13 z" fill={color} />
      ) : moved < 0 ? (
        <path d="M -11,-5 11,-5 0,13 z" fill={color} />
      ) : (
        <circle r={9} fill={color} />
      )}
      {active && (
        <text
          y={3}
          textAnchor="middle"
          fill="#fff"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={id.length > 2 ? '8px' : '9px'}
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {id}
        </text>
      )}
    </g>
  );
};

export default Blip;
