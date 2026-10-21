import { Interview, InterviewFormData } from "../types";
import { evaluarDiagnostico } from "./scoring";

const STORAGE_KEY = "is_data_solutions_entrevistas_v1";

export const SAMPLE_INTERVIEWS_SEED: Omit<InterviewFormData, "estado">[] = [
  {
    entrevistador: "Consultor Senior BI",
    responsable_nombre: "Martín Rodríguez",
    responsable_rol: "Gerente General",
    empresa: "Finca Los Olivos S.A.",
    sector: "Agroindustria / Olivícola",
    sector_otro: "",
    colaboradores: "11 a 50",
    almacenamiento_fuentes: [
      "Planillas de cálculo (Excel, Google Sheets) en carpetas locales o compartidas",
      "Documentos en papel / cuadernos de registro diario"
    ],
    almacenamiento_otro: "",
    integracion_nivel: "1 - Muy fragmentada: Cada área maneja sus propios archivos y no coinciden entre sí.",
    frecuencia_actualizacion: "Eventual / solo cuando se necesita un informe puntual",
    confianza_datos: "Bajo: Solemos encontrar duplicados, errores de carga o números que no cierran.",
    tiempo_reporte: "Horas o días de trabajo manual recopilando y cruzando planillas.",
    herramienta_visualizacion: "Planillas de Excel / tablas dinámicas",
    obstaculos_decision: [
      "Demora en obtener números actualizados.",
      "Discrepancias entre los datos de distintos departamentos.",
      "Dependencia excesiva de una persona clave para armar los reportes."
    ],
    proceso_prioritario: "Ventas, cobranzas y margen comercial",
    proceso_prioritario_otro: "",
    valor_esperado: "Ahorro de tiempo operativo en el armado de informes.",
    observaciones_consultor: "Gran interés en centralizar costos de cosecha y agilizar cobranzas. Fuertemente dependientes de cuadernos en el campo."
  },
  {
    entrevistador: "Consultor Senior BI",
    responsable_nombre: "Valeria Gómez",
    responsable_rol: "Directora de Operaciones",
    empresa: "Distribuidora Cuyo Express",
    sector: "Comercio mayorista / minorista",
    sector_otro: "",
    colaboradores: "51 a 200",
    almacenamiento_fuentes: [
      "Planillas de cálculo (Excel, Google Sheets) en carpetas locales o compartidas",
      "Software de gestión o ERP (Tango, Bejerman, SAP, Odoo, sistema a medida, etc.)",
      "Sistema de facturación electrónica o comprobantes fiscales"
    ],
    almacenamiento_otro: "",
    integracion_nivel: "2 - Básica: Hay sistemas distintos y cruzamos datos manualmente a fin de mes.",
    frecuencia_actualizacion: "Semanal",
    confianza_datos: "Medio: Los datos son confiables pero requieren revisión y limpieza manual previa.",
    tiempo_reporte: "Medio día, con plantillas prearmadas pero manuales.",
    herramienta_visualizacion: "Informes nativos del ERP / software contable",
    obstaculos_decision: [
      "Demora en obtener números actualizados.",
      "Dificultad para visualizar tendencias o anomalías a tiempo."
    ],
    proceso_prioritario: "Control de stock, inventario y compras",
    proceso_prioritario_otro: "",
    valor_esperado: "Visibilidad ejecutiva en tiempo real accesible desde el celular o la web.",
    observaciones_consultor: "Tienen ERP Tango pero el control de stock real se termina conciliando en Excel por quiebres de inventario."
  },
  {
    entrevistador: "Consultor Senior BI",
    responsable_nombre: "Carlos Méndez",
    responsable_rol: "CFO / Director de Finanzas",
    empresa: "Andes Logística Global",
    sector: "Logística / Distribución",
    sector_otro: "",
    colaboradores: "Más de 200",
    almacenamiento_fuentes: [
      "Software de gestión o ERP (Tango, Bejerman, SAP, Odoo, sistema a medida, etc.)",
      "Sistema de facturación electrónica o comprobantes fiscales",
      "CRM o plataformas de ventas / e-commerce"
    ],
    almacenamiento_otro: "",
    integracion_nivel: "3 - Parcialmente integrada: Usamos un sistema central pero con muchas planillas auxiliares.",
    frecuencia_actualizacion: "Tiempo real / diaria",
    confianza_datos: "Alto: Los registros son consistentes, estandarizados y auditados periódicamente.",
    tiempo_reporte: "Se obtienen en minutos de forma automática.",
    herramienta_visualizacion: "Herramientas de BI (Power BI, Looker Studio, Tableau)",
    obstaculos_decision: [
      "Falta de claridad o acuerdo sobre cuáles son los KPIs prioritarios.",
      "Dificultad para visualizar tendencias o anomalías a tiempo."
    ],
    proceso_prioritario: "Flujo de caja (cash flow) y costos",
    proceso_prioritario_otro: "",
    valor_esperado: "Anticipar desvíos antes del cierre mensual.",
    observaciones_consultor: "Cuentan con Power BI con métricas básicas de ventas pero necesitan modelar el flujo de caja operativo y predictibilidad de flota."
  }
];

