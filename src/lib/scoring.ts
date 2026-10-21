import { MATRIZ_EVALUACION } from "../config/constants";
import { DiagnosticResult, DimensionScores } from "../types";

export function calcularPuntajeAlmacenamiento(fuentes: string[]): number {
  if (!fuentes || fuentes.length === 0) {
    return 20.0;
  }

  const tienePapel = fuentes.some((f) => f.toLowerCase().includes("papel"));
  const tienePlanillas = fuentes.some((f) => f.toLowerCase().includes("planillas"));
  const tieneErp = fuentes.some(
    (f) => f.toLowerCase().includes("erp") || f.toLowerCase().includes("tango")
  );
  const tieneFacturacion = fuentes.some((f) =>
    f.toLowerCase().includes("facturación") || f.toLowerCase().includes("facturacion")
  );
  const tieneCrm = fuentes.some((f) => f.toLowerCase().includes("crm"));

  let score = 0.0;

  if (tieneErp && tieneCrm && !tienePapel) {
    score = 95.0;
  } else if (tieneErp && (tieneFacturacion || tienePlanillas)) {
    score = 75.0;
  } else if (tieneErp) {
    score = 70.0;
  } else if (tieneFacturacion && tienePlanillas && !tienePapel) {
    score = 55.0;
  } else if (tienePlanillas && !tienePapel) {
    score = 40.0;
  } else if (tienePapel && !tieneErp) {
    score = 20.0;
  } else {
    score = 35.0;
  }

  return Math.min(100.0, Math.max(10.0, score));
}

export function calcularPuntajeIntegracion(integracion: string): number {
  if (!integracion) {
    return 25.0;
  }
  if (integracion.startsWith("1")) {
    return 25.0;
  } else if (integracion.startsWith("2")) {
    return 50.0;
  } else if (integracion.startsWith("3")) {
    return 75.0;
  } else if (integracion.startsWith("4")) {
    return 100.0;
  }
  return 50.0;
}

export function calcularPuntajeFrecuencia(frecuencia: string): number {
  if (!frecuencia) {
    return 25.0;
  }
  if (frecuencia.includes("Tiempo real")) {
    return 100.0;
  } else if (frecuencia.includes("Semanal")) {
    return 75.0;
  } else if (frecuencia.includes("Mensual")) {
    return 50.0;
  } else if (frecuencia.includes("Eventual")) {
    return 25.0;
  }
  return 40.0;
}

export function calcularPuntajeCalidad(calidad: string): number {
  if (!calidad) {
    return 25.0;
  }
  if (calidad.includes("Alto")) {
    return 100.0;
  } else if (calidad.includes("Medio")) {
    return 65.0;
  } else if (calidad.includes("Bajo")) {
    return 25.0;
  }
  return 40.0;
}

export function calcularPuntajeEficiencia(
  tiempoReporte: string,
  herramienta: string
): number {
  // Score por tiempo
  let sTiempo = 30.0;
  if (tiempoReporte.includes("minutos de forma automática")) {
    sTiempo = 100.0;
  } else if (tiempoReporte.includes("Medio día")) {
    sTiempo = 65.0;
  } else if (tiempoReporte.includes("Horas o días")) {
    sTiempo = 35.0;
  } else if (tiempoReporte.includes("No contamos")) {
    sTiempo = 20.0;
  }

  // Score por herramienta
  let sHerr = 30.0;
  if (herramienta.includes("Herramientas de BI")) {
    sHerr = 100.0;
  } else if (herramienta.includes("Informes nativos del ERP")) {
    sHerr = 75.0;
  } else if (herramienta.includes("Planillas de Excel")) {
    sHerr = 50.0;
  } else if (herramienta.includes("Reportes estáticos")) {
    sHerr = 35.0;
  } else if (herramienta.includes("Ninguna")) {
    sHerr = 15.0;
  }

  return Math.round(((sTiempo * 0.5) + (sHerr * 0.5)) * 10) / 10;
}

export function evaluarDiagnostico(respuestas: {
  storage_sources?: string[];
  integration_level?: string;
  update_frequency?: string;
  data_confidence?: string;
  report_time?: string;
  current_bi_tool?: string;
}): DiagnosticResult {
  const pAlmacenamiento = calcularPuntajeAlmacenamiento(respuestas.storage_sources || []);
  const pIntegracion = calcularPuntajeIntegracion(respuestas.integration_level || "");
  const pFrecuencia = calcularPuntajeFrecuencia(respuestas.update_frequency || "");
  const pCalidad = calcularPuntajeCalidad(respuestas.data_confidence || "");
  const pEficiencia = calcularPuntajeEficiencia(
    respuestas.report_time || "",
    respuestas.current_bi_tool || ""
  );

  // Ponderaciones estratégicas:
  // Almacenamiento: 20%, Integración: 25%, Frecuencia: 15%, Calidad: 20%, Eficiencia: 20%
  const scoreGlobal = Math.round(
    ((pAlmacenamiento * 0.20) +
     (pIntegracion * 0.25) +
     (pFrecuencia * 0.15) +
     (pCalidad * 0.20) +
     (pEficiencia * 0.20)) * 10
  ) / 10;

  // Clasificación en base a la Matriz Interna
  let nivel: string;
  if (scoreGlobal < 45.0) {
    nivel = "Nivel 1: Inicial / Disperso";
  } else if (scoreGlobal < 75.0) {
    nivel = "Nivel 2: Operativo / Estructurado";
  } else {
    nivel = "Nivel 3: Avanzado / Preparado";
  }

  const infoMatriz = MATRIZ_EVALUACION[nivel] || MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];

  const dimensiones: DimensionScores = {
    "Almacenamiento y Fuentes": pAlmacenamiento,
    "Integración entre Áreas": pIntegracion,
    "Frecuencia de Actualización": pFrecuencia,
    "Calidad y Consistencia": pCalidad,
    "Eficiencia de Reportes": pEficiencia
  };

  return {
    score_global: scoreGlobal,
    nivel,
    criterio: infoMatriz.criterio,
    solucion_recomendada: infoMatriz.solucion,
    badge_color: infoMatriz.badge_color,
    bg_color: infoMatriz.bg_color,
    prioridades_clave: infoMatriz.prioridades_clave,
    dimensiones
  };
}
