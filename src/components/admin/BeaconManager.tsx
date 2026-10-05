import React, { useState } from 'react';
import { Radio, Signal, Edit2, Check, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { TourPoint } from '../../types';
import { StorageService } from '../../services/storageService';

interface BeaconManagerProps {
  points: TourPoint[];
  onRefresh: () => void;
}

export const BeaconManager: React.FC<BeaconManagerProps> = ({
  points,
  onRefresh,
}) => {
  const [editingPointId, setEditingPointId] = useState<string | null>(null);
  const [minorValue, setMinorValue] = useState<number>(101);
  const [uuidValue, setUuidValue] = useState<string>('FDA50693-A4E2-4FB1-AFCF-C6EB07647825');

  const beaconPoints = points.filter(p => p.beacon);

  const handleSaveBeacon = (point: TourPoint) => {
    const updated: TourPoint = {
      ...point,
      beacon: {
        uuid: uuidValue,
        major: 1,
        minor: minorValue,
      },
    };
    StorageService.updatePoint(updated);
    setEditingPointId(null);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-stone-100 font-serif">Gestor de Balizas Beacon Bluetooth</h3>
        <p className="text-xs text-stone-400">
          Configuración iBeacon (UUID, Major, Minor) y asignación a salas subterráneas
        </p>
      </div>

      {/* Guide Card */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-blue-400 font-semibold">
          <Info className="w-4 h-4" />
          <span>Protocolo Can Marçà Subterráneo</span>
        </div>
        <p className="text-stone-300 leading-relaxed text-[11px]">
          Las balizas iBeacon operan en frecuencias de 2.4 GHz Bluetooth Low Energy. En el interior kárstico, la roca caliza atenúa las reflexiones de señal. Por ello, el umbral de disparo está calibrado a <code className="text-amber-400 font-mono font-bold">-85 dBm</code> con 2 segundos de confirmación continua y 20 segundos de enfriamiento para evitar falsos positivos o repeticiones molestas.
        </p>
      </div>

      {/* Beacons List */}
      <div className="space-y-2.5">
        {points.map(point => {
          const hasBeacon = !!point.beacon;
          const isEditing = editingPointId === point.id;

          return (
            <div
              key={point.id}
              className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    hasBeacon
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      : 'bg-stone-950 border-stone-800 text-stone-600'
                  }`}
                >
                  <Radio className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className="font-mono font-bold text-amber-400">{point.id}</span>
                    <span className="text-stone-500">•</span>
                    <span className="font-semibold text-stone-200">{point.translations.es.title}</span>
                  </div>

                  {hasBeacon ? (
                    <p className="text-[11px] text-stone-400 font-mono">
                      UUID: {point.beacon?.uuid.slice(0, 8)}... | Major: {point.beacon?.major} | Minor:{' '}
                      <span className="text-blue-300 font-bold">{point.beacon?.minor}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-500">Sin baliza asignada (Activación por QR / GPS)</p>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="flex items-center space-x-2 shrink-0">
                  <input
                    type="number"
                    value={minorValue}
                    onChange={e => setMinorValue(parseInt(e.target.value, 10) || 101)}
                    className="w-20 px-2 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 font-mono text-center text-xs"
                    placeholder="Minor"
                  />
                  <button
                    onClick={() => handleSaveBeacon(point)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-stone-950 font-bold"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingPointId(null)}
                    className="px-2 py-1.5 rounded-lg bg-stone-800 text-stone-400"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingPointId(point.id);
                    setMinorValue(point.beacon?.minor || 100 + point.order);
                    setUuidValue(point.beacon?.uuid || 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825');
                  }}
                  className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 flex items-center space-x-1.5 self-end sm:self-center transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configurar</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
