
import React, { useState } from 'react';
import { User, Contact } from '../types';
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Heart, 
  Shield, 
  FileText, 
  Droplets, 
  AlertCircle, 
  X, 
  Plus, 
  ChevronRight,
  Phone,
  Check,
  Bell,
  Eye,
  Activity,
  MapPin,
  ExternalLink,
  Info,
  Stethoscope,
  Pill,
  Thermometer,
  Lock,
  Mail,
  Save,
  Camera,
  ShieldCheck,
  Award
} from 'lucide-react';
import { STRINGS, PREDEFINED_ALLERGIES, PREDEFINED_CONDITIONS, PUBLIC_EMERGENCY_CONTACTS } from '../constants';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

type ProfileScreen = 'main' | 'medical' | 'contacts' | 'settings' | 'privacy' | 'credentials';

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [screen, setScreen] = useState<ProfileScreen>('main');
  const [currentUser, setCurrentUser] = useState<User>(user);
  
  // Local states for adding items
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  // Credential editing states
  const [editUserId, setEditUserId] = useState(user.userId);
  const [editPassword, setEditPassword] = useState(user.password || '');
  const [credMessage, setCredMessage] = useState('');

  const saveUser = (updated: User) => {
    setCurrentUser(updated);
    localStorage.setItem('hillshield_user', JSON.stringify(updated));
    const accountsRaw = localStorage.getItem('hillshield_accounts');
    if (accountsRaw) {
      const accounts: User[] = JSON.parse(accountsRaw);
      const index = accounts.findIndex(a => a.id === updated.id);
      if (index !== -1) {
        accounts[index] = updated;
        localStorage.setItem('hillshield_accounts', JSON.stringify(accounts));
      }
    }
  };

  const updateCredentials = () => {
    if (!editUserId.trim() || !editPassword.trim()) {
      setCredMessage('সবগুলো ঘর পূরণ করুন।');
      return;
    }
    if (editUserId !== currentUser.userId) {
       const accountsRaw = localStorage.getItem('hillshield_accounts');
       const accounts: User[] = accountsRaw ? JSON.parse(accountsRaw) : [];
       if (accounts.find(a => a.userId === editUserId && a.id !== currentUser.id)) {
         setCredMessage('এই ইউজার আইডি ইতিমধ্যে ব্যবহার করা হয়েছে।');
         return;
       }
    }
    const updated = { ...currentUser, userId: editUserId, password: editPassword };
    saveUser(updated);
    setCredMessage('সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => setCredMessage(''), 3000);
  };

  const removeItem = (type: 'allergies' | 'conditions' | 'medications', index: number) => {
    if (!currentUser.medicalHistory) return;
    const history = { ...currentUser.medicalHistory };
    history[type] = history[type].filter((_, i) => i !== index);
    saveUser({ ...currentUser, medicalHistory: history });
  };

  const addItem = (type: 'allergies' | 'conditions' | 'medications') => {
    let textToAdd = '';
    if (type === 'allergies') textToAdd = newAllergy.trim();
    if (type === 'conditions') textToAdd = newCondition.trim();
    if (type === 'medications') textToAdd = newMedication.trim();
    if (!textToAdd || !currentUser.medicalHistory) return;
    if (currentUser.medicalHistory[type].includes(textToAdd)) return;
    const history = { ...currentUser.medicalHistory };
    history[type] = [...history[type], textToAdd];
    saveUser({ ...currentUser, medicalHistory: history });
    if (type === 'allergies') setNewAllergy('');
    if (type === 'conditions') setNewCondition('');
    if (type === 'medications') setNewMedication('');
  };

  const toggleSetting = (key: keyof User['settings']) => {
    saveUser({ ...currentUser, settings: { ...currentUser.settings, [key]: !currentUser.settings[key] } });
  };

  const togglePrivacy = (key: keyof User['privacy']) => {
    saveUser({ ...currentUser, privacy: { ...currentUser.privacy, [key]: !currentUser.privacy[key] } });
  };

  if (screen === 'medical') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <div className="bg-red-600 p-8 text-white flex items-center space-x-4 shadow-lg sticky top-0 z-20">
          <button onClick={() => setScreen('main')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all"><ChevronRight className="w-6 h-6 rotate-180" /></button>
          <h2 className="text-xl font-black tracking-tight italic">স্বাস্থ্য প্রোফাইল</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-red-50 space-y-8">
            <section>
              <div className="flex items-center space-x-2 mb-4 text-red-600">
                <Droplets className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{STRINGS.blood_group}</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <button key={bg} onClick={() => saveUser({...currentUser, medicalHistory: {...currentUser.medicalHistory!, bloodGroup: bg}})}
                    className={`py-4 text-sm font-black rounded-2xl border transition-all ${currentUser.medicalHistory?.bloodGroup === bg ? 'bg-red-600 text-white border-red-600 shadow-lg scale-105' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-red-200'}`}>
                    {bg}
                  </button>
                ))}
              </div>
            </section>
            <section className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
              <div className="flex items-center space-x-2 mb-4 text-blue-600">
                <Info className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">অ্যালার্জি ও সেনসিটিভিটি</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentUser.medicalHistory?.allergies.map((item, i) => (
                  <span key={i} className="bg-white text-blue-700 px-4 py-2 rounded-xl text-[11px] font-black flex items-center shadow-sm border border-blue-100">
                    {item} <button onClick={() => removeItem('allergies', i)} className="ml-2 text-red-400"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input type="text" placeholder="যোগ করুন..." className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  onChange={(e) => setNewAllergy(e.target.value)} value={newAllergy} onKeyDown={(e) => e.key === 'Enter' && addItem('allergies')} />
                <button onClick={() => addItem('allergies')} className="bg-blue-600 text-white p-3 rounded-xl shadow-lg"><Plus className="w-5 h-5" /></button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'credentials') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <div className="bg-indigo-900 p-8 text-white flex items-center space-x-4 shadow-lg sticky top-0 z-20">
          <button onClick={() => setScreen('main')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all"><ChevronRight className="w-6 h-6 rotate-180" /></button>
          <h2 className="text-xl font-black tracking-tight italic">অ্যাকাউন্ট সেটিংস</h2>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-8">
            <div className="flex flex-col items-center space-y-2 mb-4">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Lock className="w-8 h-8" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">নিরাপত্তা ও অ্যাক্সেস</p>
            </div>
            {credMessage && (
               <div className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center space-x-3 ${credMessage.includes('সফল') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                 <Check className="w-4 h-4" /> <span>{credMessage}</span>
               </div>
            )}
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইউজার আইডি</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                   <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold outline-none transition-all"
                     value={editUserId} onChange={(e) => setEditUserId(e.target.value)} />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">নতুন পাসওয়ার্ড</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                   <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold outline-none transition-all"
                     value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                 </div>
               </div>
               <button onClick={updateCredentials} className="w-full bg-indigo-950 text-white font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-all border-b-4 border-black flex items-center justify-center space-x-3">
                 <Save className="w-5 h-5" /> <span>সংরক্ষণ করুন</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto pb-24 animate-in fade-in duration-500">
      {/* Visual Hero Header */}
      <div className="bg-indigo-950 pt-16 pb-24 px-10 text-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          {/* Main Avatar Section */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-indigo-900 rotate-2 group transition-transform hover:rotate-0 duration-500">
              <UserIcon className="w-16 h-16 text-indigo-950 -rotate-2 group-hover:rotate-0 transition-transform" />
            </div>
            <button className="absolute bottom-0 right-0 bg-red-600 text-white p-3 rounded-2xl shadow-xl border-4 border-indigo-950 hover:bg-red-700 transition-colors active:scale-90">
              <Camera className="w-5 h-5" />
            </button>
            <div className="absolute -top-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-indigo-950 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tighter italic leading-none">{currentUser.name}</h2>
          <div className="flex items-center justify-center space-x-2 mt-3">
             <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
               <span className="text-[10px] text-indigo-100 font-black uppercase tracking-widest">{currentUser.userId}</span>
             </div>
             <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
               <span className="text-[9px] text-green-400 font-black uppercase tracking-widest">Active</span>
             </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto">
             <HeroStat icon={<Award className="w-4 h-4 text-amber-400" />} label="Verified" color="bg-indigo-900/50" />
             <HeroStat icon={<Droplets className="w-4 h-4 text-red-500" />} label={currentUser.medicalHistory?.bloodGroup || 'N/A'} color="bg-indigo-900/50" />
             <HeroStat icon={<MapPin className="w-4 h-4 text-indigo-400" />} label="Citizen" color="bg-indigo-900/50" />
          </div>
        </div>
      </div>

      {/* Profile Body Options */}
      <div className="flex-1 px-6 space-y-6 -mt-10 relative z-20">
        {/* Important Health Summary Card */}
        <button 
          onClick={() => setScreen('medical')}
          className="w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-red-50 flex items-center justify-between transition-all active:scale-[0.98] group overflow-hidden relative"
        >
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
             <Heart className="w-32 h-32 text-red-600" />
          </div>
          <div className="flex items-center space-x-5 relative z-10">
            <div className="p-5 bg-red-100 rounded-[1.5rem] text-red-600 shadow-inner">
              <Heart className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black italic tracking-tighter text-slate-900 leading-none">স্বাস্থ্য প্রোফাইল</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Medical History & Vitals</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative z-10">
            <span className="text-[9px] font-black text-red-600 uppercase bg-red-50 px-3 py-1.5 rounded-full border border-red-100">সম্পাদনা</span>
            <ChevronRight className="w-6 h-6 text-slate-200" />
          </div>
        </button>

        {/* Sectioned Menu */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">সিস্টেম ও একাউন্ট</h4>
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <ModernMenuOption 
              icon={<Lock className="w-6 h-6 text-indigo-600" />} 
              label="অ্যাকাউন্ট সেটিংস" 
              sub="ইউজার আইডি ও পাসওয়ার্ড পরিবর্তন"
              onClick={() => setScreen('credentials')}
            />
            <ModernMenuOption 
              icon={<Shield className="w-6 h-6 text-teal-600" />} 
              label="জরুরি কন্টাক্ট" 
              sub="বিপদকালীন উদ্ধারকারীদের জন্য"
              onClick={() => setScreen('contacts')}
              count={currentUser.contacts.length}
            />
            <ModernMenuOption 
              icon={<Eye className="w-6 h-6 text-amber-600" />} 
              label="সুরক্ষা প্রটোকল" 
              sub="অবস্থান ও দৃশ্যমানতা নিয়ন্ত্রণ"
              onClick={() => setScreen('privacy')}
            />
            <ModernMenuOption 
              icon={<Settings className="w-6 h-6 text-slate-600" />} 
              label="অ্যাপ সেটিংস" 
              sub="নোটিফিকেশন ও ইন্টারফেস"
              onClick={() => setScreen('settings')}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <button 
          onClick={onLogout}
          className="w-full bg-white text-red-600 font-black py-6 rounded-[2.5rem] shadow-lg border border-red-100 flex items-center justify-center space-x-3 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute left-0 w-1 bg-red-600 h-full group-hover:w-full opacity-5 transition-all duration-300"></div>
          <LogOut className="w-6 h-6 relative z-10" />
          <span className="text-lg uppercase tracking-tight relative z-10">সিস্টেম থেকে লগ আউট</span>
        </button>

        <div className="text-center py-6">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Doctor Ache? v2.5.0</p>
        </div>
      </div>
    </div>
  );
};

const HeroStat = ({ icon, label, color }: any) => (
  <div className={`${color} rounded-2xl p-3 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center space-y-1`}>
    {icon}
    <span className="text-[9px] font-black text-white uppercase tracking-tighter">{label}</span>
  </div>
);

const ModernMenuOption = ({ icon, label, sub, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 text-left group"
  >
    <div className="flex items-center space-x-5">
      <div className="p-4 bg-slate-50 rounded-[1.25rem] group-hover:bg-white group-hover:shadow-md transition-all">
        {icon}
      </div>
      <div>
        <span className="block text-base font-black text-slate-800 leading-tight mb-0.5">{label}</span>
        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub}</span>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {count !== undefined && (
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full">{count}</span>
      )}
      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-300 transition-colors" />
    </div>
  </button>
);

export default Profile;
