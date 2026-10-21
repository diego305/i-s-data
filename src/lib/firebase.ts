import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { Interview, InterviewFormData } from "../types";
import { evaluarDiagnostico } from "./scoring";
import { SAMPLE_INTERVIEWS_SEED } from "./storage";

// Support both static json and Vercel VITE_* environment variables
export const effectiveFirebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
};

// Initialize Firebase
const app = initializeApp(effectiveFirebaseConfig);

// CRITICAL: Must use firestoreDatabaseId from config
export const db = getFirestore(app, effectiveFirebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export interface AuthDiagnosticError {
  code: string;
  originalMessage: string;
  title: string;
  explanation: string;
  solution: string;
  actionUrl?: string;
  actionLabel?: string;
}

export function parseAuthError(err: any): AuthDiagnosticError {
  const code = err?.code || "unknown";
  const rawMessage = err?.message || String(err);
  const currentHost = typeof window !== "undefined" ? window.location.hostname : "";

  switch (code) {
    case "auth/unauthorized-domain":
      return {
        code,
        originalMessage: rawMessage,
        title: "Dominio no autorizado en Firebase (Vercel)",
        explanation: `El dominio '${currentHost}' no está autorizado en Firebase Authentication. Google y Firebase bloquean la autenticación si el dominio no está en la lista blanca.`,
        solution: `Ingresa en Firebase Console > Authentication > Settings > Dominios autorizados (Authorized domains) y agrega '${currentHost}'.`,
        actionUrl: `https://console.firebase.google.com/project/${effectiveFirebaseConfig.projectId}/authentication/settings`,
        actionLabel: "Abrir Ajustes de Firebase Console"
      };
    case "auth/popup-blocked":
      return {
        code,
        originalMessage: rawMessage,
        title: "Ventana emergente bloqueada por el navegador",
        explanation: "Tu navegador o bloqueador de anuncios cerró preventivamente la ventana emergente de Google OAuth.",
        solution: "Habilita las ventanas emergentes (popups) en la barra de direcciones de tu navegador para este sitio y vuelve a intentarlo."
      };
    case "auth/popup-closed-by-user":
      return {
        code,
        originalMessage: rawMessage,
        title: "Ventana cerrada antes de completar el inicio de sesión",
        explanation: "La ventana de Google se cerró antes de que pudieras seleccionar o autorizar tu cuenta.",
        solution: "Haz clic nuevamente en 'Acceso con Google' y selecciona tu cuenta para continuar."
      };
    case "auth/operation-not-allowed":
      return {
        code,
        originalMessage: rawMessage,
        title: "Proveedor Google deshabilitado en Firebase",
        explanation: "El proveedor Google no está activado en la consola de Firebase para este proyecto.",
        solution: "En Firebase Console ve a Authentication > Sign-in method > Google y asegúrate de habilitarlo.",
        actionUrl: `https://console.firebase.google.com/project/${effectiveFirebaseConfig.projectId}/authentication/providers`,
        actionLabel: "Habilitar Google en Firebase"
      };
    case "auth/invalid-api-key":
      return {
        code,
        originalMessage: rawMessage,
        title: "API Key de Firebase no configurada o inválida",
        explanation: "La variable VITE_FIREBASE_API_KEY no se encontró o contiene caracteres incorrectos en Vercel.",
        solution: "En Vercel ve a Settings > Environment Variables y añade VITE_FIREBASE_API_KEY con la clave de tu proyecto."
      };
    default:
      if (rawMessage.toLowerCase().includes("access_denied") || rawMessage.includes("403")) {
        return {
          code: "oauth/access_denied",
          originalMessage: rawMessage,
          title: "Acceso denegado (App en modo de prueba en Google Cloud)",
          explanation: "La pantalla de consentimiento de OAuth está en estado 'Testing'. Solo los correos registrados como 'Usuarios de prueba' pueden iniciar sesión.",
          solution: "Agrega tu correo en Google Cloud Console > APIs & Services > OAuth consent screen > Test users, o publica la app.",
          actionUrl: "https://console.cloud.google.com/apis/credentials/consent",
          actionLabel: "Ir a Pantalla de consentimiento en Google Cloud"
        };
      }
      return {
        code,
        originalMessage: rawMessage,
        title: "Error al iniciar sesión con Google",
        explanation: rawMessage,
        solution: "Revisa la consola de desarrollo del navegador (F12) o los logs de Vercel para identificar el detalle técnico."
      };
  }
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write"
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}

testConnection();

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Error signing in with Google:", err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

const COLLECTION_PATH = "entrevistas";

// Real-time listener for multi-user sync
export function subscribeToInterviews(
  onData: (interviews: Interview[]) => void,
  onError?: (err: any) => void
) {
  const q = query(collection(db, COLLECTION_PATH), orderBy("created_at", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const results: Interview[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        results.push({
          ...(data as Interview),
          id: Number(data.id || docSnap.id)
        });
      });
      onData(results);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_PATH);
      if (onError) onError(error);
    }
  );
}

