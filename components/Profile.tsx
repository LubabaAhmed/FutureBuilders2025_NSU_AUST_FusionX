
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
  Thermometer
} from 'lucide-react';
import { STRINGS, PREDEFINED_ALLERGIES, PREDEFINED_CONDITIONS, PUBLIC_EMERGENCY_CONTACTS } from '../constants';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

type ProfileScreen = 'main' | 'medical' | 'contacts' | 'settings' | 'privacy';

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [screen, setScreen] = useState<ProfileScreen>('main');
  const [currentUser, setCurrentUser] = useState<User>(user);
  
  // Local states for adding items - SEPARATED to fix the bug
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  const saveUser = (updated: User) => {
    setCurrentUser(updated);
    localStorage.setItem('hillshield_user', JSON.stringify(updated));
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
    
    if (currentUser.medicalHistory[type].includes(textToAdd)) {
      if (type === 'allergies') setNewAllergy('');
      if (type === 'conditions') setNewCondition('');
      if (type === 'medications') setNewMedication('');
      return;
    }

    const history = { ...currentUser.medicalHistory };
    history[type] = [...history[type], textToAdd];
    saveUser({ ...currentUser, medicalHistory: history });
    
    // Reset specific field
    if (type === 'allergies') setNewAllergy('');
    if (type === 'conditions') setNewCondition('');
    if (type === 'medications') setNewMedication('');
  };

  const togglePredefined = (type: 'allergies' | 'conditions', value: string) => {
    if (!currentUser.medicalHistory) return;
    const history = { ...currentUser.medicalHistory };
    if (history[type].includes(value)) {
      history[type] = history[type].filter(i => i !== value);
    } else {
      history[type] = [...history[type], value];
    }
    saveUser({ ...currentUser, medicalHistory: history });
  };

  const removeContact = (id: string) => {
    saveUser({
      ...currentUser,
      contacts: currentUser.contacts.filter(c => c.id !== id)
    });
  };

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim()
    };
    saveUser({
      ...currentUser,
      contacts: [...currentUser.contacts, contact]
    });
    setNewContact({ name: '', phone: '' });
  };

  const toggleSetting = (key: keyof User['settings']) => {
    saveUser({
      ...currentUser,
      settings: { ...currentUser.settings, [key]: !currentUser.settings[key] }
    });
  };

  const togglePrivacy = (key: keyof User['privacy']) => {
    saveUser({
      ...currentUser,
      privacy: { ...currentUser.privacy, [key]: !currentUser.privacy[key] }
    });
  };

  const renderMedical = () => (
    <div className="flex-1 p-6 space-y-6 animate-in slide-in-from-right duration-200">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => setScreen('main')} className="bg-white p-2 rounded-xl shadow-sm text-red-600 hover:bg-red-50 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black text-slate-800">চিকিৎসা তথ্য আপডেট</h2>
      </div>
      
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-10">
        {/* Blood Group */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-red-600" />
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">{STRINGS.blood_group}</label>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
              <button
                key={bg}
                onClick={() => saveUser({...currentUser, medicalHistory: {...currentUser.medicalHistory!, bloodGroup: bg}})}
                className={`py-3 text-sm font-black rounded-2xl border transition-all ${
                  currentUser.medicalHistory?.bloodGroup === bg 
                  ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-red-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </section>

        {/* Allergies */}
        <section className="bg-blue-50/30 p-6 rounded-[2rem] border border-blue-100/50">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-black text-blue-900 uppercase tracking-widest">{STRINGS.allergies}</label>
          </div>
          
          <div className="mb-4">
            <p className="text-[10px] text-blue-400 mb-3 font-bold uppercase">পরামর্শিত তালিকা:</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_ALLERGIES.map(suggested => (
                <button
                  key={suggested}
                  onClick={() => togglePredefined('allergies', suggested)}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                    currentUser.medicalHistory?.allergies.includes(suggested)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-blue-400 border-blue-100'
                  }`}
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {currentUser.medicalHistory?.allergies.map((item, i) => (
              <span key={i} className="bg-white text-blue-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm border border-blue-100">
                {item}
                <button onClick={() => removeItem('allergies', i)} className="ml-2 text-blue-300 hover:text-red-500"><X className="w-4 h-4" /></button>
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="অন্যান্য অ্যালার্জি লিখুন..." 
              className="flex-1 bg-white border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              onKeyDown={(e) => { if(e.key === 'Enter') addItem('allergies'); }}
              onChange={(e) => setNewAllergy(e.target.value)}
              value={newAllergy}
            />
            <button onClick={() => addItem('allergies')} className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Long term conditions */}
        <section className="bg-amber-50/30 p-6 rounded-[2rem] border border-amber-100/50">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-amber-600" />
            <label className="text-sm font-black text-amber-900 uppercase tracking-widest">{STRINGS.conditions}</label>
          </div>
          
          <div className="mb-4">
            <p className="text-[10px] text-amber-400 mb-3 font-bold uppercase">পরামর্শিত তালিকা:</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_CONDITIONS.map(suggested => (
                <button
                  key={suggested}
                  onClick={() => togglePredefined('conditions', suggested)}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                    currentUser.medicalHistory?.conditions.includes(suggested)
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-amber-400 border-amber-100'
                  }`}
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {currentUser.medicalHistory?.conditions.map((item, i) => (
              <span key={i} className="bg-white text-amber-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm border border-amber-100">
                {item}
                <button onClick={() => removeItem('conditions', i)} className="ml-2 text-amber-300 hover:text-red-500"><X className="w-4 h-4" /></button>
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="অন্যান্য রোগ লিখুন..." 
              className="flex-1 bg-white border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
              onKeyDown={(e) => { if(e.key === 'Enter') addItem('conditions'); }}
              onChange={(e) => setNewCondition(e.target.value)}
              value={newCondition}
            />
            <button onClick={() => addItem('conditions')} className="bg-amber-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Current Medications */}
        <section className="bg-purple-50/30 p-6 rounded-[2rem] border border-purple-100/50">
          <div className="flex items-center space-x-2 mb-4">
            <Pill className="w-5 h-5 text-purple-600" />
            <label className="text-sm font-black text-purple-900 uppercase tracking-widest">{STRINGS.medications}</label>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {currentUser.medicalHistory?.medications.map((item, i) => (
              <span key={i} className="bg-white text-purple-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm border border-purple-100">
                {item}
                <button onClick={() => removeItem('medications', i)} className="ml-2 text-purple-300 hover:text-red-500"><X className="w-4 h-4" /></button>
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="বর্তমান ওষুধগুলোর নাম লিখুন..." 
              className="flex-1 bg-white border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
              onKeyDown={(e) => { if(e.key === 'Enter') addItem('medications'); }}
              onChange={(e) => setNewMedication(e.target.value)}
              value={newMedication}
            />
            <button onClick={() => addItem('medications')} className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="flex-1 p-6 space-y-6 animate-in slide-in-from-right duration-200">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => setScreen('main')} className="bg-white p-2 rounded-xl shadow-sm text-red-600 hover:bg-red-50 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black text-slate-800">জরুরি যোগাযোগসমূহ</h2>
      </div>

      <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-black text-red-700">জাতীয় জরুরি সেবা</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {PUBLIC_EMERGENCY_CONTACTS.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-red-50 hover:border-red-200 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 leading-tight mb-1">{c.name}</p>
                  <p className="text-lg font-black text-red-600">{c.phone}</p>
                </div>
              </div>
              <a href={`tel:${c.phone}`} className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-black mb-8 flex items-center text-slate-800">
          <Shield className="w-6 h-6 mr-3 text-indigo-500" /> ব্যক্তিগত কন্টাক্ট
        </h3>

        <div className="space-y-4 mb-10">
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
              <div className="flex items-center space-x-2">
                <a href={`tel:${c.phone}`} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100">
                  <Phone className="w-5 h-5" />
                </a>
                <button onClick={() => removeContact(c.id)} className="p-3 text-slate-300 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
          {currentUser.contacts.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Info className="w-10 h-10 text-slate-200 mx-auto mb-4" />
              <p className="text-sm text-slate-400 font-medium italic">এখনো কোনো কন্টাক্ট নেই।</p>
            </div>
          )}
        </div>

        <div className="bg-indigo-50/50 p-6 rounded-[2rem] border-2 border-dashed border-indigo-100">
          <p className="text-xs font-black text-indigo-950 uppercase mb-4 flex items-center tracking-widest">
            <Plus className="w-4 h-4 mr-2" /> নতুন কন্টাক্ট যোগ করুন
          </p>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="নাম" 
              className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-200 transition-all"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="ফোন নাম্বার" 
              className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-200 transition-all"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
            />
            <button 
              onClick={addContact}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all mt-2"
            >
              <Plus className="w-5 h-5" /> <span>তালিকায় যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex-1 p-6 space-y-6 animate-in slide-in-from-right duration-200">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => setScreen('main')} className="bg-white p-2 rounded-xl shadow-sm text-red-600 hover:bg-red-50 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black text-slate-800">{STRINGS.settings}</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="space-y-4">
          <ToggleOption 
            icon={<Bell className="w-5 h-5" />} 
            label={STRINGS.notif_enable} 
            active={currentUser.settings.notifications} 
            onClick={() => toggleSetting('notifications')} 
          />
          <ToggleOption 
            icon={<Activity className="w-5 h-5" />} 
            label={STRINGS.offline_mode} 
            active={currentUser.settings.offlineMode} 
            onClick={() => toggleSetting('offlineMode')} 
          />
          {/* DARK MODE REMOVED AS REQUESTED */}
        </div>
        <p className="mt-8 text-[10px] text-slate-400 font-medium leading-relaxed px-4">
          অফলাইন মোড সক্রিয় থাকলে ইন্টারনেট না থাকলেও নিকটস্থ ডিভাইসগুলোর সাথে মেস নেটওয়ার্কের মাধ্যমে যোগাযোগ করা সম্ভব হবে।
        </p>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="flex-1 p-6 space-y-6 animate-in slide-in-from-right duration-200">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => setScreen('main')} className="bg-white p-2 rounded-xl shadow-sm text-red-600 hover:bg-red-50 transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black text-slate-800">{STRINGS.privacy}</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="space-y-4">
          <ToggleOption 
            icon={<MapPin className="w-5 h-5" />} 
            label={STRINGS.location_share} 
            active={currentUser.privacy.shareLocation} 
            onClick={() => togglePrivacy('shareLocation')} 
          />
          <ToggleOption 
            icon={<Eye className="w-5 h-5" />} 
            label={STRINGS.visibility} 
            active={currentUser.privacy.visibleToResponders} 
            onClick={() => togglePrivacy('visibleToResponders')} 
          />
          <ToggleOption 
            icon={<Activity className="w-5 h-5" />} 
            label="ব্যবহারবিধি ডেটা শেয়ার করুন" 
            active={currentUser.privacy.dataUsageAnalytics} 
            onClick={() => togglePrivacy('dataUsageAnalytics')} 
          />
        </div>
        <div className="mt-8 bg-amber-50 p-6 rounded-3xl border border-amber-100">
           <div className="flex items-start space-x-3">
             <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
             <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
               আপনার ডেটা সম্পূর্ণ এনক্রিপ্টেড এবং শুধুমাত্র জরুরি সেবার প্রয়োজনে অনুমোদিত উদ্ধারকারীদের দেখানো হবে।
             </p>
           </div>
        </div>
      </div>
    </div>
  );

  if (screen === 'medical') return <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">{renderMedical()}</div>;
  if (screen === 'contacts') return <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">{renderContacts()}</div>;
  if (screen === 'settings') return <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">{renderSettings()}</div>;
  if (screen === 'privacy') return <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">{renderPrivacy()}</div>;

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">
      <div className="bg-indigo-950 p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <UserIcon className="w-48 h-48 text-white" />
        </div>
        <div className="relative">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center shadow-2xl border-4 border-indigo-900 rotate-2">
            <UserIcon className="w-14 h-14 text-indigo-950 -rotate-2" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{currentUser.name}</h2>
          <p className="text-indigo-300 text-sm font-medium mt-1">{currentUser.email}</p>
          <div className="mt-6 inline-flex items-center space-x-3 bg-indigo-900/50 px-4 py-2 rounded-2xl border border-indigo-800">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[11px] text-indigo-100 font-black uppercase tracking-widest">নাগরিক প্রোফাইল</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 -mt-6">
        {/* Quick Medical Summary */}
        <div 
          onClick={() => setScreen('medical')}
          className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-red-50 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <Heart className="w-32 h-32 text-red-600" />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-2xl">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{STRINGS.medical_history}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">স্বাস্থ্য তথ্য</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-red-600 uppercase bg-red-50 px-4 py-2 rounded-xl border border-red-100">সম্পাদনা</span>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/30">
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-red-500" />
                <span className="text-sm font-black text-slate-700">{STRINGS.blood_group}</span>
              </div>
              <span className="text-2xl font-black text-red-600 tracking-tighter">{currentUser.medicalHistory?.bloodGroup}</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {currentUser.medicalHistory?.allergies.length ? (
                 <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap">অ্যালার্জি ({currentUser.medicalHistory.allergies.length})</span>
              ) : null}
              {currentUser.medicalHistory?.conditions.length ? (
                 <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap">দীর্ঘস্থায়ী রোগ ({currentUser.medicalHistory.conditions.length})</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-md border border-slate-100 overflow-hidden">
          <MenuOption 
            icon={<Shield className="text-indigo-600" />} 
            label={`${STRINGS.contacts} (${currentUser.contacts.length})`} 
            sub="জরুরি সেবার জন্য জাতীয় ও ব্যক্তিগত কন্টাক্ট"
            onClick={() => setScreen('contacts')}
          />
          <MenuOption 
            icon={<FileText className="text-amber-600" />} 
            label={STRINGS.privacy} 
            sub="আপনার তথ্যের নিরাপত্তা ও দৃশ্যমানতা নিয়ন্ত্রণ করুন"
            onClick={() => setScreen('privacy')}
          />
          <MenuOption 
            icon={<Settings className="text-slate-600" />} 
            label={STRINGS.settings} 
            sub="নোটিফিকেশন ও অফলাইন মেস নেটওয়ার্ক কনফিগার"
            onClick={() => setScreen('settings')}
          />
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-white text-red-600 font-black py-5 rounded-[2rem] shadow-sm border border-red-100 flex items-center justify-center space-x-3 active:scale-95 transition-all mb-10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-lg uppercase tracking-tight">সিস্টেম থেকে লগ আউট</span>
        </button>
      </div>
    </div>
  );
};

const MenuOption = ({ icon, label, sub, onClick }: { icon: React.ReactNode, label: string, sub: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 text-left"
  >
    <div className="flex items-center space-x-5">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors">
        {icon}
      </div>
      <div>
        <span className="block text-base font-black text-slate-800 leading-tight mb-0.5">{label}</span>
        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub}</span>
      </div>
    </div>
    <ChevronRight className="w-6 h-6 text-slate-300" />
  </button>
);

const ToggleOption = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all active:scale-[0.98] text-left"
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
