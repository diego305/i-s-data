import React, { useState } from "react";
import { Interview } from "../types";
import { updateInterview, deleteInterview, seedSampleData } from "../lib/storage";
import { ReportView } from "./ReportView";
import * as XLSX from "xlsx";
import {
  Search,
  Download,
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
  Award
} from "lucide-react";

interface AdminViewProps {
  interviews: Interview[];
  onRefresh: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ interviews, onRefresh }) => {
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

  // If viewing a single report
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

  // If empty state
  if (interviews.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-center py-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="text-4xl">📋</div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Todavía no hay entrevistas registradas
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Puede comenzar creando una nueva entrevista o sembrar datos de ejemplo para explorar las capacidades del sistema.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                seedSampleData();
                onRefresh();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs"
            >
              <Sprout className="w-4 h-4" />
              Cargar Entrevistas de Ejemplo (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate high-level metrics
  const total = interviews.length;
  const avgScore =
    Math.round((interviews.reduce((acc, cur) => acc + cur.score_global, 0) / total) * 10) / 10;

  // Sector mode
  const sectorCountMap: Record<string, number> = {};
  interviews.forEach((i) => {
    sectorCountMap[i.sector] = (sectorCountMap[i.sector] || 0) + 1;
  });
  const topSector =
    Object.entries(sectorCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Level mode
  const levelCountMap: Record<string, number> = {};
  interviews.forEach((i) => {
    levelCountMap[i.nivel_madurez] = (levelCountMap[i.nivel_madurez] || 0) + 1;
  });
  const topLevel =
    Object.entries(levelCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const topLevelShort = topLevel.split(":")[0];

  // Filtering
  const filteredInterviews = interviews.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      i.empresa.toLowerCase().includes(q) ||
      i.responsable_nombre.toLowerCase().includes(q) ||
      i.entrevistador.toLowerCase().includes(q);

    const matchLevel = filterLevel === "Todos" || i.nivel_madurez === filterLevel;
    const matchSector = filterSector === "Todos" || i.sector === filterSector;

    return matchSearch && matchLevel && matchSector;
  });

  // Unique options for filters
  const levelOptions = ["Todos", ...Array.from(new Set(interviews.map((i) => i.nivel_madurez)))];
  const sectorOptions = ["Todos", ...Array.from(new Set(interviews.map((i) => i.sector)))];

  // Export handlers
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
      "Integración Nivel": item.integracion_nivel,
      "Frecuencia Actualización": item.frecuencia_actualizacion,
      "Confianza Datos": item.confianza_datos,
      "Tiempo Reporte": item.tiempo_reporte,
      "Herramienta BI Actual": item.herramienta_visualizacion,
      "Proceso Prioritario": item.proceso_prioritario,
      "Valor Esperado": item.valor_esperado,
      "Notas Consultor": item.observaciones_consultor,
      Estado: item.estado,
      Entrevistador: item.entrevistador
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
      "Estado"
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
      `"${i.estado}"`
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

  const handleSaveEdit = () => {
    if (!editingInterview) return;
    updateInterview(editingInterview.id, {
      observaciones_consultor: editNotes,
      estado: editStatus
    });
    setEditingInterview(null);
    onRefresh();
  };

  const handleDeleteConfirm = () => {
    if (deletingId === null) return;
    deleteInterview(deletingId);
    setDeletingId(null);
    onRefresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          📋 Panel de Administración de Entrevistas
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Gestione todos los relevamientos realizados, exporte la base consolidada y consulte los informes de cada cliente.
        </p>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
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
            <div className="text-2xl font-extrabold text-slate-900">{avgScore} <span className="text-xs text-slate-500">/ 100</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sector Principal</div>
            <div className="text-sm font-extrabold text-slate-900 truncate" title={topSector}>
              {topSector}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            📊
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nivel Predominante</div>
            <div className="text-sm font-extrabold text-emerald-800 truncate" title={topLevel}>
              {topLevelShort}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Empresa, Responsable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
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
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
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
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-semibold">
            Registros encontrados: <span className="text-slate-900 font-bold">{filteredInterviews.length}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Descargar Excel
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              Descargar CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-300 rounded-lg hover:bg-sky-100 transition-colors shadow-2xs"
            >
              <FileCode className="w-3.5 h-3.5 text-sky-700" />
              Descargar JSON
            </button>
            <button
              onClick={() => {
                seedSampleData();
                onRefresh();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              title="Agrega 3 entrevistas representativas a la base"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              Sembrar Datos Demo
            </button>
          </div>
        </div>
      </div>

      {/* List of Interviews */}
      <div className="space-y-3">
        {filteredInterviews.map((item) => {
          const isL1 = item.nivel_madurez.includes("Nivel 1");
          const isL2 = item.nivel_madurez.includes("Nivel 2");
          const dotColor = isL1 ? "#ef4444" : isL2 ? "#f59e0b" : "#10b981";
          const badgeClass = isL1
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : isL2
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: dotColor }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {item.empresa}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{item.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {item.estado}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{item.responsable_nombre} {item.responsable_rol && `(${item.responsable_rol})`}</span>
                      <span>•</span>
                      <span>{item.sector}</span>
                      <span>•</span>
                      <span>📅 {item.created_at.substring(0, 16)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right self-start sm:self-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    Score: {item.score_global} pts
                  </span>
                  <span
                    className="text-xs font-extrabold"
                    style={{ color: dotColor }}
                  >
                    {item.nivel_madurez}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedIdForReport(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Informe
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  Editar Notas & Estado
                </button>

                <button
                  onClick={() => setDeletingId(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors ml-auto cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Editar Registro: {editingInterview.empresa} (#{editingInterview.id})
              </h3>
              <button
                onClick={() => setEditingInterview(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estado de la entrevista:
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Completada">Completada</option>
                <option value="En Seguimiento">En Seguimiento</option>
                <option value="Archivada">Archivada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notas y observaciones del consultor:
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                placeholder="Observaciones, acuerdos comerciales, próximas fechas..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingInterview(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl">
                ⚠️
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                ¿Eliminar esta entrevista?
              </h3>
              <p className="text-xs text-slate-500">
                Esta acción no se puede deshacer. Se eliminará el relevamiento #{deletingId} de la base local.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
