import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { WelcomeScreen } from './components/visitor/WelcomeScreen';
import { PermissionsScreen } from './components/visitor/PermissionsScreen';
import { OfflineDownloadScreen } from './components/visitor/OfflineDownloadScreen';
import { RouteOverview } from './components/visitor/RouteOverview';
import { AudioPlayerSheet } from './components/visitor/AudioPlayerSheet';
import { PointDetailModal } from './components/visitor/PointDetailModal';
import { QRScannerModal } from './components/visitor/QRScannerModal';
import { BeaconStatusWidget } from './components/visitor/BeaconStatusWidget';
import { TourEndScreen } from './components/visitor/TourEndScreen';
import { LanguageModal } from './components/visitor/LanguageModal';
import { ZoneRecognitionViewer } from './components/visitor/ZoneRecognitionViewer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

import { TourPoint, LanguageCode, VisitorScreen, AudioPlaybackState, AnalyticsEvent } from './types';
import { StorageService } from './services/storageService';
import { audioEngine } from './services/audioEngine';
import { ActivationEngine } from './services/activationEngine';

export default function App() {
  const [points, setPoints] = useState<TourPoint[]>(() => {
    if (typeof window !== 'undefined') {
      return StorageService.getPoints();
    }
    return [];
  });
  const [currentScreen, setCurrentScreen] = useState<VisitorScreen>('WELCOME');
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      return StorageService.getVisitorProgress().selectedLanguage;
    }
    return 'es';
  });
  const [visitedPointIds, setVisitedPointIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return StorageService.getVisitorProgress().visitedPointIds;
    }
    return [];
  });
  const [currentPointId, setCurrentPointId] = useState<string | null>(null);

  // Playback state
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioEngine.getState());

  // Modals & Panels
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isBeaconWidgetOpen, setIsBeaconWidgetOpen] = useState(false);
  const [isZoneViewerOpen, setIsZoneViewerOpen] = useState(false);
  const [selectedDetailPoint, setSelectedDetailPoint] = useState<TourPoint | null>(null);

  // Admin
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    if (typeof window !== 'undefined') {
      return StorageService.getAnalyticsEvents();
    }
    return [];
  });

  // Connectivity & GPS
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));
  const [gpsDistanceToTerrace, setGpsDistanceToTerrace] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedPoints = StorageService.getPoints();
    setPoints(loadedPoints);

    const progress = StorageService.getVisitorProgress();
    setLanguage(progress.selectedLanguage);
    setVisitedPointIds(progress.visitedPointIds);
    setAnalyticsEvents(StorageService.getAnalyticsEvents());

    // Audio Engine Subscription
    const unsubscribe = audioEngine.subscribe(state => {
      setPlaybackState(state);
      if (state.currentPointId) {
        setCurrentPointId(state.currentPointId);
      }
    });

    // Network status listener
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial GPS Terrace Check
    const terracePoint = loadedPoints.find(p => p.id === 'CM-01');
    if (terracePoint) {
      ActivationEngine.checkGPSProximity(terracePoint).then(status => {
        setGpsDistanceToTerrace(status.distanceToTerraceMeters);
        if (status.insideTerraceZone && !progress.visitedPointIds.includes('CM-01')) {
          // If on terrace and not yet played, trigger Point 1
          audioEngine.triggerAutomaticPoint(terracePoint, progress.selectedLanguage);
        }
      });
    }

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshData = () => {
    setPoints(StorageService.getPoints());
    const prog = StorageService.getVisitorProgress();
    setVisitedPointIds(prog.visitedPointIds);
    setAnalyticsEvents(StorageService.getAnalyticsEvents());
  };

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    const prog = StorageService.getVisitorProgress();
    prog.selectedLanguage = code;
    StorageService.saveVisitorProgress(prog);
  };

  const handleStartTourFromWelcome = () => {
    const prog = StorageService.getVisitorProgress();
    StorageService.trackEvent('tour_started', { language });

    // If permissions not yet answered, show permissions screen
    if (!prog.permissionsGranted.bluetooth && !prog.permissionsGranted.location) {
      setCurrentScreen('PERMISSIONS');
    } else if (!prog.downloadedOffline) {
      setCurrentScreen('DOWNLOAD');
    } else {
      setCurrentScreen('ROUTE');
      // Set initial point to CM-01 and start playing automatically
      const p1 = points.find(p => p.id === 'CM-01') || points[0];
      if (p1) {
        handleSelectAndPlayPoint(p1);
      }
    }
  };

  const handlePermissionsContinue = () => {
    const prog = StorageService.getVisitorProgress();
    if (!prog.downloadedOffline) {
      setCurrentScreen('DOWNLOAD');
    } else {
      setCurrentScreen('ROUTE');
      const p1 = points.find(p => p.id === 'CM-01') || points[0];
      if (p1) handleSelectAndPlayPoint(p1);
    }
  };

  const handleDownloadComplete = () => {
    setCurrentScreen('ROUTE');
    const p1 = points.find(p => p.id === 'CM-01') || points[0];
    if (p1) handleSelectAndPlayPoint(p1);
  };

  const handleSelectAndPlayPoint = (point: TourPoint) => {
    setCurrentPointId(point.id);
    audioEngine.playPoint(point, language, true);
    setVisitedPointIds(StorageService.getVisitorProgress().visitedPointIds);
  };

  const handleOpenPointDetail = (point: TourPoint) => {
    setSelectedDetailPoint(point);
    // Start audio automatically when cave information is opened
    handleSelectAndPlayPoint(point);
  };

  const handleQRPointActivated = (point: TourPoint) => {
    setCurrentPointId(point.id);
    setCurrentScreen('ROUTE');
    audioEngine.playPoint(point, language, false);
    setVisitedPointIds(StorageService.getVisitorProgress().visitedPointIds);
  };

  // Previous and Next points logic
  const publishedPoints = points.filter(p => p.published).sort((a, b) => a.order - b.order);
  const currentPointIndex = publishedPoints.findIndex(p => p.id === currentPointId);
  const currentPoint = currentPointIndex >= 0 ? publishedPoints[currentPointIndex] : null;

  const handlePreviousPoint = () => {
    if (currentPointIndex > 0) {
      const prev = publishedPoints[currentPointIndex - 1];
      handleSelectAndPlayPoint(prev);
    }
  };

  const handleNextPoint = () => {
    if (currentPointIndex < publishedPoints.length - 1) {
      const next = publishedPoints[currentPointIndex + 1];
      handleSelectAndPlayPoint(next);
    }
  };

  const handleFinishTour = () => {
    StorageService.trackEvent('tour_completed', { language });
    setCurrentScreen('END');
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      if (StorageService.isAdminAuthenticated()) {
        setIsAdminMode(true);
      } else {
        setIsAdminLoginModalOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Header */}
      <Header
        currentLanguage={language}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenVisionGuide={() => setIsZoneViewerOpen(true)}
        onToggleAdmin={handleAdminToggle}
        isAdmin={isAdminMode}
        ambientSoundActive={playbackState.ambientCaveSound}
        onToggleAmbientSound={() => audioEngine.toggleAmbientCaveSound()}
        isOffline={isOffline}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {isAdminMode ? (
          <AdminLayout
            points={points}
            analytics={analyticsEvents}
            onExitAdmin={() => setIsAdminMode(false)}
            onRefreshData={refreshData}
          />
        ) : (
          <>
            {currentScreen === 'WELCOME' && (
              <WelcomeScreen
                currentLanguage={language}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                onStartTour={handleStartTourFromWelcome}
                isOfflineReady={StorageService.isOfflinePackageReady()}
                onOpenDownloadScreen={() => setCurrentScreen('DOWNLOAD')}
              />
            )}

            {currentScreen === 'PERMISSIONS' && (
              <PermissionsScreen
                language={language}
                onContinue={handlePermissionsContinue}
                onSkip={() => setCurrentScreen('ROUTE')}
              />
            )}

            {currentScreen === 'DOWNLOAD' && (
              <OfflineDownloadScreen
                language={language}
                onComplete={handleDownloadComplete}
                onSkip={() => setCurrentScreen('ROUTE')}
              />
            )}

            {currentScreen === 'ROUTE' && (
              <>
                <RouteOverview
                  points={points}
                  currentPointId={currentPointId}
                  visitedPointIds={visitedPointIds}
                  playbackState={playbackState}
                  language={language}
                  onSelectPoint={handleSelectAndPlayPoint}
                  onOpenPointDetail={handleOpenPointDetail}
                  onOpenQRScanner={() => setIsQRScannerOpen(true)}
                  onOpenBeaconSim={() => setIsBeaconWidgetOpen(true)}
                  onOpenVisionGuide={() => setIsZoneViewerOpen(true)}
                  onFinishTour={handleFinishTour}
                  gpsDistanceToTerrace={gpsDistanceToTerrace}
                />

                {/* Persistent Tactile Audio Player Bar */}
                <AudioPlayerSheet
                  currentPoint={currentPoint}
                  playbackState={playbackState}
                  language={language}
                  onOpenPointDetail={handleOpenPointDetail}
                  onOpenTranscript={handleOpenPointDetail}
                  onOpenVisionGuide={() => setIsZoneViewerOpen(true)}
                  onPreviousPoint={handlePreviousPoint}
                  onNextPoint={handleNextPoint}
                  hasPrevious={currentPointIndex > 0}
                  hasNext={currentPointIndex < publishedPoints.length - 1}
                />
              </>
            )}

            {currentScreen === 'END' && (
              <TourEndScreen
                language={language}
                totalPoints={points.length}
                onRestartTour={() => {
                  setCurrentScreen('ROUTE');
                  const p1 = points.find(p => p.id === 'CM-01') || points[0];
                  if (p1) handleSelectAndPlayPoint(p1);
                }}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={language}
        onSelectLanguage={handleLanguageChange}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        points={points}
        language={language}
        onPointActivated={handleQRPointActivated}
      />

      <ZoneRecognitionViewer
        isOpen={isZoneViewerOpen}
        onClose={() => setIsZoneViewerOpen(false)}
        points={points}
        currentPointId={currentPointId}
        visitedPointIds={visitedPointIds}
        language={language}
        playbackState={playbackState}
        onSelectAndPlayPoint={handleSelectAndPlayPoint}
        onOpenPointDetail={handleOpenPointDetail}
        onOpenBeaconSim={() => {
          setIsZoneViewerOpen(false);
          setIsBeaconWidgetOpen(true);
        }}
        onOpenQRScanner={() => {
          setIsZoneViewerOpen(false);
          setIsQRScannerOpen(true);
        }}
      />

      <BeaconStatusWidget
        isOpen={isBeaconWidgetOpen}
        onClose={() => setIsBeaconWidgetOpen(false)}
        points={points}
        language={language}
      />

      <PointDetailModal
        point={selectedDetailPoint}
        isOpen={!!selectedDetailPoint}
        onClose={() => setSelectedDetailPoint(null)}
        language={language}
        playbackState={playbackState}
        onPlayPoint={p => {
          handleSelectAndPlayPoint(p);
          setSelectedDetailPoint(null);
        }}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => {
          setIsAdminMode(true);
          refreshData();
        }}
      />
    </div>
  );
}
