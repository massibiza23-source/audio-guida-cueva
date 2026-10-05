import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Radio,
  MapPin,
  QrCode,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Upload,
  Camera,
  Link,
  Star,
  FolderOpen,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { TourPoint, LanguageCode } from '../../types';
import { StorageService } from '../../services/storageService';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';

const CAVE_PHOTO_PRESETS = [
  {
    name: 'Terraza y Puerto de San Miguel',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vistas panorámicas a la bahía del Puerto de San Miguel y Torre d’en Mular',
  },
  {
    name: 'Entrada kárstica en roca caliza',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Acceso a la cavidad kárstica excavada en roca calcárea',
  },
  {
    name: 'Bambalinas y cortinas minerales',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    caption: 'Formaciones onduladas minerales conocidas como bambalinas y refugio clandestino',
  },
  {
    name: 'Gran Lago y Templo de Buda',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Lago subterráneo cristalino y silueta rocosa que evoca a Buda',
  },
  {
    name: 'Niveles horizontales de calcita',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    caption: 'Líneas horizontales en las paredes que registran antiguos niveles freáticos',
  },
  {
    name: 'Vía de escape de contrabandistas',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Marcas negras y rojas que guiaban la evasión rápida en la oscuridad',
  },
  {
    name: 'Cascada subterránea con luz',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Espectáculo de agua y luz que revive el fluir milenario de la cueva',
  },
  {
    name: 'Lagos verdes esmeralda',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Aguas esmeralda fosforescentes fruto de sales minerales e iluminación',
  },
  {
    name: 'Zona seca con estalactitas fósiles',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    caption: 'Estalactitas fósiles detenidas en el tiempo por ausencia de humedad activa',
  },
  {
    name: 'Galería de salida y conservación',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    caption: 'El legado natural de Can Marçà protegido para las futuras generaciones',
  },
];

/**
 * Compresses an image file in browser to max 1280px width at 85% JPEG quality.
 * Prevents localStorage quota limits while preserving high visual quality.
 */
