import { useEffect, useState } from 'react';

interface TachometerProps {
  value: number; // 0-1000
  max?: number; // Maximum value (default 1000)
  size?: number;
  showValue?: boolean;
  label?: string;
}

export function Tachometer({ value, max = 1000, size = 300, showValue = true, label }: TachometerProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Animate on mount and value changes
    const timeout = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);

    return () => clearTimeout(timeout);
  }, [value]);

  // Calculate dimensions
  const strokeWidth = size * 0.08;
  const radius = size * 0.35;
  const centerX = size / 2;
  const centerY = size * 0.6;
  const needleLength = radius * 0.85;
  const hubRadius = size * 0.05;
  const dotRadius = size * 0.025;

  // Convert value to percentage (0-100) for rotation
  const percentage = (animatedValue / max) * 100;
  
  // Rotation formula: 0% → -180deg (left/red), 50% → -90deg (top/yellow), 100% → 0deg (right/green)
  const rotation = -180 + (percentage * 1.8);

  // Calculate needle tip position
  const needleAngle = (rotation * Math.PI) / 180;
  const needleTipX = centerX + needleLength * Math.cos(needleAngle);
  const needleTipY = centerY + needleLength * Math.sin(needleAngle);

  // Arc path for the upper semicircle from right (0°) to left (180°)
  // Start at 3 o'clock position
  const startX = centerX + radius;
  const startY = centerY;
  // End at 9 o'clock position
  const endX = centerX - radius;
  const endY = centerY;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size * 0.6}
        viewBox={`0 0 ${size} ${size * 0.6}`}
        className="overflow-visible"
      >
        <defs>
          {/* Gradient from right (green) to left (red) */}
          <linearGradient id="tachometer-gradient" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Drop shadow for needle */}
          <filter id="needle-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background arc (light gray) */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 0 ${endX} ${endY}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Colored gradient arc */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 0 ${endX} ${endY}`}
          fill="none"
          stroke="url(#tachometer-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((tickPercent, idx) => {
          const tickRotation = -180 + (tickPercent * 100 * 1.8);
          const tickAngle = (tickRotation * Math.PI) / 180;
          const tickStartRadius = radius - strokeWidth / 2 - 5;
          const tickEndRadius = radius - strokeWidth / 2 + 5;
          
          const tickStartX = centerX + tickStartRadius * Math.cos(tickAngle);
          const tickStartY = centerY + tickStartRadius * Math.sin(tickAngle);
          const tickEndX = centerX + tickEndRadius * Math.cos(tickAngle);
          const tickEndY = centerY + tickEndRadius * Math.sin(tickAngle);

          return (
            <line
              key={idx}
              x1={tickStartX}
              y1={tickStartY}
              x2={tickEndX}
              y2={tickEndY}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          );
        })}

        {/* Animated needle (triangle) */}
        <g
          style={{
            transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: `${centerX}px ${centerY}px`,
            transform: `rotate(${rotation}deg)`,
          }}
          filter="url(#needle-shadow)"
        >
          <polygon
            points={`
              ${centerX + needleLength},${centerY}
              ${centerX - 15},${centerY - 6}
              ${centerX - 15},${centerY + 6}
            `}
            fill="#000000"
          />
        </g>

        {/* Center hub (dark gray) */}
        <circle cx={centerX} cy={centerY} r={hubRadius} fill="#374151" />

        {/* Center dot (darker gray) */}
        <circle cx={centerX} cy={centerY} r={dotRadius} fill="#1f2937" />
      </svg>

      {/* Value display */}
      {showValue && (
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">
            {Math.round(animatedValue)}
          </div>
          {label && (
            <div className="text-sm text-muted-foreground mt-1">
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
