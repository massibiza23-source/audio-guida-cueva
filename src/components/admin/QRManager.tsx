import React, { useState } from 'react';
import { QrCode, Printer, Download, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { TourPoint } from '../../types';

interface QRManagerProps {
  points: TourPoint[];
}

export const QRManager: React.FC<QRManagerProps> = ({ points }) => {
  const [selectedPointId, setSelectedPointId] = useState<string>('CM-01');

  const selectedPoint = points.find(p => p.id === selectedPointId) || points[0];

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG QR matrix representation (or standard visual QR)
  const qrTargetUrl = selectedPoint.qr.url || `https://app.cuevadecanmarca.com/p/${selectedPoint.id}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-100 font-serif">Gestor de Códigos QR Físicos</h3>
          <p className="text-xs text-stone-400">
            Diseño e impresión de placas identificativas para colocar en los puntos del recorrido
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Placa Actual</span>
        </button>
      </div>

      {/* Point Selector Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {points.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPointId(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 border transition-all ${
              selectedPointId === p.id
                ? 'bg-amber-500 text-stone-950 border-amber-400'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            {p.id}
          </button>
        ))}
      </div>

      {/* Printable Plaque Preview */}
      <div className="flex flex-col items-center justify-center p-6 bg-stone-950 rounded-3xl border border-stone-800">
        <div
          id="qr-plaque-print-area"
          className="w-full max-w-sm bg-stone-900 border-2 border-amber-500/80 rounded-3xl p-6 text-center shadow-2xl space-y-4 text-stone-100 print:bg-white print:text-black print:border-black"
        >
          {/* Plaque Header */}
          <div className="border-b border-stone-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-serif font-bold text-sm flex items-center justify-center mx-auto mb-1.5 shadow-sm">
              CM
            </div>
            <h4 className="font-serif font-bold text-base tracking-wide uppercase text-amber-400 print:text-black">
              Cueva de Can Marçà
            </h4>
            <p className="text-[10px] text-stone-400 print:text-gray-600 uppercase tracking-widest">
              Audioguía Oficial • Ibiza
            </p>
          </div>

          {/* Point Identification */}
          <div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300 print:border print:border-black print:text-black">
              PARADA #{selectedPoint.order} • {selectedPoint.id}
            </span>
            <h3 className="text-lg font-bold mt-1 text-white print:text-black font-serif">
              {selectedPoint.translations.es.title}
            </h3>
            <p className="text-xs text-stone-400 print:text-gray-600">
              {selectedPoint.translations.en?.title || selectedPoint.translations.es.title}
            </p>
          </div>

          {/* QR Code Canvas */}
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
            {/* SVG QR Code Pattern with logo in center */}
            <svg
              viewBox="0 0 120 120"
              className="w-44 h-44 text-stone-950 mx-auto"
              fill="currentColor"
            >
              {/* Corner 1 */}
              <rect x="5" y="5" width="30" height="30" fill="black" />
              <rect x="10" y="10" width="20" height="20" fill="white" />
              <rect x="14" y="14" width="12" height="12" fill="black" />

              {/* Corner 2 */}
              <rect x="85" y="5" width="30" height="30" fill="black" />
              <rect x="90" y="10" width="20" height="20" fill="white" />
              <rect x="94" y="14" width="12" height="12" fill="black" />

              {/* Corner 3 */}
              <rect x="5" y="85" width="30" height="30" fill="black" />
              <rect x="10" y="90" width="20" height="20" fill="white" />
              <rect x="14" y="94" width="12" height="12" fill="black" />

              {/* QR Data Dots */}
              <rect x="42" y="10" width="6" height="6" fill="black" />
              <rect x="54" y="10" width="6" height="6" fill="black" />
              <rect x="66" y="10" width="6" height="6" fill="black" />
              <rect x="42" y="24" width="6" height="6" fill="black" />
              <rect x="66" y="24" width="6" height="6" fill="black" />

              <rect x="10" y="42" width="6" height="6" fill="black" />
              <rect x="24" y="42" width="6" height="6" fill="black" />
              <rect x="10" y="54" width="6" height="6" fill="black" />
              <rect x="24" y="66" width="6" height="6" fill="black" />

              {/* Center matrix */}
              <rect x="42" y="42" width="36" height="36" fill="black" />
              <rect x="48" y="48" width="24" height="24" fill="white" />
              <text
                x="60"
                y="65"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="black"
                fontFamily="sans-serif"
              >
                CM
              </text>

              <rect x="85" y="42" width="6" height="6" fill="black" />
              <rect x="98" y="54" width="6" height="6" fill="black" />
              <rect x="85" y="66" width="6" height="6" fill="black" />

              <rect x="42" y="85" width="6" height="6" fill="black" />
              <rect x="54" y="98" width="6" height="6" fill="black" />
              <rect x="66" y="85" width="6" height="6" fill="black" />
              <rect x="85" y="85" width="6" height="6" fill="black" />
              <rect x="98" y="98" width="6" height="6" fill="black" />
            </svg>
          </div>

          {/* Footer Call to Action */}
          <div className="pt-2 text-[11px] text-stone-400 print:text-gray-700 space-y-0.5">
            <p className="font-semibold text-stone-200 print:text-black">
              Escanea para escuchar la explicación
            </p>
            <p className="font-mono text-[10px] text-amber-400/90 print:text-black">
              {qrTargetUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
