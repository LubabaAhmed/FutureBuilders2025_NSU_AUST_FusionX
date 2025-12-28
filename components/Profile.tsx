
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
  Award,
  ArrowLeft
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
  
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

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

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim()
    };
    saveUser({ ...currentUser, contacts: [...currentUser.contacts, contact] });
    setNewContact({ name: '', phone: '' });
  };

  const removeContact = (id: string) => {
    saveUser({ ...currentUser, contacts: currentUser.contacts.filter(c => c.id !== id) });
  };

  // Sub-screen renderers
  if (screen === 'medical') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <SubHeader title="চিকিৎসা তথ্য" onBack={() => setScreen('main')} color="bg-red-600" />
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-red-50 space-y-8">
            <section>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">রক্তের গ্রুপ</p>
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
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">অ্যালার্জি ও সেনসিটিভিটি</p>
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

  if (screen === 'contacts') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <SubHeader title="জরুরি কন্টাক্ট" onBack={() => setScreen('main')} color="bg-teal-600" />
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-teal-50 space-y-8">
            <div className="space-y-4">
              {currentUser.contacts.map(c => (
                <div key={c.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black text-lg shadow-inner">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-base">{c.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => removeContact(c.id)} className="p-3 text-slate-300 hover:text-red-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border-2 border-dashed border-indigo-100">
              <p className="text-[10px] font-black text-indigo-950 uppercase mb-4 tracking-widest">নতুন কন্টাক্ট যোগ করুন</p>
              <div className="space-y-3">
                <input type="text" placeholder="নাম" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm outline-none shadow-sm"
                  value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} />
                <input type="text" placeholder="ফোন নাম্বার" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm outline-none shadow-sm"
                  value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} />
                <button onClick={addContact} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all">
                  <Plus className="w-5 h-5" /> <span>যোগ করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'credentials') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <SubHeader title="অ্যাকাউন্ট সেটিংস" onBack={() => setScreen('main')} color="bg-indigo-900" />
        <div className="p-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-6">
            {credMessage && (
               <div className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center space-x-3 ${credMessage.includes('সফল') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                 <Check className="w-4 h-4" /> <span>{credMessage}</span>
               </div>
            )}
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ইউজার আইডি</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                   <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold outline-none transition-all"
                     value={editUserId} onChange={(e) => setEditUserId(e.target.value)} />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">নতুন পাসওয়ার্ড</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                   <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold outline-none transition-all"
                     value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                 </div>
               </div>
               <button onClick={updateCredentials} className="w-full bg-indigo-950 text-white font-black py-5 rounded-3xl shadow-xl border-b-4 border-black flex items-center justify-center space-x-3">
                 <Save className="w-5 h-5" /> <span>সংরক্ষণ করুন</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Settings & Privacy screens
  if (screen === 'settings') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <SubHeader title="অ্যাপ সেটিংস" onBack={() => setScreen('main')} color="bg-slate-700" />
        <div className="p-6 space-y-4">
          <ToggleOption icon={<Bell className="w-5 h-5" />} label="নোটিফিকেশন" active={currentUser.settings.notifications} onClick={() => toggleSetting('notifications')} />
          <ToggleOption icon={<Activity className="w-5 h-5" />} label="অফলাইন মোড" active={currentUser.settings.offlineMode} onClick={() => toggleSetting('offlineMode')} />
        </div>
      </div>
    );
  }

  if (screen === 'privacy') {
    return (
      <div className="h-full bg-slate-50 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 pb-20">
        <SubHeader title="সুরক্ষা প্রটোকল" onBack={() => setScreen('main')} color="bg-amber-600" />
        <div className="p-6 space-y-4">
          <ToggleOption icon={<MapPin className="w-5 h-5" />} label="অবস্থান শেয়ারিং" active={currentUser.privacy.shareLocation} onClick={() => togglePrivacy('shareLocation')} />
          <ToggleOption icon={<Eye className="w-5 h-5" />} label="দৃশ্যমানতা" active={currentUser.privacy.visibleToResponders} onClick={() => togglePrivacy('visibleToResponders')} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto pb-24 animate-in fade-in duration-500">
      {/* Seamless Visual Hero Header */}
      <div className="bg-indigo-950 pt-16 pb-24 px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-indigo-900 rotate-2 group transition-transform hover:rotate-0 duration-500 overflow-hidden">
              <UserIcon className="w-16 h-16 text-indigo-950 -rotate-2 group-hover:rotate-0 transition-transform" />
            </div>
            <button className="absolute bottom-0 right-0 bg-red-600 text-white p-3 rounded-2xl shadow-xl border-4 border-indigo-950 hover:bg-red-700 active:scale-90 transition-all">
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
               <span className="text-[9px] text-green-400 font-black uppercase tracking-widest italic">Live Profile</span>
             </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto">
             <HeroStat icon={<Award className="w-4 h-4 text-amber-400" />} label="Verified" color="bg-indigo-900/50" />
             <HeroStat icon={<Droplets className="w-4 h-4 text-red-500" />} label={currentUser.medicalHistory?.bloodGroup || 'N/A'} color="bg-indigo-900/50" />
             <HeroStat icon={<MapPin className="w-4 h-4 text-indigo-400" />} label="Citizen" color="bg-indigo-900/50" />
          </div>
        </div>
      </div>

      {/* Control Center - Options stacked under Header */}
      <div className="flex-1 px-6 space-y-6 -mt-10 relative z-20">
        
        {/* Section 1: Medical History (Highlight) */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] ml-4 drop-shadow-sm">স্বাস্থ্যের অবস্থা</p>
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
                <h3 className="text-xl font-black italic tracking-tighter text-slate-900 leading-none">চিকিৎসা ইতিহাস</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Medical Records & Allergies</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        {/* Section 2: Contacts & Protocols */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">সুরক্ষা ও যোগাযোগ</p>
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <ModernMenuOption 
              icon={<Shield className="w-6 h-6 text-teal-600" />} 
              label="জরুরি কন্টাক্ট" 
              sub="Emergency Trusted Contacts"
              onClick={() => setScreen('contacts')}
              count={currentUser.contacts.length}
            />
            <ModernMenuOption 
              icon={<Eye className="w-6 h-6 text-amber-600" />} 
              label="সুরক্ষা প্রটোকল" 
              sub="Privacy & Visibility Control"
              onClick={() => setScreen('privacy')}
            />
          </div>
        </div>

        {/* Section 3: App & Account Settings */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">সিস্টেম ও একাউন্ট</p>
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <ModernMenuOption 
              icon={<Lock className="w-6 h-6 text-indigo-600" />} 
              label="অ্যাকাউন্ট সেটিংস" 
              sub="Password & Identity Manage"
              onClick={() => setScreen('credentials')}
            />
            <ModernMenuOption 
              icon={<Settings className="w-6 h-6 text-slate-600" />} 
              label="অ্যাপ সেটিংস" 
              sub="Notifications & Interface"
              onClick={() => setScreen('settings')}
            />
          </div>
        </div>

        {/* Logout Action */}
        <button 
          onClick={onLogout}
          className="w-full bg-white text-red-600 font-black py-6 rounded-[2.5rem] shadow-lg border border-red-100 flex items-center justify-center space-x-3 active:scale-95 transition-all group overflow-hidden relative"
        >
          <LogOut className="w-6 h-6 relative z-10" />
          <span className="text-lg uppercase tracking-tight relative z-10">সিস্টেম থেকে লগ আউট</span>
        </button>

        <div className="text-center py-6">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">LifeLine Secure v2.6.4</p>
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
    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left group"
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

const SubHeader = ({ title, onBack, color }: { title: string, onBack: () => void, color: string }) => (
  <div className={`${color} p-8 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-50`}>
    <button onClick={onBack} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
      <ArrowLeft className="w-6 h-6" />
    </button>
    <h2 className="text-2xl font-black italic tracking-tight">{title}</h2>
  </div>
);

const ToggleOption = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 transition-all active:scale-[0.98] text-left shadow-sm"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-2xl ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
        {icon}
      </div>
      <span className="text-sm font-black text-slate-700 tracking-tight">{label}</span>
    </div>
    <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${active ? 'bg-indigo-600 shadow-inner' : 'bg-slate-300'}`}>
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${active ? 'translate-x-7' : 'translate-x-1'}`} />
    </div>
  </button>
);

export default Profile;
