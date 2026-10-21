import React, { useState, useEffect } from "react";
import { Navigation, NavModule } from "./components/Navigation";
import { FormView } from "./components/FormView";
import { ProposalView } from "./components/ProposalView";
import { AdminView } from "./components/AdminView";
import { AnalyticsView } from "./components/AnalyticsView";
import { MethodologyView } from "./components/MethodologyView";
import { getInterviews, initStorage } from "./lib/storage";
import { subscribeToInterviews, seedSampleDataFirestore } from "./lib/firebase";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Interview } from "./types";
import { HardDrive, Cloud, LogIn, X } from "lucide-react";

function MainApp() {
  const [currentModule, setCurrentModule] = useState<NavModule>("form");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const { currentUser, isGuest, guestUser, exitGuestMode, login } = useAuth();

  const loadLocalData = () => {
    const list = getInterviews();
    setInterviews(list);
  };

  useEffect(() => {
    // Initialize local storage cache
    initStorage();
    loadLocalData();

    // Listen for storage changes
    const handleStorageUpdated = () => {
      loadLocalData();
    };

    window.addEventListener("storage_updated", handleStorageUpdated);
    window.addEventListener("storage", handleStorageUpdated);

    // If real user is authenticated (not guest), attach Firestore real-time listener
    let unsubscribeFirestore: (() => void) | null = null;

    if (currentUser && !isGuest) {
      try {
        unsubscribeFirestore = subscribeToInterviews(
          (cloudInterviews) => {
            if (cloudInterviews && cloudInterviews.length > 0) {
              setInterviews(cloudInterviews);
              setIsCloudSynced(true);
            } else {
              // If cloud is empty, seed demo data to firestore
              seedSampleDataFirestore()
                .then(() => setIsCloudSynced(true))
                .catch(() => {});
            }
          },
          (err) => {
            console.warn("Firestore subscription warning:", err);
            setIsCloudSynced(false);
          }
        );
      } catch (err) {
        console.warn("Could not initiate Firestore subscription:", err);
        setIsCloudSynced(false);
      }
    } else {
      setIsCloudSynced(false);
    }

    return () => {
      window.removeEventListener("storage_updated", handleStorageUpdated);
      window.removeEventListener("storage", handleStorageUpdated);
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [currentUser, isGuest]);

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-[#1E252D] flex flex-col lg:flex-row font-['Inter']">
      {/* Navigation Sidebar */}
      <Navigation
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        interviewCount={interviews.length}
        isCloudSynced={isCloudSynced}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Guest Mode Alert Banner */}
        {isGuest && (
          <aside
            aria-label="Aviso de Modo Invitado"
            className="bg-amber-50/95 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 sticky top-0 z-30 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-amber-100 text-amber-800">
                <HardDrive className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-semibold font-['Outfit'] mr-1.5 text-amber-950">
                  Modo Invitado de Prueba Activo:
                </span>
                <span className="text-amber-800">
                  Operando en almacenamiento local ({guestUser?.name || "Consultor Invitado"}). Las entrevistas se guardan únicamente en este navegador y no se sincronizan con la nube.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => login()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-semibold text-[#1E252D] hover:bg-amber-100/50 transition-colors cursor-pointer font-['Outfit']"
                title="Conectar cuenta de Google para respaldar en la nube"
              >
                <Cloud className="w-3 h-3 text-[#3B8AC4]" />
                <span>Pasar a Cloud (Google)</span>
              </button>
              <button
                onClick={() => exitGuestMode()}
                className="p-1 text-amber-700 hover:text-amber-950 hover:bg-amber-100 rounded-md cursor-pointer transition-colors"
                title="Salir del modo invitado"
                aria-label="Cerrar modo invitado"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentModule === "form" && <FormView />}
          {currentModule === "proposal" && <ProposalView interviews={interviews} />}
          {currentModule === "admin" && (
            <AdminView interviews={interviews} onRefresh={loadLocalData} />
          )}
          {currentModule === "analytics" && (
            <AnalyticsView interviews={interviews} onRefresh={loadLocalData} />
          )}
          {currentModule === "methodology" && <MethodologyView />}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
