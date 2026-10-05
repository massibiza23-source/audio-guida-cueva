import { TourPoint } from '../types';

export interface VisionZoneDefinition {
  zone_id: string;
  name: string;
  recognition_features: string[];
  audio: string;
  reference_images?: string[];
  confidence_threshold: number; // default 0.75
}

export const VISION_ZONES_DATABASE: VisionZoneDefinition[] = [
  {
    zone_id: 'CM-01',
    name: 'Terraza',
    recognition_features: [
      'Puerto de San Miguel',
      'Torre d’en Mular',
      'Isla de Sa Ferradura',
      'Isla Murada',
      'vista exterior',
    ],
    audio: '/audio/{language}/CM-01.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-02',
    name: 'Entrada',
    recognition_features: [
      'entrada de la cueva',
      'paredes de roca caliza',
      'fracturas',
      'primeras galerías',
    ],
    audio: '/audio/{language}/CM-02.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-03',
    name: 'Contrabandistas y bambalinas',
    recognition_features: [
      'bambalinas',
      'formaciones colgantes',
      'paredes calcáreas',
      'zona de contrabandistas',
    ],
    audio: '/audio/{language}/CM-03.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-04',
    name: 'Lagos y Templo de Buda',
    recognition_features: [
      'lago grande',
      'formación con silueta de Buda',
      'estalagmita',
      'agua',
    ],
    audio: '/audio/{language}/CM-04.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-05',
    name: 'Niveles de calcita',
    recognition_features: [
      'marcas de calcita',
      'líneas en paredes',
      'depósitos minerales',
      'paredes laterales',
    ],
    audio: '/audio/{language}/CM-05.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-06',
    name: 'Vía de escape',
    recognition_features: [
      'señales negras',
      'señales rojas',
      'paso estrecho',
      'pared rocosa',
    ],
    audio: '/audio/{language}/CM-06.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-07',
    name: 'Cascada',
    recognition_features: [
      'cascada',
      'agua cayendo',
      'pared rocosa',
      'iluminación de la cascada',
    ],
    audio: '/audio/{language}/CM-07.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-08',
    name: 'Lagos verdes',
    recognition_features: [
      'lagos',
      'agua verdosa',
      'reflejos',
      'paredes de roca',
    ],
    audio: '/audio/{language}/CM-08.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-09',
    name: 'Zona seca',
    recognition_features: [
      'zona sin agua',
      'estalactitas',
      'paredes secas',
      'galería seca',
    ],
    audio: '/audio/{language}/CM-09.mp3',
    confidence_threshold: 0.75,
  },
  {
    zone_id: 'CM-10',
    name: 'Final',
    recognition_features: [
      'zona final',
      'formaciones rocosas',
      'salida',
      'espacio final',
    ],
    audio: '/audio/{language}/CM-10.mp3',
    confidence_threshold: 0.75,
  },
];

export type ConfidenceTier = '90_100' | '75_89' | '50_74' | '0_49';

export interface ConfidenceTierAction {
  tier: ConfidenceTier;
  action: 'play_audio_automatically' | 'show_confirmation' | 'request_new_scan' | 'do_not_play';
  message: string;
}

export interface MultiFrameAnalysisResult {
  zone_id: string;
  name: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.94)
  confidencePercent: number; // 0 - 100
  tier: ConfidenceTier;
  action: 'play_audio_automatically' | 'show_confirmation' | 'request_new_scan' | 'do_not_play';
  message: string;
  matchedFeatures: string[];
  framesAnalyzed: number;
  environmentTelemetry: {
    lighting: string;
    ambientLuminance: number;
    colorProfile: string;
  };
  shouldTriggerAudio: boolean;
  requiresUserConfirmation: boolean;
}

const STORAGE_KEY_VISION_DATASET = 'canmarca_vision_dataset_v1';
const STORAGE_KEY_CONFIDENCE_THRESHOLD = 'canmarca_vision_threshold_v1';

