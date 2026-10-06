import React from 'react';
import { Volume2, VolumeX, QrCode, Globe, Shield, Sparkles, Wifi, WifiOff, Camera } from 'lucide-react';
import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onOpenLanguageModal: () => void;
  onOpenQRScanner: () => void;
  onOpenVisionGuide?: () => void;
  onToggleAdmin: () => void;
  isAdmin: boolean;
  ambientSoundActive: boolean;
  onToggleAmbientSound: () => void;
  isOffline: boolean;
  isKidsMode?: boolean;
  onToggleKidsMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onOpenLanguageModal,
  onOpenQRScanner,
  onOpenVisionGuide,
  onToggleAdmin,
  isAdmin,
  ambientSoundActive,
  onToggleAmbientSound,
  isOffline,
  isKidsMode = false,
  onToggleKidsMode,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 px-4 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold">
            <span className="font-serif text-lg tracking-wider">CM</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-sm tracking-wide text-stone-100 flex items-center gap-1 font-serif">
                Can Marçà
                <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Ibiza
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-stone-400">Audioguía Inteligente</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Kids Mode Toggle (Miki Cartoon Voice) */}
          {onToggleKidsMode && (
            <button
              onClick={onToggleKidsMode}
              aria-label="Modo Niños con voz estilo Miki"
              title={
                isKidsMode
                  ? 'Voz Miki para Niños activada (clic para volver a modo adultos)'
                  : 'Activar modo niños con voz estilo Miki'
              }
              className={`px-2 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isKidsMode
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 border-yellow-300 shadow-md shadow-amber-500/25 ring-1 ring-yellow-400/50 scale-105'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-amber-300 hover:border-amber-500/30'
              }`}
            >
              <span className="text-sm leading-none">🐭</span>
              <span className="text-[11px] font-bold hidden sm:inline">
                {isKidsMode ? 'Voz Miki' : 'Niños'}
              </span>
            </button>
          )}

          {/* PWA Home Screen Install Button */}
          <PWAInstallButton variant="header" />

          {/* Offline Status */}
          <div
            title={isOffline ? 'Modo sin conexión' : 'Conectado'}
            className={`p-1.5 rounded-lg border text-xs flex items-center ${
              isOffline
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                : 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          </div>

          {/* Ambient Cave Audio Toggle */}
          <button
            onClick={onToggleAmbientSound}
            aria-label="Sonido ambiente de cueva"
            title={ambientSoundActive ? 'Silenciar atmósfera de cueva' : 'Activar atmósfera kárstica de cueva'}
            className={`p-2 rounded-lg border transition-all ${
              ambientSoundActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            {ambientSoundActive ? (
              <span className="flex items-center gap-1">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-medium hidden sm:inline">Eco</span>
              </span>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Can Marca Vision Guide Button */}
          {onOpenVisionGuide && (
            <button
              onClick={onOpenVisionGuide}
              aria-label="Reconocer zona con cámara"
              title="Reconocer zona con cámara (Can Marca Vision Guide)"
              className="py-1.5 px-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Reconocer zona</span>
            </button>
          )}

          {/* QR Scanner Shortcut */}
          <button
            onClick={onOpenQRScanner}
            aria-label="Escanear QR"
            title="Escanear código QR del punto"
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 hover:bg-stone-800 hover:text-amber-300 transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-xs font-medium text-stone-200 transition-colors"
          >
            <span className="text-base leading-none">{currentLangObj.flag}</span>
            <span className="uppercase text-[11px] font-bold text-stone-300">{currentLangObj.code}</span>
          </button>

          {/* Admin Switch */}
          <button
            onClick={onToggleAdmin}
            aria-label="Panel de Administración"
            title={isAdmin ? 'Volver a modo visitante' : 'Acceso a Panel de Administración'}
            className={`p-2 rounded-lg border transition-all ${
              isAdmin
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
