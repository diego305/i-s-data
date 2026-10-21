import { MatrizNivelInfo } from "../types";

export const APP_TITLE = "Diagnóstico de Madurez de Datos & BI";
export const APP_SUBTITLE = "Evaluación Inicial para Business Intelligence";
export const APP_DESCRIPTION =
  "Herramienta integral para relevar el estado actual del flujo de información en la empresa, identificar cuellos de botella y dimensionar la implementación del primer sistema de tableros de control y analítica.";

// Opciones Sección 1: Datos Generales
export const SECTORES = [
  "Agroindustria / Olivícola",
  "Comercio mayorista / minorista",
  "Servicios profesionales / Consultoría",
  "Logística / Distribución",
  "Industria / Manufactura",
  "Otro"
];

export const RANGOS_COLABORADORES = [
  "1 a 10",
  "11 a 50",
  "51 a 200",
  "Más de 200"
];

// Opciones Sección 2: Almacenamiento y Fuentes
export const FUENTES_ALMACENAMIENTO = [
  "Planillas de cálculo (Excel, Google Sheets) en carpetas locales o compartidas",
  "Software de gestión o ERP (Tango, Bejerman, SAP, Odoo, sistema a medida, etc.)",
  "Sistema de facturación electrónica o comprobantes fiscales",
  "CRM o plataformas de ventas / e-commerce",
  "Documentos en papel / cuadernos de registro diario",
  "Otro"
];

export const NIVELES_INTEGRACION = [
  "1 - Muy fragmentada: Cada área maneja sus propios archivos y no coinciden entre sí.",
  "2 - Básica: Hay sistemas distintos y cruzamos datos manualmente a fin de mes.",
  "3 - Parcialmente integrada: Usamos un sistema central pero con muchas planillas auxiliares.",
  "4 - Integrada: Toda la información clave convive en una única base de datos."
];

// Opciones Sección 3: Recolección, Actualización y Calidad
export const FRECUENCIAS_ACTUALIZACION = [
  "Tiempo real / diaria",
  "Semanal",
  "Mensual (al cierre administrativo)",
  "Eventual / solo cuando se necesita un informe puntual"
];

export const NIVELES_CONFIANZA = [
  "Bajo: Solemos encontrar duplicados, errores de carga o números que no cierran.",
  "Medio: Los datos son confiables pero requieren revisión y limpieza manual previa.",
  "Alto: Los registros son consistentes, estandarizados y auditados periódicamente."
];

// Opciones Sección 4: Generación de Reportes y Toma de Decisiones
export const TIEMPOS_REPORTE = [
  "Horas o días de trabajo manual recopilando y cruzando planillas.",
  "Medio día, con plantillas prearmadas pero manuales.",
  "Se obtienen en minutos de forma automática.",
  "No contamos con reportes periódicos formales."
];

export const HERRAMIENTAS_VISUALIZACION = [
  "Planillas de Excel / tablas dinámicas",
  "Reportes estáticos en PDF / impresos",
  "Herramientas de BI (Power BI, Looker Studio, Tableau)",
  "Informes nativos del ERP / software contable",
  "Ninguna / sólo consultas directas puntuales"
];

export const OBSTACULOS_DECISION = [
  "Demora en obtener números actualizados.",
  "Falta de claridad o acuerdo sobre cuáles son los KPIs prioritarios.",
  "Discrepancias entre los datos de distintos departamentos.",
  "Dificultad para visualizar tendencias o anomalías a tiempo.",
  "Dependencia excesiva de una persona clave para armar los reportes."
];

// Opciones Sección 5: Prioridades y Expectativas
export const AREAS_PRIORITARIAS = [
  "Ventas, cobranzas y margen comercial",
  "Control de stock, inventario y compras",
  "Eficiencia operativa / rendimientos de producción",
  "Flujo de caja (cash flow) y costos",
  "Rendimiento de clientes o cartera morosa",
  "Otro"
];

export const VALORES_ESPERADOS = [
  "Ahorro de tiempo operativo en el armado de informes.",
  "Visibilidad ejecutiva en tiempo real accesible desde el celular o la web.",
  "Anticipar desvíos antes del cierre mensual.",
  "Mayor precisión en la planificación comercial y presupuestaria."
];

// Matriz Oficial de Evaluación Interna
export const MATRIZ_EVALUACION: Record<string, MatrizNivelInfo> = {
  "Nivel 1: Inicial / Disperso": {
    badge_color: "#EF4444",
    bg_color: "rgba(239, 68, 68, 0.12)",
    criterio: "Uso intensivo de planillas aisladas, datos en papel, reportes manuales lentos.",
    solucion: "Normalización y Tablero Base: Limpieza de datos + conexión de planillas a Looker Studio / Power BI con métricas comerciales directas.",
    prioridades_clave: [
      "Digitalizar y estandarizar planillas críticas",
      "Eliminar registros en papel o cuadernos",
      "Construir el primer tablero comercial unificado (ventas y cobros)",
      "Capacitar al equipo en buenas prácticas de carga"
    ]
  },
  "Nivel 2: Operativo / Estructurado": {
    badge_color: "#F59E0B",
    bg_color: "rgba(245, 158, 11, 0.12)",
    criterio: "Cuentan con ERP o facturación centralizada, pero reportan en Excel manual.",
    solucion: "Pipeline y Data Modeling: Conexión a la base de datos o exportaciones automáticas + Tablero Ejecutivo de KPIs estratégicos.",
    prioridades_clave: [
      "Conectar BI directamente a la base del ERP / facturación",
      "Automatizar el pipeline de extracción y transformación de datos",
      "Desarrollar tablero directivo multidisciplinario (ventas, stock y finanzas)",
      "Reducir el tiempo de preparación de informes de días a minutos"
    ]
  },
  "Nivel 3: Avanzado / Preparado": {
    badge_color: "#10B981",
    bg_color: "rgba(16, 185, 129, 0.12)",
    criterio: "Datos integrados y actualizados, buscan autonomía y exploración profunda.",
    solucion: "BI Integral & Analítica Predictiva: Tableros drill-down multidimensionales, alertas automáticas y preparación para modelos de IA.",
    prioridades_clave: [
      "Implementar alertas tempranas de desvíos y anomalías",
      "Modelos de segmentación avanzada de clientes y forecasting de demanda",
      "Gobernanza y democratización de datos (autoservicio BI)",
      "Integración de analítica predictiva y modelos de machine learning"
    ]
  }
};
