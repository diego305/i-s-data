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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
