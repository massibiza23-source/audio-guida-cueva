import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  FileText,
  Radio,
  Clock,
  Sparkles,
  Maximize2,
  AlertCircle,
} from 'lucide-react';
import { TourPoint, AudioPlaybackState, LanguageCode } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { UI_TRANSLATIONS } from '../../data/uiTranslations';
import { KIDS_TOUR_DATA } from '../../data/kidsAudioData';
import { Camera } from 'lucide-react';

interface AudioPlayerSheetProps {
  currentPoint: TourPoint | null;
  playbackState: AudioPlaybackState;
  language: LanguageCode;
  onOpenPointDetail: (point: TourPoint) => void;
  onOpenTranscript: (point: TourPoint) => void;
  onOpenVisionGuide?: () => void;
  onPreviousPoint: () => void;
  onNextPoint: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const AudioPlayerSheet: React.FC<AudioPlayerSheetProps> = ({
  currentPoint,
  playbackState,
  language,
  onOpenPointDetail,
  onOpenTranscript,
  onOpenVisionGuide,
  onPreviousPoint,
  onNextPoint,
  hasPrevious,
  hasNext,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es;

  if (!currentPoint) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-stone-950/90 border-t border-stone-800 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{t.waitingPoint}</span>
          </div>
          {onOpenVisionGuide && (
            <button
              onClick={onOpenVisionGuide}
              className="py-1 px-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 text-xs font-semibold hover:bg-amber-500 hover:text-stone-950 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Reconocer zona</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const translation = currentPoint.translations[language] || currentPoint.translations.es;
  const kidData = KIDS_TOUR_DATA[currentPoint.id];
  const kidTranslation = (kidData && (kidData[language] || kidData['es'])) || null;
  const displayTitle = playbackState.isKidsMode && kidTranslation ? kidTranslation.title : translation.title;
  const displaySubtitle = playbackState.isKidsMode && kidTranslation ? kidTranslation.subtitle : translation.subtitle;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioEngine.seek(val);
  };

  const handleSpeedCycle = () => {
    const speeds = [1.0, 1.25, 0.75];
    const currentIdx = speeds.indexOf(playbackState.playbackRate);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
    audioEngine.setPlaybackRate(nextSpeed);
  };

  const progressPercent = playbackState.duration > 0
    ? (playbackState.currentTime / playbackState.duration) * 100
    : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-stone-950/95 border-t border-stone-800/90 backdrop-blur-xl shadow-2xl transition-all">
      <div className="max-w-xl mx-auto p-3 sm:p-4 space-y-2.5">
        {/* Status indicator bar (e.g. Confirming 2s or Cooldown 20s) */}
        {playbackState.status === 'CONFIRMING' && (
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>{t.beaconDetecting}</span>
            </div>
            <span className="font-mono font-bold text-amber-400">
              {playbackState.confirmingCountdown}s
            </span>
          </div>
        )}

        {playbackState.status === 'COOLDOWN' && (
          <div className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-1 flex items-center justify-between text-[11px] text-stone-400">
            <span>{t.cooldownActive}</span>
            <span className="font-mono text-stone-300">{playbackState.cooldownRemaining}s</span>
          </div>
        )}

        {/* Current Point Info Header */}
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => onOpenPointDetail(currentPoint)}
            className="flex items-center space-x-3 cursor-pointer group flex-1 min-w-0"
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-700/80 group-hover:border-amber-500/50 transition-colors">
              <img
                src={currentPoint.visual.image}
                alt={translation.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <Maximize2 className="w-3.5 h-3.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {currentPoint.id}
                </span>
                {playbackState.isKidsMode ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 flex items-center gap-1 animate-pulse">
                    <span>🐭</span>
                    <span>Voz Miki</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400 truncate">
                    {t.stationOf(currentPoint.order, 10)}
                  </span>
                )}
              </div>
              <h3 className={`text-sm font-bold truncate transition-colors ${
                playbackState.isKidsMode
                  ? 'text-yellow-200 group-hover:text-yellow-300 font-serif'
                  : 'text-stone-100 group-hover:text-amber-400'
              }`}>
                {displayTitle}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">{displaySubtitle}</p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* Kids Mode Toggle */}
            <button
              onClick={() => audioEngine.toggleKidsMode(currentPoint, language)}
              title={
                playbackState.isKidsMode
                  ? 'Voz Miki para Niños activa (clic para volver a modo adultos)'
                  : 'Activar modo niños con voz estilo Miki'
              }
              className={`px-2 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                playbackState.isKidsMode
                  ? 'bg-yellow-400 text-stone-950 border-yellow-300 shadow-md shadow-yellow-500/25 ring-1 ring-yellow-400/50'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-yellow-400 hover:border-yellow-500/30'
              }`}
            >
              <span className="text-sm leading-none">🐭</span>
              <span className="text-[10px] hidden sm:inline">
                {playbackState.isKidsMode ? 'Voz Miki' : 'Niños'}
              </span>
            </button>

            {/* Speed Toggle */}
            <button
              onClick={handleSpeedCycle}
              title="Velocidad de reproducción"
              className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono font-bold text-stone-300 hover:text-amber-400 transition-colors"
            >
              {playbackState.playbackRate}x
            </button>

            {/* Transcript Modal Button */}
            <button
              onClick={() => onOpenTranscript(currentPoint)}
              title="Ver transcripción completa"
              className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-400 transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Vision Guide Button */}
            {onOpenVisionGuide && (
              <button
                onClick={onOpenVisionGuide}
                title="Reconocer sala con cámara"
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 hover:bg-stone-800 hover:text-amber-300 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={playbackState.duration || 45}
              step={0.5}
              value={playbackState.currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-0.5">
            <span>{formatTime(playbackState.currentTime)}</span>
            <span>{formatTime(playbackState.duration)}</span>
          </div>
        </div>

        {/* Transport Controls Bar */}
        <div className="flex items-center justify-between pt-0.5">
          {/* Restart */}
          <button
            onClick={() => audioEngine.seek(0)}
            title="Reiniciar punto"
            className="p-2.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Point */}
          <button
            onClick={onPreviousPoint}
            disabled={!hasPrevious}
            title="Punto anterior"
            className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={() => audioEngine.togglePlayPause()}
            aria-label={playbackState.isPlaying ? 'Pausar' : 'Reproducir'}
            className="w-13 h-13 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform"
          >
            {playbackState.isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950 stroke-stone-950" />
            ) : (
              <Play className="w-6 h-6 ml-0.5 fill-stone-950 stroke-stone-950" />
            )}
          </button>

          {/* Next Point */}
          <button
            onClick={onNextPoint}
            disabled={!hasNext}
            title="Punto siguiente"
            className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Volume Control */}
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              title="Ajustar volumen"
              className="p-2.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
            >
              {playbackState.volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-12 right-0 bg-stone-900 border border-stone-800 p-2 rounded-xl shadow-xl z-40 w-32 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={playbackState.volume}
                  onChange={e => audioEngine.setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
