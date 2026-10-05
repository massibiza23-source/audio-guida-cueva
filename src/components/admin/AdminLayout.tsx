import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Headphones,
  Radio,
  QrCode,
  Globe,
  BarChart3,
  LogOut,
  ArrowLeft,
  Shield,
  Camera,
} from 'lucide-react';
import { TourPoint, AnalyticsEvent, AdminTab } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { PointManager } from './PointManager';
import { AudioManager } from './AudioManager';
import { BeaconManager } from './BeaconManager';
import { QRManager } from './QRManager';
import { LanguageManager } from './LanguageManager';
import { AnalyticsView } from './AnalyticsView';
import { VisionTrainingManager } from './VisionTrainingManager';
import { StorageService } from '../../services/storageService';

interface AdminLayoutProps {
  points: TourPoint[];
  analytics: AnalyticsEvent[];
  onExitAdmin: () => void;
  onRefreshData: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  points,
  analytics,
  onExitAdmin,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleLogout = () => {
    StorageService.setAdminAuthenticated(false);
    onExitAdmin();
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Inicio', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'points', label: 'Puntos', icon: <MapPin className="w-4 h-4" /> },
    { id: 'audio', label: 'Audios', icon: <Headphones className="w-4 h-4" /> },
    { id: 'vision', label: 'Visor IA', icon: <Camera className="w-4 h-4" /> },
    { id: 'beacons', label: 'Beacons', icon: <Radio className="w-4 h-4" /> },
    { id: 'qr', label: 'QR', icon: <QrCode className="w-4 h-4" /> },
    { id: 'languages', label: 'Idiomas', icon: <Globe className="w-4 h-4" /> },
    { id: 'analytics', label: 'Métricas', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Admin Subheader & Navigation */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 sticky top-14 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onExitAdmin}
              className="py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modo Visitante</span>
            </button>
            <div className="h-4 w-[1px] bg-stone-700"></div>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Administración Can Marçà
            </span>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-950/20 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex-1 pb-20">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            points={points}
            analytics={analytics}
            onNavigateTab={tab => setActiveTab(tab)}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'points' && (
          <PointManager points={points} onRefresh={onRefreshData} />
        )}

        {activeTab === 'audio' && (
          <AudioManager points={points} onRefresh={onRefreshData} />
        )}

        {activeTab === 'vision' && (
          <VisionTrainingManager points={points} />
        )}

        {activeTab === 'beacons' && (
          <BeaconManager points={points} onRefresh={onRefreshData} />
        )}

        {activeTab === 'qr' && <QRManager points={points} />}

        {activeTab === 'languages' && <LanguageManager points={points} />}

        {activeTab === 'analytics' && <AnalyticsView events={analytics} />}
      </main>
    </div>
  );
};
