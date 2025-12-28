
import React, { useState } from 'react';
import { User, AppView, SOSAlert, Broadcast } from '../types';
import { 
  Map as MapIcon, 
  MessageSquare, 
  Bell, 
  Stethoscope, 
  User as UserIcon, 
  Activity,
  Wifi,
  WifiOff,
  Sparkles,
  Heart,
  ClipboardList
} from 'lucide-react';
import EmergencyMap from './EmergencyMap';
import MeshChat from './MeshChat';
import BroadcastFeed from './BroadcastFeed';
import AIDoctor from './AIDoctor';
import Profile from './Profile';
import SOSButton from './SOSButton';
import FirstAid from './FirstAid';
import VoiceControl from './VoiceControl';
import { MOCK_BROADCASTS, STRINGS } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<AppView>('map');
  const [isOnline] = useState(true);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [broadcasts] = useState<Broadcast[]>(MOCK_BROADCASTS);
  const [voiceQuery, setVoiceQuery] = useState<string | null>(null);

  const handleSOS = (alert: SOSAlert) => {
    setSosAlerts(prev => [alert, ...prev]);
  };

  const handleVoiceAction = (action: string, params?: string) => {
    switch (action) {
      case 'NAVIGATE_MAP': setCurrentView('map'); break;
      case 'NAVIGATE_CHAT': setCurrentView('chat'); break;
      case 'NAVIGATE_DOCTOR': 
        setVoiceQuery(null);
        setCurrentView('doctor'); 
        break;
      case 'NAVIGATE_FIRST_AID': setCurrentView('firstaid'); break;
      case 'NAVIGATE_PROFILE': setCurrentView('profile'); break;
      case 'SCAN_MEDICINE':
        setCurrentView('doctor');
        setVoiceQuery("ওষুধ স্ক্যান করতে ক্যামেরা বাটন চাপুন।");
        break;
      case 'TRIGGER_SOS': 
        alert("জরুরি SOS সক্রিয় করা হচ্ছে!"); 
        break;
      case 'MEDICAL_QUERY':
        setVoiceQuery(params || null);
        setCurrentView('doctor');
        break;
      case 'FIRST_AID_QUERY':
        setCurrentView('firstaid');
        break;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'map': return <EmergencyMap user={user} alerts={sosAlerts} />;
      case 'chat': return <MeshChat user={user} isOnline={isOnline} />;
      case 'broadcast': return <BroadcastFeed broadcasts={broadcasts} />;
      case 'doctor': return <AIDoctor user={user} initialQuery={voiceQuery} />;
      case 'firstaid': return <FirstAid />;
      case 'profile': return <Profile user={user} onLogout={onLogout} />;
      default: return <EmergencyMap user={user} alerts={sosAlerts} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <header className="bg-indigo-950 text-white px-6 py-5 flex justify-between items-center shadow-2xl z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-xl rotate-12 shadow-lg">
            <Stethoscope className="w-5 h-5 text-white -rotate-12" />
          </div>
          <h2 className="text-xl font-black tracking-tighter italic">ডাক্তার আছে?</h2>
        </div>
        
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-inner ${isOnline ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{isOnline ? 'অনলাইন' : 'মেস মোড'}</span>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-white rounded-t-[3rem] -mt-6 shadow-2xl z-10 border-t border-white/20">
        {renderView()}
        {currentView !== 'chat' && currentView !== 'doctor' && (
          <SOSButton user={user} onSOS={handleSOS} />
        )}
        <VoiceControl onAction={handleVoiceAction} />
      </main>

      <nav className="bg-white border-t border-slate-100 pb-safe-area shadow-[0_-15px_40px_rgba(0,0,0,0.08)] z-50">
        <div className="flex justify-around items-center h-24 min-w-full px-4">
          <NavButton active={currentView === 'map'} onClick={() => setCurrentView('map')} icon={<MapIcon className="w-6 h-6" />} label={STRINGS.nav_map} />
          <NavButton active={currentView === 'chat'} onClick={() => setCurrentView('chat')} icon={<MessageSquare className="w-6 h-6" />} label={STRINGS.nav_mesh} />
          <NavButton active={currentView === 'doctor'} onClick={() => { setCurrentView('doctor'); setVoiceQuery(null); }} icon={<Heart className="w-6 h-6" />} label="ডাক্তার এআই" />
          <NavButton active={currentView === 'firstaid'} onClick={() => setCurrentView('firstaid')} icon={<Activity className="w-6 h-6" />} label="চিকিৎসা" />
          <NavButton active={currentView === 'profile'} onClick={() => setCurrentView('profile')} icon={<UserIcon className="w-6 h-6" />} label={STRINGS.nav_profile} />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-indigo-900 scale-110' : 'text-slate-400'}`}>
    <div className={`p-3 rounded-[1.25rem] transition-all ${active ? 'bg-indigo-50 shadow-md' : 'hover:bg-slate-50'}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default Dashboard;
