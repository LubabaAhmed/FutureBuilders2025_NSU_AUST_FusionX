
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
  WifiOff
} from 'lucide-react';
import EmergencyMap from './EmergencyMap';
import MeshChat from './MeshChat';
import BroadcastFeed from './BroadcastFeed';
import AIDoctor from './AIDoctor';
import Profile from './Profile';
import SOSButton from './SOSButton';
import { MOCK_BROADCASTS } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<AppView>('map');
  const [isOnline, setIsOnline] = useState(true);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [broadcasts] = useState<Broadcast[]>(MOCK_BROADCASTS);

  // Simulate network status changes
  useEffect(() => {
    const timer = setInterval(() => {
      // setIsOnline(Math.random() > 0.3); // Simulate real-world instability
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSOS = (alert: SOSAlert) => {
    setSosAlerts(prev => [alert, ...prev]);
    // In a real app, this would send to server or via mesh
  };

  const renderView = () => {
    switch (currentView) {
      case 'map': return <EmergencyMap user={user} alerts={sosAlerts} />;
      case 'chat': return <MeshChat user={user} isOnline={isOnline} />;
      case 'broadcast': return <BroadcastFeed broadcasts={broadcasts} />;
      case 'doctor': return <AIDoctor user={user} />;
      case 'profile': return <Profile user={user} onLogout={onLogout} />;
      default: return <EmergencyMap user={user} alerts={sosAlerts} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Navigation / Status */}
      <header className="bg-indigo-950 text-white p-4 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight">HillShield</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'Network Live' : 'Mesh Mode'}</span>
          </div>
          <button className="relative">
            <Bell className="w-6 h-6 text-slate-300" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-white overflow-hidden">
        {renderView()}
        
        {/* Floating SOS Action Button */}
        {currentView !== 'chat' && currentView !== 'doctor' && (
          <SOSButton user={user} onSOS={handleSOS} />
        )}
      </main>

      {/* Tab Navigation (Mobile Bottom Bar) */}
      <nav className="bg-white border-t border-slate-200 pb-safe-area shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <NavButton 
            active={currentView === 'map'} 
            onClick={() => setCurrentView('map')} 
            icon={<MapIcon className="w-6 h-6" />} 
            label="Map" 
          />
          <NavButton 
            active={currentView === 'chat'} 
            onClick={() => setCurrentView('chat')} 
            icon={<MessageSquare className="w-6 h-6" />} 
            label="Mesh" 
          />
          <NavButton 
            active={currentView === 'broadcast'} 
            onClick={() => setCurrentView('broadcast')} 
            icon={<Bell className="w-6 h-6" />} 
            label="Alerts" 
          />
          <NavButton 
            active={currentView === 'doctor'} 
            onClick={() => setCurrentView('doctor')} 
            icon={<Stethoscope className="w-6 h-6" />} 
            label="Dr. AI" 
          />
          <NavButton 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')} 
            icon={<UserIcon className="w-6 h-6" />} 
            label="Me" 
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
    className={`flex flex-col items-center justify-center w-full transition-colors ${active ? 'text-red-600' : 'text-slate-400'}`}
  >
    <div className={`p-1 rounded-lg transition-colors ${active ? 'bg-red-50' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold mt-0.5 uppercase tracking-wider">{label}</span>
  </button>
);

export default Dashboard;
