export type LanguageCode =
  | 'es'
  | 'en'
  | 'de'
  | 'fr'
  | 'it'
  | 'nl'
  | 'pt'
  | 'ru'
  | 'pl'
  | 'cs'
  | 'ro'
  | 'zh'
  | 'ja'
  | 'ar';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  enabled: boolean;
}

export type ActivationMethod = 'beacon' | 'qr' | 'gps' | 'camera' | 'manual';

export interface GPSCoordinates {
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
}

export interface BeaconMapping {
  uuid: string;
  major: number;
  minor: number;
  pointId: string;
  rssiThreshold: number; // e.g. -85 dBm
}

export interface PointTranslation {
  title: string;
  subtitle: string;
  description: string;
  audioUrl?: string;
  transcript?: string;
}

export interface TourPoint {
  id: string; // e.g. "CM-01"
  order: number;
  title: string;
  subtitle: string;
  activation: {
    primary: ActivationMethod;
    secondary: ActivationMethod;
    manual: boolean;
  };
  location: {
    gps: GPSCoordinates;
  };
  beacon?: {
    uuid: string;
    major: number;
    minor: number;
  };
  visual: {
    image: string;
    caption?: string;
    gallery?: string[];
  };
  translations: Partial<Record<LanguageCode, PointTranslation>> & { es: PointTranslation };
  keywords: string[];
  qr: {
    enabled: boolean;
    url: string;
  };
  published: boolean;
  durationSeconds?: number;
}

export type AudioEngineStatus =
  | 'IDLE'
  | 'DETECTED'
  | 'CONFIRMING'
  | 'LOADING'
  | 'PLAYING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'COOLDOWN';

export interface AudioPlaybackState {
  currentPointId: string | null;
  status: AudioEngineStatus;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  ambientCaveSound: boolean;
  autoplayEnabled: boolean;
  confirmingCountdown: number; // seconds remaining in 2s detection confirmation
  cooldownRemaining: number; // seconds remaining in 20s cooldown
  isKidsMode: boolean; // Mickey Mouse styled cartoon voice and kid adventure script
}

export type VisitorScreen =
  | 'WELCOME'
  | 'LANGUAGE'
  | 'PERMISSIONS'
  | 'DOWNLOAD'
  | 'ROUTE'
  | 'POINT_DETAIL'
  | 'END';

export interface VisitorProgress {
  selectedLanguage: LanguageCode;
  visitedPointIds: string[];
  lastVisitedPointId: string | null;
  tourStartedAt: number | null;
  completedAt: number | null;
  downloadedOffline: boolean;
  offlineDownloadedAt?: number;
  permissionsGranted: {
    bluetooth: boolean;
    location: boolean;
  };
  isKidsMode?: boolean;
}

export interface AnalyticsEvent {
  id: string;
  name:
    | 'tour_started'
    | 'point_detected'
    | 'point_audio_started'
    | 'point_audio_completed'
    | 'point_audio_replayed'
    | 'qr_scanned'
    | 'camera_scanned'
    | 'language_selected'
    | 'tour_completed'
    | 'download_completed'
    | 'activation_error'
    | 'kids_mode_toggled';
  timestamp: number;
  pointId?: string;
  activationMethod?: ActivationMethod;
  language?: LanguageCode;
  metadata?: Record<string, string | number | boolean>;
}

export type AdminTab =
  | 'dashboard'
  | 'points'
  | 'audio'
  | 'beacons'
  | 'qr'
  | 'languages'
  | 'vision'
  | 'analytics'
  | 'settings';
