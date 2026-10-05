import React, { useState } from 'react';
import { Download, CheckCircle2, WifiOff, ArrowRight, Loader2 } from 'lucide-react';
import { LanguageCode } from '../../types';
import { StorageService } from '../../services/storageService';
import { UI_TRANSLATIONS } from '../../data/uiTranslations';

interface OfflineDownloadScreenProps {
  language: LanguageCode;
  onComplete: () => void;
  onSkip: () => void;
}

export const OfflineDownloadScreen: React.FC<OfflineDownloadScreenProps> = ({
  language,
  onComplete,
  onSkip,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState('...');
  const [completed, setCompleted] = useState(StorageService.isOfflinePackageReady());

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es;

  const handleStartDownload = async () => {
    setDownloading(true);
    setProgress(5);
    setStepMessage(t.downloading);

    try {
      await StorageService.downloadOfflinePackage((pct) => {
        setProgress(pct);
      });
      setCompleted(true);
      StorageService.trackEvent('download_completed');
      setTimeout(() => {
        onComplete();
      }, 800);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 sm:p-6 pb-24 max-w-md mx-auto w-full">
      <div className="space-y-6 pt-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <Download className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-100 font-serif">{t.downloadTitle}</h2>
          <p className="text-xs text-stone-400">
            {t.downloadSubtitle}
          </p>
        </div>

        {/* Feature List */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center space-x-3 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.downloadAudioFeat}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.downloadImagesFeat}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.downloadTranscriptsFeat}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.downloadBeaconsFeat}</span>
          </div>
        </div>

        {/* Progress Bar Display */}
        {downloading && (
          <div className="space-y-2 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 flex items-center gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                {t.downloading}
              </span>
              <span className="font-bold text-amber-400">{progress}%</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {completed && !downloading && (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{t.downloadComplete}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4">
        {completed ? (
          <button
            onClick={onComplete}
            className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>{t.startTourBtn}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={handleStartDownload}
            disabled={downloading}
            className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.downloading} ({progress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.downloadBtn}</span>
              </>
            )}
          </button>
        )}

        {!completed && (
          <button
            onClick={onSkip}
            disabled={downloading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
          >
            {t.skipDownloadBtn}
          </button>
        )}
      </div>
    </div>
  );
};
