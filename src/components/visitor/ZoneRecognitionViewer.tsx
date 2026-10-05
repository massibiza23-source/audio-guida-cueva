import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Map as MapIcon,
  HelpCircle,
  Sparkles,
  Play,
  Volume2,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Upload,
  Thermometer,
  Droplets,
  Layers,
  ArrowUpRight,
  Crosshair,
  Scan,
  Compass,
  Check,
  AlertCircle,
  Eye,
  Radio,
  Info,
  QrCode,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  StopCircle,
} from 'lucide-react';
import { TourPoint, LanguageCode, AudioPlaybackState } from '../../types';
import { CAVE_ZONES, CaveZoneData } from '../../data/zoneRecognitionData';
import {
  VisionRecognitionEngine,
  VISION_ZONES_DATABASE,
  MultiFrameAnalysisResult,
} from '../../services/visionRecognitionEngine';
import { StorageService } from '../../services/storageService';

interface ZoneRecognitionViewerProps {
  isOpen: boolean;
  onClose: () => void;
  points: TourPoint[];
  currentPointId: string | null;
  visitedPointIds: string[];
  language: LanguageCode;
  playbackState: AudioPlaybackState;
  onSelectAndPlayPoint: (point: TourPoint) => void;
  onOpenPointDetail?: (point: TourPoint) => void;
  onOpenBeaconSim?: () => void;
  onOpenQRScanner?: () => void;
}

type ViewerTab = 'camera' | 'map' | 'clues' | 'sensors';

