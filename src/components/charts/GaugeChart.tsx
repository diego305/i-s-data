import React from "react";

interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  badgeColor?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  label = "Nivel de Preparación BI",
  badgeColor = "#0284c7"
}) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = clampedValue / max;

  // Semicircle gauge: angle from -180 to 0 degrees (or -90 to 90)
  // Let's use SVG coordinates: Center at (150, 140), radius = 100
  const cx = 150;
  const cy = 135;
  const r = 95;
  const strokeWidth = 22;

  // Polar to Cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  // 3 segments:
  // 0% - 45% (Red: 0 to 81 deg)
  // 45% - 75% (Amber: 81 to 135 deg)
  // 75% - 100% (Green: 135 to 180 deg)
  const d1 = describeArc(cx, cy, r, 0, 81);
  const d2 = describeArc(cx, cy, r, 81, 135);
  const d3 = describeArc(cx, cy, r, 135, 180);

  // Needle angle: from 0 deg (value 0) to 180 deg (value 100)
  const needleAngle = percentage * 180;
  const needlePos = polarToCartesian(cx, cy, r - 15, needleAngle);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
      <svg viewBox="0 0 300 175" className="w-full max-w-[280px] h-auto overflow-visible">
        {/* Background segments */}
        <path d={d1} fill="none" stroke="#fee2e2" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={d2} fill="none" stroke="#fef3c7" strokeWidth={strokeWidth} />
        <path d={d3} fill="none" stroke="#dcfce7" strokeWidth={strokeWidth} strokeLinecap="round" />

        {/* Dynamic active indicator arc */}
        {percentage > 0 && (
          <path
            d={describeArc(cx, cy, r, 0, needleAngle)}
            fill="none"
            stroke={badgeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Ticks and marks */}
        <text x="35" y="160" textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">0</text>
        <text x="110" y="55" textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">45</text>
        <text x="195" y="55" textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">75</text>
        <text x="265" y="160" textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">100</text>

        {/* Center needle pivot */}
        <line
          x1={cx}
          y1={cy}
          x2={needlePos.x}
          y2={needlePos.y}
          stroke="#0f172a"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <circle cx={cx} cy={cy} r="7" fill="#0f172a" />
        <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
      </svg>

      <div className="text-center mt-[-10px]">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {clampedValue} <span className="text-lg font-bold text-slate-500">pts</span>
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
};