const compressImageFile = (file: File, maxWidth = 1280, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

interface PointManagerProps {
  points: TourPoint[];
  onRefresh: () => void;
}

export const PointManager: React.FC<PointManagerProps> = ({
  points,
  onRefresh,
}) => {
  const [editingPoint, setEditingPoint] = useState<TourPoint | null>(null);
  const [photoChangingPoint, setPhotoChangingPoint] = useState<TourPoint | null>(null);
  const [activeLang, setActiveLang] = useState<LanguageCode>('es');
  const [showPresetGallery, setShowPresetGallery] = useState(false);
  const [presetTarget, setPresetTarget] = useState<'main' | 'gallery'>('main');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const handleTogglePublish = (point: TourPoint) => {
    const updated = { ...point, published: !point.published };
    StorageService.updatePoint(updated);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el punto ${id}?`)) {
      StorageService.deletePoint(id);
      onRefresh();
    }
  };

  const handleDuplicate = (point: TourPoint) => {
    const newId = `CM-${String(points.length + 1).padStart(2, '0')}`;
    const copy: TourPoint = {
      ...point,
      id: newId,
      order: points.length + 1,
      title: `${point.title} (Copia)`,
      translations: {
        ...point.translations,
        es: {
          ...point.translations.es,
          title: `${point.translations.es.title} (Copia)`,
        },
      },
    };
    StorageService.updatePoint(copy);
    onRefresh();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoint) return;
    StorageService.updatePoint(editingPoint);
    setEditingPoint(null);
    onRefresh();
  };

  const handleCreateNew = () => {
    const newOrder = points.length + 1;
    const newId = `CM-${String(newOrder).padStart(2, '0')}`;
    const newPoint: TourPoint = {
      id: newId,
      order: newOrder,
      title: `Nueva Parada ${newOrder}`,
      subtitle: 'Descripción geológica',
      activation: {
        primary: 'beacon',
        secondary: 'qr',
        manual: true,
      },
      location: {
        gps: { latitude: 39.0833, longitude: 1.4422, radiusMeters: 15 },
      },
      beacon: {
        uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
        major: 1,
        minor: 100 + newOrder,
      },
      visual: {
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Nueva formación en Can Marçà',
      },
      keywords: ['cueva', 'ibiza', 'geologia'],
      qr: {
        enabled: true,
        url: `https://app.cuevadecanmarca.com/p/${newId}`,
      },
      published: true,
      durationSeconds: 40,
      translations: {
        es: {
          title: `Nueva Parada ${newOrder}`,
          subtitle: 'Descripción geológica',
          description: 'Texto descriptivo del punto.',
          transcript: 'Texto para transcripción accesible.',
        },
        en: { title: `New Point ${newOrder}`, subtitle: 'Geological feature', description: 'Description text.' },
        de: { title: `Neuer Punkt ${newOrder}`, subtitle: 'Geologische Station', description: 'Beschreibung.' },
        fr: { title: `Nouveau Point ${newOrder}`, subtitle: 'Formation géologique', description: 'Description.' },
        it: { title: `Nuovo Punto ${newOrder}`, subtitle: 'Formazione geologica', description: 'Descrizione.' },
        nl: { title: `Nieuw Punt ${newOrder}`, subtitle: 'Geologische formatie', description: 'Beschrijving.' },
        pt: { title: `Novo Ponto ${newOrder}`, subtitle: 'Formação geológica', description: 'Descrição.' },
      },
    };

    setEditingPoint(newPoint);
  };

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-stone-100 font-serif">Puntos del Recorrido ({points.length})</h3>
          <p className="text-xs text-stone-400">Configura paradas, balizas asignadas y textos de audio</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Punto</span>
        </button>
      </div>

      {/* Points Table / List */}
      <div className="space-y-2.5">
        {points
          .sort((a, b) => a.order - b.order)
          .map(point => {
            const esTrans = point.translations.es;
            return (
              <div
                key={point.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  point.published
                    ? 'bg-stone-900 border-stone-800'
                    : 'bg-stone-950/40 border-stone-850 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    onClick={() => setPhotoChangingPoint({ ...point })}
                    title="Hacer clic para cambiar fotos de esta parada"
                    className="group relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-stone-700 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
                  >
                    <img
                      src={point.visual.image}
                      alt={esTrans.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-400">
                      <Camera className="w-4 h-4" />
                      <span className="text-[8px] font-bold mt-0.5">Cambiar</span>
                    </div>
                    <div className="absolute top-1 left-1 bg-stone-950/80 px-1 rounded text-[9px] font-mono text-amber-400 font-bold">
                      #{point.order}
                    </div>
                    {point.visual.gallery && point.visual.gallery.length > 0 && (
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px] font-mono text-stone-300">
                        +{point.visual.gallery.length}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-0.5">
                      <span className="font-mono font-bold text-amber-400">{point.id}</span>
                      <span>•</span>
                      <span>{point.activation.primary.toUpperCase()}</span>
                      {point.beacon && <span>(Minor: {point.beacon.minor})</span>}
                    </div>
                    <h4 className="text-sm font-bold text-stone-100 truncate">{esTrans.title}</h4>
                    <p className="text-xs text-stone-400 truncate">{esTrans.subtitle}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                  {/* Dedicated Cambiar Fotos button */}
                  <button
                    onClick={() => setPhotoChangingPoint({ ...point })}
                    title="Cambiar fotos de la parada"
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 border border-stone-700 transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold hidden md:inline">Fotos</span>
                  </button>

                  <button
                    onClick={() => handleTogglePublish(point)}
                    title={point.published ? 'Despublicar' : 'Publicar'}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      point.published
                        ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/50'
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                    }`}
                  >
                    {point.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setEditingPoint({ ...point })}
                    title="Editar punto"
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 border border-stone-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(point)}
                    title="Duplicar punto"
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(point.id)}
                    title="Eliminar punto"
                    className="p-2 rounded-lg bg-stone-800 hover:bg-red-950/40 text-stone-400 hover:text-red-400 border border-stone-700 hover:border-red-800/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Edit / Create Modal */}
      {editingPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-100 font-serif">
                Editar Punto: {editingPoint.id}
              </h3>
              <button
                onClick={() => setEditingPoint(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Identificador ID:</label>
                  <input
                    type="text"
                    value={editingPoint.id}
                    onChange={e => setEditingPoint({ ...editingPoint, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Orden de parada (1-10):</label>
                  <input
                    type="number"
                    value={editingPoint.order}
                    onChange={e => setEditingPoint({ ...editingPoint, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
              </div>

              {/* Activation & Beacon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Activación primaria:</label>
                  <select
                    value={editingPoint.activation.primary}
                    onChange={e =>
                      setEditingPoint({
                        ...editingPoint,
                        activation: { ...editingPoint.activation, primary: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                  >
                    <option value="beacon">Beacon Bluetooth</option>
                    <option value="gps">GPS (Terraza)</option>
                    <option value="qr">Código QR</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Beacon Minor:</label>
                  <input
                    type="number"
                    value={editingPoint.beacon?.minor || ''}
                    onChange={e =>
                      setEditingPoint({
                        ...editingPoint,
                        beacon: {
                          uuid: editingPoint.beacon?.uuid || 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
                          major: editingPoint.beacon?.major || 1,
                          minor: parseInt(e.target.value, 10) || 101,
                        },
                      })
                    }
                    placeholder="101 a 109"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Radio GPS (metros):</label>
                  <input
                    type="number"
                    value={editingPoint.location.gps.radiusMeters}
                    onChange={e =>
                      setEditingPoint({
                        ...editingPoint,
                        location: {
                          gps: {
                            ...editingPoint.location.gps,
                            radiusMeters: parseInt(e.target.value, 10) || 15,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono"
                  />
                </div>
              </div>

              {/* Visual Photo Management & Editor Section */}
              <div className="space-y-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-stone-200 text-xs sm:text-sm">
                      Gestión de Fotos de la Parada
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    Foto principal y galería secundaria
                  </span>
                </div>

                {/* Main Photo Preview & Controls */}
                <div className="space-y-2.5">
                  <label className="text-stone-300 font-semibold block text-[11px]">
                    Foto Principal:
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    {/* Live Image Preview */}
                    <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden border border-stone-700 bg-stone-900 shrink-0 shadow-md">
                      <img
                        src={editingPoint.visual.image}
                        alt="Vista previa de la parada"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-amber-400 font-bold">
                        Principal
                      </div>
                    </div>

                    {/* Action Buttons to Change Main Photo */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {/* 1. Upload from Device/PC */}
                        <label className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const dataUrl = ev.target?.result as string;
                                setEditingPoint({
                                  ...editingPoint,
                                  visual: { ...editingPoint.visual, image: dataUrl },
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>

                        {/* 2. Take with Camera (mobile) */}
                        <label className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hacer foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const dataUrl = ev.target?.result as string;
                                setEditingPoint({
                                  ...editingPoint,
                                  visual: { ...editingPoint.visual, image: dataUrl },
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>

                        {/* 3. Pick from Cave Preset Catalog */}
                        <button
                          type="button"
                          onClick={() => {
                            setPresetTarget('main');
                            setShowPresetGallery(true);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Catálogo Can Marçà</span>
                        </button>
                      </div>

                      {/* URL input */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="O pega una URL de imagen (https://...)"
                            value={editingPoint.visual.image}
                            onChange={(e) =>
                              setEditingPoint({
                                ...editingPoint,
                                visual: { ...editingPoint.visual, image: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-[11px] focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      {/* Caption Input */}
                      <div>
                        <input
                          type="text"
                          placeholder="Pie de foto descriptivo (opcional)..."
                          value={editingPoint.visual.caption || ''}
                          onChange={(e) =>
                            setEditingPoint({
                              ...editingPoint,
                              visual: { ...editingPoint.visual, caption: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-[11px] focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Photos / Gallery Section */}
                <div className="pt-3 border-t border-stone-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300 font-semibold text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Fotos Adicionales de la Parada ({editingPoint.visual.gallery?.length || 0})
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Aparecerán en el carrusel de detalle
                    </span>
                  </div>

                  {/* Existing Gallery Photos */}
                  {editingPoint.visual.gallery && editingPoint.visual.gallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {editingPoint.visual.gallery.map((galleryUrl, gIdx) => (
                        <div
                          key={gIdx}
                          className="group relative aspect-video rounded-xl overflow-hidden border border-stone-800 bg-stone-900 shadow-sm"
                        >
                          <img
                            src={galleryUrl}
                            alt={`Foto adicional ${gIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            {/* Make Main Photo */}
                            <button
                              type="button"
                              onClick={() => {
                                const currentMain = editingPoint.visual.image;
                                const newGallery = [...(editingPoint.visual.gallery || [])];
                                newGallery[gIdx] = currentMain;
                                setEditingPoint({
                                  ...editingPoint,
                                  visual: {
                                    ...editingPoint.visual,
                                    image: galleryUrl,
                                    gallery: newGallery,
                                  },
                                });
                              }}
                              className="p-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                              title="Hacer foto principal"
                            >
                              <Star className="w-3 h-3 fill-current" />
                            </button>

                            {/* Delete from gallery */}
                            <button
                              type="button"
                              onClick={() => {
                                const newGallery = [...(editingPoint.visual.gallery || [])];
                                newGallery.splice(gIdx, 1);
                                setEditingPoint({
                                  ...editingPoint,
                                  visual: {
                                    ...editingPoint.visual,
                                    gallery: newGallery,
                                  },
                                });
                              }}
                              className="p-1 rounded bg-red-500/80 hover:bg-red-500 text-white"
                              title="Eliminar foto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Extra Photo Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Upload extra file */}
                    <label className="py-1 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors">
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>Añadir foto desde archivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            const existingGallery = editingPoint.visual.gallery || [];
                            setEditingPoint({
                              ...editingPoint,
                              visual: {
                                ...editingPoint.visual,
                                gallery: [...existingGallery, dataUrl],
                              },
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    {/* Pick from preset catalog for gallery */}
                    <button
                      type="button"
                      onClick={() => {
                        setPresetTarget('gallery');
                        setShowPresetGallery(true);
                      }}
                      className="py-1 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <FolderOpen className="w-3 h-3 text-amber-400" />
                      <span>Añadir desde catálogo Can Marçà</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Multilingual Translation Switcher */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-semibold text-stone-300">Contenido del Idioma:</span>
                  <div className="flex flex-wrap gap-1">
                    {SUPPORTED_LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setActiveLang(l.code)}
                        className={`px-2 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 uppercase ${
                          activeLang === l.code ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Título ({activeLang}):</label>
                  <input
                    type="text"
                    value={editingPoint.translations[activeLang]?.title || ''}
                    onChange={e => {
                      const cur = editingPoint.translations[activeLang] || { title: '', subtitle: '', description: '' };
                      setEditingPoint({
                        ...editingPoint,
                        translations: {
                          ...editingPoint.translations,
                          [activeLang]: { ...cur, title: e.target.value },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Subtítulo ({activeLang}):</label>
                  <input
                    type="text"
                    value={editingPoint.translations[activeLang]?.subtitle || ''}
                    onChange={e => {
                      const cur = editingPoint.translations[activeLang] || { title: '', subtitle: '', description: '' };
                      setEditingPoint({
                        ...editingPoint,
                        translations: {
                          ...editingPoint.translations,
                          [activeLang]: { ...cur, subtitle: e.target.value },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Descripción explicativa ({activeLang}):</label>
                  <textarea
                    rows={3}
                    value={editingPoint.translations[activeLang]?.description || ''}
                    onChange={e => {
                      const cur = editingPoint.translations[activeLang] || { title: '', subtitle: '', description: '' };
                      setEditingPoint({
                        ...editingPoint,
                        translations: {
                          ...editingPoint.translations,
                          [activeLang]: { ...cur, description: e.target.value },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingPoint(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Photo Changer Modal */}
      {photoChangingPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-100 font-serif flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Cambiar Fotos: {photoChangingPoint.id} • {photoChangingPoint.translations.es?.title || photoChangingPoint.title}</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Sube una foto, usa la cámara o elige del catálogo oficial de Can Marçà
                </p>
              </div>
              <button
                onClick={() => setPhotoChangingPoint(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Main Photo Preview */}
              <div className="space-y-2">
                <label className="text-stone-300 font-semibold block text-xs">
                  Foto Principal Actual:
                </label>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-stone-700 bg-stone-950 shadow-lg">
                  <img
                    src={photoChangingPoint.visual.image}
                    alt={photoChangingPoint.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/75 text-[10px] font-mono text-amber-400 font-bold">
                    Foto Principal
                  </div>
                </div>
              </div>

              {/* Action Buttons to Change Main Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Upload with automatic compression */}
                <label className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-amber-500/20">
                  <Upload className="w-4 h-4" />
                  <span>Subir foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const dataUrl = await compressImageFile(file);
                      setPhotoChangingPoint({
                        ...photoChangingPoint,
                        visual: { ...photoChangingPoint.visual, image: dataUrl },
                      });
                    }}
                  />
                </label>

                {/* 2. Camera */}
                <label className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Hacer foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const dataUrl = await compressImageFile(file);
                      setPhotoChangingPoint({
                        ...photoChangingPoint,
                        visual: { ...photoChangingPoint.visual, image: dataUrl },
                      });
                    }}
                  />
                </label>

                {/* 3. Catalog */}
                <button
                  type="button"
                  onClick={() => {
                    setPresetTarget('main');
                    setShowPresetGallery(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Catálogo Can Marçà</span>
                </button>
              </div>

              {/* URL Input */}
              <div className="space-y-1">
                <label className="text-[11px] text-stone-400">O introduce una URL de imagen:</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={photoChangingPoint.visual.image}
                  onChange={(e) =>
                    setPhotoChangingPoint({
                      ...photoChangingPoint,
                      visual: { ...photoChangingPoint.visual, image: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Caption Input */}
              <div className="space-y-1">
                <label className="text-[11px] text-stone-400">Pie de foto descriptivo (opcional):</label>
                <input
                  type="text"
                  placeholder="Ej: Vista geológica de las formaciones en Can Marçà"
                  value={photoChangingPoint.visual.caption || ''}
                  onChange={(e) =>
                    setPhotoChangingPoint({
                      ...photoChangingPoint,
                      visual: { ...photoChangingPoint.visual, caption: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Secondary Gallery Photos */}
              <div className="pt-3 border-t border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Fotos Adicionales en Galería ({photoChangingPoint.visual.gallery?.length || 0})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <label className="py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors">
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>Añadir foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await compressImageFile(file);
                          const cur = photoChangingPoint.visual.gallery || [];
                          setPhotoChangingPoint({
                            ...photoChangingPoint,
                            visual: {
                              ...photoChangingPoint.visual,
                              gallery: [...cur, dataUrl],
                            },
                          });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setPresetTarget('gallery');
                        setShowPresetGallery(true);
                      }}
                      className="py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <FolderOpen className="w-3 h-3" />
                      <span>Catálogo</span>
                    </button>
                  </div>
                </div>

                {photoChangingPoint.visual.gallery && photoChangingPoint.visual.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {photoChangingPoint.visual.gallery.map((gUrl, gIdx) => (
                      <div key={gIdx} className="group relative aspect-video rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
                        <img src={gUrl} alt={`Foto ${gIdx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <button
                            type="button"
                            onClick={() => {
                              const curMain = photoChangingPoint.visual.image;
                              const newG = [...(photoChangingPoint.visual.gallery || [])];
                              newG[gIdx] = curMain;
                              setPhotoChangingPoint({
                                ...photoChangingPoint,
                                visual: {
                                  ...photoChangingPoint.visual,
                                  image: gUrl,
                                  gallery: newG,
                                },
                              });
                            }}
                            className="p-1.5 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
                            title="Hacer foto principal"
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newG = [...(photoChangingPoint.visual.gallery || [])];
                              newG.splice(gIdx, 1);
                              setPhotoChangingPoint({
                                ...photoChangingPoint,
                                visual: {
                                  ...photoChangingPoint.visual,
                                  gallery: newG,
                                },
                              });
                            }}
                            className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                            title="Eliminar de la galería"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 italic">No hay fotos secundarias aún para esta parada.</p>
                )}
              </div>
            </div>

            {/* Save Buttons */}
            <div className="p-4 border-t border-stone-800 flex items-center justify-end gap-2 bg-stone-950/60">
              <button
                type="button"
                onClick={() => setPhotoChangingPoint(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  StorageService.updatePoint(photoChangingPoint);
                  onRefresh();
                  setPhotoChangingPoint(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Fotos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Can Marçà Predefined Photos Selector Modal (Global for both photo modal and edit modal) */}
      {showPresetGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-100 font-serif">
                  Catálogo de Fotografías de Can Marçà
                </h4>
                <p className="text-[11px] text-stone-400">
                  {presetTarget === 'main'
                    ? 'Selecciona una foto para la portada principal de la parada'
                    : 'Selecciona una foto para añadir a la galería de esta parada'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetGallery(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 gap-3 max-h-[60vh]">
              {CAVE_PHOTO_PRESETS.map((preset, pIdx) => (
                <div
                  key={pIdx}
                  onClick={() => {
                    if (photoChangingPoint) {
                      if (presetTarget === 'main') {
                        setPhotoChangingPoint({
                          ...photoChangingPoint,
                          visual: {
                            ...photoChangingPoint.visual,
                            image: preset.url,
                            caption: preset.caption,
                          },
                        });
                      } else {
                        const curG = photoChangingPoint.visual.gallery || [];
                        setPhotoChangingPoint({
                          ...photoChangingPoint,
                          visual: {
                            ...photoChangingPoint.visual,
                            gallery: [...curG, preset.url],
                          },
                        });
                      }
                    } else if (editingPoint) {
                      if (presetTarget === 'main') {
                        setEditingPoint({
                          ...editingPoint,
                          visual: {
                            ...editingPoint.visual,
                            image: preset.url,
                            caption: preset.caption,
                          },
                        });
                      } else {
                        const existingGallery = editingPoint.visual.gallery || [];
                        setEditingPoint({
                          ...editingPoint,
                          visual: {
                            ...editingPoint.visual,
                            gallery: [...existingGallery, preset.url],
                          },
                        });
                      }
                    }
                    setShowPresetGallery(false);
                  }}
                  className="group rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 cursor-pointer hover:border-amber-500/80 transition-all flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold shadow-md">
                        Seleccionar
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-bold text-stone-200 group-hover:text-amber-400 transition-colors truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-stone-400 line-clamp-1">
                      {preset.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
