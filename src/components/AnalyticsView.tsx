import React from "react";
import { Interview, DimensionScores } from "../types";
import { RadarChart } from "./charts/RadarChart";
import { seedSampleData } from "../lib/storage";
import { Sprout, BarChart3, TrendingUp, Award, Zap } from "lucide-react";

interface AnalyticsViewProps {
  interviews: Interview[];
  onRefresh: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ interviews, onRefresh }) => {
  if (interviews.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-center py-12 font-['Inter']">
        <div className="bg-white p-8 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="text-3xl">📊</div>
          <h2 className="text-base font-light text-[#1E252D] font-['Outfit'] tracking-wide">
            No hay datos suficientes para calcular analíticas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Cargue al menos una entrevista o agregue los datos de muestra para visualizar métricas comparativas.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                seedSampleData();
                onRefresh();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary text-xs cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              Cargar Entrevistas de Ejemplo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = interviews.length;
  const scores = interviews.map((i) => i.score_global);
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / total) * 10) / 10;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  const levelCounts: Record<string, number> = {
    "Nivel 1: Inicial / Disperso": 0,
    "Nivel 2: Operativo / Estructurado": 0,
    "Nivel 3: Avanzado / Preparado": 0
  };
  interviews.forEach((i) => {
    if (levelCounts[i.nivel_madurez] !== undefined) {
      levelCounts[i.nivel_madurez]++;
    } else {
      levelCounts[i.nivel_madurez] = 1;
    }
  });

  const levelColors: Record<string, string> = {
    "Nivel 1: Inicial / Disperso": "#EF4444",
    "Nivel 2: Operativo / Estructurado": "#BFA898",
    "Nivel 3: Avanzado / Preparado": "#3B8AC4"
  };

  const sectorCounts: Record<string, number> = {};
  interviews.forEach((i) => {
    sectorCounts[i.sector] = (sectorCounts[i.sector] || 0) + 1;
  });
  const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
  const maxSectorVal = sortedSectors[0]?.[1] || 1;

  const obstacleCounts: Record<string, number> = {};
  interviews.forEach((i) => {
    (i.obstaculos_decision || []).forEach((obs) => {
      obstacleCounts[obs] = (obstacleCounts[obs] || 0) + 1;
    });
  });
  const sortedObstacles = Object.entries(obstacleCounts).sort((a, b) => b[1] - a[1]);
  const maxObsVal = sortedObstacles[0]?.[1] || 1;

  const processCounts: Record<string, number> = {};
  interviews.forEach((i) => {
    const p =
      i.proceso_prioritario === "Otro" && i.proceso_prioritario_otro
        ? `Otro (${i.proceso_prioritario_otro})`
        : i.proceso_prioritario;
    processCounts[p] = (processCounts[p] || 0) + 1;
  });
  const sortedProcesses = Object.entries(processCounts).sort((a, b) => b[1] - a[1]);
  const maxProcVal = sortedProcesses[0]?.[1] || 1;

  const dimSums: DimensionScores = {
    "Almacenamiento y Fuentes": 0,
    "Integración entre Áreas": 0,
    "Frecuencia de Actualización": 0,
    "Calidad y Consistencia": 0,
    "Eficiencia de Reportes": 0
  };
  interviews.forEach((i) => {
    if (i.dimensiones) {
      dimSums["Almacenamiento y Fuentes"] += i.dimensiones["Almacenamiento y Fuentes"] || 0;
      dimSums["Integración entre Áreas"] += i.dimensiones["Integración entre Áreas"] || 0;
      dimSums["Frecuencia de Actualización"] += i.dimensiones["Frecuencia de Actualización"] || 0;
      dimSums["Calidad y Consistencia"] += i.dimensiones["Calidad y Consistencia"] || 0;
      dimSums["Eficiencia de Reportes"] += i.dimensiones["Eficiencia de Reportes"] || 0;
    }
  });

  const avgDimensions: DimensionScores = {
    "Almacenamiento y Fuentes": Math.round((dimSums["Almacenamiento y Fuentes"] / total) * 10) / 10,
    "Integración entre Áreas": Math.round((dimSums["Integración entre Áreas"] / total) * 10) / 10,
    "Frecuencia de Actualización": Math.round((dimSums["Frecuencia de Actualización"] / total) * 10) / 10,
    "Calidad y Consistencia": Math.round((dimSums["Calidad y Consistencia"] / total) * 10) / 10,
    "Eficiencia de Reportes": Math.round((dimSums["Eficiencia de Reportes"] / total) * 10) / 10
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-light text-[#1E252D] tracking-wide flex items-center gap-2 font-['Outfit']">
          <span>📊</span> Analítica de Clientes Relevados
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Visión panorámica de la madurez de datos, cuellos de botella y procesos prioritarios del mercado.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#3B8AC4] flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Total Entrevistas</div>
            <div className="text-xl sm:text-2xl font-light text-[#1E252D] font-mono tabular-nums">{total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#3B8AC4] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Score Promedio</div>
            <div className="text-xl sm:text-2xl font-light text-[#1E252D] font-mono tabular-nums">
              {avgScore} <span className="text-xs font-sans text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F5] text-[#BFA898] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Score Máximo</div>
            <div className="text-xl sm:text-2xl font-light text-[#1E252D] font-mono tabular-nums">
              {maxScore} <span className="text-xs font-sans text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Score Mínimo</div>
            <div className="text-xl sm:text-2xl font-light text-[#1E252D] font-mono tabular-nums">
              {minScore} <span className="text-xs font-sans text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Distribution by Level & Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E252D] font-['Outfit']">
            Distribución de Madurez de Datos
          </h3>

          <div className="space-y-3">
            {Object.entries(levelCounts).map(([lvl, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const color = levelColors[lvl] || "#3B8AC4";
              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#1E252D]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-['Outfit']">{lvl}</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F8FB] border border-[#E4ECF2] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E4ECF2] grid grid-cols-3 text-center text-xs">
            {Object.entries(levelCounts).map(([lvl, count]) => (
              <div key={lvl}>
                <div className="font-light text-base font-mono tabular-nums" style={{ color: levelColors[lvl] }}>
                  {count}
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate font-['Outfit']">
                  {lvl.split(":")[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors horizontal bars */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E252D] font-['Outfit']">
            Entrevistas por Sector Económico
          </h3>

          <div className="space-y-2.5 pt-1">
            {sortedSectors.map(([sec, count]) => {
              const widthPct = Math.round((count / maxSectorVal) * 100);
              return (
                <div key={sec} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#1E252D]">
                    <span className="truncate pr-2 font-['Outfit']">{sec}</span>
                    <span className="text-[#3B8AC4] font-semibold font-mono tabular-nums">{count}</span>
                  </div>
                  <div className="w-full bg-[#F5F8FB] border border-[#E4ECF2] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-[#3B8AC4] rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Obstacles & Priority Processes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Obstacles */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E252D] font-['Outfit']">
            Obstáculos Principales para Decidir
          </h3>
          <p className="text-xs text-slate-500">
            Fricciones reportadas con mayor frecuencia por la dirección:
          </p>

          <div className="space-y-2.5 pt-1">
            {sortedObstacles.map(([obs, count]) => {
              const widthPct = Math.round((count / maxObsVal) * 100);
              return (
                <div key={obs} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#1E252D]">
                    <span className="truncate pr-2">{obs}</span>
                    <span className="text-[#BFA898] font-semibold font-mono tabular-nums">{count} menciones</span>
                  </div>
                  <div className="w-full bg-[#F5F8FB] border border-[#E4ECF2] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-[#BFA898] rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Processes */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E252D] font-['Outfit']">
            Procesos Prioritarios para Tablero
          </h3>
          <p className="text-xs text-slate-500">
            Áreas donde los clientes demandan su primera implementación:
          </p>

          <div className="space-y-2.5 pt-1">
            {sortedProcesses.map(([proc, count]) => {
              const widthPct = Math.round((count / maxProcVal) * 100);
              return (
                <div key={proc} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#1E252D]">
                    <span className="truncate pr-2">{proc}</span>
                    <span className="text-[#3B8AC4] font-semibold font-mono tabular-nums">{count} clientes</span>
                  </div>
                  <div className="w-full bg-[#F5F8FB] border border-[#E4ECF2] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-[#3B8AC4] rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Average Portfolio Radar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
            Madurez Promedio de la Cartera por Dimensión
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Desempeño consolidado del portafolio en los 5 ejes clave del diagnóstico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <RadarChart
              dimensiones={avgDimensions}
              color="#3B8AC4"
              fillColor="rgba(59, 138, 196, 0.22)"
              size={320}
            />
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-['Outfit']">
              Desglose de Promedios Generales
            </div>
            {Object.entries(avgDimensions).map(([dim, val]) => (
              <div key={dim} className="flex items-center justify-between p-2.5 bg-[#F5F8FB] rounded-xl border border-[#E4ECF2]">
                <span className="text-xs font-medium text-[#1E252D] font-['Outfit']">{dim}</span>
                <span className="text-xs font-semibold text-[#3B8AC4] font-mono tabular-nums bg-white px-2 py-0.5 rounded-md border border-[#7EBCE6]/30">
                  {val}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
