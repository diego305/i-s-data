import React, { useState, useEffect } from "react";
import { Navigation, NavModule } from "./components/Navigation";
import { FormView } from "./components/FormView";
import { ProposalView } from "./components/ProposalView";
import { AdminView } from "./components/AdminView";
import { AnalyticsView } from "./components/AnalyticsView";
import { MethodologyView } from "./components/MethodologyView";
import { getInterviews, initStorage } from "./lib/storage";
import { Interview } from "./types";

export function App() {
  const [currentModule, setCurrentModule] = useState<NavModule>("form");
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const loadData = () => {
    const list = getInterviews();
    setInterviews(list);
  };

  useEffect(() => {
    // Initialize storage with seeds if needed
    initStorage();
    loadData();

    // Listen for storage changes
    const handleStorageUpdated = () => {
      loadData();
    };

    window.addEventListener("storage_updated", handleStorageUpdated);
    window.addEventListener("storage", handleStorageUpdated);

    return () => {
      window.removeEventListener("storage_updated", handleStorageUpdated);
      window.removeEventListener("storage", handleStorageUpdated);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Navigation Sidebar */}
      <Navigation
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        interviewCount={interviews.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen overflow-y-auto">
        {currentModule === "form" && <FormView />}
        {currentModule === "proposal" && <ProposalView interviews={interviews} />}
        {currentModule === "admin" && (
          <AdminView interviews={interviews} onRefresh={loadData} />
        )}
        {currentModule === "analytics" && (
          <AnalyticsView interviews={interviews} onRefresh={loadData} />
        )}
        {currentModule === "methodology" && <MethodologyView />}
      </main>
    </div>
  );
}

export default App;
