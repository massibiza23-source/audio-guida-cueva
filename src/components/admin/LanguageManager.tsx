import React, { useState } from 'react';
import { Globe, Check, Eye, EyeOff, Volume2, Sparkles } from 'lucide-react';
import { TourPoint, LanguageCode, LanguageInfo } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';

interface LanguageManagerProps {
  points: TourPoint[];
}

export const LanguageManager: React.FC<LanguageManagerProps> = ({ points }) => {
  const [languages, setLanguages] = useState<LanguageInfo[]>(SUPPORTED_LANGUAGES);

  const toggleLanguage = (code: LanguageCode) => {
    setLanguages(prev =>
      prev.map(l => (l.code === code ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const handleTestSpeech = (lang: LanguageInfo) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const sample = `Audio test in ${lang.nativeName} for Can Marçà Cave Ibiza.`;
      const utt = new SpeechSynthesisUtterance(sample);
      utt.lang = lang.speechCode;
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-stone-100 font-serif">Gestor de Idiomas (7 Soportados)</h3>
        <p className="text-xs text-stone-400">
          Activa o desactiva idiomas para la audiencia internacional que visita Can Marçà
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {languages.map(lang => {
          const translatedPointsCount = points.filter(
            p => !!p.translations[lang.code]?.title
          ).length;

          return (
            <div
              key={lang.code}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                lang.enabled
                  ? 'bg-stone-900 border-stone-800'
                  : 'bg-stone-950/40 border-stone-850 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">{lang.nativeName}</h4>
                    <p className="text-xs text-stone-400">{lang.name} • {lang.speechCode}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleLanguage(lang.code)}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
                    lang.enabled
                      ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/50'
                      : 'bg-stone-800 text-stone-500 border-stone-700'
                  }`}
                >
                  {lang.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Translation status */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800 text-stone-400">
                <span>{translatedPointsCount} de {points.length} paradas traducidas</span>
                <button
                  onClick={() => handleTestSpeech(lang)}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Probar voz</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
