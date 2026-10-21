import React from "react";
import { MATRIZ_EVALUACION } from "../config/constants";
import { HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>ℹ️</span> Matriz Oficial de Evaluación Interna
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Criterios y soluciones recomendadas según el nivel de madurez analítica identificado en la entrevista de diagnóstico.
        </p>
      </div>

      {/* Cards list */}
      <div className="space-y-5">
        {Object.entries(MATRIZ_EVALUACION).map(([nivel, data]) => {
          return (
            <div
              key={nivel}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 transition-all"
              style={{ borderLeftWidth: "6px", borderLeftColor: data.badge_color }}
            >
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {nivel}
                </h3>
                <span
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: data.bg_color,
                    color: data.badge_color
                  }}
                >
                  OFICIAL
                </span>
              </div>

              {/* Criterion */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                  🔍 Criterio Diagnóstico:
                </strong>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {data.criterio}
                </p>
              </div>

              {/* Recommended Solution */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <strong className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">
                  🚀 Solución Inicial Recomendada:
                </strong>
                <p className="text-sm text-emerald-950 font-bold leading-relaxed">
                  {data.solucion}
                </p>
              </div>

              {/* Action Steps */}
              <div>
                <strong className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-2">
                  Pasos de Ejecución Sugeridos:
                </strong>
                <ul className="space-y-2">
                  {data.prioridades_clave.map((p, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
