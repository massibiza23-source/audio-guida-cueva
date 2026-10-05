import { TourPoint, VisitorProgress, LanguageCode, AnalyticsEvent } from '../types';
import { INITIAL_POINTS, SUPPORTED_LANGUAGES } from '../data/seedData';

const STORAGE_KEYS = {
  POINTS: 'canmarca_points_v1',
  VISITOR_PROGRESS: 'canmarca_visitor_progress_v1',
  ANALYTICS: 'canmarca_analytics_v1',
  OFFLINE_PACKAGE: 'canmarca_offline_pkg_v1',
  ADMIN_AUTH: 'canmarca_admin_authenticated_v1',
  ADMIN_PIN: 'canmarca_admin_pin_v1',
  LANGUAGES: 'canmarca_languages_v1',
};

const DEFAULT_ADMIN_PIN = '1234';

export class StorageService {
  // --- Points Management ---
  static getPoints(): TourPoint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POINTS);
      if (data) {
        const parsed = JSON.parse(data) as TourPoint[];
        let updated = false;
        // Merge missing language translations from INITIAL_POINTS
        for (const p of parsed) {
          const seed = INITIAL_POINTS.find(s => s.id === p.id);
          if (seed) {
            for (const lang of Object.keys(seed.translations) as (keyof typeof seed.translations)[]) {
              const seedTrans = seed.translations[lang];
              if (seedTrans) {
                if (!p.translations[lang] || !p.translations[lang].title || !p.translations[lang].description) {
                  p.translations[lang] = {
                    ...seedTrans,
                    ...(p.translations[lang] || {}),
                    title: p.translations[lang]?.title || seedTrans.title,
                    subtitle: p.translations[lang]?.subtitle || seedTrans.subtitle,
                    description: p.translations[lang]?.description || seedTrans.description,
                    transcript: p.translations[lang]?.transcript || seedTrans.transcript,
                  };
                  updated = true;
                }
              }
            }
          }
        }
        if (updated) {
          this.savePoints(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load points from storage', e);
    }
    // Initialize with seed data
    this.savePoints(INITIAL_POINTS);
    return INITIAL_POINTS;
  }

  static savePoints(points: TourPoint[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(points));
    } catch (e) {
      console.error('Failed to save points', e);
    }
  }

  static getPointById(id: string): TourPoint | undefined {
    const points = this.getPoints();
    return points.find(p => p.id === id);
  }

  static updatePoint(updated: TourPoint): void {
    const points = this.getPoints();
    const index = points.findIndex(p => p.id === updated.id);
    if (index >= 0) {
      points[index] = updated;
      this.savePoints(points);
    } else {
      points.push(updated);
      this.savePoints(points);
    }
  }

  static deletePoint(id: string): void {
    const points = this.getPoints().filter(p => p.id !== id);
    this.savePoints(points);
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.POINTS);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGES);
    this.savePoints(INITIAL_POINTS);
  }

  // --- Visitor Progress ---
  static getVisitorProgress(): VisitorProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISITOR_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load visitor progress', e);
    }
    const defaultProgress: VisitorProgress = {
      selectedLanguage: 'es',
      visitedPointIds: [],
      lastVisitedPointId: null,
      tourStartedAt: null,
      completedAt: null,
      downloadedOffline: false,
      permissionsGranted: {
        bluetooth: false,
        location: false,
      },
    };
    return defaultProgress;
  }

  static saveVisitorProgress(progress: VisitorProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save visitor progress', e);
    }
  }

  static markPointVisited(pointId: string): VisitorProgress {
    const progress = this.getVisitorProgress();
    if (!progress.visitedPointIds.includes(pointId)) {
      progress.visitedPointIds.push(pointId);
    }
    progress.lastVisitedPointId = pointId;
    if (!progress.tourStartedAt) {
      progress.tourStartedAt = Date.now();
    }
    const totalPoints = this.getPoints().filter(p => p.published).length;
    if (progress.visitedPointIds.length >= totalPoints && !progress.completedAt) {
      progress.completedAt = Date.now();
    }
    this.saveVisitorProgress(progress);
    return progress;
  }

  static resetVisitorProgress(keepOfflineAndLanguage = true): VisitorProgress {
    const current = this.getVisitorProgress();
    const fresh: VisitorProgress = {
      selectedLanguage: keepOfflineAndLanguage ? current.selectedLanguage : 'es',
      visitedPointIds: [],
      lastVisitedPointId: null,
      tourStartedAt: null,
      completedAt: null,
      downloadedOffline: keepOfflineAndLanguage ? current.downloadedOffline : false,
      offlineDownloadedAt: current.offlineDownloadedAt,
      permissionsGranted: current.permissionsGranted,
    };
    this.saveVisitorProgress(fresh);
    return fresh;
  }

  // --- Offline Package Management ---
  static isOfflinePackageReady(): boolean {
    const progress = this.getVisitorProgress();
    return !!progress.downloadedOffline;
  }

  static async downloadOfflinePackage(onProgress?: (percent: number, step: string) => void): Promise<boolean> {
    // Simulate caching 10 tour points, audio blobs, images, and translations
    const steps = [
      { p: 15, msg: 'Descargando estructura del recorrido...' },
      { p: 35, msg: 'Almacenando descripciones y transcripciones (7 idiomas)...' },
      { p: 60, msg: 'Descargando y comprimiendo imágenes de la cueva...' },
      { p: 85, msg: 'Generando caché de audio y perfiles acústicos...' },
      { p: 100, msg: 'Verificando paquete sin conexión (100% completado)' },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 400));
      onProgress?.(step.p, step.msg);
    }

    const progress = this.getVisitorProgress();
    progress.downloadedOffline = true;
    progress.offlineDownloadedAt = Date.now();
    this.saveVisitorProgress(progress);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_PACKAGE, JSON.stringify({
      downloadedAt: Date.now(),
      sizeBytes: 12450000, // ~12MB estimated
      version: '1.0.0',
    }));
    return true;
  }

  // --- Analytics Storage ---
  static getAnalyticsEvents(): AnalyticsEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load analytics', e);
    }
    return [];
  }

  static trackEvent(
    name: AnalyticsEvent['name'],
    data?: { pointId?: string; activationMethod?: any; language?: LanguageCode; metadata?: Record<string, any> }
  ): void {
    try {
      const events = this.getAnalyticsEvents();
      const newEvent: AnalyticsEvent = {
        id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name,
        timestamp: Date.now(),
        ...data,
      };
      // Keep last 500 events
      events.unshift(newEvent);
      if (events.length > 500) {
        events.length = 500;
      }
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to log event', e);
    }
  }

  // --- Admin Authentication ---
  static isAdminAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  static setAdminAuthenticated(authenticated: boolean): void {
    if (authenticated) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  }

  static getAdminPin(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
  }

  static setAdminPin(pin: string): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, pin);
  }

  // --- Export and Import JSON ---
  static exportFullBackup(): string {
    const backup = {
      timestamp: Date.now(),
      version: '1.0.0',
      points: this.getPoints(),
      languages: SUPPORTED_LANGUAGES,
      analytics: this.getAnalyticsEvents(),
    };
    return JSON.stringify(backup, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.points && Array.isArray(parsed.points)) {
        this.savePoints(parsed.points);
        return true;
      }
    } catch (e) {
      console.error('Import backup failed', e);
    }
    return false;
  }
}
