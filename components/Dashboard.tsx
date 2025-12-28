
import React, { useState, useEffect } from 'react';
import { User, AppView, SOSAlert, Broadcast } from '../types';
import { 
  Map as MapIcon, 
  MessageSquare, 
  Bell, 
  Stethoscope, 
  User as UserIcon, 
  AlertTriangle,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';
import EmergencyMap from './EmergencyMap';
import MeshChat from './MeshChat';
import BroadcastFeed from './BroadcastFeed';
import AIDoctor from './AIDoctor';
import Profile from './Profile';
import SOSButton from './SOSButton';
import FirstAid from './FirstAid';
import { MOCK_BROADCASTS, STRINGS } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<AppView>('map');
  const [isOnline, setIsOnline] = useState(true);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [broadcasts] = useState<Broadcast[]>(MOCK_BROADCASTS);

  const handleSOS = (alert: SOSAlert) => {
    setSosAlerts(prev => [alert, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'map': return <EmergencyMap user={user} alerts={sosAlerts} />;
      case 'chat': return <MeshChat user={user} isOnline={isOnline} />;
      case 'broadcast': return <BroadcastFeed broadcasts={broadcasts} />;
      case 'doctor': return <AIDoctor user={user} />;
      case 'firstaid': return <FirstAid />;
      case 'profile': return <Profile user={user} onLogout={onLogout} />;
      default: return <EmergencyMap user={user} alerts={sosAlerts} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="bg-indigo-950 text-white p-4 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight">{STRINGS.app_name}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'নেটওয়ার্ক' : 'মেস মোড'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative bg-white overflow-hidden">
        {renderView()}
        {currentView !== 'chat' && currentView !== 'doctor' && (
          <SOSButton user={user} onSOS={handleSOS} />
        )}
      </main>

      <nav className="bg-white border-t border-slate-200 pb-safe-area shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 overflow-x-auto">
        <div className="flex justify-around items-center h-16 min-w-full px-2">
          <NavButton 
            active={currentView === 'map'} 
            onClick={() => setCurrentView('map')} 
            icon={<MapIcon className="w-5 h-5" />} 
            label={STRINGS.nav_map} 
          />
          <NavButton 
            active={currentView === 'chat'} 
            onClick={() => setCurrentView('chat')} 
            icon={<MessageSquare className="w-5 h-5" />} 
            label={STRINGS.nav_mesh} 
          />
          <NavButton 
            active={currentView === 'doctor'} 
            onClick={() => setCurrentView('doctor')} 
            icon={<Stethoscope className="w-5 h-5" />} 
            label={STRINGS.nav_doctor} 
          />
          <NavButton 
            active={currentView === 'firstaid'} 
            onClick={() => setCurrentView('firstaid')} 
            icon={<Activity className="w-5 h-5" />} 
            label={STRINGS.nav_firstaid} 
          />
          <NavButton 
            active={currentView === 'broadcast'} 
            onClick={() => setCurrentView('broadcast')} 
            icon={<Bell className="w-5 h-5" />} 
            label={STRINGS.nav_alerts} 
          />
          <NavButton 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')} 
            icon={<UserIcon className="w-5 h-5" />} 
            label={STRINGS.nav_profile} 
          />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-shrink-0 px-2 transition-colors ${active ? 'text-red-600' : 'text-slate-400'}`}
  >
    <div className={`p-1 rounded-lg transition-colors ${active ? 'bg-red-50' : ''}`}>
      {icon}
    </div>
    <span className="text-[9px] font-bold mt-0.5 whitespace-nowrap">{label}</span>
  </button>
);

export default Dashboard;
