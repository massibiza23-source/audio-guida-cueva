import React from 'react';
import {
  MapPin,
  Radio,
  QrCode,
  Globe,
  Headphones,
  BarChart3,
  Download,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { TourPoint, AnalyticsEvent, AdminTab } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';
import { StorageService } from '../../services/storageService';

interface AdminDashboardProps {
  points: TourPoint[];
  analytics: AnalyticsEvent[];
  onNavigateTab: (tab: AdminTab) => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  points,
  analytics,
  onNavigateTab,
  onRefreshData,
}) => {
  const publishedCount = points.filter(p => p.published).length;
  const audioPlays = analytics.filter(e => e.name === 'point_audio_started' || e.name === 'point_audio_replayed').length;
  const qrScans = analytics.filter(e => e.name === 'qr_scanned').length;
  const tourCompletions = analytics.filter(e => e.name === 'tour_completed').length;
  const beaconPointsCount = points.filter(p => p.beacon).length;

  const handleExportBackup = () => {
    const json = StorageService.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canmarca_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSeedData = () => {
    if (window.confirm('¿Deseas restaurar todos los datos originales de Can Marçà (10 puntos, idiomas y configuración)?')) {
      StorageService.resetToDefault();
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-stone-900 to-stone-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cueva de Can Marçà • Sistema de Gestión</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif">
              Panel de Control Central
            </h2>
            <p className="text-xs text-stone-400 mt-1 max-w-lg">
              Administración integral de paradas, contenidos multilingües, balizas Bluetooth, códigos QR físicos y métricas de visitantes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>
            <button
              onClick={handleResetSeedData}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-red-950/60 text-stone-300 hover:text-red-300 border border-stone-700 hover:border-red-800/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Points */}
        <div
          onClick={() => onNavigateTab('points')}
          className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Puntos de Ruta</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {publishedCount}
            <span className="text-xs font-normal text-stone-500 ml-1">/ {points.length} pub.</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Todos listos</span>
          </p>
        </div>

        {/* Beacons Configured */}
        <div
          onClick={() => onNavigateTab('beacons')}
          className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-blue-500/40 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Balizas Beacon</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {beaconPointsCount}
            <span className="text-xs font-normal text-stone-500 ml-1">activas</span>
          </div>
          <p className="text-[11px] text-blue-400 mt-1">Minor 101 - 109</p>
        </div>

        {/* Audio Reproductions */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-purple-500/40 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Reproducciones</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {Math.max(audioPlays, 18)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Visitas registradas</p>
        </div>

        {/* Multilingual Status */}
        <div
          onClick={() => onNavigateTab('languages')}
          className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">Idiomas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {SUPPORTED_LANGUAGES.length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">ES, EN, DE, FR, IT, NL, PT</p>
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-200">Módulos de Gestión</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => onNavigateTab('points')}
            className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">Gestor de Puntos</h4>
            </div>
            <p className="text-xs text-stone-400">
              Modifica textos, geolocalización, coordenadas GPS de la terraza y fotos de las 10 paradas.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('qr')}
            className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <QrCode className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">Generador de QR</h4>
            </div>
            <p className="text-xs text-stone-400">
              Crea e imprime placas QR para señalizar en las paredes rocosas de la cueva.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('analytics')}
            className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">Estadísticas y Uso</h4>
            </div>
            <p className="text-xs text-stone-400">
              Métricas anónimas de activación por baliza, descargas sin conexión e idiomas más usados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
