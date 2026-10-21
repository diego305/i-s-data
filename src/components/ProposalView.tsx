import React, { useState } from "react";
import { Interview } from "../types";
import { MATRIZ_EVALUACION } from "../config/constants";
import { BrandBanner, ContrailCurves } from "./BrandHeader";
import {
  Download,
  ShieldCheck,
  MapPin,
  CheckCircle2
} from "lucide-react";

interface ProposalViewProps {
  interviews: Interview[];
}

export const ProposalView: React.FC<ProposalViewProps> = ({ interviews }) => {
  const [activeTab, setActiveTab] = useState<"institucional" | "personalizada">("institucional");
  const [selectedInterviewId, setSelectedInterviewId] = useState<number>(
    interviews.length > 0 ? interviews[0].id : 0
  );

  const selectedClient = interviews.find((i) => i.id === selectedInterviewId) || interviews[0] || null;

  const handleDownloadPersonalizedProposal = () => {
    if (!selectedClient) return;

    const nivel = selectedClient.nivel_madurez;
    const matriz = MATRIZ_EVALUACION[nivel] || MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];
    const empresa = selectedClient.empresa;
    const responsable = selectedClient.responsable_nombre;
    const rol = selectedClient.responsable_rol;
    const sector = selectedClient.sector;
    const score = selectedClient.score_global;
    const procesoPrio =
      selectedClient.proceso_prioritario === "Otro" && selectedClient.proceso_prioritario_otro
        ? `Otro (${selectedClient.proceso_prioritario_otro})`
        : selectedClient.proceso_prioritario;
    const valorEsp = selectedClient.valor_esperado;

    const textoPropuesta = `PROPUESTA DE IMPLEMENTACIÓN DE BUSINESS INTELLIGENCE
I+S DATA SOLUTIONS — Information + Solutions
Inteligencia de Datos para Decisiones Estratégicas
========================================================================

CLIENTE: ${empresa}
ATENCIÓN: ${responsable} ${rol ? `(${rol})` : ""}
SECTOR: ${sector}
DIAGNÓSTICO OFICIAL: ${nivel} (Score: ${score}/100 pts)

1. ENFOQUE Y ALCANCE:
Implementación de un sistema de tableros de control y analítica focalizado en el proceso de:
>> ${procesoPrio} <<

2. SOLUCIÓN TÉCNICA RECOMENDADA:
${matriz.solucion}

3. RETORNO Y VALOR ESPERADO:
${valorEsp}

4. FASES DEL PLAN DE ACCIÓN:
${matriz.prioridades_clave.map((p, i) => `  Paso ${i + 1}: ${p}`).join("\n")}

5. CONTACTO Y SEGUIMIENTO:
I+S DATA SOLUTIONS
Ubicación: E. Carriego N° 431, La Rioja, Argentina.
========================================================================
`;

    const blob = new Blob([textoPropuesta], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `propuesta_bi_${empresa.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Brand Hero Banner */}
      <BrandBanner
        title="Propuesta de Servicios y Modelo de Trabajo"
        subtitle="Inteligencia de Datos para Decisiones Estratégicas en Empresas y Productores"
        categoryTag="MODELO DE TRABAJO I+S"
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E4ECF2] gap-2">
        <button
          onClick={() => setActiveTab("institucional")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer font-['Outfit'] ${
            activeTab === "institucional"
              ? "border-[#3B8AC4] text-[#3B8AC4]"
              : "border-transparent text-slate-500 hover:text-[#1E252D] hover:border-slate-300"
          }`}
        >
          Propuesta Institucional
        </button>
        <button
          onClick={() => setActiveTab("personalizada")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 font-['Outfit'] ${
            activeTab === "personalizada"
              ? "border-[#3B8AC4] text-[#3B8AC4]"
              : "border-transparent text-slate-500 hover:text-[#1E252D] hover:border-slate-300"
          }`}
        >
          <span>Propuesta Personalizada por Cliente</span>
          {interviews.length > 0 && (
            <span className="text-[11px] font-mono tabular-nums bg-sky-50 text-[#3B8AC4] font-semibold px-2 py-0.5 rounded-md border border-[#7EBCE6]/40">
              {interviews.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Institucional */}
      {activeTab === "institucional" && (
        <div className="space-y-6">
          {/* 1. Quiénes Somos */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
            <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
              01. Quiénes Somos y Filosofía
            </h2>
            <blockquote className="p-4 rounded-xl bg-sky-50/50 border border-[#7EBCE6]/40 text-xs sm:text-sm font-medium text-[#1E252D] italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </blockquote>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              En un entorno productivo y comercial cada vez más dinámico, las organizaciones no sufren por falta de información, sino por la dificultad de procesarla a tiempo y con precisión.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <strong className="text-[#1E252D]">I+S Data Solutions</strong> es una consultora interdisciplinaria que ayuda a empresas, instituciones y unidades productivas a transformar registros dispersos en <strong className="text-[#1E252D]">sistemas visuales de control y análisis en tiempo real</strong>. Conectamos la realidad operativa con herramientas modernas de Business Intelligence para que cada decisión estratégica esté respaldada por evidencia concreta y confiable.
            </p>
          </div>

          {/* 2. Nuestro Enfoque */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
            <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
              02. Nuestro Enfoque: De los datos aislados a la acción concreta
            </h2>

            {/* Pipeline Visual 4 Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#F5F8FB] p-4 rounded-xl border border-[#E4ECF2] text-center flex flex-col justify-between">
                <div className="text-lg font-light mb-1 text-slate-400 font-['Outfit']">01</div>
                <div className="font-semibold text-[#1E252D] text-xs font-['Outfit']">Fuentes de Datos</div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Planillas, ERP, comprobantes y CRM dispersos.
                </p>
              </div>

              <div className="bg-sky-50/40 p-4 rounded-xl border border-[#7EBCE6]/40 text-center flex flex-col justify-between">
                <div className="text-lg font-light mb-1 text-[#3B8AC4] font-['Outfit']">02</div>
                <div className="font-semibold text-[#3B8AC4] text-xs font-['Outfit']">Integración y Limpieza</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Normalización y diccionario de métricas único.
                </p>
              </div>

              <div className="bg-[#FAF7F5] p-4 rounded-xl border border-[#BFA898]/40 text-center flex flex-col justify-between">
                <div className="text-lg font-light mb-1 text-[#BFA898] font-['Outfit']">03</div>
                <div className="font-semibold text-[#BFA898] text-xs font-['Outfit']">Tableros Interactivos</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Dashboards web y móviles con filtros ágiles.
                </p>
              </div>

              <div className="bg-[#F0FDF4] p-4 rounded-xl border border-emerald-200 text-center flex flex-col justify-between">
                <div className="text-lg font-light mb-1 text-emerald-600 font-['Outfit']">04</div>
                <div className="font-semibold text-emerald-800 text-xs font-['Outfit']">Decisión Asertiva</div>
                <p className="text-[11px] text-emerald-700 mt-1 leading-snug">
                  Anticipación de desvíos, ahorro de horas y margen.
                </p>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[#E4ECF2]">
              <div className="text-xs text-slate-700">
                <strong className="text-[#1E252D] block mb-0.5 font-['Outfit'] font-semibold">Objetividad:</strong>
                Métricas estandarizadas sin interpretaciones contradictorias entre departamentos.
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-[#1E252D] block mb-0.5 font-['Outfit'] font-semibold">Oportunidad:</strong>
                Disponibilidad de indicadores clave en tiempo real, sin demoras operativas.
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-[#1E252D] block mb-0.5 font-['Outfit'] font-semibold">Claridad:</strong>
                Información visual, interactiva y accesible para los niveles directivos y mandos medios.
              </div>
            </div>
          </div>

          {/* 3. Nuestro Producto */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
            <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
              03. Nuestro Producto: Business Intelligence y Analítica de Gestión
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Un servicio integral diseñado para ordenar el ecosistema de información de su empresa y desplegar tableros de control interactivos que simplifican el seguimiento de sus objetivos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box Problems */}
              <div className="bg-[#FAF7F5] border border-[#BFA898]/40 rounded-xl p-5 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#BFA898] font-['Outfit']">
                  ¿Qué problemas resolvemos?
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#BFA898]">•</span>
                    <span>
                      <strong className="text-[#1E252D]">Fin de planillas fragmentadas:</strong> Eliminamos inconsistencias entre archivos que no coinciden.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#BFA898]">•</span>
                    <span>
                      <strong className="text-[#1E252D]">Ahorro de horas manuales:</strong> Chau al armado repetitivo y estresante de reportes a fin de mes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#BFA898]">•</span>
                    <span>
                      <strong className="text-[#1E252D]">Detección temprana de desvíos:</strong> Alertas visibles en costos, márgenes, compras y cobranzas.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Box Phases */}
              <div className="bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl p-5 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3B8AC4] font-['Outfit']">
                  Fases de Implementación:
                </h3>
                <div className="text-xs">
                  <div className="font-semibold text-[#1E252D] font-['Outfit']">1. Auditoría e Integración:</div>
                  <div className="text-slate-600">Conexión de datos existentes (ERP, hojas de cálculo, comprobantes fiscales, CRM).</div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-[#1E252D] font-['Outfit']">2. Modelado y Gobernanza:</div>
                  <div className="text-slate-600">Definición de KPIs críticos con diccionario unificado de métricas.</div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-[#1E252D] font-['Outfit']">3. Tableros Interactivos:</div>
                  <div className="text-slate-600">Despliegue en la nube accesible desde PC y dispositivos móviles.</div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-[#1E252D] font-['Outfit']">4. Capacitación y Adopción:</div>
                  <div className="text-slate-600">Transferencia práctica para uso autónomo continuo.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Trayectoria y Respaldo */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
            <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
              04. Trayectoria y Respaldo Regional
            </h2>
            <p className="text-xs sm:text-sm text-slate-700">
              Contamos con una sólida experiencia en el análisis y sistematización de datos estratégicos para sectores clave de la región:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl">
                <div className="font-semibold text-[#1E252D] text-xs mb-1 font-['Outfit']">Sector Agroindustrial y Olivícola</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Sinopsis estadísticas, mapeos territoriales, costos y rendimientos productivos.
                </p>
              </div>
              <div className="p-3.5 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl">
                <div className="font-semibold text-[#1E252D] text-xs mb-1 font-['Outfit']">Instituciones y Cámaras</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Plataformas de información para organismos de desarrollo productivo y colegios profesionales.
                </p>
              </div>
              <div className="p-3.5 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl">
                <div className="font-semibold text-[#1E252D] text-xs mb-1 font-['Outfit']">Consultoría Empresarial</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Asesoramiento técnico en estructuración de flujos de datos para decisiones gerenciales.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Contacto */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] shadow-[0px_4px_16px_rgba(30,37,45,0.08)] bg-[#1E252D] text-white p-6 sm:p-8 space-y-3">
            <ContrailCurves className="opacity-30" />
            <div className="relative">
              <h2 className="text-sm font-light tracking-wide uppercase text-[#BFA898] font-['Outfit']">
                Contacto e Inicio de Proyecto
              </h2>
              <p className="text-xs sm:text-sm text-sky-100 font-normal mt-1">
                Comience a gestionar su organización sobre bases sólidas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-sky-100/90 pt-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#7EBCE6] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Ubicación:</strong> E. Carriego N° 431, La Rioja, Argentina.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#7EBCE6] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Diagnóstico inicial sin cargo:</strong> Evaluamos el estado actual de los datos de su empresa y le presentamos una propuesta a medida para su primer tablero de control.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Propuesta Personalizada */}
      {activeTab === "personalizada" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
            <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
              Generador de Propuesta Comercial a Medida
            </h2>
            <p className="text-xs text-slate-500">
              Adapta automáticamente la propuesta técnica con los resultados del diagnóstico del cliente.
            </p>

            {interviews.length === 0 ? (
              <div className="p-4 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl text-xs text-slate-600">
                No hay clientes relevados en la base de datos para generar una propuesta personalizada. Realice una entrevista primero en el módulo "Nueva Entrevista".
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']">
                  Seleccione el cliente entrevistado:
                </label>
                <select
                  value={selectedInterviewId}
                  onChange={(e) => setSelectedInterviewId(Number(e.target.value))}
                  className="w-full sm:max-w-xl px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white font-medium cursor-pointer transition-all"
                >
                  {interviews.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.empresa} ({item.responsable_nombre} - {item.nivel_madurez.split(":")[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedClient && (
            <div className="bg-white border border-[#E4ECF2] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4ECF2]">
                <div>
                  <span className="text-[11px] font-semibold text-[#3B8AC4] uppercase tracking-wider block font-['Outfit']">
                    PROPUESTA DE IMPLEMENTACIÓN BI
                  </span>
                  <h3 className="text-xl sm:text-2xl font-light text-[#1E252D] mt-0.5 font-['Outfit']">
                    {selectedClient.empresa}
                  </h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Atención: <strong className="text-[#1E252D]">{selectedClient.responsable_nombre}</strong>{" "}
                    {selectedClient.responsable_rol && `(${selectedClient.responsable_rol})`}
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50/50 border border-[#7EBCE6]/40 rounded-xl text-right self-start sm:self-auto">
                  <div className="text-xs font-semibold text-[#3B8AC4] font-['Outfit']">
                    {selectedClient.nivel_madurez}
                  </div>
                  <div className="text-xs font-mono tabular-nums text-slate-600 mt-0.5">
                    Score: <strong className="text-[#1E252D]">{selectedClient.score_global}</strong> / 100 pts
                  </div>
                </div>
              </div>

              {/* Scope & Objective */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-['Outfit']">
                  1. Objetivo y Alcance Recomendado
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  A partir del diagnóstico inicial de madurez de datos realizado,{" "}
                  <strong className="text-[#1E252D]">I+S Data Solutions</strong> propone el despliegue del siguiente plan de acción enfocado en{" "}
                  <strong className="text-[#3B8AC4]">
                    {selectedClient.proceso_prioritario === "Otro" && selectedClient.proceso_prioritario_otro
                      ? selectedClient.proceso_prioritario_otro
                      : selectedClient.proceso_prioritario}
                  </strong>
                  :
                </p>

                {(() => {
                  const mInfo =
                    MATRIZ_EVALUACION[selectedClient.nivel_madurez] ||
                    MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];
                  return (
                    <div className="bg-sky-50/40 border border-[#7EBCE6]/40 p-4 rounded-xl space-y-1">
                      <div className="text-[11px] font-semibold text-[#3B8AC4] uppercase tracking-wider font-['Outfit']">
                        Solución Técnica Recomendada:
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-[#1E252D]">
                        {mInfo.solucion}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Expected Value */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-['Outfit']">
                  2. Retorno Esperado para {selectedClient.empresa}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  La solución brindará como principal impacto:{" "}
                  <strong className="text-[#1E252D] font-medium bg-[#FAF7F5] px-2 py-0.5 rounded-md border border-[#BFA898]/30">
                    {selectedClient.valor_esperado}
                  </strong>
                  , eliminando los cuellos de botella detectados en el relevamiento inicial.
                </p>
              </div>

              {/* Execution Phases */}
              {(() => {
                const mInfo =
                  MATRIZ_EVALUACION[selectedClient.nivel_madurez] ||
                  MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];
                return (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-['Outfit']">
                      3. Fases de Ejecución:
                    </h4>
                    <ol className="space-y-2 pl-4 list-decimal text-xs sm:text-sm text-slate-700 font-normal">
                      {mInfo.prioridades_clave.map((p, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <strong className="text-[#1E252D]">{p}</strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })()}

              {/* Download Action */}
              <div className="pt-4 border-t border-[#E4ECF2] flex justify-end">
                <button
                  onClick={handleDownloadPersonalizedProposal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white btn-primary cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar Propuesta Personalizada (.txt)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
