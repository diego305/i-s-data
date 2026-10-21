import React from "react";
import {
  FileText,
  Briefcase,
  Layers,
  BarChart3,
  HelpCircle,
  Menu,
  X,
  Cloud,
  LogIn,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AppSquircleIcon, PropellerLoader } from "./BrandHeader";

export type NavModule =
  | "form"
  | "proposal"
  | "admin"
  | "analytics"
  | "methodology";

interface NavigationProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  interviewCount: number;
  isCloudSynced: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentModule,
  onSelectModule,
  interviewCount,
  isCloudSynced
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { currentUser, login, logout } = useAuth();
  const [authLoading, setAuthLoading] = React.useState(false);

  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      await login();
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems: { id: NavModule; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "form",
      label: "Nueva Entrevista",
      icon: <FileText className="w-4 h-4 text-[#3B8AC4]" />
    },
    {
      id: "proposal",
      label: "Propuesta de Trabajo",
      icon: <Briefcase className="w-4 h-4 text-[#BFA898]" />
    },
    {
      id: "admin",
      label: "Panel de Administración",
      icon: <Layers className="w-4 h-4 text-[#1E252D]" />,
      badge: interviewCount > 0 ? String(interviewCount) : undefined
    },
    {
      id: "analytics",
      label: "Analítica de Clientes",
      icon: <BarChart3 className="w-4 h-4 text-[#3B8AC4]" />
    },
    {
      id: "methodology",
      label: "Matriz & Metodología",
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />
    }
  ];

  const handleSelect = (mod: NavModule) => {
    onSelectModule(mod);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Glassmorphic Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 glass-header sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <AppSquircleIcon size={34} />
          <div>
            <div className="text-xs font-light text-[#1E252D] font-['Outfit'] tracking-wide">
              Information + Solutions
            </div>
            <div className="text-[10px] text-[#BFA898] font-semibold tracking-wider uppercase">
              Data Solutions
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#1E252D] hover:bg-white rounded-xl border border-[#E4ECF2] bg-white/70 cursor-pointer transition-colors"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#1E252D]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F5F8FB] border-r border-[#E4ECF2] flex flex-col p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="pb-4 mb-4 border-b border-[#E4ECF2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppSquircleIcon size={40} />
            <div>
              <h2 className="text-sm font-light text-[#1E252D] tracking-wide font-['Outfit']">
                Information + Solutions
              </h2>
              <div className="text-[10px] font-semibold text-[#BFA898] tracking-widest uppercase">
                Data Solutions
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Sync & User Profile Card */}
        <div className="mb-4 bg-white p-3.5 rounded-2xl border border-[#E4ECF2] shadow-[0px_2px_8px_rgba(30,37,45,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1E252D] font-['Outfit']">
              <Cloud className="w-3.5 h-3.5 text-[#3B8AC4]" />
              <span>Base Colaborativa</span>
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                isCloudSynced
                  ? "bg-sky-50 text-[#3B8AC4] border-[#7EBCE6]/50"
                  : "bg-[#F5F8FB] text-slate-600 border-[#E4ECF2]"
              }`}
            >
              <span>{isCloudSynced ? "Firestore Cloud" : "Local Caching"}</span>
            </span>
          </div>

          {currentUser ? (
            <div className="pt-2 border-t border-[#E4ECF2] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "Usuario"}
                    className="w-7 h-7 rounded-full border border-[#7EBCE6] shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-sky-50 text-[#3B8AC4] flex items-center justify-center text-xs font-semibold shrink-0">
                    {currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[#1E252D] truncate font-['Outfit']">
                    {currentUser.displayName || "Consultor BI"}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="pt-1">
              <p className="text-[11px] text-slate-500 leading-tight mb-2.5">
                Acceso con cuenta Google para sincronización multiusuario en vivo.
              </p>
              <button
                onClick={handleLogin}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 btn-primary text-xs cursor-pointer disabled:opacity-50"
              >
                {authLoading ? (
                  <PropellerLoader size={16} />
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Acceso con Google</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modules Navigation */}
        <div className="mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 px-2 font-['Outfit']">
            Módulos del Sistema
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-white text-[#3B8AC4] border border-[#7EBCE6]/50 shadow-xs font-semibold"
                      : "bg-transparent text-slate-700 hover:bg-white/80 hover:text-[#1E252D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="font-['Inter']">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md bg-sky-50 text-[#3B8AC4] font-semibold border border-[#7EBCE6]/30">
                      {item.badge}
                    </span>
                  ) : (
                    active && <ChevronRight className="w-3.5 h-3.5 text-[#3B8AC4]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Philosophy Card */}
        <div className="mt-auto pt-4">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4ECF2] shadow-xs text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-[#1E252D] text-[11px] font-['Outfit']">
              <span className="text-[#3B8AC4]">✦</span>
              <span>Propuesta de Valor I+S</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-['Inter'] italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E4ECF2] flex items-center justify-between text-[10.5px] text-slate-400 font-medium px-1">
            <span>E. Carriego N° 431, La Rioja</span>
            <span className="font-semibold text-[#BFA898] font-['Outfit']">I+S Data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
