import React from "react";

/**
 * App Icon: Squircle container with Aero Blue (#3B8AC4) to deep blue (#1E5E94) gradient
 * and crisp white 4-blade aerodynamic propeller.
 */
export const AppSquircleIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = ""
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="appSquircleGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B8AC4" />
          <stop offset="100%" stopColor="#1E5E94" />
        </linearGradient>
      </defs>
      {/* Aerodynamic squircle */}
      <rect width="48" height="48" rx="12" fill="url(#appSquircleGrad)" />

      {/* Aerodynamic white propeller cross */}
      <g fill="#FFFFFF">
        {/* Vertical blade */}
        <path d="M24 7C22.6 13.5 22.6 19.5 22.6 24C22.6 28.5 22.6 34.5 24 41C25.4 34.5 25.4 28.5 25.4 24C25.4 19.5 25.4 13.5 24 7Z" />
        {/* Horizontal blade */}
        <path d="M7 24C13.5 22.6 19.5 22.6 24 22.6C28.5 22.6 34.5 22.6 41 24C34.5 25.4 28.5 25.4 24 25.4C19.5 25.4 13.5 25.4 7 24Z" />
        {/* Hub */}
        <circle cx="24" cy="24" r="2.8" fill="#7EBCE6" />
        <circle cx="24" cy="24" r="1.3" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * Propeller Loader: Componente Estrella con hélice girando a diferentes niveles de opacidad
 */
export const PropellerLoader: React.FC<{ size?: number; text?: string; className?: string }> = ({
  size = 28,
  text,
  className = ""
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div style={{ width: size, height: size }} className="relative animate-spin-propeller shrink-0">
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
          {/* Faint rotating ghost blades */}
          <g opacity="0.2" transform="rotate(30 24 24)">
            <ellipse cx="24" cy="24" rx="2.5" ry="18" fill="#3B8AC4" />
            <ellipse cx="24" cy="24" rx="18" ry="2.5" fill="#3B8AC4" />
          </g>
          <g opacity="0.35" transform="rotate(-30 24 24)">
            <ellipse cx="24" cy="24" rx="2.5" ry="18" fill="#7EBCE6" />
            <ellipse cx="24" cy="24" rx="18" ry="2.5" fill="#7EBCE6" />
          </g>
          {/* Main 4-blade propeller */}
          <g fill="#3B8AC4">
            <path d="M24 6C22.6 12.5 22.6 18.5 22.6 24C22.6 29.5 22.6 35.5 24 42C25.4 35.5 25.4 29.5 25.4 24C25.4 18.5 25.4 12.5 24 6Z" />
            <path d="M6 24C12.5 22.6 18.5 22.6 24 22.6C29.5 22.6 35.5 22.6 42 24C35.5 25.4 29.5 25.4 24 25.4C18.5 25.4 12.5 25.4 6 24Z" />
            <circle cx="24" cy="24" r="3" fill="#1E252D" />
            <circle cx="24" cy="24" r="1.4" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
      {text && <span className="text-xs font-medium text-slate-600 font-['Inter']">{text}</span>}
    </div>
  );
};

/**
 * Contrails (Estelas de condensación) background decoration
 */
export const ContrailCurves: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 800 200"
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-40 180 C 180 135, 270 35, 490 28 C 630 20, 730 65, 860 10"
        stroke="#7EBCE6"
        strokeWidth="1.5"
        strokeDasharray="5 7"
        opacity="0.3"
      />
      <path
        d="M-20 195 C 160 155, 250 55, 470 45 C 610 38, 710 85, 840 25"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        opacity="0.25"
      />
    </svg>
  );
};

/**
 * Contrail divider line with subtle curve
 */
