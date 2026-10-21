export interface DimensionScores {
  "Almacenamiento y Fuentes": number;
  "Integración entre Áreas": number;
  "Frecuencia de Actualización": number;
  "Calidad y Consistencia": number;
  "Eficiencia de Reportes": number;
}

export interface MatrizNivelInfo {
  badge_color: string;
  bg_color: string;
  criterio: string;
  solucion: string;
  prioridades_clave: string[];
}

export interface Interview {
  id: number;
  created_at: string;
  updated_at: string;
  entrevistador: string;
  responsable_nombre: string;
  responsable_rol: string;
  empresa: string;
  sector: string;
  sector_otro?: string;
  colaboradores: string;
  almacenamiento_fuentes: string[];
  almacenamiento_otro?: string;
  integracion_nivel: string;
  frecuencia_actualizacion: string;
  confianza_datos: string;
  tiempo_reporte: string;
  herramienta_visualizacion: string;
  obstaculos_decision: string[];
  proceso_prioritario: string;
  proceso_prioritario_otro?: string;
  valor_esperado: string;
  observaciones_consultor: string;
  score_global: number;
  nivel_madurez: string;
  dimensiones: DimensionScores;
  estado: "Completada" | "En Seguimiento" | "Archivada";
}

export type InterviewFormData = Omit<Interview, "id" | "created_at" | "updated_at" | "score_global" | "nivel_madurez" | "dimensiones">;

export interface DiagnosticResult {
  score_global: number;
  nivel: string;
  criterio: string;
  solucion_recomendada: string;
  badge_color: string;
  bg_color: string;
  prioridades_clave: string[];
  dimensiones: DimensionScores;
}
