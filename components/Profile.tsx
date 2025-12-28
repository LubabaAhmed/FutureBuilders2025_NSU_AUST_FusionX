
import React from 'react';
import { User } from '../types';
import { LogOut, User as UserIcon, Settings, Heart, Shield, FileText, Droplets, AlertCircle } from 'lucide-react';
import { STRINGS } from '../constants';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  // Mock medical history if none exists
  const medical = user.medicalHistory || {
    bloodGroup: 'O+',
    allergies: ['ডাস্ট অ্যালার্জি', 'পেনিসিলিন'],
    conditions: ['অ্যাজমা'],
    medications: ['ইনহেলার']
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">
      <div className="bg-indigo-950 p-8 text-center relative">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-indigo-900">
          <UserIcon className="w-12 h-12 text-indigo-950" />
        </div>
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-indigo-300 text-sm">{user.email}</p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-indigo-900/50 px-3 py-1.5 rounded-full border border-indigo-700">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">নাগরিক প্রোফাইল</span>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 -mt-4">
        {/* Medical History Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-red-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Heart className="w-20 h-20 text-red-600" />
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-100 rounded-xl">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">{STRINGS.medical_history}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Droplets className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold text-slate-600">{STRINGS.blood_group}</span>
              </div>
              <span className="text-lg font-black text-red-600">{medical.bloodGroup}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{STRINGS.allergies}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {medical.allergies.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{STRINGS.conditions}</label>
                <div className="flex flex-wrap gap-2">
                  {medical.conditions.map((c, i) => (
                    <span key={i} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <MenuOption icon={<Shield className="text-indigo-500" />} label="জরুরি কন্টাক্ট (৩)" />
          <MenuOption icon={<FileText className="text-amber-500" />} label="সুরক্ষা প্রটোকল" />
          <MenuOption icon={<Settings className="text-slate-500" />} label="অ্যাপ সেটিংস" />
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-white text-red-600 font-bold py-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
        >
          <LogOut className="w-5 h-5" />
          <span>লগ আউট</span>
        </button>
      </div>
    </div>
  );
};

const MenuOption = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
    <ChevronRightIcon />
  </button>
);

const ChevronRightIcon = () => (
  <div className="w-5 h-5 text-slate-300">
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" /></svg>
  </div>
);

export default Profile;
