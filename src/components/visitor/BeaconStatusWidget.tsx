import React, { useState } from 'react';
import { Radio, Signal, Sliders, ChevronDown, ChevronUp, Check, Play } from 'lucide-react';
import { TourPoint, LanguageCode } from '../../types';
import { audioEngine } from '../../services/audioEngine';

interface BeaconStatusWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  points: TourPoint[];
  language: LanguageCode;
}

export const BeaconStatusWidget: React.FC<BeaconStatusWidgetProps> = ({
  isOpen,
  onClose,
  points,
  language,
}) => {
  const [selectedPointId, setSelectedPointId] = useState<string>('CM-02');
  const [simulatedRSSI, setSimulatedRSSI] = useState<number>(-72); // dBm (-95 to -50)
  const [beaconScanning, setBeaconScanning] = useState<boolean>(true);

  if (!isOpen) return null;

  const beaconPoints = points.filter(p => p.beacon);
  const targetPoint = points.find(p => p.id === selectedPointId);

  const signalQuality =
    simulatedRSSI >= -75 ? 'Excelente (-' + Math.abs(simulatedRSSI) + ' dBm)' :
    simulatedRSSI >= -85 ? 'Adecuada (-' + Math.abs(simulatedRSSI) + ' dBm)' :
    'Débil (< -85 dBm)';

  const meetsThreshold = simulatedRSSI >= -85;

  const handleSimulateProximity = (point: TourPoint) => {
    setSelectedPointId(point.id);
    setSimulatedRSSI(-68); // strong signal trigger
    audioEngine.triggerAutomaticPoint(point, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-serif">Simulador de Balizas Beacon</h2>
              <p className="text-[11px] text-stone-400">Detección por proximidad Bluetooth iBeacon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Beacon Config Info */}
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span>Umbral mínimo de activación:</span>
              <span className="font-mono font-bold text-amber-400">-85 dBm</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Tiempo de confirmación:</span>
              <span className="font-mono font-bold text-stone-200">2 segundos</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Enfriamiento anti-duplicados:</span>
              <span className="font-mono font-bold text-stone-200">20 segundos</span>
            </div>
          </div>

          {/* Select Point to emulate */}
          <div className="space-y-1.5">
            <label className="text-stone-300 font-semibold block">
              Simular aproximación a una sala subterránea:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {beaconPoints.map(p => {
                const isSelected = p.id === selectedPointId;
                const trans = p.translations[language] || p.translations.es;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSimulateProximity(p)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/30 border-blue-500/50 text-blue-200'
                        : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono font-bold text-amber-400 text-xs">{p.id}</span>
                      <div>
                        <p className="font-semibold text-stone-100">{trans.title}</p>
                        <p className="text-[10px] text-stone-400">
                          Minor: {p.beacon?.minor} • {p.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateProximity(p);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Activar</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RSSI Slider */}
          <div className="space-y-2 p-3 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5 text-blue-400" />
                Intensidad RSSI simulada:
              </span>
              <span className={`font-mono font-bold ${meetsThreshold ? 'text-emerald-400' : 'text-stone-500'}`}>
                {signalQuality}
              </span>
            </div>

            <input
              type="range"
              min={-100}
              max={-50}
              step={1}
              value={simulatedRSSI}
              onChange={e => setSimulatedRSSI(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>Lejos (-100 dBm)</span>
              <span className="text-amber-400 font-bold">Umbral (-85 dBm)</span>
              <span>Cerca (-50 dBm)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
