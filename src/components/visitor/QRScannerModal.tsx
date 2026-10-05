import React, { useState } from 'react';
import { X, QrCode, Camera, ArrowRight, AlertCircle } from 'lucide-react';
import { TourPoint, LanguageCode } from '../../types';
import { ActivationEngine } from '../../services/activationEngine';
import { StorageService } from '../../services/storageService';
import { UI_TRANSLATIONS } from '../../data/uiTranslations';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: TourPoint[];
  language: LanguageCode;
  onPointActivated: (point: TourPoint) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  points,
  language,
  onPointActivated,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es;

  const handleScanCode = (code: string) => {
    setErrorMsg(null);
    const point = ActivationEngine.parseQRInput(code, points);
    if (point) {
      StorageService.trackEvent('qr_scanned', {
        pointId: point.id,
        activationMethod: 'qr',
      });
      onPointActivated(point);
      onClose();
    } else {
      setErrorMsg(`"${code}": Code not recognized. Try CM-01 to CM-10.`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanCode(manualCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-serif">{t.qrScannerTitle}</h2>
              <p className="text-[11px] text-stone-400">{t.qrScannerSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Simulated Camera Scanner View */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 aspect-square max-h-56 flex flex-col items-center justify-center p-4">
            {/* Viewfinder brackets */}
            <div className="w-36 h-36 border-2 border-dashed border-amber-500/50 rounded-2xl relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-1 -mr-1"></div>

              {/* Animated scanning laser */}
              <div className="absolute left-2 right-2 h-0.5 bg-amber-400 shadow-md shadow-amber-400/80 animate-bounce"></div>

              <Camera className="w-8 h-8 text-stone-600" />
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-3">
              {t.qrInstruction}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 block">
              {t.qrManualPrompt}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="CM-01 a CM-10"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 font-mono uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <span>{t.activateBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Point Picker buttons */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <p className="text-xs font-semibold text-stone-400">
              {t.qrSamplePrompt}
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {points.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleScanCode(p.id)}
                  className="py-1.5 px-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 text-xs font-mono font-semibold transition-colors truncate text-center"
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
