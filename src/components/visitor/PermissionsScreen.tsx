import React, { useState } from 'react';
import { Bluetooth, MapPin, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { LanguageCode } from '../../types';
import { ActivationEngine } from '../../services/activationEngine';
import { StorageService } from '../../services/storageService';
import { UI_TRANSLATIONS } from '../../data/uiTranslations';

interface PermissionsScreenProps {
  language: LanguageCode;
  onContinue: () => void;
  onSkip: () => void;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({
  language,
  onContinue,
  onSkip,
}) => {
  const [bluetoothGranted, setBluetoothGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es;

  const handleRequestBluetooth = async () => {
    setRequesting(true);
    const success = await ActivationEngine.requestBluetoothDevice();
    setBluetoothGranted(success);
    setRequesting(false);
  };

  const handleRequestLocation = () => {
    setRequesting(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
          setRequesting(false);
          const p = StorageService.getVisitorProgress();
          p.permissionsGranted.location = true;
          StorageService.saveVisitorProgress(p);
        },
        () => {
          setLocationGranted(false);
          setRequesting(false);
        }
      );
    } else {
      setRequesting(false);
    }
  };

  const handleComplete = () => {
    const progress = StorageService.getVisitorProgress();
    progress.permissionsGranted.bluetooth = bluetoothGranted;
    progress.permissionsGranted.location = locationGranted;
    StorageService.saveVisitorProgress(progress);
    onContinue();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 sm:p-6 pb-24 max-w-md mx-auto w-full">
      <div className="space-y-6 pt-4">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-stone-100 font-serif">{t.permissionsTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-400">
            {t.permissionsSubtitle}
          </p>
        </div>

        {/* Permissions Cards */}
        <div className="space-y-3">
          {/* Bluetooth Card */}
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">{t.bluetoothTitle}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {t.bluetoothDesc}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestBluetooth}
              disabled={requesting || bluetoothGranted}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                bluetoothGranted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              {bluetoothGranted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t.bluetoothEnabled}</span>
                </>
              ) : (
                <>
                  <Bluetooth className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.bluetoothEnable}</span>
                </>
              )}
            </button>
          </div>

          {/* Location Card */}
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-200">{t.locationTitle}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {t.locationDesc}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestLocation}
              disabled={requesting || locationGranted}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                locationGranted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              {locationGranted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t.locationEnabled}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.locationEnable}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 text-[11px] text-stone-400 text-center leading-relaxed">
          {t.privacyNotice}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-4">
        <button
          onClick={handleComplete}
          className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center justify-center space-x-2"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={onSkip}
          className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-stone-900 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
        >
          {t.skipPermissionsBtn}
        </button>
      </div>
    </div>
  );
};