// Add interview to Firestore
export async function saveInterviewFirestore(
  formData: InterviewFormData,
  user?: User | null
): Promise<Interview> {
  const diag = evaluarDiagnostico({
    storage_sources: formData.almacenamiento_fuentes,
    integration_level: formData.integracion_nivel,
    update_frequency: formData.frecuencia_actualizacion,
    data_confidence: formData.confianza_datos,
    report_time: formData.tiempo_reporte,
    current_bi_tool: formData.herramienta_visualizacion
  });

  const now = new Date().toISOString().replace("T", " ").substring(0, 19);
  const numericId = Date.now();
  const docId = `entrevista_${numericId}`;

  const interview: Interview = {
    ...formData,
    id: numericId,
    created_at: now,
    updated_at: now,
    score_global: diag.score_global,
    nivel_madurez: diag.nivel,
    dimensiones: diag.dimensiones,
    estado: formData.estado || "Completada"
  };

  const payload: any = {
    ...interview,
    created_by_uid: user?.uid || auth.currentUser?.uid || "anon",
    created_by_email: user?.email || auth.currentUser?.email || "consultor@isdatasolutions.com"
  };

  try {
    await setDoc(doc(db, COLLECTION_PATH, docId), payload);
    return interview;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_PATH}/${docId}`);
    throw error;
  }
}

// Update interview on Firestore
export async function updateInterviewFirestore(
  id: number,
  updates: Partial<Interview>
): Promise<boolean> {
  const docId = `entrevista_${id}`;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  const payload: any = {
    ...updates,
    id,
    updated_at: now
  };

  try {
    await setDoc(doc(db, COLLECTION_PATH, docId), payload, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_PATH}/${docId}`);
    return false;
  }
}

// Delete interview on Firestore
export async function deleteInterviewFirestore(id: number): Promise<boolean> {
  const docId = `entrevista_${id}`;
  try {
    await deleteDoc(doc(db, COLLECTION_PATH, docId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_PATH}/${docId}`);
    return false;
  }
}

// Seed sample data to Firestore for instant multi-user exploration
export async function seedSampleDataFirestore(): Promise<void> {
  for (let idx = 0; idx < SAMPLE_INTERVIEWS_SEED.length; idx++) {
    const seed = SAMPLE_INTERVIEWS_SEED[idx];
    const numericId = Date.now() + idx;
    const docId = `entrevista_${numericId}`;
    const diag = evaluarDiagnostico({
      storage_sources: seed.almacenamiento_fuentes,
      integration_level: seed.integracion_nivel,
      update_frequency: seed.frecuencia_actualizacion,
      data_confidence: seed.confianza_datos,
      report_time: seed.tiempo_reporte,
      current_bi_tool: seed.herramienta_visualizacion
    });
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    const interview = {
      ...seed,
      id: numericId,
      created_at: now,
      updated_at: now,
      score_global: diag.score_global,
      nivel_madurez: diag.nivel,
      dimensiones: diag.dimensiones,
      estado: "Completada" as const,
      created_by_uid: auth.currentUser?.uid || "demo_consultant",
      created_by_email: auth.currentUser?.email || "consultor@isdatasolutions.com"
    };

    try {
      await setDoc(doc(db, COLLECTION_PATH, docId), interview);
    } catch (err) {
      console.warn("Could not seed doc into Firestore:", err);
    }
  }
}
