import React, { useState } from "react";
import { Interview } from "../types";
import { MATRIZ_EVALUACION } from "../config/constants";
import { Download, Building2, User, CheckCircle2, ArrowRight, ShieldCheck, Clock, Lightbulb, MapPin, Sparkles } from "lucide-react";

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
I+S DATA SOLUTIONS — Inteligencia de Datos para Decisiones Estratégicas
========================================================================

CLIENTE: ${empresa}
ATENCIÓN: ${responsable} ${rol ? `(${rol})` : ""}
SECTOR: ${sector}
DIAGNÓSTICO: ${nivel} (Score: ${score}/100)

1. ENFOQUE Y ALCANCE:
Implementación de un sistema de tableros de control y analítica focalizado en el proceso de:
>> ${procesoPrio} <<

2. SOLUCIÓN TÉCNICA PROPUESTA:
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Brand Proposal Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-8 rounded-2xl text-white border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-2">
              I+S DATA SOLUTIONS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Propuesta de Servicios y Modelo de Trabajo
            </h1>
            <p className="text-sm text-slate-300 font-medium mt-1">
              Inteligencia de Datos para Decisiones Estratégicas
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("institucional")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "institucional"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          🏢 Propuesta Institucional (Servicios)
        </button>
        <button
          onClick={() => setActiveTab("personalizada")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "personalizada"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <span>🎯 Propuesta Personalizada por Cliente</span>
          {interviews.length > 0 && (
            <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
              {interviews.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Institucional */}
      {activeTab === "institucional" && (
        <div className="space-y-8 animate-fadeIn">
          {/* 1. Quiénes Somos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              1. Quiénes Somos y Filosofía
            </h2>
            <blockquote className="p-4 rounded-xl bg-slate-50 border-l-4 border-sky-600 text-sm font-semibold text-slate-800 italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </blockquote>
            <p className="text-sm text-slate-700 leading-relaxed">
              En un entorno productivo y comercial cada vez más dinámico, las organizaciones no sufren por falta de información, sino por la dificultad de procesarla a tiempo y con precisión.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>I+S Data Solutions</strong> es una consultora interdisciplinaria que ayuda a empresas, instituciones y unidades productivas a transformar registros dispersos en <strong>sistemas visuales de control y análisis en tiempo real</strong>. Conectamos la realidad operativa con herramientas modernas de Business Intelligence para que cada decisión estratégica esté respaldada por evidencia concreta y confiable.
            </p>
          </div>

          {/* 2. Nuestro Enfoque */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              2. Nuestro Enfoque: De los datos aislados a la acción concreta
            </h2>

            {/* Pipeline Visual 4 Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-t-4 border-t-slate-500 text-center flex flex-col justify-between">
                <div className="text-2xl mb-1">📂</div>
                <div className="font-bold text-slate-900 text-sm">1. Fuentes de Datos</div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Planillas, ERP, sistemas de facturación y CRM dispersos.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-t-4 border-t-sky-500 text-center flex flex-col justify-between">
                <div className="text-2xl mb-1">⚙️</div>
                <div className="font-bold text-sky-700 text-sm">2. Integración y Consistencia</div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Limpieza, normalización y diccionario de métricas único.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-t-4 border-t-indigo-500 text-center flex flex-col justify-between">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-bold text-indigo-700 text-sm">3. Tableros Interactivos</div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Dashboards en la nube para PC y celular con filtros ágiles.
                </p>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 border-t-4 border-t-emerald-600 text-center flex flex-col justify-between">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-bold text-emerald-800 text-sm">4. Decisión Asertiva</div>
                <p className="text-xs text-emerald-700 mt-1 leading-snug">
                  Anticipación de desvíos, ahorro de horas y rentabilidad.
                </p>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 block mb-0.5">🔹 Objetividad:</strong>
                Métricas estandarizadas sin interpretaciones contradictorias entre departamentos.
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 block mb-0.5">🔹 Oportunidad:</strong>
                Disponibilidad de indicadores clave en tiempo real, sin demoras operativas.
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 block mb-0.5">🔹 Claridad:</strong>
                Información visual, interactiva y accesible para los niveles directivos y mandos medios.
              </div>
            </div>
          </div>

          {/* 3. Nuestro Producto */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              3. Nuestro Producto: Business Intelligence y Analítica de Gestión
            </h2>
            <p className="text-sm text-slate-600">
              Un servicio integral diseñado para ordenar el ecosistema de información de su empresa y desplegar tableros de control interactivos que simplifican el seguimiento de sus objetivos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box Problems */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 border-l-4 border-l-amber-500">
                <h3 className="text-sm font-bold text-amber-900 mb-2">
                  ¿Qué problemas resolvemos?
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-amber-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>
                      <strong>Fin de planillas fragmentadas:</strong> Eliminamos inconsistencias entre archivos que no coinciden.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>
                      <strong>Ahorro de horas manuales:</strong> Chau al armado repetitivo y estresante de reportes a fin de mes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>
                      <strong>Detección temprana de desvíos:</strong> Alertas visibles en costos, márgenes, compras y cobranzas.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Box Phases */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5">
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Fases y Componentes de la Solución:
                </h3>
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-sky-700">1. Auditoría e Integración de Fuentes:</div>
                  <div className="text-slate-600">Conectamos y normalizamos sus datos existentes (ERP, hojas de cálculo, comprobantes fiscales, CRM).</div>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-sky-700">2. Modelado y Gobernanza de Indicadores:</div>
                  <div className="text-slate-600">Definición precisa de sus KPIs críticos con un diccionario unificado de métricas.</div>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-sky-700">3. Despliegue de Tableros Interactivos (Dashboards):</div>
                  <div className="text-slate-600">Implementación en la nube para explorar datos con filtros por período, zona, producto o responsable.</div>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-sky-700">4. Capacitación y Adopción:</div>
                  <div className="text-slate-600">Transferencia práctica al equipo directivo y operativo para garantizar uso autónomo continuo.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Trayectoria y Respaldo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              4. Trayectoria y Respaldo
            </h2>
            <p className="text-sm text-slate-700">
              Contamos con una sólida experiencia en el análisis y sistematización de datos estratégicos para sectores clave de la región:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pl-2">
              <li className="flex items-start gap-2">
                <span>🍇</span>
                <span>
                  <strong>Sector Agroindustrial y Olivícola:</strong> Elaboración de sinopsis estadísticas, mapeos territoriales, costos y rendimientos productivos.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>🏛️</span>
                <span>
                  <strong>Instituciones y Cámaras Sectoriales:</strong> Desarrollo de plataformas y herramientas de gestión de información para organismos de desarrollo productivo y colegios profesionales.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>📈</span>
                <span>
                  <strong>Consultoría Empresarial:</strong> Asesoramiento técnico en estructuración de flujos de datos para la toma de decisiones gerenciales.
                </span>
              </li>
            </ul>
          </div>

          {/* 5. Contacto */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              5. Contacto e Inicio de Proyecto
            </h2>
            <p className="text-sm text-slate-300 font-medium">
              Comience a gestionar su organización sobre bases sólidas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Ubicación:</strong> E. Carriego N° 431, La Rioja, Argentina.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Diagnóstico inicial sin cargo:</strong> Evaluamos el estado actual de los datos de su empresa y le presentamos una propuesta a medida para su primer tablero de control.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Propuesta Personalizada */}
      {activeTab === "personalizada" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Generador de Propuesta Comercial a Medida
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Adapta automáticamente la propuesta institucional con los resultados específicos del diagnóstico de madurez del cliente.
            </p>

            {interviews.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600">
                No hay clientes relevados en la base de datos para generar una propuesta personalizada. Realice una entrevista primero en el módulo "Nueva Entrevista".
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Seleccione el cliente entrevistado:
                </label>
                <select
                  value={selectedInterviewId}
                  onChange={(e) => setSelectedInterviewId(Number(e.target.value))}
                  className="w-full sm:max-w-xl px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white font-medium cursor-pointer"
                >
                  {interviews.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.empresa} (Resp: {item.responsable_nombre} - {item.nivel_madurez.split(":")[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedClient && (
            <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 border-t-6 border-t-sky-600">
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-black text-sky-700 uppercase tracking-wider block">
                    PROPUESTA DE IMPLEMENTACIÓN BI
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedClient.empresa}
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Atención: <strong>{selectedClient.responsable_nombre}</strong>{" "}
                    {selectedClient.responsable_rol && `(${selectedClient.responsable_rol})`}
                  </div>
                </div>

                {(() => {
                  const mInfo =
                    MATRIZ_EVALUACION[selectedClient.nivel_madurez] ||
                    MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];
                  return (
                    <div
                      className="px-4 py-2 rounded-xl text-right self-start sm:self-auto"
                      style={{ backgroundColor: mInfo.bg_color }}
                    >
                      <div
                        className="text-xs font-bold"
                        style={{ color: mInfo.badge_color }}
                      >
                        {selectedClient.nivel_madurez}
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">
                        Score: {selectedClient.score_global} pts
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Scope & Objective */}
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  1. Objetivo y Alcance Recomendado
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  A partir del diagnóstico inicial de madurez de datos realizado,{" "}
                  <strong>I+S Data Solutions</strong> propone el despliegue del siguiente plan de acción enfocado prioritariamente en{" "}
                  <strong className="text-sky-800">
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
                    <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-4 rounded-xl">
                      <div className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                        Solución Específica a Implementar:
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-emerald-950 mt-1">
                        {mInfo.solucion}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Expected Value */}
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">
                  2. Retorno Esperado para {selectedClient.empresa}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  La solución brindará como principal impacto:{" "}
                  <strong className="text-slate-900 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
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
                    <h4 className="text-sm font-extrabold text-slate-900">
                      3. Fases de Ejecución:
                    </h4>
                    <ol className="space-y-2 pl-4 list-decimal text-xs sm:text-sm text-slate-700 font-medium">
                      {mInfo.prioridades_clave.map((p, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <strong>{p}</strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })()}

              {/* Download Action */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleDownloadPersonalizedProposal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-xs"
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
