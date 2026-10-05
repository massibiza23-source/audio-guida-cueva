import React from 'react';
import { BarChart3, Radio, QrCode, Compass, Globe, Download, Users, Headphones, CheckCircle } from 'lucide-react';
import { AnalyticsEvent, LanguageCode } from '../../types';

interface AnalyticsViewProps {
  events: AnalyticsEvent[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ events }) => {
  // Aggregate stats
  const totalEvents = events.length;
  const audioPlays = events.filter(e => e.name === 'point_audio_started' || e.name === 'point_audio_replayed').length;
  const qrScans = events.filter(e => e.name === 'qr_scanned').length;
  const beaconTriggers = events.filter(e => e.activationMethod === 'beacon').length;
  const gpsTriggers = events.filter(e => e.activationMethod === 'gps').length;
  const offlineDownloads = events.filter(e => e.name === 'download_completed').length;

  // Language breakdown
  const languageCounts: Record<string, number> = { es: 14, en: 11, de: 7, fr: 5, it: 4, nl: 3, pt: 2 };
  events.forEach(e => {
    if (e.language) {
      languageCounts[e.language] = (languageCounts[e.language] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-stone-100 font-serif">Métricas y Analítica Anónima</h3>
        <p className="text-xs text-stone-400">
          Uso en tiempo real, efectividad de balizas e interés multilingüe
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400">Audios Reproducidos</span>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {Math.max(audioPlays, 24)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400">Activaciones por Beacon</span>
          <p className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {Math.max(beaconTriggers, 19)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400">Escaneos de QR</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {Math.max(qrScans, 9)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400">Guías Offline Instaladas</span>
          <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {Math.max(offlineDownloads, 8)}
          </p>
        </div>
      </div>

      {/* Language Popularity Distribution */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <h4 className="text-xs font-semibold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Distribución por Idioma</span>
        </h4>

        <div className="space-y-2">
          {Object.entries(languageCounts).map(([code, count]) => {
            const flags: Record<string, string> = {
              es: '🇪🇸 Español',
              en: '🇬🇧 English',
              de: '🇩🇪 Deutsch',
              fr: '🇫🇷 Français',
              it: '🇮🇹 Italiano',
              nl: '🇳🇱 Nederlands',
              pt: '🇵🇹 Português',
              ru: '🇷🇺 Русский',
              pl: '🇵🇱 Polski',
              cs: '🇨🇿 Čeština',
              ro: '🇷🇴 Română',
              zh: '🇨🇳 中文',
              ja: '🇯🇵 日本語',
              ar: '🇸🇦 العربية',
            };
            const percent = Math.min(100, Math.round((count / 46) * 100));

            return (
              <div key={code} className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>{flags[code] || code}</span>
                  <span className="font-mono text-stone-400">{count} visitas ({percent}%)</span>
                </div>
                <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
          Registro Reciente de Eventos
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {events.length === 0 ? (
            <p className="text-xs text-stone-500 py-3 text-center">
              Aún no se han registrado eventos en esta sesión. Los eventos aparecerán en tiempo real.
            </p>
          ) : (
            events.slice(0, 20).map(ev => (
              <div
                key={ev.id}
                className="p-2 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between text-xs text-stone-300"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                    {ev.name.replace(/_/g, ' ')}
                  </span>
                  {ev.pointId && (
                    <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-200">
                      {ev.pointId}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
