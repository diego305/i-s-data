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
  badgeColor = "#3B8AC4"
}) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = clampedValue / max;

  const cx = 150;
  const cy = 135;
  const r = 95;
  const strokeWidth = 20;

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
  // 0 - 45: Initial / Disperso (Red)
  // 45 - 75: Operativo / Estructurado (Arena Titanio #BFA898)
  // 75 - 100: Avanzado / Preparado (Aero Blue #3B8AC4)
  const d1 = describeArc(cx, cy, r, 0, 81);
  const d2 = describeArc(cx, cy, r, 81, 135);
  const d3 = describeArc(cx, cy, r, 135, 180);

  const needleAngle = percentage * 180;
  const needlePos = polarToCartesian(cx, cy, r - 12, needleAngle);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#E4ECF2] shadow-xs">
      <svg viewBox="0 0 300 175" className="w-full max-w-[280px] h-auto overflow-visible">
        {/* Track segments */}
        <path d={d1} fill="none" stroke="#FEE2E2" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={d2} fill="none" stroke="#EFE7E1" strokeWidth={strokeWidth} />
        <path d={d3} fill="none" stroke="#E0EFF9" strokeWidth={strokeWidth} strokeLinecap="round" />

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
        <text x="35" y="160" textAnchor="middle" className="text-[10px] font-mono tabular-nums font-medium fill-slate-400">0</text>
        <text x="110" y="55" textAnchor="middle" className="text-[10px] font-mono tabular-nums font-medium fill-slate-400">45</text>
        <text x="195" y="55" textAnchor="middle" className="text-[10px] font-mono tabular-nums font-medium fill-slate-400">75</text>
        <text x="265" y="160" textAnchor="middle" className="text-[10px] font-mono tabular-nums font-medium fill-slate-400">100</text>

        {/* Needle with Grafito Hélice #1E252D and Cian Vuelo hub */}
        <line
          x1={cx}
          y1={cy}
          x2={needlePos.x}
          y2={needlePos.y}
          stroke="#1E252D"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <circle cx={cx} cy={cy} r="7" fill="#1E252D" />
        <circle cx={cx} cy={cy} r="2.5" fill="#7EBCE6" />
      </svg>

      <div className="text-center mt-[-10px]">
        <div className="text-3xl font-light text-[#1E252D] tracking-tight font-mono tabular-nums">
          {clampedValue} <span className="text-sm font-normal text-slate-400 font-['Inter']">/ 100</span>
        </div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-0.5 font-['Outfit']">
          {label}
        </div>
      </div>
    </div>
  );
};
