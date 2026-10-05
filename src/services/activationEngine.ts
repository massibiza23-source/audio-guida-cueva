import { TourPoint } from '../types';
import { StorageService } from './storageService';

export interface BeaconDetectionResult {
  pointId: string;
  rssi: number;
  minor: number;
  distanceEstimate: string;
  source: 'bluetooth_real' | 'bluetooth_simulated';
}

export interface GPSStatus {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  distanceToTerraceMeters: number | null;
  insideTerraceZone: boolean;
  status: 'prompt' | 'granted' | 'denied' | 'unsupported';
}

export class ActivationEngine {
  /**
   * Calculate distance between two GPS coordinates using the Haversine formula (meters)
   */
  static calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Parse QR code contents.
   * Accepts both full URLs ('https://app.cuevadecanmarca.com/p/CM-03')
   * or direct codes ('CM-03', '3', '03')
   */
  static parseQRInput(raw: string, availablePoints: TourPoint[]): TourPoint | null {
    if (!raw) return null;
    const trimmed = raw.trim().toUpperCase();

    // Check direct point ID match
    const directMatch = availablePoints.find(p => p.id === trimmed);
    if (directMatch) return directMatch;

    // Check if numeric or partial match
    if (/^\d+$/.test(trimmed)) {
      const orderNum = parseInt(trimmed, 10);
      const orderMatch = availablePoints.find(p => p.order === orderNum);
      if (orderMatch) return orderMatch;
    }

    // Extract path after /p/
    const urlMatch = trimmed.match(/\/P\/([A-Z0-9\-_]+)/);
    if (urlMatch && urlMatch[1]) {
      const pointId = urlMatch[1];
      const match = availablePoints.find(p => p.id === pointId);
      if (match) return match;
    }

    // Secondary fallback search in URL
    for (const p of availablePoints) {
      if (trimmed.includes(p.id)) {
        return p;
      }
    }

    return null;
  }

  /**
   * Request device GPS coordinates and check terrace proximity
   */
  static async checkGPSProximity(terracePoint: TourPoint): Promise<GPSStatus> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return {
        latitude: null,
        longitude: null,
        accuracy: null,
        distanceToTerraceMeters: null,
        insideTerraceZone: false,
        status: 'unsupported',
      };
    }

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          const terraceLat = terracePoint.location.gps.latitude || 39.0833;
          const terraceLon = terracePoint.location.gps.longitude || 1.4422;
          const radius = terracePoint.location.gps.radiusMeters || 25;

          const distance = this.calculateDistanceMeters(lat, lon, terraceLat, terraceLon);
          const inside = distance <= radius;

          const progress = StorageService.getVisitorProgress();
          progress.permissionsGranted.location = true;
          StorageService.saveVisitorProgress(progress);

          resolve({
            latitude: lat,
            longitude: lon,
            accuracy,
            distanceToTerraceMeters: distance,
            insideTerraceZone: inside,
            status: 'granted',
          });
        },
        error => {
          resolve({
            latitude: null,
            longitude: null,
            accuracy: null,
            distanceToTerraceMeters: null,
            insideTerraceZone: false,
            status: error.code === error.PERMISSION_DENIED ? 'denied' : 'prompt',
          });
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
      );
    });
  }

  /**
   * Web Bluetooth API support test
   */
  static isWebBluetoothSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  /**
   * Web Bluetooth pairing test
   */
  static async requestBluetoothDevice(): Promise<boolean> {
    if (!this.isWebBluetoothSupported()) return false;
    try {
      await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access'],
      });
      const progress = StorageService.getVisitorProgress();
      progress.permissionsGranted.bluetooth = true;
      StorageService.saveVisitorProgress(progress);
      return true;
    } catch (e) {
      console.warn('Bluetooth request cancelled or rejected', e);
      return false;
    }
  }
}
