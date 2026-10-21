import React from "react";
import {
  FileText,
  Briefcase,
  Layers,
  BarChart3,
  HelpCircle,
  Menu,
  X,
  Database
} from "lucide-react";

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
}

export const Navigation: React.FC<NavigationProps> = ({
  currentModule,
  onSelectModule,
  interviewCount
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems: { id: NavModule; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "form",
      label: "📝 Nueva Entrevista",
      icon: <FileText className="w-4 h-4 text-sky-600" />
    },
    {
      id: "proposal",
      label: "💼 Propuesta de Trabajo",
      icon: <Briefcase className="w-4 h-4 text-indigo-600" />
    },
    {
      id: "admin",
      label: "📋 Panel de Administración",
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      badge: interviewCount > 0 ? String(interviewCount) : undefined
    },
    {
      id: "analytics",
      label: "📊 Analítica de Clientes",
      icon: <BarChart3 className="w-4 h-4 text-amber-600" />
    },
    {
      id: "methodology",
      label: "ℹ️ Matriz & Metodología",
      icon: <HelpCircle className="w-4 h-4 text-slate-600" />
    }
  ];

  const handleSelect = (mod: NavModule) => {
    onSelectModule(mod);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-base shadow-xs">
            📊
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 leading-tight">BI Diagnóstico</div>
            <div className="text-[11px] text-slate-500 font-medium">I+S Data Solutions</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="pb-4 mb-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-white border border-slate-200 rounded-xl shadow-xs">📊</span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">
                BI Diagnóstico
              </h2>
              <p className="text-xs text-slate-500 font-medium">Relevamiento con Clientes</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modules Section */}
        <div className="mb-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Módulos:
          </span>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-sky-700 border-2 border-sky-600 shadow-xs translate-x-1"
                      : "bg-white/80 text-slate-700 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-900 hover:translate-x-0.5"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        active
                          ? "bg-sky-100 text-sky-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Usage Tips Card */}
        <div className="mt-auto pt-4">
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1.5">
              <span>💡</span>
              <span>Modos de Uso:</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-slate-600 leading-relaxed text-[11.5px]">
              <li>En vivo durante llamada / reunión con cliente.</li>
              <li>Compartido como formulario de evaluación previa.</li>
            </ul>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              I+S Data Solutions
            </span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
