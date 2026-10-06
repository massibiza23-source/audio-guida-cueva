import React, { useEffect, useState } from 'react';
import { X, Play, Pause, Radio, QrCode, Compass, Volume2, FileText, Tag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { TourPoint, LanguageCode, AudioPlaybackState } from '../../types';
import { UI_TRANSLATIONS } from '../../data/uiTranslations';
import { KIDS_TOUR_DATA } from '../../data/kidsAudioData';
import { audioEngine } from '../../services/audioEngine';

interface PointDetailModalProps {
  point: TourPoint | null;
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  playbackState: AudioPlaybackState;
  onPlayPoint: (point: TourPoint) => void;
}

export const PointDetailModal: React.FC<PointDetailModalProps> = ({
  point,
  isOpen,
  onClose,
  language,
  playbackState,
  onPlayPoint,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (isOpen && point) {
      setSelectedPhotoIndex(0);
      // Auto-start audio narration when opening cave point information
      if (playbackState.currentPointId !== point.id || !playbackState.isPlaying) {
        onPlayPoint(point);
      }
    }
  }, [isOpen, point?.id]);

  if (!isOpen || !point) return null;

  const translation = point.translations[language] || point.translations.es;
  const isPlayingThis = playbackState.currentPointId === point.id && playbackState.isPlaying;
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es;

  const kidData = KIDS_TOUR_DATA[point.id];
  const kidTranslation = (kidData && (kidData[language] || kidData['es'])) || null;

  const allPhotos = [point.visual.image, ...(point.visual.gallery || [])].filter(Boolean);
  const activePhoto = allPhotos[selectedPhotoIndex] || point.visual.image;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border-t sm:border border-stone-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="relative h-60 sm:h-64 shrink-0 overflow-hidden group">
          <img
            src={activePhoto}
            alt={translation.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent"></div>

          {/* Gallery navigation arrows if multiple photos */}
          {allPhotos.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1));
                }}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors"
                title="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0));
                }}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors"
                title="Foto siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Photo Dots / Count */}
          {allPhotos.length > 1 && (
            <div className="absolute top-4 left-4 flex items-center space-x-1.5 bg-black/60 px-2 py-1 rounded-full backdrop-blur-md text-[10px] font-mono text-stone-200">
              <span>{selectedPhotoIndex + 1}/{allPhotos.length} fotos</span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-950/70 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-stone-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Order Badge & Title Floating on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500 text-stone-950">
                {point.id}
              </span>
              <span className="text-xs text-stone-300 font-medium">
                {t.stationOf(point.order, 10)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight drop-shadow-md">
              {translation.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 drop-shadow">
              {translation.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Play Narration CTA */}
          <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-200">{t.audioExplanation}</p>
                <p className="text-[11px] text-stone-400">
                  {isPlayingThis ? t.listeningNarration : t.listenPoint}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => audioEngine.toggleKidsMode(point, language)}
                title={playbackState.isKidsMode ? 'Voz Miki activa (clic para volver a adultos)' : 'Activar voz Miki'}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all ${
                  playbackState.isKidsMode
                    ? 'bg-yellow-400 text-stone-950 shadow-md shadow-yellow-500/20 ring-1 ring-yellow-400/50'
                    : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700'
                }`}
              >
                <span>🐭</span>
                <span className="text-[11px]">{playbackState.isKidsMode ? 'Voz Miki' : 'Niños'}</span>
              </button>

              <button
                onClick={() => onPlayPoint(point)}
                className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                  isPlayingThis
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700'
                }`}
              >
                {isPlayingThis ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>{t.pauseBtn}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>{t.playBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kids Mode Story & Challenge Box */}
          {kidTranslation && (
            <div
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                playbackState.isKidsMode
                  ? 'bg-yellow-950/25 border-yellow-400/50 shadow-md shadow-yellow-500/10'
                  : 'bg-stone-950/60 border-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐭</span>
                  <div>
                    <h5 className="text-xs font-bold text-yellow-300">
                      {kidTranslation.title}
                    </h5>
                    <p className="text-[10px] text-yellow-400/80">
                      Narración infantil con voz estilo Miki
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => audioEngine.toggleKidsMode(point, language)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    playbackState.isKidsMode
                      ? 'bg-yellow-400 text-stone-950 shadow-sm'
                      : 'bg-stone-800 text-yellow-300 border border-stone-700 hover:bg-stone-700'
                  }`}
                >
                  {playbackState.isKidsMode ? 'Escuchando a Miki' : 'Escuchar a Miki'}
                </button>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-stone-200">
                <p className="bg-yellow-950/30 p-2.5 rounded-xl border border-yellow-800/20 text-yellow-100">
                  💬 <span className="italic font-medium">"{kidTranslation.audioScript}"</span>
                </p>

                {kidTranslation.challenge && (
                  <div className="flex items-start gap-2 bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 text-[11px] text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-200">Reto de Miki para exploradores: </strong>
                      <span>{kidTranslation.challenge}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              {t.geoHistoryTitle}
            </h4>
            <p className="text-sm text-stone-200 leading-relaxed font-sans">
              {translation.description}
            </p>
          </div>

          {/* Transcript Section for Accessibility */}
          {translation.transcript && (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                <FileText className="w-4 h-4" />
                <span>{t.transcriptTitle}</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "{translation.transcript}"
              </p>
            </div>
          )}

          {/* Keywords Tags */}
          {point.keywords && point.keywords.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {t.keywordsTitle}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {point.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700/60"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activation details */}
          <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800 text-[11px] text-stone-400 space-y-1">
            <p className="font-semibold text-stone-300">{t.activationMethodsTitle}</p>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-blue-400" />
                Beacon: {point.beacon ? `Minor ${point.beacon.minor}` : 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <QrCode className="w-3 h-3 text-amber-400" />
                QR: {point.qr.enabled ? '✓' : '✗'}
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                GPS: {point.location.gps.latitude ? '✓' : 'Cueva'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
