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
import { saveInterviewFirestore } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { ReportView } from "./ReportView";
import { BrandBanner, PropellerLoader } from "./BrandHeader";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Cloud,
  ChevronRight,
  HardDrive
} from "lucide-react";

export const FormView: React.FC = () => {
  const { currentUser, isGuest, guestUser } = useAuth();
  const [lastSaved, setLastSaved] = useState<Interview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [interviewer, setInterviewer] = useState(() => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email;
    if (isGuest) return guestUser?.name || "Consultor Invitado";
    return "Consultor BI";
  });

  React.useEffect(() => {
    if (currentUser?.displayName) {
      setInterviewer(currentUser.displayName);
    } else if (currentUser?.email) {
      setInterviewer(currentUser.email);
    } else if (isGuest) {
      setInterviewer(guestUser?.name || "Consultor Invitado");
    }
  }, [currentUser, isGuest, guestUser]);
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
  const [integrationLevel, setIntegrationLevel] = useState(NIVELES_INTEGRACION[1]);

  // Section 3
  const [updateFrequency, setUpdateFrequency] = useState(FRECUENCIAS_ACTUALIZACION[1]);
  const [dataConfidence, setDataConfidence] = useState(NIVELES_CONFIANZA[1]);

  // Section 4
  const [reportTime, setReportTime] = useState(TIEMPOS_REPORTE[0]);
  const [currentBiTool, setCurrentBiTool] = useState(HERRAMIENTAS_VISUALIZACION[0]);
  const [decisionObstacles, setDecisionObstacles] = useState<string[]>([
    OBSTACULOS_DECISION[0]
  ]);

  // Section 5
  const [priorityProcess, setPriorityProcess] = useState(AREAS_PRIORITARIAS[0]);
  const [priorityOther, setPriorityOther] = useState("");
  const [expectedValue, setExpectedValue] = useState(VALORES_ESPERADOS[0]);

  // Consultant notes
  const [consultantNotes, setConsultantNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!intervieweeName.trim()) {
      setErrorMessage("Por favor, ingrese el nombre del responsable entrevistado.");
      return;
    }
    if (!company.trim()) {
      setErrorMessage("Por favor, ingrese el nombre de la empresa u organización.");
      return;
    }
    if (storageSources.length === 0) {
      setErrorMessage("Debe seleccionar al menos una fuente de almacenamiento de datos.");
      return;
    }

    setIsSubmitting(true);

    const payload: InterviewFormData = {
      entrevistador: interviewer.trim() || "Consultor BI",
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

    try {
      let savedResult: Interview;
      if (currentUser && !isGuest) {
        savedResult = await saveInterviewFirestore(payload, currentUser);
        saveInterview(payload);
      } else {
        // Modo Invitado o Local: guarda ÚNICAMENTE en localStorage
        savedResult = saveInterview(payload);
      }

      setLastSaved(savedResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Error saving interview:", err);
      const localSaved = saveInterview(payload);
      setLastSaved(localSaved);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (lastSaved) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-sky-50/70 border border-[#7EBCE6]/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#3B8AC4] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#1E252D] flex items-center gap-2 font-['Outfit']">
                <span>Entrevista registrada y evaluada con éxito</span>
                {currentUser && !isGuest ? (
                  <span className="text-[10px] font-semibold text-[#3B8AC4] bg-white border border-[#7EBCE6]/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> Sincronizada en Cloud
                  </span>
                ) : isGuest ? (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-amber-600" /> Almacenada en Local (Modo Invitado)
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-600 bg-white border border-[#E4ECF2] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-500" /> Almacenada en Local
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-0.5 font-['Inter']">
                Empresa <strong>{lastSaved.empresa}</strong> guardada {isGuest ? "en tu almacenamiento local de prueba." : "en la base de datos oficial."}
              </div>
            </div>
          </div>
          <button
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 px-3.5 py-2 btn-primary text-xs cursor-pointer"
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Brand Hero Banner using the user-provided aerobatic sky photo */}
      <BrandBanner
        title={APP_TITLE}
        subtitle={APP_SUBTITLE}
        categoryTag="FORMULARIO OFICIAL DE RELEVAMIENTO"
      />

      {/* Description & Duration card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-2">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {APP_DESCRIPTION}
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#3B8AC4] pt-1 font-['Outfit']">
          <Clock className="w-3.5 h-3.5 text-[#3B8AC4]" />
          <span>Tiempo estimado de respuesta: 5 a 7 minutos</span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-500 font-normal font-['Inter']">Relevamiento presencial o virtual</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xs font-['Inter']">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Relevamiento Auditor Metadata */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-['Outfit']">
            Datos del Relevamiento
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Consultor / Entrevistador a cargo:
              </label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="Ej: Diego Martínez"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all"
              />
            </div>
            <div className="text-xs text-slate-500 italic sm:pt-4">
              {currentUser && !isGuest ? (
                <span>Registrado como: <strong className="font-mono text-[#1E252D]">{currentUser.email}</strong> (Cloud)</span>
              ) : isGuest ? (
                <span className="text-amber-800 font-medium">Modo Invitado: Guardado exclusivo en tu navegador (<strong className="font-mono text-amber-900">localStorage</strong>)</span>
              ) : (
                <span>Registro asociado a la auditoría técnica de BI (Local).</span>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 1: DATOS GENERALES */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
                01. Datos Generales de la Organización
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Información básica de la empresa y del referente que responde.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">1 / 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Nombre y Apellido del responsable <span className="text-[#3B8AC4]">*</span>
              </label>
              <input
                type="text"
                value={intervieweeName}
                onChange={(e) => setIntervieweeName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Cargo / Rol en la organización
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ej: Gerente de Operaciones / Dueño"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Nombre de la empresa u organización <span className="text-[#3B8AC4]">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ej: Bodegas Andinas S.A."
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Cantidad aproximada de colaboradores
              </label>
              <select
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white cursor-pointer transition-all"
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
            <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
              Sector o actividad principal
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white cursor-pointer transition-all"
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
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#7EBCE6] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B8AC4] bg-sky-50/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 2: ALMACENAMIENTO Y FUENTES DE INFORMACIÓN */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
                02. Almacenamiento y Fuentes de Información
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Identificación de repositorios, sistemas transaccionales e integración actual.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">2 / 5</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']">
              ¿Dónde se registra y almacena hoy la mayor parte de la información operativa y comercial?
              <span className="block text-[11px] font-normal text-slate-500 font-['Inter']">(Seleccione todas las que apliquen)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {FUENTES_ALMACENAMIENTO.map((fuente) => {
                const checked = storageSources.includes(fuente);
                return (
                  <label
                    key={fuente}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      checked
                        ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                        : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleStorage(fuente)}
                      className="mt-0.5 rounded-sm border-[#E4ECF2] text-[#3B8AC4] focus:ring-[#7EBCE6]"
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
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#7EBCE6] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B8AC4] bg-sky-50/30"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-[#1E252D] mb-2 font-['Outfit']">
              ¿Cómo calificaría la integración entre sus distintas áreas (ventas, compras, administración, operaciones)?
            </label>
            <div className="space-y-2">
              {NIVELES_INTEGRACION.map((nivel) => {
                const checked = integrationLevel === nivel;
                return (
                  <label
                    key={nivel}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      checked
                        ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                        : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="integrationLevel"
                      checked={checked}
                      onChange={() => setIntegrationLevel(nivel)}
                      className="mt-0.5 text-[#3B8AC4] focus:ring-[#7EBCE6]"
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
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
                03. Recolección, Actualización y Calidad
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dinámica de refresco y confiabilidad percibida de la información.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">3 / 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-2 font-['Outfit']">
                ¿Con qué frecuencia se actualizan los datos clave del negocio?
              </label>
              <div className="space-y-2">
                {FRECUENCIAS_ACTUALIZACION.map((freq) => {
                  const checked = updateFrequency === freq;
                  return (
                    <label
                      key={freq}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                          : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="updateFrequency"
                        checked={checked}
                        onChange={() => setUpdateFrequency(freq)}
                        className="text-[#3B8AC4] focus:ring-[#7EBCE6]"
                      />
                      <span>{freq}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-2 font-['Outfit']">
                ¿Qué nivel de confianza tiene en la consistencia de sus datos actuales?
              </label>
              <div className="space-y-2">
                {NIVELES_CONFIANZA.map((conf) => {
                  const checked = dataConfidence === conf;
                  return (
                    <label
                      key={conf}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                          : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="dataConfidence"
                        checked={checked}
                        onChange={() => setDataConfidence(conf)}
                        className="mt-0.5 text-[#3B8AC4] focus:ring-[#7EBCE6]"
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
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
                04. Generación de Reportes y Toma de Decisiones
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tiempos de preparación, herramientas y principales fricciones directivas.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">4 / 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-2 font-['Outfit']">
                ¿Cuánto tiempo le toma a su equipo consolidar los reportes periódicos?
              </label>
              <div className="space-y-2">
                {TIEMPOS_REPORTE.map((t) => {
                  const checked = reportTime === t;
                  return (
                    <label
                      key={t}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                          : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportTime"
                        checked={checked}
                        onChange={() => setReportTime(t)}
                        className="mt-0.5 text-[#3B8AC4] focus:ring-[#7EBCE6]"
                      />
                      <span>{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-2 font-['Outfit']">
                ¿Qué herramienta utilizan actualmente para visualizar los indicadores?
              </label>
              <div className="space-y-2">
                {HERRAMIENTAS_VISUALIZACION.map((h) => {
                  const checked = currentBiTool === h;
                  return (
                    <label
                      key={h}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                          : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="currentBiTool"
                        checked={checked}
                        onChange={() => setCurrentBiTool(h)}
                        className="mt-0.5 text-[#3B8AC4] focus:ring-[#7EBCE6]"
                      />
                      <span>{h}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']">
              ¿Cuáles son los principales obstáculos que enfrenta la dirección al tomar decisiones?
              <span className="block text-[11px] font-normal text-slate-500 font-['Inter']">(Marque hasta 3)</span>
            </label>
            <div className="space-y-2 pt-1">
              {OBSTACULOS_DECISION.map((obs) => {
                const checked = decisionObstacles.includes(obs);
                return (
                  <label
                    key={obs}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      checked
                        ? "bg-[#F5F8FB] border-[#BFA898] text-[#1E252D] font-medium"
                        : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleObstacle(obs)}
                      className="mt-0.5 text-[#BFA898] focus:ring-[#BFA898]"
                    />
                    <span>{obs}</span>
                  </label>
                );
              })}
            </div>
            {decisionObstacles.length > 3 && (
              <div className="mt-2 p-2.5 bg-[#F5F8FB] border border-[#BFA898]/40 rounded-xl text-slate-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#BFA898] shrink-0" />
                <span>
                  Ha marcado {decisionObstacles.length} obstáculos. Le sugerimos priorizar los 3 más críticos para un diagnóstico más certero.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 5: PRIORIDADES Y EXPECTATIVAS */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
                05. Prioridades y Expectativas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Foco de negocio deseado y retorno esperado de la iniciativa de BI.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">5 / 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']">
                Área o proceso prioritario para implementar su primer tablero
              </label>
              <select
                value={priorityProcess}
                onChange={(e) => setPriorityProcess(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white cursor-pointer transition-all"
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
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#7EBCE6] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3B8AC4] bg-sky-50/30"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']">
                Valor principal esperado de la implementación de BI
              </label>
              <div className="space-y-2">
                {VALORES_ESPERADOS.map((val) => {
                  const checked = expectedValue === val;
                  return (
                    <label
                      key={val}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        checked
                          ? "bg-sky-50/60 border-[#7EBCE6] text-[#1E252D] font-medium"
                          : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="expectedValue"
                        checked={checked}
                        onChange={() => setExpectedValue(val)}
                        className="mt-0.5 text-[#3B8AC4] focus:ring-[#7EBCE6]"
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
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-2">
          <label className="block text-sm font-medium text-[#1E252D] font-['Outfit']">
            Notas y Observaciones del Consultor
          </label>
          <p className="text-xs text-slate-500 font-['Inter']">
            Comentarios cualitativos, tono del cliente, sistemas específicos mencionados o próximos pasos:
          </p>
          <textarea
            value={consultantNotes}
            onChange={(e) => setConsultantNotes(e.target.value)}
            rows={3}
            placeholder="Ej: El cliente planea cambiar de ERP el año próximo. Tienen urgencia en el módulo de ventas y cobranzas. Muy receptivo a tableros en la nube."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all font-['Inter']"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white btn-primary flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <PropellerLoader
                size={20}
                text={currentUser && !isGuest ? "Guardando en Firestore Cloud..." : "Guardando en almacenamiento local..."}
                className="text-white"
              />
            ) : (
              <>
                <span>
                  {isGuest
                    ? "Guardar Entrevista (Modo Invitado / Prueba Local)"
                    : "Finalizar Entrevista y Calcular Diagnóstico"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
