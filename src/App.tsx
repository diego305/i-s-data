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

function MainApp() {
  const [currentModule, setCurrentModule] = useState<NavModule>("form");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const { currentUser } = useAuth();

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

    // If user is authenticated, attach Firestore real-time listener
    let unsubscribeFirestore: (() => void) | null = null;

    if (currentUser) {
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
  }, [currentUser]);

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
      <main className="flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8 min-h-screen overflow-y-auto">
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
