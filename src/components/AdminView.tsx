import React, { useState } from "react";
import { Interview } from "../types";
import { updateInterview, deleteInterview, seedSampleData } from "../lib/storage";
import {
  updateInterviewFirestore,
  deleteInterviewFirestore,
  seedSampleDataFirestore
} from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { ReportView } from "./ReportView";
import * as XLSX from "xlsx";
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  FileSpreadsheet,
  FileText,
  FileCode,
  Sprout,
  X,
  Check,
  Building,
  TrendingUp,
  Award,
  Cloud,
  User as UserIcon,
  ShieldCheck,
  HardDrive
} from "lucide-react";
import { OAuthDiagnosticsModal } from "./OAuthDiagnosticsModal";

interface AdminViewProps {
  interviews: Interview[];
  onRefresh: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ interviews, onRefresh }) => {
  const { currentUser, isGuest, guestUser } = useAuth();
  const [selectedIdForReport, setSelectedIdForReport] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("Todos");
  const [filterSector, setFilterSector] = useState("Todos");

  // Edit modal state
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<"Completada" | "En Seguimiento" | "Archivada">("Completada");

  // Delete confirm modal state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (selectedIdForReport !== null) {
    const item = interviews.find((i) => i.id === selectedIdForReport);
    if (item) {
      return (
        <ReportView
          interview={item}
          onBack={() => setSelectedIdForReport(null)}
          showBackButton={true}
        />
      );
    }
  }

  if (interviews.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-center py-12 font-['Inter']">
        <div className="bg-white p-8 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <div className="w-12 h-12 bg-sky-50 text-[#3B8AC4] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold font-['Outfit']">
            📋
          </div>
          <h2 className="text-lg font-light text-[#1E252D] font-['Outfit'] tracking-wide">
            Todavía no hay entrevistas registradas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Comience creando una nueva entrevista o cargue los datos de muestra para explorar las capacidades del sistema.
          </p>
          <div className="pt-2">
            <button
              onClick={async () => {
                seedSampleData();
                if (currentUser && !isGuest) {
                  await seedSampleDataFirestore();
                }
                onRefresh();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary text-xs cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              Cargar Entrevistas de Ejemplo
            </button>
            <button
              onClick={() => setShowDiagnostics(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#3B8AC4] border border-[#7EBCE6]/40 rounded-xl text-xs font-semibold cursor-pointer hover:bg-sky-50/50 transition-colors font-['Outfit']"
            >
              <ShieldCheck className="w-4 h-4 text-[#3B8AC4]" />
              Diagnóstico OAuth / Vercel
            </button>
          </div>
          <OAuthDiagnosticsModal isOpen={showDiagnostics} onClose={() => setShowDiagnostics(false)} />
        </div>
      </div>
    );
  }

  const total = interviews.length;
  const avgScore =
    Math.round((interviews.reduce((acc, cur) => acc + cur.score_global, 0) / total) * 10) / 10;

  const sectorCountMap: Record<string, number> = {};
  interviews.forEach((i) => {
    sectorCountMap[i.sector] = (sectorCountMap[i.sector] || 0) + 1;
  });
  const topSector =
    Object.entries(sectorCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const levelCountMap: Record<string, number> = {};
  interviews.forEach((i) => {
    levelCountMap[i.nivel_madurez] = (levelCountMap[i.nivel_madurez] || 0) + 1;
  });
  const topLevel =
    Object.entries(levelCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const topLevelShort = topLevel.split(":")[0];

  const filteredInterviews = interviews.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      i.empresa.toLowerCase().includes(q) ||
      i.responsable_nombre.toLowerCase().includes(q) ||
      i.entrevistador.toLowerCase().includes(q) ||
      (i.created_by_email && i.created_by_email.toLowerCase().includes(q));

    const matchLevel = filterLevel === "Todos" || i.nivel_madurez === filterLevel;
    const matchSector = filterSector === "Todos" || i.sector === filterSector;

    return matchSearch && matchLevel && matchSector;
  });

  const levelOptions = ["Todos", ...Array.from(new Set(interviews.map((i) => i.nivel_madurez)))];
  const sectorOptions = ["Todos", ...Array.from(new Set(interviews.map((i) => i.sector)))];

  const handleExportExcel = () => {
    const exportData = filteredInterviews.map((item) => ({
      ID: item.id,
      Fecha: item.created_at,
      Empresa: item.empresa,
      Responsable: item.responsable_nombre,
      Rol: item.responsable_rol,
      Sector: item.sector,
      Colaboradores: item.colaboradores,
      "Score Global (0-100)": item.score_global,
      "Nivel Madurez": item.nivel_madurez,
      "Almacenamiento (pts)": item.dimensiones["Almacenamiento y Fuentes"],
      "Integración (pts)": item.dimensiones["Integración entre Áreas"],
      "Frecuencia (pts)": item.dimensiones["Frecuencia de Actualización"],
      "Calidad (pts)": item.dimensiones["Calidad y Consistencia"],
      "Eficiencia (pts)": item.dimensiones["Eficiencia de Reportes"],
      "Proceso Prioritario": item.proceso_prioritario,
      "Valor Esperado": item.valor_esperado,
      "Notas Consultor": item.observaciones_consultor,
      Estado: item.estado,
      "Consultor Responsable": item.created_by_email || item.entrevistador
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entrevistas_BI");
    XLSX.writeFile(workbook, "diagnostico_entrevistas_bi.xlsx");
  };

  const handleExportCSV = () => {
    const header = [
      "ID",
      "Fecha",
      "Empresa",
      "Responsable",
      "Rol",
      "Sector",
      "Score_Global",
      "Nivel_Madurez",
      "Proceso_Prioritario",
      "Valor_Esperado",
      "Estado",
      "Registrado_Por"
    ];
    const rows = filteredInterviews.map((i) => [
      i.id,
      `"${i.created_at}"`,
      `"${i.empresa.replace(/"/g, '""')}"`,
      `"${i.responsable_nombre.replace(/"/g, '""')}"`,
      `"${i.responsable_rol.replace(/"/g, '""')}"`,
      `"${i.sector.replace(/"/g, '""')}"`,
      i.score_global,
      `"${i.nivel_madurez.replace(/"/g, '""')}"`,
      `"${i.proceso_prioritario.replace(/"/g, '""')}"`,
      `"${i.valor_esperado.replace(/"/g, '""')}"`,
      `"${i.estado}"`,
      `"${i.created_by_email || ''}"`
    ]);

    const csvContent = "\uFEFF" + [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagnostico_entrevistas_bi.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredInterviews, null, 2);
    const blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagnostico_entrevistas_bi.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenEdit = (i: Interview) => {
    setEditingInterview(i);
    setEditNotes(i.observaciones_consultor || "");
    setEditStatus(i.estado || "Completada");
  };

  const handleSaveEdit = async () => {
    if (!editingInterview) return;
    const updates = {
      observaciones_consultor: editNotes,
      estado: editStatus
    };
    updateInterview(editingInterview.id, updates);
    if (currentUser && !isGuest) {
      await updateInterviewFirestore(editingInterview.id, updates);
    }
    setEditingInterview(null);
    onRefresh();
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    deleteInterview(deletingId);
    if (currentUser && !isGuest) {
      await deleteInterviewFirestore(deletingId);
    }
    setDeletingId(null);
    onRefresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-light text-[#1E252D] tracking-wide flex items-center gap-2 font-['Outfit']">
            <span>📋</span> Panel de Administración de Entrevistas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestión consolidada de clientes, auditorías y sincronización multiusuario.
          </p>
        </div>
        {currentUser && !isGuest ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#3B8AC4] border border-[#7EBCE6]/40 rounded-xl text-xs font-semibold self-start sm:self-auto font-['Outfit']">
            <Cloud className="w-3.5 h-3.5 text-[#3B8AC4]" />
            <span>Sincronización Cloud Activa</span>
          </div>
        ) : isGuest ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold self-start sm:self-auto font-['Outfit']">
            <HardDrive className="w-3.5 h-3.5 text-amber-600" />
            <span>Almacenamiento Local (Modo Invitado)</span>
          </div>
        ) : null}
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#3B8AC4] flex items-center justify-center font-bold shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Total Relevamientos</div>
            <div className="text-xl sm:text-2xl font-light text-[#1E252D] font-mono tabular-nums">{total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F5] text-[#BFA898] flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Score Promedio</div>
            <div className="text-xl sm:text-2xl font-light text-[#1E252D] font-mono tabular-nums">
              {avgScore} <span className="text-xs font-sans text-slate-400 font-normal">/ 100</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#3B8AC4] flex items-center justify-center font-bold shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Sector Principal</div>
            <div className="text-xs sm:text-sm font-semibold text-[#1E252D] truncate font-['Outfit']" title={topSector}>
              {topSector}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 font-['Outfit']">
            ✦
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-['Outfit']">Nivel Predominante</div>
            <div className="text-xs sm:text-sm font-semibold text-[#1E252D] truncate font-['Outfit']" title={topLevel}>
              {topLevelShort}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Empresa, Responsable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] transition-all"
            />
          </div>

          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white cursor-pointer transition-all"
            >
              {levelOptions.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === "Todos" ? "Filtrar por Nivel: Todos" : lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white cursor-pointer transition-all"
            >
              {sectorOptions.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === "Todos" ? "Filtrar por Sector: Todos" : sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action / Export Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E4ECF2]">
          <div className="text-xs text-slate-500">
            Registros encontrados: <span className="text-[#1E252D] font-semibold font-mono tabular-nums">{filteredInterviews.length}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors shadow-2xs cursor-pointer font-['Outfit']"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Descargar Excel
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors shadow-2xs cursor-pointer font-['Outfit']"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Descargar CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors shadow-2xs cursor-pointer font-['Outfit']"
            >
              <FileCode className="w-3.5 h-3.5 text-[#3B8AC4]" />
              Descargar JSON
            </button>
            <button
              onClick={async () => {
                seedSampleData();
                if (currentUser && !isGuest) {
                  await seedSampleDataFirestore();
                }
                onRefresh();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors shadow-2xs cursor-pointer font-['Outfit']"
              title="Agrega 3 entrevistas representativas a la base"
            >
              <Sprout className="w-3.5 h-3.5 text-[#3B8AC4]" />
              Sembrar Datos Demo
            </button>
            <button
              onClick={() => setShowDiagnostics(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3B8AC4] bg-sky-50/60 border border-[#7EBCE6]/40 rounded-xl hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer font-['Outfit']"
              title="Verificar configuración de OAuth, dominios autorizados y variables de Vercel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#3B8AC4]" />
              Diagnóstico OAuth / Vercel
            </button>
          </div>
        </div>
      </div>

      {/* List of Interviews */}
      <div className="space-y-3">
        {filteredInterviews.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white border border-[#E4ECF2] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#7EBCE6] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-medium text-[#1E252D] font-['Outfit']">
                      {item.empresa}
                    </h3>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      #{item.id}
                    </span>
                    <span className="text-[10px] font-semibold text-[#1E252D] bg-[#F5F8FB] border border-[#E4ECF2] px-2 py-0.5 rounded-md font-['Outfit']">
                      {item.estado}
                    </span>
                    {item.created_by_email && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-sky-50/60 border border-[#7EBCE6]/30 px-2 py-0.5 rounded-md font-mono">
                        <UserIcon className="w-3 h-3 text-slate-400" />
                        {item.created_by_email}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>{item.responsable_nombre} {item.responsable_rol && `(${item.responsable_rol})`}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{item.sector}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono tabular-nums">📅 {item.created_at.substring(0, 16)}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right self-start sm:self-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                  <span className="text-xs font-semibold text-[#1E252D] font-mono tabular-nums">
                    {item.score_global} / 100 pts
                  </span>
                  <span className="text-xs font-medium text-[#3B8AC4] font-['Outfit']">
                    {item.nivel_madurez}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E4ECF2]">
                <button
                  onClick={() => setSelectedIdForReport(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3B8AC4] bg-sky-50/70 hover:bg-sky-100/70 border border-[#7EBCE6]/40 rounded-xl transition-colors cursor-pointer font-['Outfit']"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Informe
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl transition-colors cursor-pointer font-['Outfit']"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  Editar Notas & Estado
                </button>

                <button
                  onClick={() => setDeletingId(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors ml-auto cursor-pointer font-['Outfit']"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E252D]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E4ECF2]">
            <div className="flex items-center justify-between border-b border-[#E4ECF2] pb-3">
              <h3 className="text-sm font-light text-[#1E252D] font-['Outfit'] tracking-wide">
                Editar Registro: {editingInterview.empresa} (#{editingInterview.id})
              </h3>
              <button
                onClick={() => setEditingInterview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Estado de la entrevista:
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white cursor-pointer transition-all"
              >
                <option value="Completada">Completada</option>
                <option value="En Seguimiento">En Seguimiento</option>
                <option value="Archivada">Archivada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                Notas y observaciones del consultor:
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all font-['Inter']"
                placeholder="Observaciones, acuerdos comerciales, próximas fechas..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E4ECF2]">
              <button
                onClick={() => setEditingInterview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors cursor-pointer font-['Outfit']"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white btn-primary cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E252D]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-[#E4ECF2]">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-lg">
                ⚠️
              </div>
              <h3 className="text-sm font-light text-[#1E252D] font-['Outfit'] tracking-wide">
                ¿Eliminar esta entrevista?
              </h3>
              <p className="text-xs text-slate-500 font-['Inter']">
                Se eliminará el relevamiento #{deletingId} de la base de datos.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors cursor-pointer font-['Outfit']"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs cursor-pointer font-['Outfit']"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OAuth & Vercel Diagnostics Modal */}
      <OAuthDiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />
    </div>
  );
};
