
import React from 'react';
import { User } from '../types';
import { LogOut, User as UserIcon, Settings, Heart, Shield, FileText } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="bg-indigo-950 p-8 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
          <UserIcon className="w-12 h-12 text-indigo-950" />
        </div>
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-indigo-300 text-sm">{user.email}</p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-indigo-900/50 px-3 py-1.5 rounded-full border border-indigo-700">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">{user.role} Account</span>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <MenuOption icon={<Heart className="text-red-500" />} label="Medical Information" />
          <MenuOption icon={<Shield className="text-indigo-500" />} label="Trusted Contacts (3)" />
          <MenuOption icon={<FileText className="text-amber-500" />} label="Emergency Protocols" />
          <MenuOption icon={<Settings className="text-slate-500" />} label="App Preferences" />
        </div>

        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <h4 className="text-xs font-bold text-indigo-950 uppercase mb-2 tracking-widest">Network Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-xl border border-indigo-100">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Mesh Hops</p>
              <p className="text-xl font-black text-indigo-600">4,209</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-indigo-100">
              <p className="text-[10px] text-slate-500 font-bold uppercase">SOS History</p>
              <p className="text-xl font-black text-indigo-600">0</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-white text-red-600 font-bold py-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
        >
          <LogOut className="w-5 h-5" />
          <span>Secure Sign Out</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-400 p-6">
        HillShield v2.4.0 • Built for Hill Tracts Development Board
      </p>
    </div>
  );
};

const MenuOption = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
    <div className="w-5 h-5 text-slate-300">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" /></svg>
    </div>
  </button>
);

export default Profile;
