import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Play, Pause, Volume2, Upload, Check, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { TourPoint, LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';
import { StorageService } from '../../services/storageService';
import { audioEngine } from '../../services/audioEngine';

interface AudioManagerProps {
  points: TourPoint[];
  onRefresh: () => void;
}

export const AudioManager: React.FC<AudioManagerProps> = ({
  points,
  onRefresh,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('es');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      if (!state.isPlaying && playingId) {
        setPlayingId(null);
      }
    });
    return () => unsubscribe();
  }, [playingId]);

  const handleTestAudio = (point: TourPoint) => {
    if (playingId === point.id) {
      audioEngine.stop();
      setPlayingId(null);
      return;
    }

    setPlayingId(point.id);
    audioEngine.playPoint(point, selectedLang, true);
  };

  const handleSetCustomAudioUrl = (point: TourPoint, url: string) => {
    const updated = {
      ...point,
      translations: {
        ...point.translations,
        [selectedLang]: {
          ...(point.translations[selectedLang] || point.translations.es),
          audioUrl: url,
        },
      },
    };
    StorageService.updatePoint(updated);
    onRefresh();
  };

  const handleUploadAudioFile = (point: TourPoint, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleSetCustomAudioUrl(point, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-100 font-serif">Gestor de Audios y Locuciones</h3>
          <p className="text-xs text-stone-400">
            Control de archivos MP3/AAC, preescucha y síntesis de voz multilingüe
          </p>
        </div>

        {/* Language Pill Selector */}
        <div className="flex flex-wrap gap-1.5">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                if (playingId) {
                  window.speechSynthesis.cancel();
                  setPlayingId(null);
                }
                setSelectedLang(lang.code);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                selectedLang === lang.code
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="uppercase text-[11px]">{lang.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Engine Spec Note */}
      <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-start space-x-3 text-xs">
        <Headphones className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-stone-200">
            Especificaciones recomendadas para audio Can Marçà:
          </p>
          <p className="text-stone-400 text-[11px]">
            Formatos soportados: MP3 o AAC • Bitrate: 128-192 kbps • Muestreo: 44.1 kHz estéreo. Si no se especifica una URL externa, el sistema utiliza el sintetizador nativo de alta definición en el dispositivo del visitante de forma 100% offline.
          </p>
        </div>
      </div>

      {/* Points Audio List */}
      <div className="space-y-2.5">
        {points.map(point => {
          const trans = point.translations[selectedLang] || point.translations.es;
          const isPlaying = playingId === point.id;

          return (
            <div
              key={point.id}
              className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono font-bold text-xs text-amber-400 bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800">
                    {point.id}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">{trans.title}</h4>
                    <p className="text-[11px] text-stone-400">{trans.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTestAudio(point)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isPlaying
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Detener</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Probar Audio</span>
                    </>
                  )}
                </button>
              </div>

              {/* Audio URL Input & File Upload */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-[11px] text-stone-400 shrink-0">Audio ({selectedLang.toUpperCase()}):</span>
                <input
                  type="text"
                  placeholder={`/audio/${selectedLang}/${point.id}.mp3 o enlace https://`}
                  value={trans.audioUrl || ''}
                  onChange={e => handleSetCustomAudioUrl(point, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="py-1 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Subir MP3</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAudioFile(point, file);
                      }}
                    />
                  </label>
                  {trans.audioUrl && (
                    <button
                      onClick={() => handleSetCustomAudioUrl(point, '')}
                      title="Eliminar audio personalizado (usar voz sintética)"
                      className="p-1.5 rounded-xl bg-stone-800 hover:bg-red-950/40 text-stone-400 hover:text-red-400 border border-stone-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