function buildInterviewFromRaw(
  id: number,
  raw: Omit<InterviewFormData, "estado">,
  createdAt?: string,
  estado: "Completada" | "En Seguimiento" | "Archivada" = "Completada"
): Interview {
  const diag = evaluarDiagnostico({
    storage_sources: raw.almacenamiento_fuentes,
    integration_level: raw.integracion_nivel,
    update_frequency: raw.frecuencia_actualizacion,
    data_confidence: raw.confianza_datos,
    report_time: raw.tiempo_reporte,
    current_bi_tool: raw.herramienta_visualizacion
  });

  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  return {
    ...raw,
    id,
    created_at: createdAt || now,
    updated_at: now,
    score_global: diag.score_global,
    nivel_madurez: diag.nivel,
    dimensiones: diag.dimensiones,
    estado
  };
}

export function initStorage(): Interview[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial: Interview[] = SAMPLE_INTERVIEWS_SEED.map((seed, idx) =>
        buildInterviewFromRaw(idx + 1, seed, `2026-10-${10 + idx} 10:30:00`)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array, re-seed
    const initial: Interview[] = SAMPLE_INTERVIEWS_SEED.map((seed, idx) =>
      buildInterviewFromRaw(idx + 1, seed, `2026-10-${10 + idx} 10:30:00`)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return SAMPLE_INTERVIEWS_SEED.map((seed, idx) =>
      buildInterviewFromRaw(idx + 1, seed, `2026-10-${10 + idx} 10:30:00`)
    );
  }
}

export function getInterviews(): Interview[] {
  return initStorage();
}

export function getInterview(id: number): Interview | null {
  const list = getInterviews();
  return list.find((item) => item.id === id) || null;
}

export function saveInterview(formData: InterviewFormData): Interview {
  const list = getInterviews();
  const nextId = list.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
  const newInterview = buildInterviewFromRaw(nextId, formData, undefined, formData.estado || "Completada");
  const updated = [newInterview, ...list];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage_updated"));
  } catch (err) {
    console.error("Error saving interview to localStorage", err);
  }
  return newInterview;
}

export function updateInterview(id: number, updates: Partial<Interview>): boolean {
  const list = getInterviews();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return false;

  const current = list[index];
  const merged: Interview = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString().replace("T", " ").substring(0, 19)
  };

  // If any scoring dimension changed, recalculate
  if (
    updates.almacenamiento_fuentes ||
    updates.integracion_nivel ||
    updates.frecuencia_actualizacion ||
    updates.confianza_datos ||
    updates.tiempo_reporte ||
    updates.herramienta_visualizacion
  ) {
    const diag = evaluarDiagnostico({
      storage_sources: merged.almacenamiento_fuentes,
      integration_level: merged.integracion_nivel,
      update_frequency: merged.frecuencia_actualizacion,
      data_confidence: merged.confianza_datos,
      report_time: merged.tiempo_reporte,
      current_bi_tool: merged.herramienta_visualizacion
    });
    merged.score_global = diag.score_global;
    merged.nivel_madurez = diag.nivel;
    merged.dimensiones = diag.dimensiones;
  }

  list[index] = merged;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage_updated"));
  } catch (err) {
    console.error("Error updating interview in localStorage", err);
  }
  return true;
}

export function deleteInterview(id: number): boolean {
  const list = getInterviews();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length === list.length) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("storage_updated"));
  } catch (err) {
    console.error("Error deleting interview in localStorage", err);
  }
  return true;
}

export function seedSampleData(): void {
  const current = getInterviews();
  const maxId = current.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const newSamples = SAMPLE_INTERVIEWS_SEED.map((seed, idx) =>
    buildInterviewFromRaw(
      maxId + idx + 1,
      { ...seed, empresa: `${seed.empresa} (Muestra)` },
      new Date().toISOString().replace("T", " ").substring(0, 19)
    )
  );
  const updated = [...newSamples, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage_updated"));
  } catch (err) {
    console.error("Error seeding sample data", err);
  }
}

export function resetDatabase(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    initStorage();
    window.dispatchEvent(new Event("storage_updated"));
  } catch (err) {
    console.error("Error resetting database", err);
  }
}
