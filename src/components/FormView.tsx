import React, { useState } from "react";
import {
  APP_TITLE,
  APP_SUBTITLE,
  APP_DESCRIPTION,
  SECTORES,
  RANGOS_COLABORADORES,
  FUENTES_ALMACENAMIENTO,
  NIVELES_INTEGRACION,
  FRECUENCIAS_ACTUALIZACION,
  NIVELES_CONFIANZA,
  TIEMPOS_REPORTE,
  HERRAMIENTAS_VISUALIZACION,
  OBSTACULOS_DECISION,
  AREAS_PRIORITARIAS,
  VALORES_ESPERADOS
} from "../config/constants";
import { Interview, InterviewFormData } from "../types";
import { saveInterview } from "../lib/storage";
import { ReportView } from "./ReportView";
import { CheckCircle2, AlertCircle, Clock, Building, Database, RefreshCw, BarChart2, Target, Plus } from "lucide-react";

export const FormView: React.FC = () => {
  // Saved interview in current session to show immediate report
  const [lastSaved, setLastSaved] = useState<Interview | null>(null);

  // Form states
  const [interviewer, setInterviewer] = useState("Consultor BI");
  const [intervieweeName, setIntervieweeName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState(SECTORES[0]);
  const [sectorOther, setSectorOther] = useState("");
  const [employeeCount, setEmployeeCount] = useState(RANGOS_COLABORADORES[1]); // "11 a 50"

  // Section 2
  const [storageSources, setStorageSources] = useState<string[]>([
    "Planillas de cálculo (Excel, Google Sheets) en carpetas locales o compartidas"
  ]);
  const [storageOther, setStorageOther] = useState("");
  const [integrationLevel, setIntegrationLevel] = useState(NIVELES_INTEGRACION[1]); // Nivel 2

  // Section 3
  const [updateFrequency, setUpdateFrequency] = useState(FRECUENCIAS_ACTUALIZACION[1]); // Semanal
  const [dataConfidence, setDataConfidence] = useState(NIVELES_CONFIANZA[1]); // Medio

  // Section 4
  const [reportTime, setReportTime] = useState(TIEMPOS_REPORTE[0]); // Horas o días
  const [currentBiTool, setCurrentBiTool] = useState(HERRAMIENTAS_VISUALIZACION[0]); // Excel
  const [decisionObstacles, setDecisionObstacles] = useState<string[]>([
    OBSTACULOS_DECISION[0]
  ]);

  // Section 5
  const [priorityProcess, setPriorityProcess] = useState(AREAS_PRIORITARIAS[0]); // Ventas
  const [priorityOther, setPriorityOther] = useState("");
  const [expectedValue, setExpectedValue] = useState(VALORES_ESPERADOS[0]); // Ahorro de tiempo

  // Consultant notes
  const [consultantNotes, setConsultantNotes] = useState("");

  // Error messaging
  const [errorMessage, setErrorMessage] = useState("");

  // Reset to empty for another interview
  const handleStartNew = () => {
    setLastSaved(null);
    setIntervieweeName("");
    setRole("");
    setCompany("");
    setSector(SECTORES[0]);
    setSectorOther("");
    setEmployeeCount(RANGOS_COLABORADORES[1]);
    setStorageSources([FUENTES_ALMACENAMIENTO[0]]);
    setStorageOther("");
    setIntegrationLevel(NIVELES_INTEGRACION[1]);
    setUpdateFrequency(FRECUENCIAS_ACTUALIZACION[1]);
    setDataConfidence(NIVELES_CONFIANZA[1]);
    setReportTime(TIEMPOS_REPORTE[0]);
    setCurrentBiTool(HERRAMIENTAS_VISUALIZACION[0]);
    setDecisionObstacles([OBSTACULOS_DECISION[0]]);
    setPriorityProcess(AREAS_PRIORITARIAS[0]);
    setPriorityOther("");
    setExpectedValue(VALORES_ESPERADOS[0]);
    setConsultantNotes("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleStorage = (fuente: string) => {
    setStorageSources((prev) =>
      prev.includes(fuente) ? prev.filter((item) => item !== fuente) : [...prev, fuente]
    );
  };

  const handleToggleObstacle = (obs: string) => {
    setDecisionObstacles((prev) =>
      prev.includes(obs) ? prev.filter((item) => item !== obs) : [...prev, obs]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!company.trim()) {
      setErrorMessage("Por favor ingrese el Nombre de la empresa u organización.");
      return;
    }
    if (!intervieweeName.trim()) {
      setErrorMessage("Por favor ingrese el Nombre y Apellido del responsable.");
      return;
    }

    const payload: InterviewFormData = {
      entrevistador: interviewer.trim(),
      responsable_nombre: intervieweeName.trim(),
      responsable_rol: role.trim(),
      empresa: company.trim(),
      sector,
      sector_otro: sector === "Otro" ? sectorOther.trim() : "",
      colaboradores: employeeCount,
      almacenamiento_fuentes: storageSources,
      almacenamiento_otro: storageSources.includes("Otro") ? storageOther.trim() : "",
      integracion_nivel: integrationLevel,
      frecuencia_actualizacion: updateFrequency,
      confianza_datos: dataConfidence,
      tiempo_reporte: reportTime,
      herramienta_visualizacion: currentBiTool,
      obstaculos_decision: decisionObstacles,
      proceso_prioritario: priorityProcess,
      proceso_prioritario_otro: priorityProcess === "Otro" ? priorityOther.trim() : "",
      valor_esperado: expectedValue,
      observaciones_consultor: consultantNotes.trim(),
      estado: "Completada"
    };

    const saved = saveInterview(payload);
    setLastSaved(saved);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If newly saved, show report immediately with header button to load another
  if (lastSaved) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-emerald-950">
                ¡Entrevista registrada y evaluada con éxito!
              </div>
              <div className="text-xs text-emerald-700">
                Empresa <strong>{lastSaved.empresa}</strong> guardada en la base de datos (ID #{lastSaved.id}).
              </div>
            </div>
          </div>
          <button
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Cargar Otra Entrevista
          </button>
        </div>

        <ReportView interview={lastSaved} showBackButton={false} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Official Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-sky-600" />
        <div className="space-y-2 pl-2">
          <span className="inline-block bg-sky-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
            FORMULARIO OFICIAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {APP_TITLE}
          </h1>
          <div className="text-sm font-semibold text-sky-800">
            {APP_SUBTITLE}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {APP_DESCRIPTION}
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 pt-1">
            <Clock className="w-4 h-4" />
            <span>Tiempo estimado de respuesta: 5 a 7 minutos</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-sm font-semibold flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Relevamiento Auditor Metadata */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            👤 Datos del Relevamiento
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Consultor / Entrevistador a cargo:
              </label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="Ej: Diego Martínez"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>
            <div className="text-xs text-slate-500 italic sm:pt-4">
              Este dato quedará registrado en la auditoría y exportación de la entrevista.
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 1: DATOS GENERALES */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                🏢 SECCIÓN 1: DATOS GENERALES
              </h2>
              <p className="text-xs text-slate-500">
                Información básica de la empresa y del referente que responde.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. Nombre y Apellido del responsable <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={intervieweeName}
                onChange={(e) => setIntervieweeName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. Cargo / Rol en la organización
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ej: Gerente de Operaciones / Dueño"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                3. Nombre de la empresa u organización <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ej: Bodegas Andinas S.A."
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                5. Cantidad aproximada de colaboradores
              </label>
              <select
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white cursor-pointer"
              >
                {RANGOS_COLABORADORES.map((r) => (
                  <option key={r} value={r}>
                    {r} colaboradores
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              4. Sector o actividad principal
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white cursor-pointer"
            >
              {SECTORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {sector === "Otro" && (
              <div className="mt-2">
                <input
                  type="text"
                  value={sectorOther}
                  onChange={(e) => setSectorOther(e.target.value)}
                  placeholder="Especifique el sector o actividad (ej: Fintech, Energía solar...)"
                  className="w-full px-3.5 py-2 text-sm border border-sky-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-sky-50/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 2: ALMACENAMIENTO Y FUENTES DE INFORMACIÓN */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                💾 SECCIÓN 2: ALMACENAMIENTO Y FUENTES DE INFORMACIÓN
              </h2>
              <p className="text-xs text-slate-500">
                Identificación de repositorios, sistemas transaccionales e integración actual.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              6. ¿Dónde se registra y almacena hoy la mayor parte de la información operativa y comercial?
              <span className="block text-[11px] font-normal text-slate-500">(Seleccione todas las que apliquen)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {FUENTES_ALMACENAMIENTO.map((fuente) => {
                const checked = storageSources.includes(fuente);
                return (
                  <label
                    key={fuente}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                      checked
                        ? "bg-sky-50/70 border-sky-400 text-sky-950 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleStorage(fuente)}
                      className="mt-0.5 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{fuente}</span>
                  </label>
                );
              })}
            </div>
            {storageSources.includes("Otro") && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={storageOther}
                  onChange={(e) => setStorageOther(e.target.value)}
                  placeholder="Especifique otro medio de almacenamiento (ej: Access, Notion, etc.)"
                  className="w-full px-3.5 py-2 text-sm border border-sky-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-sky-50/30"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              7. ¿Cómo calificaría la integración entre sus distintas áreas (ventas, compras, administración, operaciones)?
            </label>
            <div className="space-y-2">
              {NIVELES_INTEGRACION.map((nivel) => {
                const checked = integrationLevel === nivel;
                return (
                  <label
                    key={nivel}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      checked
                        ? "bg-sky-50/80 border-sky-500 text-sky-950 font-semibold shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="integrationLevel"
                      checked={checked}
                      onChange={() => setIntegrationLevel(nivel)}
                      className="mt-0.5 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{nivel}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 3: RECOLECCIÓN, ACTUALIZACIÓN Y CALIDAD */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                🔄 SECCIÓN 3: RECOLECCIÓN, ACTUALIZACIÓN Y CALIDAD
              </h2>
              <p className="text-xs text-slate-500">
                Dinámica de refresco y confiabilidad percibida de la información.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                8. ¿Con qué frecuencia se actualizan los datos clave del negocio?
              </label>
              <div className="space-y-2">
                {FRECUENCIAS_ACTUALIZACION.map((freq) => {
                  const checked = updateFrequency === freq;
                  return (
                    <label
                      key={freq}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/80 border-sky-500 text-sky-950 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="updateFrequency"
                        checked={checked}
                        onChange={() => setUpdateFrequency(freq)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span>{freq}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                9. ¿Qué nivel de confianza tiene en la consistencia de sus datos actuales?
              </label>
              <div className="space-y-2">
                {NIVELES_CONFIANZA.map((conf) => {
                  const checked = dataConfidence === conf;
                  return (
                    <label
                      key={conf}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/80 border-sky-500 text-sky-950 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="dataConfidence"
                        checked={checked}
                        onChange={() => setDataConfidence(conf)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <span>{conf}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 4: GENERACIÓN DE REPORTES Y TOMA DE DECISIONES */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                📊 SECCIÓN 4: GENERACIÓN DE REPORTES Y TOMA DE DECISIONES
              </h2>
              <p className="text-xs text-slate-500">
                Tiempos de preparación, herramientas y principales fricciones directivas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                10. ¿Cuánto tiempo le toma a su equipo consolidar los reportes periódicos de gestión?
              </label>
              <div className="space-y-2">
                {TIEMPOS_REPORTE.map((t) => {
                  const checked = reportTime === t;
                  return (
                    <label
                      key={t}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/80 border-sky-500 text-sky-950 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportTime"
                        checked={checked}
                        onChange={() => setReportTime(t)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <span>{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                11. ¿Qué herramienta utilizan actualmente para visualizar y analizar los indicadores?
              </label>
              <div className="space-y-2">
                {HERRAMIENTAS_VISUALIZACION.map((h) => {
                  const checked = currentBiTool === h;
                  return (
                    <label
                      key={h}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/80 border-sky-500 text-sky-950 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="currentBiTool"
                        checked={checked}
                        onChange={() => setCurrentBiTool(h)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <span>{h}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              12. ¿Cuáles son los principales obstáculos que enfrenta la dirección al momento de tomar decisiones?
              <span className="block text-[11px] font-normal text-slate-500">(Marque hasta 3)</span>
            </label>
            <div className="space-y-2 pt-1">
              {OBSTACULOS_DECISION.map((obs) => {
                const checked = decisionObstacles.includes(obs);
                return (
                  <label
                    key={obs}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      checked
                        ? "bg-amber-50/80 border-amber-400 text-amber-950 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleObstacle(obs)}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{obs}</span>
                  </label>
                );
              })}
            </div>
            {decisionObstacles.length > 3 && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Ha marcado más de 3 obstáculos ({decisionObstacles.length}). Le sugerimos priorizar los 3 más críticos para un diagnóstico más certero.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 5: PRIORIDADES Y EXPECTATIVAS */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                🎯 SECCIÓN 5: PRIORIDADES Y EXPECTATIVAS
              </h2>
              <p className="text-xs text-slate-500">
                Foco de negocio deseado y retorno esperado de la iniciativa de BI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                13. ¿Cuál sería el área o proceso prioritario para implementar su primer tablero interactivo?
              </label>
              <select
                value={priorityProcess}
                onChange={(e) => setPriorityProcess(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
              >
                {AREAS_PRIORITARIAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {priorityProcess === "Otro" && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={priorityOther}
                    onChange={(e) => setPriorityOther(e.target.value)}
                    placeholder="Especifique el área o proceso prioritario (ej: Logística de frío, mermas...)"
                    className="w-full px-3.5 py-2 text-sm border border-sky-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-sky-50/30"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                14. ¿Qué valor principal espera obtener de la implementación de Business Intelligence?
              </label>
              <div className="space-y-2">
                {VALORES_ESPERADOS.map((val) => {
                  const checked = expectedValue === val;
                  return (
                    <label
                      key={val}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/80 border-sky-500 text-sky-950 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="expectedValue"
                        checked={checked}
                        onChange={() => setExpectedValue(val)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <span>{val}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* NOTAS ADICIONALES DEL CONSULTOR */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <label className="block text-sm font-extrabold text-slate-900">
            📝 Notas y Observaciones del Consultor
          </label>
          <p className="text-xs text-slate-500">
            Comentarios cualitativos, tono del cliente, sistemas específicos mencionados o próximos pasos:
          </p>
          <textarea
            value={consultantNotes}
            onChange={(e) => setConsultantNotes(e.target.value)}
            rows={3}
            placeholder="Ej: El cliente planea cambiar de ERP el año próximo. Tienen urgencia en el módulo de ventas y cobranzas. Muy receptivo a Power BI."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>Finalizar Entrevista y Calcular Diagnóstico</span>
          </button>
        </div>
      </form>
    </div>
  );
};
