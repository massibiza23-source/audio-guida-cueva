import React, { useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA on home screen, hide
  if (isInstalled) {
    return null;
  }

  // Header compact pill variant
  if (variant === 'header') {
    if (isInstallable) {
      return (
        <button
          onClick={install}
          title="Instalar en pantalla de inicio"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 text-xs font-semibold transition-all shadow-sm group"
        >
          <img src="/apple-touch-icon.png" alt="Can Marçà" className="w-4 h-4 rounded-md shadow-sm" />
          <span className="hidden sm:inline">Instalar App</span>
          <Download className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      );
    }

    if (isIOS) {
      return (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            title="Añadir a pantalla de inicio en iPhone"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-850 border border-stone-700 text-stone-200 text-xs font-medium transition-all shadow-sm"
          >
            <img src="/apple-touch-icon.png" alt="Can Marçà" className="w-4 h-4 rounded-md shadow-sm" />
            <span className="hidden sm:inline">Añadir a Inicio</span>
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {showIOSGuide && (
            <IOSInstallModal onClose={() => setShowIOSGuide(false)} />
          )}
        </>
      );
    }

    return null;
  }

  // Card / banner variant for Welcome Screen
  return (
    <>
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt="Icono Can Marçà"
            className="w-11 h-11 rounded-xl shadow-md border border-amber-500/40 shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-stone-100 flex items-center gap-1">
              <span>Instalar en Pantalla de Inicio</span>
            </p>
            <p className="text-[11px] text-stone-400 leading-tight">
              Acceso instantáneo con el icono oficial y uso sin conexión
            </p>
          </div>
        </div>

        {isInstallable ? (
          <button
            onClick={install}
            className="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-400 border border-stone-700 text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Cómo añadir</span>
          </button>
        )}
      </div>

      {showIOSGuide && (
        <IOSInstallModal onClose={() => setShowIOSGuide(false)} />
      )}
    </>
  );
};

const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
    <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 p-5 shadow-2xl text-stone-100 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/apple-touch-icon.png"
            alt="Icono Can Marçà"
            className="w-9 h-9 rounded-xl shadow-md border border-amber-500/40"
          />
          <div>
            <h3 className="text-sm font-bold text-stone-100">Añadir a Pantalla de Inicio</h3>
            <p className="text-[10px] text-amber-400">Can Marçà • Audioguía</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 text-xs text-stone-300">
        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/60 border border-stone-850">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
            1
          </div>
          <div>
            <p className="font-semibold text-stone-200">Pulsa el botón Compartir</p>
            <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
              En la barra inferior de Safari, pulsa <Share className="w-3.5 h-3.5 inline text-blue-400" />
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/60 border border-stone-850">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
            2
          </div>
          <div>
            <p className="font-semibold text-stone-200">Añadir a la pantalla de inicio</p>
            <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
              Desplaza hacia abajo y selecciona <PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/60 border border-stone-850">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-stone-200">¡Listo con el icono oficial!</p>
            <p className="text-[11px] text-stone-400">
              Aparecerá en tu pantalla de inicio como una app nativa con el icono dorado de Can Marçà.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
      >
        Entendido
      </button>
    </div>
  </div>
);
