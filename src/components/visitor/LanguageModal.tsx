import React from 'react';
import { X, Check, Volume2 } from 'lucide-react';
import { LanguageCode, LanguageInfo } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';
import { StorageService } from '../../services/storageService';
import { audioEngine } from '../../services/audioEngine';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    onSelectLanguage(code);
    StorageService.trackEvent('language_selected', { language: code });
    onClose();
  };

  const handleTestVoice = (e: React.MouseEvent, lang: LanguageInfo) => {
    e.stopPropagation();
    audioEngine.previewVoiceSample(lang.code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-100 font-serif">Selecciona tu idioma</h2>
            <p className="text-xs text-stone-400">Select language / Sprache wählen</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map(lang => {
            const isCurrent = lang.code === selectedLanguage;
            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-stone-100">{lang.nativeName}</p>
                    <p className="text-xs text-stone-400">{lang.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={e => handleTestVoice(e, lang)}
                    title="Escuchar muestra de pronunciación"
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isCurrent
                        ? 'bg-amber-500 border-amber-400 text-stone-950'
                        : 'border-stone-700 bg-stone-800/40 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-stone-950/60 border-t border-stone-800 text-center">
          <p className="text-xs text-stone-400">
            Podrás cambiar de idioma en cualquier momento durante la visita.
          </p>
        </div>
      </div>
    </div>
  );
};
