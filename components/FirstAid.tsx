
import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  ChevronRight, 
  Heart, 
  ArrowLeft, 
  BriefcaseMedical, 
  Mountain, 
  Flame, 
  Ghost, 
  Scissors, 
  Calendar,
  Baby,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  PhoneCall,
  Check,
  Shield,
  Waves,
  Skull,
  Bug,
  HeartHandshake,
  ShieldAlert,
  Wind
} from 'lucide-react';
import { FIRST_AID_DATA } from '../constants';
import { FirstAidStep, FirstAidStepDetail } from '../types';
import MentalHealth from './MentalHealth';

type MedicalView = 'hub' | 'list' | 'mental-health' | 'detail' | 'appointment-hub' | 'mom-kid-care';
type CategoryFilter = 'all' | 'injury' | 'medical' | 'natural-disaster' | 'environmental';

const FirstAid: React.FC = () => {
  const [view, setView] = useState<MedicalView>('hub');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedItem, setSelectedItem] = useState<FirstAidStep | null>(null);
  const [search, setSearch] = useState('');
  
  // Appointment states
  const [aptBooked, setAptBooked] = useState(false);
  const [momKidBooked, setMomKidBooked] = useState(false);
  const [aptType, setAptType] = useState<string>('');
  const [momKidType, setMomKidType] = useState<string>('');

  const filteredItems = FIRST_AID_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                             (activeCategory === 'injury' && (item.category === 'injury' || item.category === 'medical')) ||
                             (activeCategory === 'natural-disaster' && item.category === 'natural-disaster');
    return matchesSearch && matchesCategory;
  });

  const handleItemSelect = (item: FirstAidStep) => {
    setSelectedItem(item);
    setView('detail');
  };

  const openCategory = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setView('list');
  };

  const getAilmentIcon = (id: string) => {
    switch(id) {
      case 'burns': return <Flame className="w-8 h-8" />;
      case 'heart-attack': return <Heart className="w-8 h-8" />;
      case 'cuts-scrapes': return <Scissors className="w-8 h-8" />;
      case 'choking': return <Ghost className="w-8 h-8" />;
      case 'snake-bite': return <Bug className="w-8 h-8" />;
      case 'cyclone': return <Waves className="w-8 h-8" />;
      case 'earthquake': return <Activity className="w-8 h-8" />;
      case 'landslide': return <Mountain className="w-8 h-8" />;
      case 'flash-flood': return <Waves className="w-8 h-8" />;
      case 'fire-safety': return <Flame className="w-8 h-8" />;
      default: return <BriefcaseMedical className="w-8 h-8" />;
    }
  };

  if (view === 'hub') {
    return (
      <div className="h-full bg-slate-50 overflow-y-auto animate-in fade-in duration-500 pb-24">
        <div className="bg-indigo-950 p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter text-white">চিকিৎসা কেন্দ্র</h2>
            <p className="text-xs text-indigo-300 font-black uppercase tracking-widest mt-2 flex items-center">
              <Stethoscope className="w-3 h-3 mr-2" /> Central Healthcare Hub
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6 -mt-8 relative z-20">
          <div className="grid grid-cols-1 gap-4">
            <HubCard 
              title="৪৮ ঘণ্টা সার্ভিস" 
              sub="জরুরি ডাক্তার অ্যাপয়েন্টমেন্ট" 
              icon={<Calendar className="w-8 h-8" />} 
              color="bg-indigo-600" 
              onClick={() => setView('appointment-hub')} 
            />
            <HubCard 
              title="মা ও শিশু বিশেষ যত্ন" 
              sub="মাতৃ ও শিশু স্বাস্থ্য সেবা" 
              icon={<Baby className="w-8 h-8" />} 
              color="bg-pink-600" 
              onClick={() => setView('mom-kid-care')} 
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">বিশেষায়িত মডিউল</h4>
            <div className="grid grid-cols-1 gap-4">
              <ModuleCard 
                title="ফার্স্ট এইড গাইড" 
                desc="আঘাত ও জরুরি প্রাথমিক চিকিৎসা ধাপসমূহ" 
                icon={<BriefcaseMedical className="w-10 h-10" />} 
                color="bg-red-500" 
                onClick={() => openCategory('injury')} 
              />
              <ModuleCard 
                title="দুর্যোগ ব্যবস্থাপনা" 
                desc="প্রাকৃতিক বিপদে জীবন রক্ষার পূর্ণাঙ্গ গাইড" 
                icon={<ShieldAlert className="w-10 h-10" />} 
                color="bg-slate-800" 
                onClick={() => openCategory('natural-disaster')} 
              />
              <ModuleCard 
                title="মানসিক প্রশান্তি" 
                desc="মানসিক চাপ ও আতঙ্ক কমানোর টুলস" 
                icon={<HeartHandshake className="w-10 h-10" />} 
                color="bg-teal-600" 
                onClick={() => setView('mental-health')} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'list') {
    const title = activeCategory === 'natural-disaster' ? 'দুর্যোগ ব্যবস্থাপনা' : 'ফার্স্ট এইড গাইড';
    const bgColor = activeCategory === 'natural-disaster' ? 'bg-slate-800' : 'bg-red-600';

    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto pb-24">
        <div className={`${bgColor} p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-30`}>
          <button onClick={() => setView('hub')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black italic tracking-tight">{title}</h2>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="পদ্ধতি খুঁজুন..." 
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className="w-full bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-between hover:bg-slate-50 transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center space-x-5">
                  <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${activeCategory === 'natural-disaster' ? 'bg-slate-100 text-slate-700' : 'bg-red-50 text-red-600'}`}>
                    {getAilmentIcon(item.id)}
                  </div>
                  <div className="text-left">
                    <h5 className="font-black text-slate-800 tracking-tight text-lg leading-tight">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{item.steps.length} টি জীবনরক্ষাকারী পদক্ষেপ</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selectedItem) {
    const isDisaster = selectedItem.category === 'natural-disaster';
    const headerColor = isDisaster ? 'bg-slate-800' : 'bg-red-600';
    const accentColor = isDisaster ? 'text-slate-800' : 'text-red-600';
    const accentBg = isDisaster ? 'bg-slate-800' : 'bg-red-600';

    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-24">
        <div className={`${headerColor} p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-30`}>
          <button onClick={() => setView('list')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black italic tracking-tight">{selectedItem.title}</h2>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 mb-6">
            <div className="p-10">
              <div className="mb-8 flex items-center space-x-3">
                 <div className={`p-3 rounded-xl ${isDisaster ? 'bg-slate-100 text-slate-800' : 'bg-red-50 text-red-600'}`}>
                   {getAilmentIcon(selectedItem.id)}
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{selectedItem.title}</h3>
              </div>
              
              <p className="text-slate-500 font-bold text-base mb-10 leading-relaxed italic border-l-4 border-indigo-200 pl-4">{selectedItem.description}</p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">তাৎক্ষণিক পদক্ষেপ (Action Plan)</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {selectedItem.steps.map((step, i) => (
                    <div key={i} className={`rounded-3xl p-6 border flex items-start space-x-6 transition-all ${step.type === 'warning' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100 hover:shadow-md'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg text-lg ${step.type === 'warning' ? 'bg-red-600 text-white' : 'bg-white text-slate-800 border border-slate-100'}`}>
                        {i + 1}
                      </div>
                      <div className="pt-1">
                         <div className="flex items-center space-x-2 mb-1">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${step.type === 'warning' ? 'text-red-600' : accentColor}`}>পদক্ষেপ {i + 1}</span>
                           {step.type === 'warning' && <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">গুরুত্বপূর্ণ</span>}
                         </div>
                         <p className={`font-black text-base leading-tight ${step.type === 'warning' ? 'text-red-900' : 'text-slate-800'}`}>{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedItem.warningSigns && (
                <div className="mt-12 bg-red-100/50 rounded-[2.5rem] p-8 border border-red-200 shadow-inner relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-400/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-black text-red-700 tracking-tight">সতর্ক সংকেত (Warning Signs)</h4>
                    </div>
                    <ul className="space-y-4">
                      {selectedItem.warningSigns.map((sign, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-red-900 font-bold leading-relaxed">
                          <Check className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-red-200/30">
                       <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center">জরুরি প্রয়োজনে দেরি না করে SOS বাটন প্রেস করুন</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex items-center space-x-6">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <div>
                  <h5 className="text-xl font-black italic tracking-tighter">বিশেষজ্ঞের পরামর্শ?</h5>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mt-1 italic">৪৮ ঘণ্টা সার্ভিস টিম আপনার পাশে</p>
                </div>
             </div>
             <button 
              onClick={() => setView('appointment-hub')}
              className="bg-white text-indigo-950 p-4 rounded-2xl shadow-lg active:scale-90 transition-all relative z-10"
             >
                <ChevronRight className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Appointment hubs and Mental Health
  if (view === 'appointment-hub') {
    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-24">
        <div className="bg-indigo-900 p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-30">
          <button onClick={() => setView('hub')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black italic tracking-tight">৪৮ ঘণ্টা সার্ভিস</h2>
        </div>
        <div className="p-6">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-50">
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">জরুরি অ্যাপয়েন্টমেন্ট</h3>
              {aptBooked ? (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center space-y-3">
                   <Check className="w-12 h-12 text-green-600 mx-auto" />
                   <h4 className="font-black text-green-800 uppercase tracking-widest">অনুরোধ সফল হয়েছে!</h4>
                   <p className="text-xs text-green-600 font-bold">আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">পাহাড়ি ও দুর্যোগপ্রবণ এলাকায় জরুরি চিকিৎসা নিশ্চিত করতে আমাদের বিশেষায়িত টিম ৪৮ ঘণ্টার মধ্যে সরাসরি পরামর্শ প্রদান করবে।</p>
                  <div className="space-y-3">
                    {['তীব্র জ্বর বা ব্যথা', 'আঘাতজনিত সমস্যা', 'গর্ভকালীন জটিলতা', 'শিশুর জরুরি সমস্যা'].map(opt => (
                      <button key={opt} onClick={() => setAptType(opt)} className={`w-full p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${aptType === opt ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-indigo-200'}`}>
                        <span className="font-black text-slate-700">{opt}</span>
                        {aptType === opt && <Check className="w-5 h-5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setAptBooked(true)} disabled={!aptType} className="w-full bg-indigo-900 text-white font-black py-6 rounded-3xl shadow-xl active:scale-95 transition-all disabled:opacity-50 text-lg border-b-4 border-black">অ্যাপয়েন্টমেন্ট নিশ্চিত করুন</button>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  if (view === 'mom-kid-care') {
    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-24">
        <div className="bg-pink-600 p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-30">
          <button onClick={() => setView('hub')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black italic tracking-tight">মা ও শিশু বিশেষ যত্ন</h2>
        </div>
        <div className="p-6">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-pink-50">
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">মাতৃ ও শিশু সাপোর্ট</h3>
              {momKidBooked ? (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center space-y-3">
                   <Check className="w-12 h-12 text-green-600 mx-auto" />
                   <h4 className="font-black text-green-800 uppercase tracking-widest">বুকিং সম্পন্ন হয়েছে!</h4>
                   <p className="text-xs text-green-600 font-bold">একজন বিশেষায়িত ডাক্তার শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic">গর্ভবতী মা ও শিশুদের জন্য আমাদের বিশেষায়িত প্যানেল থেকে দ্রুত এবং সুরক্ষিত সহায়তা নিন।</p>
                  <div className="space-y-3">
                    {['গর্ভবতী মায়ের যত্ন', 'নবজাতক (০-২ বছর)', 'শিশু (২-১০ বছর)'].map(opt => (
                      <button key={opt} onClick={() => setMomKidType(opt)} className={`w-full p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${momKidType === opt ? 'border-pink-600 bg-pink-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-pink-200'}`}>
                        <span className="font-black text-slate-700">{opt}</span>
                        {momKidType === opt && <Check className="w-5 h-5 text-pink-600" />}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setMomKidBooked(true)} disabled={!momKidType} className="w-full bg-pink-600 text-white font-black py-6 rounded-3xl shadow-xl active:scale-95 transition-all disabled:opacity-50 text-lg border-b-4 border-pink-800">বিশেষজ্ঞ সহায়তা নিন</button>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  if (view === 'mental-health') {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-teal-600 p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-30">
          <button onClick={() => setView('hub')} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black italic tracking-tight">মানসিক প্রশান্তি</h2>
        </div>
        <MentalHealth />
      </div>
    );
  }

  return null;
};

// UI Components
const HubCard = ({ title, sub, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[2.5rem] p-7 shadow-xl border border-slate-100 flex items-center space-x-6 transition-all active:scale-[0.97] group relative overflow-hidden"
  >
    <div className={`${color} p-5 rounded-2xl shadow-lg text-white group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="text-left flex-1">
      <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 leading-none">{title}</h3>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{sub}</p>
    </div>
    <ChevronRight className="w-6 h-6 text-slate-200" />
  </button>
);

const ModuleCard = ({ title, desc, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full bg-white p-7 rounded-[2.5rem] shadow-lg border border-slate-100 flex items-center space-x-7 hover:bg-slate-50 active:scale-[0.98] transition-all text-left group"
  >
    <div className={`${color} p-5 rounded-2xl text-white shadow-xl group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-2xl font-black italic tracking-tighter text-slate-900 leading-none">{title}</h4>
      <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1.5 italic">{desc}</p>
    </div>
    <ChevronRight className="w-6 h-6 text-slate-200" />
  </button>
);

export default FirstAid;
