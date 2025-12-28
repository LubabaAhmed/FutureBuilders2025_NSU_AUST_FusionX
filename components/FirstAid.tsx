
import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  ChevronRight, 
  Heart, 
  ShieldAlert, 
  HeartHandshake, 
  ArrowLeft, 
  BriefcaseMedical, 
  Mountain, 
  Flame, 
  Ghost, 
  Scissors, 
  Zap,
  Info,
  Calendar,
  Siren,
  Baby,
  Users,
  Clock,
  Thermometer,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { FIRST_AID_DATA } from '../constants';
import { FirstAidStep } from '../types';
import MentalHealth from './MentalHealth';

type MedicalView = 'hub' | 'first-aid-list' | 'disaster-list' | 'mental-health' | 'detail' | 'appointment-hub' | 'mom-kid-care';

const FirstAid: React.FC = () => {
  const [view, setView] = useState<MedicalView>('hub');
  const [selectedItem, setSelectedItem] = useState<FirstAidStep | null>(null);
  const [search, setSearch] = useState('');
  const [aptBooked, setAptBooked] = useState(false);
  const [momKidBooked, setMomKidBooked] = useState(false);

  const firstAidItems = FIRST_AID_DATA.filter(item => item.category !== 'natural-disaster');
  const disasterItems = FIRST_AID_DATA.filter(item => item.category === 'natural-disaster');

  const filteredItems = (view === 'first-aid-list' ? firstAidItems : disasterItems).filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleItemSelect = (item: FirstAidStep) => {
    setSelectedItem(item);
    setView('detail');
  };

  const getIcon = (id: string) => {
    switch(id) {
      case 'burns': return <Flame className="w-6 h-6" />;
      case 'choking': return <Ghost className="w-6 h-6" />;
      case 'cuts': return <Scissors className="w-6 h-6" />;
      case 'fainting': return <Zap className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  if (view === 'hub') {
    return (
      <div className="h-full bg-slate-50 overflow-y-auto animate-in fade-in duration-500 pb-24">
        {/* Hub Header */}
        <div className="bg-indigo-950 p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter text-white">চিকিৎসা কেন্দ্র</h2>
            <p className="text-xs text-indigo-300 font-black uppercase tracking-widest mt-2 flex items-center">
              <Stethoscope className="w-3 h-3 mr-2" /> Medical Intelligence Hub
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6 -mt-8 relative z-20">
          {/* Actionable Service Cards */}
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setView('appointment-hub')}
              className="w-full bg-white rounded-[2.5rem] p-6 shadow-xl border border-indigo-100 flex items-center space-x-5 transition-all active:scale-[0.97] group relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12">
                 <Calendar className="w-24 h-24" />
              </div>
              <div className="bg-indigo-700 p-5 rounded-[1.5rem] shadow-lg text-white group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-black italic tracking-tighter text-indigo-950">৪৮ ঘণ্টা সার্ভিস</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Urgent Medical Appointment</p>
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <Siren className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase">২৪-৪৮ ঘণ্টা রেসপন্স</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </button>

            <button 
              onClick={() => setView('mom-kid-care')}
              className="w-full bg-white rounded-[2.5rem] p-6 shadow-xl border border-pink-100 flex items-center space-x-5 transition-all active:scale-[0.97] group relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 text-pink-600">
                 <Baby className="w-24 h-24" />
              </div>
              <div className="bg-pink-600 p-5 rounded-[1.5rem] shadow-lg text-white group-hover:scale-110 transition-transform">
                <Baby className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-black italic tracking-tighter text-pink-950">মা ও শিশু বিশেষ যত্ন</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mom & Kid Priority Care</p>
                <div className="mt-2 flex items-center space-x-2 text-pink-600">
                  <Heart className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase">উচ্চ অগ্রাধিকার সার্ভিস</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">অন্যান্য সেবাসমূহ</h4>
            <div className="grid grid-cols-1 gap-4">
              <HubActionCard 
                title="প্রাথমিক চিকিৎসা" 
                desc="জরুরি কাটা-ছেঁড়া, অজ্ঞান হওয়া বা পুড়া সমস্যার নির্দেশিকা"
                icon={<BriefcaseMedical className="w-10 h-10" />}
                color="bg-red-600"
                onClick={() => setView('first-aid-list')}
              />
              <HubActionCard 
                title="দুর্যোগ ব্যবস্থাপনা" 
                desc="ঘূর্ণিঝড়, ভূমিকম্প ও ভূমিধস সুরক্ষার নির্দেশিকা"
                icon={<Mountain className="w-10 h-10" />}
                color="bg-slate-800"
                onClick={() => setView('disaster-list')}
              />
              <HubActionCard 
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

  if (view === 'appointment-hub') {
    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-24">
        <SubHeader title="৪৮ ঘণ্টা অ্যাপয়েন্টমেন্ট" onBack={() => setView('hub')} color="bg-indigo-900" />
        <div className="p-6 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-indigo-50 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <PhoneCall className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">জরুরি স্বাস্থ্য পরামর্শ</h3>
            <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed px-4 text-center">
              আমরা দুর্যোগপূর্ণ এলাকায় ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ভিডিও কলের মাধ্যমে বিশেষজ্ঞ ডাক্তারের পরামর্শ নিশ্চিত করি।
            </p>
            {aptBooked ? (
              <SuccessState token={`#MED-${Math.floor(1000 + Math.random() * 9000)}`} />
            ) : (
              <button 
                onClick={() => setAptBooked(true)}
                className="w-full bg-indigo-900 text-white font-black py-6 rounded-[2rem] shadow-xl active:scale-95 transition-all border-b-4 border-indigo-950"
              >
                এখনই বুক করুন
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'mom-kid-care') {
    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto pb-24">
        <SubHeader title="মা ও শিশু বিশেষ যত্ন" onBack={() => setView('hub')} color="bg-pink-600" />
        <div className="p-6 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-pink-50 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Baby className="w-10 h-10 text-pink-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">মাতৃ ও শিশু বিশেষ কেয়ার</h3>
            <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed px-4 text-center">
              গর্ভবতী মা এবং শিশুদের জন্য আমাদের রয়েছে বিশেষ হাই-প্রায়োরিটি সাপোর্ট। যেকোনো জটিলতায় আমাদের বিশেষজ্ঞ দল আপনার পাশে আছে।
            </p>
            {momKidBooked ? (
              <SuccessState token={`#MK-${Math.floor(1000 + Math.random() * 9000)}`} color="green" />
            ) : (
              <button 
                onClick={() => setMomKidBooked(true)}
                className="w-full bg-pink-600 text-white font-black py-6 rounded-[2rem] shadow-xl active:scale-95 transition-all border-b-4 border-pink-800"
              >
                বিশেষ সার্ভিস বুক করুন
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
             <TriageDisplayItem 
                icon={<Baby className="w-6 h-6 text-pink-600" />}
                title="গর্ভবতী নারী"
                level="সর্বোচ্চ অগ্রাধিকার"
                color="border-pink-100 bg-pink-50/50"
                textColor="text-pink-700"
                desc="জরুরি প্রসবকালীন সাপোর্ট এবং পুষ্টির বিশেষ ব্যবস্থা।"
              />
              <TriageDisplayItem 
                icon={<Users className="w-6 h-6 text-indigo-600" />}
                title="শিশু (০-১২ বছর)"
                level="বিশেষ অগ্রাধিকার"
                color="border-indigo-100 bg-indigo-50/50"
                textColor="text-indigo-700"
                desc="শিশুদের টিকাদান এবং দুর্যোগকালীন অসুস্থতার দ্রুত সমাধান।"
              />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'mental-health') {
    return (
      <div className="h-full flex flex-col animate-in fade-in">
        <SubHeader title="মানসিক প্রশান্তি" onBack={() => setView('hub')} color="bg-teal-600" />
        <MentalHealth />
      </div>
    );
  }

  if (view === 'detail' && selectedItem) {
    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300">
        <SubHeader title={selectedItem.title} onBack={() => setView(selectedItem.category === 'natural-disaster' ? 'disaster-list' : 'first-aid-list')} color={selectedItem.category === 'natural-disaster' ? 'bg-slate-800' : 'bg-red-600'} />
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
            <p className="text-slate-500 font-bold mb-8 leading-relaxed text-lg">{selectedItem.description}</p>
            <div className="space-y-6">
              {selectedItem.steps.map((step, i) => (
                <div key={i} className="flex space-x-5 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-md transition-transform group-hover:scale-110 ${selectedItem.category === 'natural-disaster' ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'}`}>
                    {i + 1}
                  </div>
                  <p className="text-slate-800 font-black text-sm leading-relaxed pt-2">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
      <SubHeader 
        title={view === 'first-aid-list' ? "প্রাথমিক চিকিৎসা" : "দুর্যোগ ব্যবস্থাপনা"} 
        onBack={() => setView('hub')} 
        color={view === 'first-aid-list' ? 'bg-red-600' : 'bg-slate-800'} 
      />
      
      <div className="p-6 pb-24">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="নির্দেশিকা খুঁজুন..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleItemSelect(item)}
              className="w-full bg-white p-5 rounded-[1.75rem] border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${view === 'first-aid-list' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                  {getIcon(item.id)}
                </div>
                <div className="text-left">
                  <h5 className="font-black text-slate-800 tracking-tight">{item.title}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{item.steps.length} টি ধাপ</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SuccessState = ({ token, color = "green" }: { token: string, color?: string }) => (
  <div className={`bg-${color}-50 p-8 rounded-[2rem] border-2 border-${color}-200 animate-in zoom-in duration-300`}>
     <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
       <Clock className={`w-6 h-6 text-${color}-600`} />
     </div>
     <h4 className={`text-${color}-800 font-black text-lg mb-1`}>অনুরোধ সফল হয়েছে!</h4>
     <p className={`text-xs text-${color}-600 font-bold uppercase tracking-widest mb-4`}>টোকেন: {token}</p>
     <p className={`text-[10px] text-${color}-500 font-medium leading-tight`}>আমাদের মেডিকেল টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে। অনুগ্রহ করে ফোন চালু রাখুন।</p>
  </div>
);

const HubActionCard = ({ title, desc, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex items-center space-x-6 hover:bg-slate-50 active:scale-[0.98] transition-all text-left group"
  >
    <div className={`${color} p-5 rounded-[1.5rem] text-white shadow-xl group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-xl font-black italic tracking-tighter text-slate-900">{title}</h4>
      <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1">{desc}</p>
    </div>
    <ChevronRight className="w-6 h-6 text-slate-200" />
  </button>
);

const TriageDisplayItem = ({ icon, title, level, color, textColor, desc }: any) => (
  <div className={`${color} p-6 rounded-[2rem] border-2 shadow-sm flex items-start space-x-5`}>
    <div className="bg-white p-3 rounded-2xl shadow-sm flex-shrink-0">
      {icon}
    </div>
    <div>
      <h5 className="text-base font-black text-slate-800 leading-none mb-1">{title}</h5>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${textColor}`}>{level}</p>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SubHeader = ({ title, onBack, color }: { title: string, onBack: () => void, color: string }) => (
  <div className={`${color} p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-10`}>
    <button onClick={onBack} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
      <ArrowLeft className="w-6 h-6" />
    </button>
    <h2 className="text-xl font-black italic tracking-tight text-white">{title}</h2>
  </div>
);

export default FirstAid;
