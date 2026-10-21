import React, { useState } from "react";
import {
  FileText,
  Briefcase,
  Settings,
  BarChart3,
  HelpCircle,
  Cloud,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  UserCheck,
  HardDrive,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AppSquircleIcon, PropellerLoader } from "./BrandHeader";

export type NavModule = "form" | "proposal" | "admin" | "analytics" | "methodology";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    currentUser,
    isGuest,
    guestUser,
    enterGuestMode,
    exitGuestMode,
    login,
    logout,
    authError,
    clearAuthError
  } = useAuth();
  const [authLoading, setAuthLoading] = React.useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [customGuestName, setCustomGuestName] = useState("Consultor Invitado");

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

  const handleConfirmGuestMode = () => {
    enterGuestMode(customGuestName.trim() || "Consultor Invitado");
    setShowGuestModal(false);
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
      label: "Administración",
      icon: <Settings className="w-4 h-4 text-[#1E252D]" />,
      badge: interviewCount > 0 ? interviewCount.toString() : undefined
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
        <div className="flex items-center gap-3">
          <AppSquircleIcon size={38} />
          <div>
            <div className="text-xs font-semibold text-[#1E252D] font-['Outfit'] tracking-tight leading-tight">
              Information + Solutions
            </div>
            <div className="text-[10px] text-[#2C6E9E] font-normal tracking-wider uppercase font-['Outfit'] mt-0.5">
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
            <AppSquircleIcon size={42} />
            <div>
              <h2 className="text-sm font-semibold text-[#1E252D] tracking-tight font-['Outfit'] leading-tight">
                Information + Solutions
              </h2>
              <div className="text-[10px] font-normal text-[#2C6E9E] tracking-widest uppercase font-['Outfit'] mt-0.5">
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
              {isGuest ? (
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-[#3B8AC4]" />
              )}
              <span>{isGuest ? "Almacenamiento Local" : "Base de Datos"}</span>
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                currentUser && !isGuest
                  ? isCloudSynced
                    ? "bg-sky-50 text-[#3B8AC4] border-[#7EBCE6]/50"
                    : "bg-[#F5F8FB] text-slate-600 border-[#E4ECF2]"
                  : isGuest
                  ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold"
                  : "bg-[#F5F8FB] text-slate-600 border-[#E4ECF2]"
              }`}
            >
              <span>
                {currentUser && !isGuest
                  ? isCloudSynced
                    ? "Firestore Cloud"
                    : "Conectando..."
                  : isGuest
                  ? "Modo Invitado"
                  : "Sin Conexión"}
              </span>
            </span>
          </div>

          {currentUser && !isGuest ? (
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
          ) : isGuest ? (
            <div className="pt-2 border-t border-[#E4ECF2] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#1E252D] truncate font-['Outfit']">
                      {guestUser?.name || "Consultor Invitado"}
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium">
                      Modo Prueba · Solo Local
                    </div>
                  </div>
                </div>
                <button
                  onClick={exitGuestMode}
                  title="Salir del modo invitado"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#7EBCE6]/60 bg-sky-50 text-[11px] font-semibold text-[#2C6E9E] hover:bg-sky-100/70 transition-colors cursor-pointer font-['Outfit']"
              >
                <Cloud className="w-3.5 h-3.5 text-[#3B8AC4]" />
                <span>Conectar con Google (Cloud)</span>
              </button>
            </div>
          ) : (
            <div className="pt-1 space-y-2">
              <p className="text-[11px] text-slate-500 leading-tight">
                Acceso con cuenta Google o explora en modo prueba local.
              </p>

              {/* Google OAuth Login */}
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

              {/* Guest Access Mode Button */}
              <button
                onClick={() => setShowGuestModal(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4ECF2] bg-[#F5F8FB] hover:bg-sky-50 hover:border-[#7EBCE6] text-slate-700 hover:text-[#2C6E9E] text-xs font-medium cursor-pointer transition-all font-['Outfit']"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#3B8AC4]" />
                <span>Acceso como Invitado (Prueba)</span>
              </button>

              {authError && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px] font-['Outfit']">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{authError.title}</span>
                    </div>
                    <button
                      onClick={clearAuthError}
                      className="text-amber-500 hover:text-amber-800 p-0.5 cursor-pointer"
                      title="Cerrar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[10.5px] text-amber-800 leading-tight">
                    {authError.explanation}
                  </p>
                  <div className="pt-1 border-t border-amber-200/60 text-[10px] text-amber-900">
                    <span className="font-semibold">Solución:</span> {authError.solution}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {authError.actionUrl && (
                      <a
                        href={authError.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#3B8AC4] hover:text-[#2C6E9E] font-medium underline"
                      >
                        <span>{authError.actionLabel || "Abrir Consola"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        clearAuthError();
                        enterGuestMode("Consultor Invitado");
                      }}
                      className="text-[10px] text-amber-900 font-semibold underline hover:text-amber-950 cursor-pointer ml-auto"
                    >
                      Usar modo invitado mientras tanto →
                    </button>
                  </div>
                </div>
              )}
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

          <div className="mt-3 pt-3 border-t border-[#E4ECF2] flex items-center justify-between text-[10.5px] text-slate-500 font-medium px-1">
            <span>E. Carriego N° 431, La Rioja</span>
            <span className="font-bold text-[#2C6E9E] font-['Outfit']">I+S Data</span>
          </div>
        </div>
      </aside>

      {/* Guest Mode Onboarding Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 bg-[#1E252D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E4ECF2] shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between gap-2 border-b border-[#E4ECF2] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#3B8AC4] flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1E252D] font-['Outfit']">
                    Acceso como Invitado
                  </h3>
                  <p className="text-xs text-slate-500 font-['Inter']">
                    Modo de prueba con almacenamiento local
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuestModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-['Inter']">
              <p className="leading-relaxed">
                Este acceso te permite evaluar y usar todas las funciones de la plataforma sin necesidad de iniciar sesión con Google:
              </p>

              <div className="space-y-2 bg-[#F5F8FB] p-3.5 rounded-xl border border-[#E4ECF2]">
                <div className="flex items-start gap-2">
                  <HardDrive className="w-4 h-4 text-[#3B8AC4] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1E252D] font-['Outfit'] block">Almacenamiento 100% Local:</strong>
                    Tus entrevistas, scores y configuraciones se guardan exclusivamente en la memoria local de tu navegador (<code className="text-[11px] font-mono text-[#3B8AC4]">localStorage</code>). No se envían a la nube.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#BFA898] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1E252D] font-['Outfit'] block">Herramientas Habilitadas:</strong>
                    Formulario completo de relevamiento, cálculo de madurez, generador de propuestas de BI, analítica y panel de gestión.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1E252D] font-['Outfit'] block">Sin Compromiso:</strong>
                    Ideal para demostraciones a clientes o pruebas internas. Puedes reiniciar la base o pasar a Google Cloud cuando lo decidas.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']">
                  Nombre del Consultor para los reportes de prueba:
                </label>
                <input
                  type="text"
                  value={customGuestName}
                  onChange={(e) => setCustomGuestName(e.target.value)}
                  placeholder="Ej: Diego Martínez (Prueba)"
                  className="w-full px-3.5 py-2 text-xs border border-[#E4ECF2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7EBCE6] focus:border-[#3B8AC4] bg-white transition-all font-['Inter']"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4ECF2]">
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-[#F5F8FB] border border-[#E4ECF2] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmGuestMode}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white btn-primary flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ingresar en Modo Invitado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
