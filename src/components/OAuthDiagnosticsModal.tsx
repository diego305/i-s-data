import React, { useState } from "react";
import { effectiveFirebaseConfig } from "../lib/firebase";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Server,
  Globe,
  Key,
  ShieldAlert
} from "lucide-react";

interface OAuthDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OAuthDiagnosticsModal: React.FC<OAuthDiagnosticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const currentHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  if (!isOpen) return null;

  const isLocal = currentHost === "localhost" || currentHost === "127.0.0.1";
  const isVercel = currentHost.includes("vercel.app");

  const envVarsConfig = [
    { key: "VITE_FIREBASE_API_KEY", value: effectiveFirebaseConfig.apiKey },
    { key: "VITE_FIREBASE_AUTH_DOMAIN", value: effectiveFirebaseConfig.authDomain },
    { key: "VITE_FIREBASE_PROJECT_ID", value: effectiveFirebaseConfig.projectId },
    { key: "VITE_FIREBASE_DATABASE_ID", value: effectiveFirebaseConfig.firestoreDatabaseId },
    { key: "VITE_FIREBASE_STORAGE_BUCKET", value: effectiveFirebaseConfig.storageBucket },
    { key: "VITE_FIREBASE_MESSAGING_SENDER_ID", value: effectiveFirebaseConfig.messagingSenderId },
    { key: "VITE_FIREBASE_APP_ID", value: effectiveFirebaseConfig.appId }
  ];

  const handleCopyEnv = () => {
    const text = envVarsConfig.map((item) => `${item.key}=${item.value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const firebaseAuthHandlerUri = `https://${effectiveFirebaseConfig.authDomain}/__/auth/handler`;

  return (
    <div className="fixed inset-0 z-50 bg-[#1E252D]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Inter']">
      <div className="bg-white rounded-3xl border border-[#E4ECF2] shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E4ECF2] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#3B8AC4] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#3B8AC4]" />
            </div>
            <div>
              <h3 className="text-lg font-light text-[#1E252D] font-['Outfit'] tracking-wide">
                Diagnóstico de OAuth & Despliegue en Vercel
              </h3>
              <p className="text-xs text-slate-500">
                Verificación de dominios autorizados, credenciales y variables de entorno.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-[#F5F8FB] rounded-2xl border border-[#E4ECF2] flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#3B8AC4] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-400 font-['Outfit']">
                Dominio Actual
              </div>
              <div className="text-xs font-mono font-medium text-[#1E252D] truncate">
                {currentHost}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F5F8FB] rounded-2xl border border-[#E4ECF2] flex items-center gap-2.5">
            <Server className="w-4 h-4 text-[#7EBCE6] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-400 font-['Outfit']">
                Proyecto Firebase
              </div>
              <div className="text-xs font-mono font-medium text-[#1E252D] truncate">
                {effectiveFirebaseConfig.projectId}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Verification Checkpoints */}
        <div className="space-y-4">
          {/* Checkpoint 1: Authorized Domains & Redirect URIs */}
          <div className="p-4 rounded-2xl border border-[#E4ECF2] bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-xs text-[#1E252D] font-['Outfit']">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-[#3B8AC4] flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                <span className="text-sm font-light">Dominios Autorizados en Firebase & URIs de Redirección</span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded-md font-mono bg-amber-50 text-amber-700 border border-amber-200">
                Causa #1 en Vercel
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Firebase Authentication bloquea llamadas de inicio de sesión desde dominios no registrados con el error <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">auth/unauthorized-domain</code>.
            </p>
            <div className="bg-[#F5F8FB] p-3 rounded-xl border border-[#E4ECF2] text-xs space-y-1.5 font-mono">
              <div className="text-[11px] text-slate-500 font-sans font-semibold">
                Para resolverlo en Firebase Console:
              </div>
              <div className="text-[11px] text-[#1E252D]">
                1. Ve a <strong>Authentication</strong> → pestaña <strong>Settings (Ajustes)</strong> → <strong>Dominios autorizados</strong>.
              </div>
              <div className="text-[11px] text-[#1E252D]">
                2. Haz clic en <strong>Agregar dominio</strong> y añade:
                <div className="mt-1 p-1.5 bg-white border border-[#E4ECF2] rounded text-[#3B8AC4] font-semibold">
                  {currentHost.includes("vercel.app") ? currentHost : "tu-proyecto.vercel.app"}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-sans pt-1">
                La URI de redirección de OAuth gestionada por Firebase es:
                <div className="text-[10px] text-slate-600 truncate mt-0.5">{firebaseAuthHandlerUri}</div>
              </div>
            </div>
            <div className="pt-1 flex items-center gap-2">
              <a
                href={`https://console.firebase.google.com/project/${effectiveFirebaseConfig.projectId}/authentication/settings`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B8AC4] hover:text-[#2C6E9E] font-['Outfit']"
              >
                <span>Abrir Dominios Autorizados en Firebase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Checkpoint 2: Environment Variables in Vercel */}
          <div className="p-4 rounded-2xl border border-[#E4ECF2] bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-xs text-[#1E252D] font-['Outfit']">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-[#3B8AC4] flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                <span className="text-sm font-light">Variables de Entorno en Vercel (Prefijo VITE_)</span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded-md font-mono bg-sky-50 text-[#3B8AC4] border border-[#7EBCE6]/40">
                Vite Config
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En proyectos construidos con <strong>Vite</strong>, Vercel no inyecta variables al frontend a menos que comiencen con el prefijo obligatorio <code className="text-[#3B8AC4] bg-sky-50 px-1 py-0.5 rounded font-mono font-semibold">VITE_</code>.
            </p>
            <div className="bg-[#F5F8FB] p-3 rounded-xl border border-[#E4ECF2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 font-['Outfit']">
                  Variables requeridas para Vercel:
                </span>
                <button
                  onClick={handleCopyEnv}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3B8AC4] hover:text-[#2C6E9E] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">¡Copiado al portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar todas las variables</span>
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1 font-mono text-[10.5px] text-slate-700 max-h-28 overflow-y-auto bg-white p-2 rounded-lg border border-[#E4ECF2]">
                {envVarsConfig.map((env) => (
                  <div key={env.key} className="truncate">
                    <span className="text-[#2C6E9E] font-semibold">{env.key}</span>=
                    <span className="text-slate-500">{env.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkpoint 3: Google Cloud OAuth Testing Mode vs Production */}
          <div className="p-4 rounded-2xl border border-[#E4ECF2] bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-xs text-[#1E252D] font-['Outfit']">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-[#3B8AC4] flex items-center justify-center text-[11px] font-bold">
                  3
                </span>
                <span className="text-sm font-light">Estado de la Pantalla de Consentimiento (Google Cloud)</span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded-md font-mono bg-purple-50 text-purple-700 border border-purple-200">
                Google Cloud
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Si la pantalla de consentimiento está en modo <strong>"En pruebas" (Testing)</strong>, solo los correos registrados explícitamente en la lista de <em>Usuarios de prueba (Test users)</em> pueden iniciar sesión. Otros usuarios recibirán un error <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">403 access_denied</code>.
            </p>
            <div className="bg-[#F5F8FB] p-3 rounded-xl border border-[#E4ECF2] text-xs space-y-1 font-mono">
              <div className="text-[11px] text-slate-700 font-sans">
                Para permitir acceso a cualquier usuario de la organización:
              </div>
              <div className="text-[11px] text-[#1E252D]">
                • En <strong>Google Cloud Console</strong> → <strong>APIs y servicios</strong> → <strong>Pantalla de consentimiento de OAuth</strong>:
              </div>
              <div className="text-[11px] text-[#1E252D]">
                • Agrega los correos en <em>Usuarios de prueba</em>, o haz clic en <strong>Publicar la aplicación</strong>.
              </div>
            </div>
            <div className="pt-1">
              <a
                href="https://console.cloud.google.com/apis/credentials/consent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B8AC4] hover:text-[#2C6E9E] font-['Outfit']"
              >
                <span>Ver Pantalla de Consentimiento en Google Cloud</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E4ECF2] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 btn-primary text-xs cursor-pointer font-['Outfit']"
          >
            Entendido / Cerrar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
};