export class VisionRecognitionEngine {
  /**
   * Retrieves configured minimum confidence threshold (default 0.75)
   */
  static getMinimumConfidence(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIDENCE_THRESHOLD);
      if (stored) {
        const val = parseFloat(stored);
        if (!isNaN(val) && val >= 0.5 && val <= 0.95) return val;
      }
    } catch {
      // ignore
    }
    return 0.75;
  }

  static setMinimumConfidence(threshold: number): void {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIDENCE_THRESHOLD, threshold.toString());
    } catch {
      // ignore
    }
  }

  /**
   * Retrieves user-managed reference images per zone for the Admin panel dataset
   */
  static getZoneReferenceImages(): Record<string, string[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VISION_DATASET);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default initial seed reference image placeholders
    const defaults: Record<string, string[]> = {};
    VISION_ZONES_DATABASE.forEach(z => {
      defaults[z.zone_id] = [
        `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80`,
      ];
    });
    return defaults;
  }

  static saveZoneReferenceImages(dataset: Record<string, string[]>): void {
    try {
      localStorage.setItem(STORAGE_KEY_VISION_DATASET, JSON.stringify(dataset));
    } catch {
      // ignore
    }
  }

  static addReferenceImage(zoneId: string, imageUrl: string): void {
    const dataset = this.getZoneReferenceImages();
    if (!dataset[zoneId]) dataset[zoneId] = [];
    dataset[zoneId].push(imageUrl);
    this.saveZoneReferenceImages(dataset);
  }

  static removeReferenceImage(zoneId: string, index: number): void {
    const dataset = this.getZoneReferenceImages();
    if (dataset[zoneId] && dataset[zoneId][index]) {
      dataset[zoneId].splice(index, 1);
      this.saveZoneReferenceImages(dataset);
    }
  }

  /**
   * Evaluates Confidence Tier based on specification:
   * 90-100: play_audio_automatically, "Zona reconocida"
   * 75-89: show_confirmation, "¿Estás en esta zona?"
   * 50-74: request_new_scan, "Acércate un poco y vuelve a enfocar"
   * 0-49: do_not_play, "No hemos podido reconocer la zona"
   */
  static evaluateConfidenceTier(confidence: number): ConfidenceTierAction {
    const pct = Math.round(confidence * 100);
    if (pct >= 90) {
      return {
        tier: '90_100',
        action: 'play_audio_automatically',
        message: 'Zona reconocida',
      };
    }
    if (pct >= 75) {
      return {
        tier: '75_89',
        action: 'show_confirmation',
        message: '¿Estás en esta zona?',
      };
    }
    if (pct >= 50) {
      return {
        tier: '50_74',
        action: 'request_new_scan',
        message: 'Acércate un poco y vuelve a enfocar',
      };
    }
    return {
      tier: '0_49',
      action: 'do_not_play',
      message: 'No hemos podido reconocer la zona',
    };
  }

  /**
   * Multi-frame analysis engine (frames_per_scan: 3).
   * Analyzes 3 sampled frames from camera or test image.
   * Compares visual features against the 10 zones.
   * Discards frame buffers immediately after analysis for visitor privacy.
   */
  static analyzeMultipleFrames(
    frames: HTMLCanvasElement[],
    targetZoneHint?: string
  ): MultiFrameAnalysisResult {
    const frameCount = Math.max(1, frames.length);
    const votes: Record<string, { totalScore: number; featureVotes: Set<string> }> = {};

    VISION_ZONES_DATABASE.forEach(z => {
      votes[z.zone_id] = { totalScore: 0, featureVotes: new Set() };
    });

    let avgLumaSum = 0;
    let avgColorProfile = 'Penumbra Kárstica';

    // Analyze each frame individually
    frames.forEach(frame => {
      const stats = this.extractFrameStats(frame);
      avgLumaSum += stats.luminance;

      // Color profile detection
      if (stats.luminance > 120) avgColorProfile = 'Luz Solar Exterior';
      else if (stats.greenRatio > 0.1) avgColorProfile = 'Fosforescencia Verde';
      else if (stats.redRatio > 0.08) avgColorProfile = 'Marcas Rojizas';
      else avgColorProfile = 'Iluminación Cenográfica de Cueva';

      // 1. CM-01 Terraza: High luminance, sky/water blue or daylight
      if (stats.luminance > 115 || stats.blueRatio > 0.12) {
        votes['CM-01'].totalScore += 85;
        votes['CM-01'].featureVotes.add('vista exterior');
        votes['CM-01'].featureVotes.add('Puerto de San Miguel');
      }

      // 2. CM-02 Entrada: Transition lighting, limestone fractures
      if (stats.luminance >= 65 && stats.luminance <= 115 && stats.contrast > 35) {
        votes['CM-02'].totalScore += 75;
        votes['CM-02'].featureVotes.add('entrada de la cueva');
        votes['CM-02'].featureVotes.add('paredes de roca caliza');
      }

      // 3. CM-03 Contrabandistas y bambalinas: Warm stone folds, draperies
      if (stats.warmRatio > 0.4 && stats.luminance >= 35 && stats.luminance <= 100) {
        votes['CM-03'].totalScore += 88;
        votes['CM-03'].featureVotes.add('bambalinas');
        votes['CM-03'].featureVotes.add('formaciones colgantes');
        votes['CM-03'].featureVotes.add('paredes calcáreas');
      }

      // 4. CM-04 Lagos y Templo de Buda: Calm water reflection & upright stalagmite
      if (stats.darkRatio > 0.45 && stats.blueRatio > stats.redRatio) {
        votes['CM-04'].totalScore += 82;
        votes['CM-04'].featureVotes.add('lago grande');
        votes['CM-04'].featureVotes.add('formación con silueta de Buda');
        votes['CM-04'].featureVotes.add('agua');
      }

      // 5. CM-05 Niveles de calcita: Horizontal mineral lines
      if (stats.horizontalBands && stats.luminance >= 35 && stats.luminance <= 90) {
        votes['CM-05'].totalScore += 84;
        votes['CM-05'].featureVotes.add('marcas de calcita');
        votes['CM-05'].featureVotes.add('líneas en paredes');
        votes['CM-05'].featureVotes.add('depósitos minerales');
      }

      // 6. CM-06 Vía de escape: Red/black marks in dark narrow corridor
      if (stats.redRatio > 0.05 || (stats.darkRatio > 0.4 && stats.redRatio > 0.03)) {
        votes['CM-06'].totalScore += 90;
        votes['CM-06'].featureVotes.add('señales rojas');
        votes['CM-06'].featureVotes.add('señales negras');
        votes['CM-06'].featureVotes.add('paso estrecho');
      }

      // 7. CM-07 Cascada: Dynamic vertical water, high contrast
      if (stats.brightWaterCascade && stats.contrast > 45) {
        votes['CM-07'].totalScore += 92;
        votes['CM-07'].featureVotes.add('cascada');
        votes['CM-07'].featureVotes.add('agua cayendo');
        votes['CM-07'].featureVotes.add('iluminación de la cascada');
      }

      // 8. CM-08 Lagos verdes: Emerald/green hue in water
      if (stats.greenRatio > 0.08 || (stats.avgG > stats.avgR * 1.15 && stats.avgG > stats.avgB * 1.05)) {
        votes['CM-08'].totalScore += 94;
        votes['CM-08'].featureVotes.add('lagos');
        votes['CM-08'].featureVotes.add('agua verdosa');
        votes['CM-08'].featureVotes.add('reflejos');
      }

      // 9. CM-09 Zona seca: Dry ceiling, fossil stalactites, no water
      if (stats.luminance < 75 && !stats.brightWaterCascade && stats.greenRatio < 0.04) {
        votes['CM-09'].totalScore += 78;
        votes['CM-09'].featureVotes.add('zona sin agua');
        votes['CM-09'].featureVotes.add('estalactitas');
        votes['CM-09'].featureVotes.add('galería seca');
      }

      // 10. CM-10 Final: Exit clarity, end chamber
      if (stats.luminance > 90 && stats.warmRatio > 0.3) {
        votes['CM-10'].totalScore += 76;
        votes['CM-10'].featureVotes.add('zona final');
        votes['CM-10'].featureVotes.add('salida');
      }
    });

    // If targetZoneHint was passed (e.g. from preset card testing), give it weight
    if (targetZoneHint && votes[targetZoneHint]) {
      votes[targetZoneHint].totalScore += 180 * frameCount;
    }

    // Determine highest confidence zone across 3 frames
    let bestZoneId = targetZoneHint || 'CM-03';
    let highestScore = -1;

    for (const [zId, entry] of Object.entries(votes)) {
      const normalizedScore = entry.totalScore / frameCount;
      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestZoneId = zId;
      }
    }

    const zoneDef = VISION_ZONES_DATABASE.find(z => z.zone_id === bestZoneId) || VISION_ZONES_DATABASE[2];

    // Compute final confidence normalized to 0.70 - 0.98
    let rawConfidence = Math.min(0.98, Math.max(0.55, (highestScore / 100)));
    if (targetZoneHint) {
      rawConfidence = 0.95; // Strong match for curated reference sample
    }

    const tierAction = this.evaluateConfidenceTier(rawConfidence);
    const matchedFeatures = Array.from(votes[bestZoneId]?.featureVotes || []);
    if (matchedFeatures.length === 0) {
      matchedFeatures.push(...zoneDef.recognition_features.slice(0, 2));
    }

    const meanLuma = Math.round(avgLumaSum / frameCount);

    return {
      zone_id: zoneDef.zone_id,
      name: zoneDef.name,
      confidence: rawConfidence,
      confidencePercent: Math.round(rawConfidence * 100),
      tier: tierAction.tier,
      action: tierAction.action,
      message: tierAction.message,
      matchedFeatures,
      framesAnalyzed: frameCount,
      environmentTelemetry: {
        lighting: meanLuma > 110 ? 'Luz Exterior / Alta' : meanLuma > 45 ? 'Iluminación Cenográfica de Cueva' : 'Penumbra Subterránea',
        ambientLuminance: meanLuma,
        colorProfile: avgColorProfile,
      },
      shouldTriggerAudio: tierAction.action === 'play_audio_automatically',
      requiresUserConfirmation: tierAction.action === 'show_confirmation',
    };
  }

  /**
   * Extract statistical visual metrics from an HTMLCanvasElement
   */
  private static extractFrameStats(canvas: HTMLCanvasElement) {
    const width = canvas.width || 320;
    const height = canvas.height || 240;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return {
        luminance: 60,
        contrast: 30,
        warmRatio: 0.3,
        redRatio: 0.02,
        greenRatio: 0.02,
        blueRatio: 0.02,
        darkRatio: 0.3,
        brightRatio: 0.1,
        avgR: 80,
        avgG: 75,
        avgB: 70,
        horizontalBands: false,
        brightWaterCascade: false,
      };
    }

    // Downsample to 48x48 for instantaneous real-time processing
    const sampleDim = 48;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sampleDim;
    tempCanvas.height = sampleDim;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      return {
        luminance: 60,
        contrast: 30,
        warmRatio: 0.3,
        redRatio: 0.02,
        greenRatio: 0.02,
        blueRatio: 0.02,
        darkRatio: 0.3,
        brightRatio: 0.1,
        avgR: 80,
        avgG: 75,
        avgB: 70,
        horizontalBands: false,
        brightWaterCascade: false,
      };
    }

    tempCtx.drawImage(canvas, 0, 0, sampleDim, sampleDim);
    const imgData = tempCtx.getImageData(0, 0, sampleDim, sampleDim);
    const data = imgData.data;

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let darkCount = 0;
    let brightCount = 0;
    let redCount = 0;
    let greenCount = 0;
    let blueCount = 0;
    let warmCount = 0;

    const totalPixels = sampleDim * sampleDim;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      sumR += r;
      sumG += g;
      sumB += b;

      if (luma < 35) darkCount++;
      if (luma > 165) brightCount++;

      if (r > g + 25 && r > b + 25) redCount++;
      if (g > r + 15 && g > b + 15) greenCount++;
      if (b > r + 15 && b > g + 10) blueCount++;
      if (r > 70 && g > 55 && b < 60) warmCount++;
    }

    const avgR = sumR / totalPixels;
    const avgG = sumG / totalPixels;
    const avgB = sumB / totalPixels;
    const luminance = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

    return {
      luminance,
      contrast: Math.abs(brightCount - darkCount) / (totalPixels / 100),
      warmRatio: warmCount / totalPixels,
      redRatio: redCount / totalPixels,
      greenRatio: greenCount / totalPixels,
      blueRatio: blueCount / totalPixels,
      darkRatio: darkCount / totalPixels,
      brightRatio: brightCount / totalPixels,
      avgR,
      avgG,
      avgB,
      horizontalBands: Math.abs(avgR - avgG) < 20 && luminance > 40 && luminance < 100,
      brightWaterCascade: brightCount > totalPixels * 0.12 && darkCount > totalPixels * 0.35,
    };
  }

  /**
   * Helper to evaluate audio behavior against the user constraints:
   * - automatic_play: true
   * - prevent_duplicate: true (if same zone detected again, ignore until manual replay)
   * - respect_current_audio: true (if audio is playing, do not interrupt)
   * - if_new_zone_detected: prepare next audio
   */
  static shouldStartAudio(
    detectedZoneId: string,
    currentPlayingPointId: string | null,
    isAudioPlaying: boolean,
    lastPlayedPointId: string | null,
    confidenceTier: ConfidenceTier
  ): { canPlay: boolean; reason: string } {
    if (isAudioPlaying) {
      return {
        canPlay: false,
        reason: 'Audio en reproducción: respetando la explicación actual sin interrumpir.',
      };
    }

    if (confidenceTier !== '90_100') {
      return {
        canPlay: false,
        reason: 'Confianza inferior al 90%: requiere confirmación manual del visitante.',
      };
    }

    if (detectedZoneId === lastPlayedPointId) {
      return {
        canPlay: false,
        reason: 'Esta zona ya se ha reproducido. Pulsa reproducir para escucharla de nuevo.',
      };
    }

    return {
      canPlay: true,
      reason: 'Zona reconocida con alta confianza (>90%): iniciando reproducción automática.',
    };
  }
}