export const ZoneRecognitionViewer: React.FC<ZoneRecognitionViewerProps> = ({
  isOpen,
  onClose,
  points,
  currentPointId,
  visitedPointIds,
  language,
  playbackState,
  onSelectAndPlayPoint,
  onOpenPointDetail,
  onOpenBeaconSim,
  onOpenQRScanner,
}) => {
  const [activeTab, setActiveTab] = useState<ViewerTab>('camera');

  // Camera State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1x, 2x, 3x

  // Multi-frame Scan State (frames_per_scan: 3)
  const [isScanning, setIsScanning] = useState(false);
  const [scanFrameIndex, setScanFrameIndex] = useState<number>(0);
  const [scanStepMessage, setScanStepMessage] = useState('Apunta la cámara a la formación o sala...');

  // Multi-frame Result
  const [analysisResult, setAnalysisResult] = useState<MultiFrameAnalysisResult | null>(() => {
    // Default initial preview with CM-03 or current point
    const initId = currentPointId || 'CM-03';
    const dummyCanvas = document.createElement('canvas');
    dummyCanvas.width = 100;
    dummyCanvas.height = 100;
    return VisionRecognitionEngine.analyzeMultipleFrames([dummyCanvas], initId);
  });

  // Automatic Audio countdown
  const [autoPlayCountdown, setAutoPlayCountdown] = useState<number | null>(null);
  const autoPlayTimerRef = useRef<any>(null);

  // Selected Zone in Map or Clues
  const [selectedZone, setSelectedZone] = useState<CaveZoneData>(() => {
    const initialPointId = currentPointId || 'CM-01';
    return CAVE_ZONES.find(z => z.pointId === initialPointId) || CAVE_ZONES[0];
  });

  // Track last played to prevent duplicates
  const [lastPlayedZoneId, setLastPlayedZoneId] = useState<string | null>(currentPointId);

  // Initialize camera when viewer opens and camera tab is active
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      clearAutoPlayTimer();
      return;
    }

    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      clearAutoPlayTimer();
    };
  }, [isOpen, activeTab]);

  const clearAutoPlayTimer = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    setAutoPlayCountdown(null);
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Cámara no compatible con este dispositivo. Usa fotos de muestra o el plano kárstico.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error', err);
      setCameraError('Permiso de cámara no concedido. Puedes probar con las fotos de referencia o el plano.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  /**
   * Execute 3-frame scan sequence strictly per specification:
   * use_multiple_frames: true, frames_per_scan: 3, avoid_single_frame_decision: true
   */
  const handlePerformMultiFrameScan = (targetZoneHint?: string) => {
    clearAutoPlayTimer();
    setIsScanning(true);
    setScanFrameIndex(1);
    setScanStepMessage('Fotograma 1/3: Analizando relieve y textura kárstica...');

    const capturedCanvases: HTMLCanvasElement[] = [];

    const captureSingleFrame = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current && videoRef.current.videoWidth > 0) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
      return canvas;
    };

    // Frame 1 capture
    capturedCanvases.push(captureSingleFrame());

    // Frame 2 at 450ms
    setTimeout(() => {
      setScanFrameIndex(2);
      setScanStepMessage('Fotograma 2/3: Comparando con base de datos de salas...');
      capturedCanvases.push(captureSingleFrame());
    }, 450);

    // Frame 3 at 900ms
    setTimeout(() => {
      setScanFrameIndex(3);
      setScanStepMessage('Fotograma 3/3: Verificando rasgos geológicos y minerales...');
      capturedCanvases.push(captureSingleFrame());
    }, 900);

    // Decision at 1350ms
    setTimeout(() => {
      const result = VisionRecognitionEngine.analyzeMultipleFrames(capturedCanvases, targetZoneHint);
      setAnalysisResult(result);
      setIsScanning(false);
      setScanStepMessage('Análisis completado');

      // Update selected zone for map synchronization
      const matchedZoneData = CAVE_ZONES.find(z => z.pointId === result.zone_id);
      if (matchedZoneData) {
        setSelectedZone(matchedZoneData);
      }

      // Check automatic audio behavior
      evaluateAutoPlay(result);
    }, 1350);
  };

  const evaluateAutoPlay = (result: MultiFrameAnalysisResult) => {
    const audioEval = VisionRecognitionEngine.shouldStartAudio(
      result.zone_id,
      playbackState.currentPointId,
      playbackState.isPlaying,
      lastPlayedZoneId,
      result.tier
    );

    if (audioEval.canPlay) {
      // 2 second countdown before automatic playback so visitor sees confirmation
      setAutoPlayCountdown(2);
      let remaining = 2;
      autoPlayTimerRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearAutoPlayTimer();
          handleConfirmAndPlay(result.zone_id, true);
        } else {
          setAutoPlayCountdown(remaining);
        }
      }, 1000);
    }
  };

  const handleConfirmAndPlay = (zoneId: string, isAutomatic = false) => {
    clearAutoPlayTimer();
    const targetPoint = points.find(p => p.id === zoneId);
    if (targetPoint) {
      StorageService.trackEvent('camera_scanned', {
        pointId: zoneId,
        activationMethod: 'camera',
        metadata: {
          isAutomatic,
          confidence: analysisResult?.confidencePercent || 95,
        },
      });

      setLastPlayedZoneId(zoneId);
      onSelectAndPlayPoint(targetPoint);
      onClose();
    }
  };

  const handleSelectSampleTest = (zone: CaveZoneData) => {
    handlePerformMultiFrameScan(zone.pointId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanStepMessage('Procesando fotografía...');

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const result = VisionRecognitionEngine.analyzeMultipleFrames([canvas, canvas, canvas]);
          setAnalysisResult(result);
          const matchedZone = CAVE_ZONES.find(z => z.pointId === result.zone_id);
          if (matchedZone) setSelectedZone(matchedZone);
          evaluateAutoPlay(result);
        }
        setIsScanning(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh] h-[870px]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-bold">
              <Camera className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-100 font-serif">
                  Can Marçà Vision Guide
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Reconocimiento Óptico IA
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Apunta la cámara para reconocer la sala y reproducir la audioguía
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            aria-label="Cerrar visor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between p-2 bg-stone-950/50 border-b border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Reconocer zona</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Plano de la Cueva</span>
          </button>

          <button
            onClick={() => setActiveTab('clues')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'clues'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Rasgos visuales</span>
          </button>

          <button
            onClick={() => setActiveTab('sensors')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'sensors'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>Telemetría</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: CAMERA VISION RECOGNITION */}
          {activeTab === 'camera' && (
            <div className="space-y-3.5">
              {/* Camera Preview Viewport with AR Recognition Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center group shadow-inner">
                {/* Live Video with Digital Zoom support */}
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-stone-400 max-w-sm">
                    {cameraError ? (
                      <>
                        <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                        <p className="text-xs text-stone-300 font-medium mb-3">{cameraError}</p>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reintentar cámara
                        </button>
                      </>
                    ) : (
                      <>
                        <Camera className="w-10 h-10 text-stone-600 mb-2 animate-pulse" />
                        <p className="text-xs text-stone-300 font-medium mb-1">
                          Iniciando sensor visual de la cueva...
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Enfoca la bóveda, cascada, lagos o formaciones rocosas
                        </p>
                      </>
                    )}
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* AR HUD / Recognition Frame & Scan Animations */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3.5 sm:p-4">
                  {/* Top Bar with Status and Zoom Controls */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-stone-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1.5 font-mono shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      VISIÓN EN VIVO • 3 FOTOGRAMAS
                    </span>

                    {/* Zoom Toggle Pill (pointer-events-auto) */}
                    <div className="pointer-events-auto flex items-center bg-stone-950/85 backdrop-blur-md border border-stone-800 rounded-full p-0.5 text-xs text-stone-300">
                      <button
                        onClick={() => setZoomLevel(1)}
                        className={`px-2 py-0.5 rounded-full font-mono transition-colors ${
                          zoomLevel === 1 ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:text-stone-100'
                        }`}
                      >
                        1x
                      </button>
                      <button
                        onClick={() => setZoomLevel(2)}
                        className={`px-2 py-0.5 rounded-full font-mono transition-colors ${
                          zoomLevel === 2 ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:text-stone-100'
                        }`}
                      >
                        2x
                      </button>
                      <button
                        onClick={() => setZoomLevel(3)}
                        className={`px-2 py-0.5 rounded-full font-mono transition-colors ${
                          zoomLevel === 3 ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:text-stone-100'
                        }`}
                      >
                        3x
                      </button>
                    </div>
                  </div>

                  {/* Center Target Recognition Box */}
                  <div className="relative mx-auto w-48 sm:w-64 h-36 sm:h-44 border border-dashed border-amber-400/50 rounded-2xl flex items-center justify-center">
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

                    {/* Laser Scanner Bar during active scan */}
                    {isScanning && (
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_14px_#f59e0b] animate-bounce"></div>
                    )}

                    <div className="flex flex-col items-center text-center p-2">
                      <Crosshair className={`w-7 h-7 ${isScanning ? 'text-amber-400 animate-spin' : 'text-amber-400/70'}`} />
                      <p className="text-[11px] font-mono text-amber-300 font-semibold mt-1.5 uppercase tracking-wider max-w-[190px]">
                        {isScanning ? scanStepMessage : 'Encuadra la zona'}
                      </p>
                      {isScanning && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`w-2 h-2 rounded-full ${scanFrameIndex >= 1 ? 'bg-amber-400' : 'bg-stone-700'}`}></span>
                          <span className={`w-2 h-2 rounded-full ${scanFrameIndex >= 2 ? 'bg-amber-400' : 'bg-stone-700'}`}></span>
                          <span className={`w-2 h-2 rounded-full ${scanFrameIndex >= 3 ? 'bg-amber-400' : 'bg-stone-700'}`}></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Telemetry HUD Bar */}
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span className="bg-stone-950/80 px-2 py-0.5 rounded backdrop-blur font-mono text-stone-300">
                      Luz: {analysisResult?.environmentTelemetry.lighting || 'Óptima'}
                    </span>
                    <span className="bg-stone-950/80 px-2 py-0.5 rounded backdrop-blur font-mono text-stone-300">
                      Base de datos: 10 Zonas de Can Marçà
                    </span>
                  </div>
                </div>
              </div>

              {/* Camera Manual Scan & Upload Trigger Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePerformMultiFrameScan()}
                  disabled={isScanning}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Scan className="w-4 h-4 text-stone-950" />
                  <span>{isScanning ? 'Escaneando 3 fotogramas...' : 'Reconocer zona'}</span>
                </button>

                <label className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer transition-colors flex items-center justify-center" title="Subir foto para reconocimiento">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Automatic Play Countdown Banner if 90-100% confidence */}
              {autoPlayCountdown !== null && analysisResult && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-3 flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs font-mono">
                      {autoPlayCountdown}s
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-300">Zona confirmada automáticamente</p>
                      <p className="text-[11px] text-emerald-400/80">
                        Iniciando audioguía de {analysisResult.name}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleConfirmAndPlay(analysisResult.zone_id, true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 text-stone-950 text-xs font-bold hover:bg-emerald-400"
                    >
                      Reproducir ya
                    </button>
                    <button
                      onClick={clearAutoPlayTimer}
                      className="px-2 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
                    >
                      Pausar
                    </button>
                  </div>
                </div>
              )}

              {/* Recognition Result Card with Tier Indicator */}
              {analysisResult && (
                <div
                  className={`bg-stone-900 border rounded-3xl p-4 shadow-xl space-y-3 transition-colors ${
                    analysisResult.tier === '90_100'
                      ? 'border-emerald-500/60 bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/20'
                      : analysisResult.tier === '75_89'
                      ? 'border-amber-500/60 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/20'
                      : 'border-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {/* Confidence Indicator with user-specified tier colors */}
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                            analysisResult.tier === '90_100'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : analysisResult.tier === '75_89'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {analysisResult.confidencePercent}% Coincidencia
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          {analysisResult.zone_id}
                        </span>
                      </div>

                      {/* Recognized Zone Name */}
                      <h3 className="text-lg font-bold text-stone-100 font-serif mt-1">
                        {analysisResult.name}
                      </h3>
                      <p className="text-xs text-amber-300/90 font-medium">
                        {analysisResult.message}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {analysisResult.zone_id === 'CM-01' ? 'Exterior (+105m)' : 'Galería kárstica'}
                      </span>
                      <p className="text-[10px] text-stone-400">
                        {analysisResult.framesAnalyzed} fotogramas analizados
                      </p>
                    </div>
                  </div>

                  {/* Matched Features Tags */}
                  <div className="bg-stone-950/60 rounded-2xl p-3 border border-stone-800/80 space-y-1.5">
                    <p className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                      Rasgos visuales coincidentes:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matchedFeatures.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-stone-900 text-stone-200 border border-stone-800 text-[11px]"
                        >
                          ✦ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Audio Controls & Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Audio Start Button */}
                    <button
                      onClick={() => handleConfirmAndPlay(analysisResult.zone_id, false)}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Reproducir explicación de esta zona</span>
                    </button>

                    <button
                      onClick={() => {
                        const targetZone = CAVE_ZONES.find(z => z.pointId === analysisResult.zone_id);
                        if (targetZone) setSelectedZone(targetZone);
                        setActiveTab('map');
                      }}
                      className="py-3 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1.5"
                    >
                      <MapIcon className="w-4 h-4 text-amber-400" />
                      <span>Ver plano</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Reference Gallery / 10 Cave Zones Test Presets */}
              <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Probar detector con fotos de referencia de las 10 zonas:
                  </span>
                  <span className="text-[10px] text-stone-500">10 Salas</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                  {CAVE_ZONES.map((zone) => {
                    const isSelected = analysisResult?.zone_id === zone.pointId;
                    return (
                      <button
                        key={zone.pointId}
                        onClick={() => handleSelectSampleTest(zone)}
                        className={`flex-shrink-0 flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <img
                          src={zone.sampleImages[0].url}
                          alt={zone.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="text-[11px] leading-tight">
                          <p className="font-semibold text-stone-200 truncate max-w-[110px]">
                            {zone.pointId} {zone.name}
                          </p>
                          <p className="text-[10px] text-stone-400">{zone.depthMeters}m prof.</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fallback System Navigation strictly per JSON: Camera AI -> Beacon -> QR -> Manual */}
              <div className="bg-stone-950/40 border border-stone-800 rounded-2xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    Sistemas alternativos de detección:
                  </span>
                  <span className="text-[10px] text-stone-500">Modo de respaldo</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenBeaconSim) onOpenBeaconSim();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>Baliza Beacon</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenQRScanner) onOpenQRScanner();
                    }}
                    className="py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>Escanear QR</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('map')}
                    className="py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Selección Manual</span>
                  </button>
                </div>
              </div>

              {/* Privacy Notice per user constraints */}
              <div className="flex items-center gap-2 px-2 py-1 text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Privacidad garantizada: Las imágenes se analizan en memoria de tu navegador y se descartan inmediatamente. Sin reconocimiento facial ni almacenamiento en servidores.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE 2.5D CAVE TOPOGRAPHY & MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                <span>Corte topográfico transversal de Can Marçà (Acantilado a -14m)</span>
                <span className="font-mono text-amber-400">10 Estaciones</span>
              </div>

              {/* SVG Cave Section & Path */}
              <div className="relative bg-stone-950 rounded-3xl border border-stone-800 p-4 overflow-hidden shadow-2xl">
                <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] select-none">
                  <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-md">
                    <defs>
                      <linearGradient id="caveBackGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1c1917" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#0c0a09" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#09090b" stopOpacity="1" />
                      </linearGradient>

                      <linearGradient id="cliffSeaGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0369a1" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
                      </linearGradient>

                      <linearGradient id="cavePathGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="40%" stopColor="#10b981" />
                        <stop offset="70%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>

                    {/* Exterior Sky & Sea Cliff */}
                    <rect x="0" y="0" width="220" height="500" fill="url(#cliffSeaGrad2)" opacity="0.15" />
                    <line x1="0" y1="460" x2="200" y2="460" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="15" y="480" fill="#38bdf8" fontSize="14" fontFamily="monospace">Nivel del Mar (0m)</text>

                    {/* Cliff Contour */}
                    <path
                      d="M 160 50 Q 180 150 190 280 T 210 460 L 220 500 L 0 500 L 0 50 Z"
                      fill="#292524"
                      opacity="0.3"
                    />

                    {/* Cave Massive Rock Cavity Shell */}
                    <path
                      d="M 180 80 Q 300 60 500 80 T 850 140 Q 980 200 950 350 T 800 440 Q 600 480 400 460 T 210 420 Q 200 250 180 80 Z"
                      fill="url(#caveBackGrad2)"
                      stroke="#44403c"
                      strokeWidth="2"
                    />

                    {/* Cave Pathway */}
                    <path
                      d="M 120 90 L 220 150 Q 320 220 420 280 T 560 300 T 680 340 T 780 400 T 730 310 T 520 190 T 280 120"
                      fill="none"
                      stroke="url(#cavePathGrad2)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="6 6"
                      opacity="0.8"
                    />

                    {/* Underground Water Lake (CM-04 & CM-08) */}
                    <ellipse cx="430" cy="305" rx="55" ry="18" fill="#0284c7" opacity="0.35" />
                    <ellipse cx="730" cy="330" rx="45" ry="14" fill="#059669" opacity="0.45" />

                    {/* Waterfall Graphic (CM-07) */}
                    <line x1="780" y1="350" x2="780" y2="415" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" opacity="0.75" />

                    {/* Station Nodes */}
                    {CAVE_ZONES.map((zone) => {
                      const coordsMap: Record<string, { cx: number; cy: number }> = {
                        'CM-01': { cx: 120, cy: 90 },
                        'CM-02': { cx: 220, cy: 150 },
                        'CM-03': { cx: 330, cy: 220 },
                        'CM-04': { cx: 420, cy: 280 },
                        'CM-05': { cx: 560, cy: 300 },
                        'CM-06': { cx: 680, cy: 340 },
                        'CM-07': { cx: 780, cy: 400 },
                        'CM-08': { cx: 730, cy: 310 },
                        'CM-09': { cx: 520, cy: 190 },
                        'CM-10': { cx: 280, cy: 120 },
                      };

                      const { cx, cy } = coordsMap[zone.pointId] || { cx: 200, cy: 200 };
                      const isCurrent = currentPointId === zone.pointId;
                      const isSelected = selectedZone.pointId === zone.pointId;
                      const isVisited = visitedPointIds.includes(zone.pointId);

                      return (
                        <g
                          key={zone.pointId}
                          onClick={() => setSelectedZone(zone)}
                          className="cursor-pointer group"
                        >
                          {(isCurrent || isSelected) && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r="26"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2"
                              opacity="0.8"
                              className="animate-ping"
                              style={{ animationDuration: '2.5s' }}
                            />
                          )}

                          <circle
                            cx={cx}
                            cy={cy}
                            r={isSelected ? 18 : 14}
                            fill={isVisited ? '#059669' : isCurrent ? '#f59e0b' : '#1c1917'}
                            stroke={isSelected ? '#fbbf24' : '#78716c'}
                            strokeWidth={isSelected ? '3' : '1.5'}
                            className="transition-all"
                          />

                          <text
                            x={cx}
                            y={cy + 5}
                            textAnchor="middle"
                            fill={isVisited || isCurrent ? '#ffffff' : '#f5f5f4'}
                            fontSize={isSelected ? '14' : '11'}
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {zone.order}
                          </text>

                          <text
                            x={cx}
                            y={cy - 20}
                            textAnchor="middle"
                            fill={isSelected ? '#fbbf24' : '#a8a29e'}
                            fontSize="11"
                            fontWeight="600"
                            fontFamily="sans-serif"
                            className="pointer-events-none drop-shadow"
                          >
                            {zone.name.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Visitada
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-700"></span>
                      Pendiente
                    </span>
                  </div>
                  <span className="font-mono text-stone-500 text-[10px]">Cota: +105m a +66m</span>
                </div>
              </div>

              {/* Selected Zone Card from Map */}
              {selectedZone && (
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 space-y-3 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedZone.sampleImages[0].url}
                        alt={selectedZone.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-800"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
                            {selectedZone.pointId}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            Estación {selectedZone.order} de 10
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-stone-100 font-serif">
                          {selectedZone.name}
                        </h4>
                        <p className="text-xs text-stone-400">{selectedZone.caveSection}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {selectedZone.depthMeters === 0 ? 'Cota +105m' : `${selectedZone.depthMeters}m profundidad`}
                      </span>
                      <p className="text-[10px] text-stone-400">{selectedZone.temperatureCelsius}°C • {selectedZone.humidityPercent}% HR</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/50 p-2.5 rounded-xl border border-stone-800/80">
                    <span className="text-amber-400 font-semibold">Formación: </span>
                    {selectedZone.geologicalFeature}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConfirmAndPlay(selectedZone.pointId, false)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Confirmar esta sala y reproducir</span>
                    </button>

                    {onOpenPointDetail && (
                      <button
                        onClick={() => {
                          const p = points.find(pt => pt.id === selectedZone.pointId);
                          if (p) onOpenPointDetail(p);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium"
                      >
                        Ficha completa
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISUAL CLUES ("¿DÓNDE ME ENCUENTRO?") */}
          {activeTab === 'clues' && (
            <div className="space-y-3">
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-3 text-xs text-stone-300 flex items-center space-x-2.5">
                <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p>
                  Si la cueva está oscura o no dispones de cámara, toca el rasgo que estás viendo frente a ti para identificar tu estación:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CAVE_ZONES.map((zone) => {
                  const clue = zone.visualClues[language] || zone.visualClues.es;
                  const isSelected = selectedZone.pointId === zone.pointId;

                  return (
                    <div
                      key={zone.pointId}
                      onClick={() => {
                        setSelectedZone(zone);
                        handlePerformMultiFrameScan(zone.pointId);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/80 shadow-md shadow-amber-500/10'
                          : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <img
                          src={zone.sampleImages[0].url}
                          alt={zone.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10">
                              {zone.pointId}
                            </span>
                            <span className="text-xs font-bold text-stone-200 truncate">
                              {zone.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 mt-1 font-medium leading-tight">
                            {clue.question}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-[11px]">
                        <span className="text-stone-400">{zone.depthMeters === 0 ? 'Terraza exterior' : `${zone.depthMeters}m prof.`}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmAndPlay(zone.pointId, false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>¡Es aquí!</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ENVIRONMENTAL SENSORS & TELEMETRY */}
          {activeTab === 'sensors' && (
            <div className="space-y-4">
              <div className="bg-stone-950 border border-stone-800 rounded-3xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-stone-100 font-serif">
                      Microclima Subterráneo de Can Marçà
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Estable 365 días
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Temperatura</p>
                    <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">20.0°C</p>
                    <p className="text-[9px] text-stone-500">Constante</p>
                  </div>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Humedad</p>
                    <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">85%</p>
                    <p className="text-[9px] text-stone-500">Saturación kárstica</p>
                  </div>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Profundidad Máx.</p>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">-14m</p>
                    <p className="text-[9px] text-stone-500">Sala de la Cascada</p>
                  </div>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Cota Acantilado</p>
                    <p className="text-xl font-bold font-mono text-orange-400 mt-0.5">+105m</p>
                    <p className="text-[9px] text-stone-500">Sobre el nivel del mar</p>
                  </div>
                </div>

                <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800 text-xs space-y-2 text-stone-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Info className="w-4 h-4" />
                    <span>Detección de salas en la cueva</span>
                  </div>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    Dentro de la Cueva de Can Marçà, los visitantes se desplazan bajo decenas de metros de roca maciza calcárea. La audioguía detecta tu posición mediante cámara óptica (Can Marca Vision Guide), balizas Bluetooth (Beacons) y códigos QR en paneles discretos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">
              Zona actual audioguía: <strong className="text-stone-200">{currentPointId || 'Sin asignar'}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
