import React from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Radio,
  MapPin,
  QrCode,
  Volume2,
  Sparkles,
  ChevronRight,
  Compass,
  Trophy,
} from 'lucide-react';
import { TourPoint, LanguageCode, AudioPlaybackState } from '../../types';
import { UI_TRANSLATIONS } from '../../data/uiTranslations';
import { Camera, Eye } from 'lucide-react';

interface RouteOverviewProps {
  points: TourPoint[];
  currentPointId: string | null;
  visitedPointIds: string[];
  playbackState: AudioPlaybackState;
  language: LanguageCode;
  onSelectPoint: (point: TourPoint) => void;
  onOpenPointDetail: (point: TourPoint) => void;
  onOpenQRScanner: () => void;
  onOpenBeaconSim: () => void;
  onOpenVisionGuide: () => void;
  onFinishTour: () => void;
  gpsDistanceToTerrace: number | null;
}

export const RouteOverview: React.FC<RouteOverviewProps> = ({
  points,
  currentPointId,
  visitedPointIds,
  playbackState,
  language,
  onSelectPoint,
  onOpenPointDetail,
  onOpenQRScanner,
  onOpenBeaconSim,
  onOpenVisionGuide,
  onFinishTour,
  gpsDistanceToTerrace,
}) => {
  const publishedPoints = points.filter(p => p.published).sort((a, b) => a.order - b.order);
  const total = publishedPoints.length;
  const completedCount = visitedPointIds.length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es;

  return (
    <div className="space-y-4 pb-36 pt-2 px-3 sm:px-4 max-w-xl mx-auto">
      {/* Route Progress Header Card */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              {t.routeSubtitle}
            </span>
            <h2 className="text-base font-bold text-stone-100 font-serif">
              {t.routeTitle}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-stone-200">
              {completedCount}/{total}
            </span>
            <p className="text-[10px] text-stone-400">{progressPercent}% {t.completed}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Quick Activation Bar */}
        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-stone-800/80 text-xs">
          <button
            onClick={onOpenVisionGuide}
            className="flex-[1.2] py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/50 flex items-center justify-center space-x-1.5 transition-all font-bold shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Reconocer zona</span>
          </button>

          <button
            onClick={onOpenBeaconSim}
            className="flex-1 py-2 px-2 rounded-xl bg-stone-800/70 hover:bg-stone-800 text-stone-300 border border-stone-700/60 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium">{t.beaconBtn}</span>
          </button>

          <button
            onClick={onOpenQRScanner}
            className="flex-1 py-2 px-2 rounded-xl bg-stone-800/70 hover:bg-stone-800 text-stone-300 border border-stone-700/60 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium">{t.qrBtn}</span>
          </button>

          {completedCount >= total && (
            <button
              onClick={onFinishTour}
              className="py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 font-semibold text-[11px] animate-pulse"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t.finishBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Can Marca Vision Guide Banner */}
      <div
        onClick={onOpenVisionGuide}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenVisionGuide();
        }}
        className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-3 flex items-center justify-between text-xs text-stone-200 cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-stone-100 font-serif">Can Marca Vision Guide</span>
              <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                IA Óptica
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Enfoca con la cámara para reconocer la sala y activar el audio automático
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* GPS Terrace Live Detection Banner if near terrace or outdoors */}
      {gpsDistanceToTerrace !== null && gpsDistanceToTerrace <= 40 && (
        <div className="bg-cyan-950/30 border border-cyan-700/40 rounded-2xl p-3 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <p className="font-semibold">{t.terraceDetected}</p>
              <p className="text-[10px] text-cyan-300/80">
                Aproximadamente a {gpsDistanceToTerrace}m
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const p1 = publishedPoints.find(p => p.id === 'CM-01');
              if (p1) onSelectPoint(p1);
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-500 text-stone-950 font-bold text-[11px] shadow-sm hover:bg-cyan-400"
          >
            {t.playBtn}
          </button>
        </div>
      )}

      {/* Point Cards List */}
      <div className="space-y-2.5">
        {publishedPoints.map((point) => {
          const isCurrent = currentPointId === point.id;
          const isVisited = visitedPointIds.includes(point.id);
          const isPlayingThis = isCurrent && playbackState.isPlaying;
          const translation = point.translations[language] || point.translations.es;

          return (
            <div
              key={point.id}
              onClick={() => onSelectPoint(point)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPoint(point);
                }
              }}
              className={`rounded-2xl border transition-all overflow-hidden cursor-pointer select-none active:scale-[0.99] ${
                isPlayingThis
                  ? 'bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/30'
                  : isCurrent
                  ? 'bg-stone-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : isVisited
                  ? 'bg-stone-950/70 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/40'
                  : 'bg-stone-950/40 border-stone-850 hover:border-stone-800 hover:bg-stone-900/40'
              }`}
            >
              <div className="p-3.5 flex items-center justify-between gap-3">
                {/* Thumbnail Image + Order Badge */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-700/60 group">
                  <img
                    src={point.visual.image}
                    alt={translation.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 bg-stone-950/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-amber-400">
                    {point.order}
                  </div>
                  {isPlayingThis ? (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: '60%' }} />
                        <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                        <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: '45%', animationDelay: '300ms' }} />
                      </div>
                    </div>
                  ) : isVisited ? (
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-stone-950 rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : null}
                </div>

                {/* Point Metadata & Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 text-[10px] text-stone-400 mb-0.5">
                    <span className="font-semibold text-stone-300">{point.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {point.activation.primary === 'beacon' && (
                        <>
                          <Radio className="w-3 h-3 text-blue-400" />
                          <span>Beacon</span>
                        </>
                      )}
                      {point.activation.primary === 'gps' && (
                        <>
                          <Compass className="w-3 h-3 text-cyan-400" />
                          <span>GPS Exterior</span>
                        </>
                      )}
                      {point.activation.primary === 'qr' && (
                        <>
                          <QrCode className="w-3 h-3 text-amber-400" />
                          <span>QR</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold truncate flex items-center gap-1.5 ${
                      isPlayingThis
                        ? 'text-amber-400'
                        : isCurrent
                        ? 'text-amber-300'
                        : 'text-stone-100'
                    }`}
                  >
                    <span>{translation.title}</span>
                    {isPlayingThis && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-sans font-normal animate-pulse">
                        Reproduciendo
                      </span>
                    )}
                  </h3>

                  <p className="text-xs text-stone-400 truncate mt-0.5">
                    {translation.subtitle}
                  </p>
                </div>

                {/* Action Play Button & Info Button */}
                <div className="shrink-0 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPoint(point);
                    }}
                    aria-label={`Reproducir ${translation.title}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isPlayingThis
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                        : isCurrent
                        ? 'bg-stone-800 text-amber-400 border border-amber-500/40'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPointDetail(point);
                    }}
                    title="Detalles y transcripción"
                    className="p-2 text-stone-500 hover:text-amber-400 hover:bg-stone-900 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
