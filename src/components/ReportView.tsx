import React from "react";
import { Interview } from "../types";
import { MATRIZ_EVALUACION } from "../config/constants";
import { GaugeChart } from "./charts/GaugeChart";
import { RadarChart } from "./charts/RadarChart";
import { Download, ArrowLeft, Printer, CheckCircle, AlertTriangle, Building2, User, Calendar, Tag } from "lucide-react";

interface ReportViewProps {
  interview: Interview;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  interview,
  onBack,
  showBackButton = true
}) => {
  const matrizInfo =
    MATRIZ_EVALUACION[interview.nivel_madurez] ||
    MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];

  const handleDownloadTxt = () => {
    const resumenTxt = `# REPORTE DE EVALUACIÓN DE MADUREZ DE DATOS & BI
Empresa: ${interview.empresa}
Responsable: ${interview.responsable_nombre} ${interview.responsable_rol ? `(${interview.responsable_rol})` : ""}
Sector: ${interview.sector}${interview.sector === "Otro" && interview.sector_otro ? ` (${interview.sector_otro})` : ""}
Fecha: ${interview.created_at.substring(0, 10)}
Puntaje Global: ${interview.score_global}/100
Nivel de Madurez: ${interview.nivel_madurez}

CRITERIO DIAGNÓSTICO:
${matrizInfo.criterio}

SOLUCIÓN INICIAL RECOMENDADA:
${matrizInfo.solucion}

PLAN DE ACCIÓN:
${matrizInfo.prioridades_clave.map((p, idx) => `Paso ${idx + 1}: ${p}`).join("\n")}

PROCESO PRIORITARIO: ${interview.proceso_prioritario}${interview.proceso_prioritario === "Otro" && interview.proceso_prioritario_otro ? ` (${interview.proceso_prioritario_otro})` : ""}
VALOR ESPERADO: ${interview.valor_esperado}
NOTAS DEL CONSULTOR: ${interview.observaciones_consultor || "Sin observaciones"}

I+S DATA SOLUTIONS — Inteligencia de Datos para Decisiones Estratégicas
`;

    const blob = new Blob([resumenTxt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagnostico_bi_${interview.empresa.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const sectorDisplay =
    interview.sector === "Otro" && interview.sector_otro
      ? `Otro (${interview.sector_otro})`
      : interview.sector;

  const procesoPrioDisplay =
    interview.proceso_prioritario === "Otro" && interview.proceso_prioritario_otro
      ? `Otro (${interview.proceso_prioritario_otro})`
      : interview.proceso_prioritario;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Imprimir
          </button>
          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            Descargar Informe (.txt)
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-8 rounded-2xl text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block bg-white/15 backdrop-blur-xs text-slate-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10">
              INFORME DE EVALUACIÓN BI • {interview.created_at.substring(0, 10)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {interview.empresa}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-400" />
                <strong>{interview.responsable_nombre}</strong>
                {interview.responsable_rol && ` (${interview.responsable_rol})`}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                {sectorDisplay}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                {interview.colaboradores} colaboradores
              </span>
            </div>
          </div>

          <div
            className="self-start md:self-auto text-left md:text-right p-4 rounded-xl border border-white/10 backdrop-blur-xs min-w-[200px]"
            style={{ backgroundColor: matrizInfo.bg_color }}
          >
            <div
              className="text-xs uppercase font-extrabold tracking-wider"
              style={{ color: matrizInfo.badge_color }}
            >
              Diagnóstico Oficial
            </div>
            <div
              className="text-xl font-extrabold mt-1"
              style={{ color: matrizInfo.badge_color }}
            >
              {interview.nivel_madurez}
            </div>
            <div className="text-white text-sm font-semibold mt-1">
              Puntaje: <span className="text-lg font-bold">{interview.score_global}</span> / 100
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Gauge & Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>🎯</span> Índice de Madurez Global
          </h3>
          <GaugeChart
            value={interview.score_global}
            label="Nivel de Preparación BI"
            badgeColor={matrizInfo.badge_color}
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>🕸️</span> Evaluación por Dimensiones Clave
          </h3>
          <RadarChart dimensiones={interview.dimensiones} />
        </div>
      </div>

      {/* Official Matrix Recommendation Cards */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <span>🎯</span> Dictamen y Solución Recomendada (Matriz Oficial)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-5 rounded-xl border shadow-xs bg-slate-50"
            style={{ borderLeftWidth: "5px", borderLeftColor: matrizInfo.badge_color }}
          >
            <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>🔍</span> Criterio Diagnóstico
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {matrizInfo.criterio}
            </p>
          </div>

          <div className="p-5 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/70 border-l-[5px] border-l-emerald-600">
            <h4 className="text-sm font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
              <span>🚀</span> Solución Inicial Recomendada
            </h4>
            <p className="text-sm text-emerald-900 leading-relaxed font-semibold">
              {matrizInfo.solucion}
            </p>
          </div>
        </div>
      </div>

      {/* Action Plan Steps */}
      <div>
        <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3">
          📋 Plan de Acción y Prioridades Clave:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {matrizInfo.prioridades_clave.map((paso, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-t-4 border-t-sky-600 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-black text-sky-700 tracking-wider uppercase block mb-1">
                  PASO {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  {paso}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Survey Findings */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <span>📑</span> Relevamiento Detallado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Infrastructure */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Infraestructura y Datos Actuales
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Integración entre áreas: </span>
                {interview.integracion_nivel}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Frecuencia de actualización: </span>
                {interview.frecuencia_actualizacion}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Nivel de confianza en los datos: </span>
                {interview.confianza_datos}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Herramienta actual de análisis: </span>
                {interview.herramienta_visualizacion}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Tiempo de consolidación de reportes: </span>
                {interview.tiempo_reporte}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900 text-xs sm:text-sm block mb-1.5">
                Fuentes donde se almacena la información:
              </span>
              {interview.almacenamiento_fuentes && interview.almacenamiento_fuentes.length > 0 ? (
                <ul className="space-y-1">
                  {interview.almacenamiento_fuentes.map((f, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-1.5">
                      <span className="text-sky-600 mt-0.5">•</span>
                      <span>
                        {f}
                        {f === "Otro" && interview.almacenamiento_otro
                          ? ` (${interview.almacenamiento_otro})`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-slate-400 italic">No especificadas</span>
              )}
            </div>
          </div>

          {/* Column 2: Objectives & Obstacles */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Objetivos y Expectativas del Cliente
            </h4>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Proceso prioritario para tablero: </span>
                <span className="inline-block bg-sky-50 text-sky-800 font-semibold px-2 py-0.5 rounded-md border border-sky-100">
                  {procesoPrioDisplay}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Valor principal esperado: </span>
                <div className="text-slate-700 font-medium mt-0.5">{interview.valor_esperado}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900 text-xs sm:text-sm block mb-1.5">
                Principales obstáculos al tomar decisiones:
              </span>
              {interview.obstaculos_decision && interview.obstaculos_decision.length > 0 ? (
                <ul className="space-y-1.5">
                  {interview.obstaculos_decision.map((obs, i) => (
                    <li key={i} className="text-xs sm:text-sm text-amber-900 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-slate-400 italic">Ninguno especificado</span>
              )}
            </div>

            {interview.observaciones_consultor && (
              <div className="pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-900 text-xs sm:text-sm block mb-1">
                  Notas del Consultor:
                </span>
                <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs sm:text-sm text-blue-900 italic leading-relaxed">
                  "{interview.observaciones_consultor}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
