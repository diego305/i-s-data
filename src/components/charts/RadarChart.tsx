import React from "react";
import { DimensionScores } from "../../types";

interface RadarChartProps {
  dimensiones: DimensionScores;
  color?: string;
  fillColor?: string;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensiones,
  color = "#0284c7",
  fillColor = "rgba(14, 165, 233, 0.25)",
  size = 320
}) => {
  const categories: (keyof DimensionScores)[] = [
    "Almacenamiento y Fuentes",
    "Integración entre Áreas",
    "Frecuencia de Actualización",
    "Calidad y Consistencia",
    "Eficiencia de Reportes"
  ];

  const totalAxes = categories.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = (size / 2) - 52; // margin for labels

  // Coordinates helper
  const getCoordinates = (index: number, value: number) => {
    // Angle in radians, starting at top (-PI / 2)
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Concentric polygon levels: 25, 50, 75, 100
  const levels = [25, 50, 75, 100];

  // Data polygon points
  const points = categories
    .map((cat, i) => {
      const val = dimensiones[cat] ?? 50;
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs w-full overflow-hidden">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible max-w-full h-auto">
        {/* Background concentric polygons */}
        {levels.map((level) => {
          const ringPoints = categories
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <g key={level}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={level === 100 ? undefined : "3,3"}
              />
              {/* Level mark on vertical axis */}
              <text
                x={cx + 3}
                y={cy - (level / 100) * maxRadius + 3}
                className="text-[9px] fill-slate-400 font-medium"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Axis radial lines */}
        {categories.map((cat, i) => {
          const outer = getCoordinates(i, 100);
          return (
            <line
              key={cat}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points}
          fill={fillColor}
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Points and Labels */}
        {categories.map((cat, i) => {
          const val = dimensiones[cat] ?? 0;
          const { x, y } = getCoordinates(i, val);
          const outer = getCoordinates(i, 100);

          // Label placement offset
          const angle = (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
          const labelDist = maxRadius + 22;
          const labelX = cx + labelDist * Math.cos(angle);
          const labelY = cy + labelDist * Math.sin(angle);

          const textAnchor =
            Math.abs(Math.cos(angle)) < 0.2
              ? "middle"
              : Math.cos(angle) > 0
              ? "start"
              : "end";

          return (
            <g key={`data-${cat}`}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill={color}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="text-[10px] font-semibold fill-slate-700 pointer-events-none select-none"
              >
                {cat.split(" ")[0]} ({val}%)
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-xs text-slate-500 font-medium mt-1">
        Escala de preparación por dimensión (0 a 100%)
      </div>
    </div>
  );
};