export const ContrailDivider: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative h-px w-full my-4 bg-gradient-to-r from-transparent via-[#E4ECF2] to-transparent ${className}`}>
      <span className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-[#7EBCE6]/50 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B8AC4]" />
      </span>
    </div>
  );
};

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  withText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
  withText = false
}) => {
  const heights = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11"
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* SVG recreation of the official I+S Propeller Logo */}
      <svg
        viewBox="0 0 160 80"
        className={`${heights[size]} w-auto select-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="I+S Data Solutions Logo"
      >
        {/* The 'I': Aero Blue vertical bar (#3B8AC4) */}
        <rect x="18" y="14" width="7" height="52" rx="2" fill="#3B8AC4" />

        {/* Faint rotating ghost propeller blades for rotation motion */}
        <g opacity="0.18" transform="rotate(30 75 40)">
          <ellipse cx="75" cy="40" rx="4" ry="28" fill="#1E252D" />
          <ellipse cx="75" cy="40" rx="28" ry="4" fill="#1E252D" />
        </g>
        <g opacity="0.3" transform="rotate(-30 75 40)">
          <ellipse cx="75" cy="40" rx="4" ry="28" fill="#1E252D" />
          <ellipse cx="75" cy="40" rx="28" ry="4" fill="#1E252D" />
        </g>

        {/* The '+': Grafito Hélice propeller blades (#1E252D) */}
        <path
          d="M75 12C72.5 22 72.5 32 72.5 40C72.5 48 72.5 58 75 68C77.5 58 77.5 48 77.5 40C77.5 32 77.5 22 75 12Z"
          fill="#1E252D"
        />
        <path
          d="M47 40C57 37.5 67 37.5 75 37.5C83 37.5 93 37.5 103 40C93 42.5 83 42.5 75 42.5C67 42.5 57 42.5 47 40Z"
          fill="#1E252D"
        />
        <circle cx="75" cy="40" r="3.5" fill="#3B8AC4" />
        <circle cx="75" cy="40" r="1.5" fill="#FFFFFF" />

        {/* The 'S': Arena Titanio (#BFA898) */}
        <text
          x="122"
          y="56"
          fontFamily="'Outfit', sans-serif"
          fontWeight="400"
          fontSize="48"
          fill="#BFA898"
          letterSpacing="0"
        >
          S
        </text>

        {/* Reflection */}
        <g opacity="0.12" transform="scale(1, -0.38) translate(0, -170)">
          <rect x="18" y="14" width="7" height="40" rx="2" fill="#3B8AC4" />
          <ellipse cx="75" cy="40" rx="3.5" ry="20" fill="#1E252D" />
          <ellipse cx="75" cy="40" rx="20" ry="3.5" fill="#1E252D" />
          <text
            x="122"
            y="56"
            fontFamily="'Outfit', sans-serif"
            fontWeight="400"
            fontSize="48"
            fill="#BFA898"
          >
            S
          </text>
        </g>
      </svg>

      {withText && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-light tracking-wide text-[#1E252D] font-['Outfit']">
            Information + Solutions
          </span>
          <span className="text-[10px] font-semibold text-[#BFA898] tracking-widest uppercase mt-0.5">
            Data Solutions
          </span>
        </div>
      )}
    </div>
  );
};

interface BrandBannerProps {
  title?: string;
  subtitle?: string;
  categoryTag?: string;
}

export const BrandBanner: React.FC<BrandBannerProps> = ({
  title = "Diagnóstico de Madurez de Datos & BI",
  subtitle = "Evaluación Inicial para Business Intelligence",
  categoryTag = "INFORMATION + SOLUTIONS"
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] mb-6 bg-[#1E252D] shadow-[0px_4px_16px_rgba(30,37,45,0.08)]">
      <div className="relative h-40 sm:h-48 md:h-52 w-full overflow-hidden">
        {/* Improved aerobatic banner photo */}
        <img
          src="/assets/aistudio/imass1_7e7d6ad3.jpg"
          alt="Information + Solutions banner"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Contrail Curves subtle overlay */}
        <ContrailCurves className="opacity-25" />

        {/* Gradient scrims for accessible contrast with the title & subtitle */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E252D]/85 via-[#1E252D]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E252D]/85 via-transparent to-transparent" />

        {/* Main Banner Content */}
        <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFA898] font-['Outfit']">
                {categoryTag}
              </span>
              <span className="text-[#7EBCE6]/70" aria-hidden="true">·</span>
              <span className="text-[11px] font-medium text-white/90">
                La Rioja, Argentina
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-white drop-shadow-xs font-['Outfit']">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 font-normal max-w-2xl drop-shadow-xs font-['Inter']">
              {subtitle}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-medium text-white shrink-0 self-start sm:self-auto font-['Outfit']">
            <span className="w-2 h-2 rounded-full bg-[#7EBCE6]" />
            <span>Inteligencia de Datos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
