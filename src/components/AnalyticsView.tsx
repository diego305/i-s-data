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
      <div className="max-w-4xl mx-auto space-y-6 text-center py-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="text-4xl">📊</div>
          <h2 className="text-xl font-extrabold text-slate-900">
            No hay datos suficientes para calcular analíticas
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Cargue al menos una entrevista o agregue los datos de muestra para visualizar métricas comparativas.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                seedSampleData();
                onRefresh();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              Cargar Entrevistas de Ejemplo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const total = interviews.length;
  const scores = interviews.map((i) => i.score_global);
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / total) * 10) / 10;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  // Distribution by level
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
    "Nivel 1: Inicial / Disperso": "#ef4444",
    "Nivel 2: Operativo / Estructurado": "#f59e0b",
    "Nivel 3: Avanzado / Preparado": "#10b981"
  };

  // Distribution by Sector
  const sectorCounts: Record<string, number> = {};
  interviews.forEach((i) => {
    sectorCounts[i.sector] = (sectorCounts[i.sector] || 0) + 1;
  });
  const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
  const maxSectorVal = sortedSectors[0]?.[1] || 1;

  // Obstacles count
  const obstacleCounts: Record<string, number> = {};
  interviews.forEach((i) => {
    (i.obstaculos_decision || []).forEach((obs) => {
      obstacleCounts[obs] = (obstacleCounts[obs] || 0) + 1;
    });
  });
  const sortedObstacles = Object.entries(obstacleCounts).sort((a, b) => b[1] - a[1]);
  const maxObsVal = sortedObstacles[0]?.[1] || 1;

  // Priority Process count
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

  // Average dimensions for the portfolio
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          📊 Analítica de Clientes Relevados
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Visión panorámica de la madurez de datos, cuellos de botella más comunes y procesos prioritarios del mercado.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Entrevistas</div>
            <div className="text-2xl font-extrabold text-slate-900">{total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score Promedio</div>
            <div className="text-2xl font-extrabold text-slate-900">{avgScore} <span className="text-xs text-slate-500">pts</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score Máximo</div>
            <div className="text-2xl font-extrabold text-emerald-700">{maxScore} <span className="text-xs text-slate-500">pts</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score Mínimo</div>
            <div className="text-2xl font-extrabold text-rose-700">{minScore} <span className="text-xs text-slate-500">pts</span></div>
          </div>
        </div>
      </div>

      {/* Row 1: Distribution by Level & Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maturity Donut / Bar breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            Distribución de Madurez de Datos
          </h3>

          <div className="space-y-3">
            {Object.entries(levelCounts).map(([lvl, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const color = levelColors[lvl] || "#0284c7";
              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{lvl}</span>
                    </span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
            {Object.entries(levelCounts).map(([lvl, count]) => (
              <div key={lvl}>
                <div className="font-extrabold text-sm" style={{ color: levelColors[lvl] }}>
                  {count}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate">
                  {lvl.split(":")[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors horizontal bars */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900">
            Entrevistas por Sector Económico
          </h3>

          <div className="space-y-2.5 pt-1">
            {sortedSectors.map(([sec, count]) => {
              const widthPct = Math.round((count / maxSectorVal) * 100);
              return (
                <div key={sec} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate pr-2">{sec}</span>
                    <span className="text-sky-700 font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-500"
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
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900">
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
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span className="truncate pr-2">{obs}</span>
                    <span className="text-rose-700 font-bold">{count} menciones</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Processes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900">
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
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span className="truncate pr-2">{proc}</span>
                    <span className="text-indigo-700 font-bold">{count} clientes</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
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
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Madurez Promedio de la Cartera por Dimensión
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Desempeño consolidado del portafolio en los 5 ejes clave del diagnóstico de BI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <RadarChart
              dimensiones={avgDimensions}
              color="#6366f1"
              fillColor="rgba(99, 102, 241, 0.25)"
              size={320}
            />
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Desglose de Promedios Generales
            </div>
            {Object.entries(avgDimensions).map(([dim, val]) => (
              <div key={dim} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-800">{dim}</span>
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
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
