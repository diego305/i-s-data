import React from "react";
import { MATRIZ_EVALUACION } from "../config/constants";
import { BrandBanner } from "./BrandHeader";

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Brand Hero Banner */}
      <BrandBanner
        title="Matriz Oficial de Evaluación Interna"
        subtitle="Criterios y soluciones recomendadas según el nivel de madurez analítica identificado"
        categoryTag="METODOLOGÍA I+S DATA SOLUTIONS"
      />

      {/* Cards list */}
      <div className="space-y-5">
        {Object.entries(MATRIZ_EVALUACION).map(([nivel, data]) => {
          return (
            <div
              key={nivel}
              className="bg-white border border-[#E4ECF2] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E4ECF2]">
                <h3 className="text-base sm:text-lg font-light text-[#1E252D] font-['Outfit'] tracking-wide">
                  {nivel}
                </h3>
                <span
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider font-['Outfit']"
                  style={{
                    backgroundColor: data.bg_color,
                    color: data.badge_color
                  }}
                >
                  Norma Oficial
                </span>
              </div>

              {/* Criterion */}
              <div className="p-4 bg-[#F5F8FB] rounded-xl border border-[#E4ECF2] space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block font-['Outfit']">
                  Criterio Diagnóstico:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {data.criterio}
                </p>
              </div>

              {/* Recommended Solution */}
              <div className="p-4 bg-sky-50/40 border border-[#7EBCE6]/40 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3B8AC4] block font-['Outfit']">
                  Solución Inicial Recomendada:
                </span>
                <p className="text-xs sm:text-sm text-[#1E252D] font-medium leading-relaxed">
                  {data.solucion}
                </p>
              </div>

              {/* Action Steps */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2 font-['Outfit']">
                  Pasos de Ejecución Sugeridos:
                </span>
                <ul className="space-y-2">
                  {data.prioridades_clave.map((p, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-sky-50 text-[#3B8AC4] border border-[#7EBCE6]/40 flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5 font-mono">
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
