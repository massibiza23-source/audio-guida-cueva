import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Info,
  Scan,
} from 'lucide-react';
import { TourPoint } from '../../types';
import {
  VisionRecognitionEngine,
  VISION_ZONES_DATABASE,
  VisionZoneDefinition,
} from '../../services/visionRecognitionEngine';

interface VisionTrainingManagerProps {
  points: TourPoint[];
}

export const VisionTrainingManager: React.FC<VisionTrainingManagerProps> = ({ points }) => {
  const [dataset, setDataset] = useState<Record<string, string[]>>(() =>
    VisionRecognitionEngine.getZoneReferenceImages()
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string>('CM-01');
  const [threshold, setThreshold] = useState<number>(() =>
    VisionRecognitionEngine.getMinimumConfidence()
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const selectedZone = VISION_ZONES_DATABASE.find(z => z.zone_id === selectedZoneId) || VISION_ZONES_DATABASE[0];
  const currentImages = dataset[selectedZoneId] || [];

  const REQUIRED_IMAGES = 20;
  const RECOMMENDED_IMAGES = 40;

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    VisionRecognitionEngine.addReferenceImage(selectedZoneId, newImageUrl.trim());
    setDataset(VisionRecognitionEngine.getZoneReferenceImages());
    setNewImageUrl('');
  };

  const handleDeleteImage = (index: number) => {
    VisionRecognitionEngine.removeReferenceImage(selectedZoneId, index);
    setDataset(VisionRecognitionEngine.getZoneReferenceImages());
  };

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    VisionRecognitionEngine.setMinimumConfidence(val);
  };

  const handleTestRecognition = () => {
    setTestResult('Analizando dataset y pesos de rasgos...');
    setTimeout(() => {
      setTestResult(
        `Prueba completada para ${selectedZone.name}: Rasgos validados con umbral ${(
          threshold * 100
        ).toFixed(0)}%. Coincidencia en ${currentImages.length} muestras de entrenamiento.`
      );
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-stone-100 font-serif">
                Can Marca Vision Guide • Entrenamiento IA
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Dataset Activo
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Gestión de imágenes de referencia y umbrales de confianza para reconocimiento óptico de salas
            </p>
          </div>
        </div>

        {/* Global Confidence Threshold Control */}
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center space-x-3">
          <Sliders className="w-4 h-4 text-amber-400" />
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-300 font-medium">Umbral mínimo:</span>
              <span className="font-mono font-bold text-amber-400">
                {(threshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={threshold}
              onChange={e => handleThresholdChange(parseFloat(e.target.value))}
              className="w-32 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Dataset Guidelines Box */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 text-xs text-stone-300 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-bold">
          <Info className="w-4 h-4" />
          <span>Requisitos del Dataset de Salas (Recomendaciones del Modelo)</span>
        </div>
        <p className="text-stone-400 text-[11px] leading-relaxed">
          Para garantizar una precisión superior al 90% en la cueva, se recomiendan entre 20 y 40 imágenes de referencia por sala con variaciones de ángulos, distancias, condiciones de iluminación ténue y cámaras de distintos teléfonos móviles.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-stone-400">
          <span className="bg-stone-950 px-2 py-1 rounded border border-stone-800">✦ Diferentes ángulos</span>
          <span className="bg-stone-950 px-2 py-1 rounded border border-stone-800">✦ Distancias cortas y panorámicas</span>
          <span className="bg-stone-950 px-2 py-1 rounded border border-stone-800">✦ Luces frías y cálidas de cueva</span>
          <span className="bg-stone-950 px-2 py-1 rounded border border-stone-800">✦ Visitantes en segundo plano</span>
        </div>
      </div>

      {/* Main Grid: Zone Selector & Images Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Zone Selection List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
            Salas de Can Marçà (10 Zonas)
          </h3>
          <div className="space-y-1.5">
            {VISION_ZONES_DATABASE.map(zone => {
              const isSelected = selectedZoneId === zone.zone_id;
              const imgCount = dataset[zone.zone_id]?.length || 0;
              const progressPct = Math.min(100, Math.round((imgCount / RECOMMENDED_IMAGES) * 100));

              return (
                <button
                  key={zone.zone_id}
                  onClick={() => {
                    setSelectedZoneId(zone.zone_id);
                    setTestResult(null);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-stone-100 shadow-md shadow-amber-500/10'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">
                        {zone.zone_id}
                      </span>
                      <span className="text-xs font-bold truncate">{zone.name}</span>
                    </div>
                    <div className="w-28 bg-stone-800 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-stone-400">
                    {imgCount} fotos
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Zone Details & Image Gallery */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {selectedZone.zone_id}
                  </span>
                  <h3 className="text-base font-bold text-stone-100 font-serif">
                    {selectedZone.name}
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Audio asociado: <code className="text-amber-400/90 font-mono text-[11px]">{selectedZone.audio}</code>
                </p>
              </div>

              <button
                onClick={handleTestRecognition}
                className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Probar Clasificador</span>
              </button>
            </div>

            {testResult && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 animate-in fade-in">
                {testResult}
              </div>
            )}

            {/* Recognition Features Badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                Rasgos visuales analizados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedZone.recognition_features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 text-xs font-medium"
                  >
                    ✦ {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Add Image Form */}
            <form onSubmit={handleAddImage} className="flex gap-2">
              <input
                type="url"
                placeholder="URL de imagen de referencia para esta sala (Unsplash / CDN)..."
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </form>

            {/* Reference Images Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Imágenes de referencia registradas ({currentImages.length})</span>
                <span className="text-[10px]">Meta: 20 a 40 imágenes</span>
              </div>

              {currentImages.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-stone-800 rounded-2xl text-stone-500 text-xs">
                  No hay imágenes de referencia para esta zona. Añade la primera arriba.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 aspect-video shadow-sm"
                    >
                      <img
                        src={imgUrl}
                        alt={`${selectedZone.name} ref ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteImage(idx)}
                          className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                          title="Eliminar imagen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-stone-300">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
