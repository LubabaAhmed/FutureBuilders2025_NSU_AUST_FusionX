
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
  Info
} from 'lucide-react';
import { FIRST_AID_DATA } from '../constants';
import { FirstAidStep } from '../types';
import MentalHealth from './MentalHealth';

type MedicalView = 'hub' | 'first-aid-list' | 'disaster-list' | 'mental-health' | 'detail';

const FirstAid: React.FC = () => {
  const [view, setView] = useState<MedicalView>('hub');
  const [selectedItem, setSelectedItem] = useState<FirstAidStep | null>(null);
  const [search, setSearch] = useState('');

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
      <div className="h-full bg-slate-50 overflow-y-auto animate-in fade-in duration-500">
        <div className="bg-indigo-950 p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/20 rounded-full blur-3xl"></div>
          <h2 className="text-3xl font-black italic tracking-tighter">চিকিৎসা কেন্দ্র</h2>
          <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mt-1">Medical Hub & Safety</p>
        </div>

        <div className="p-6 space-y-6 -mt-6">
          <HubCard 
            title="প্রাথমিক চিকিৎসা" 
            sub="কাটা-ছেঁড়া, পুড়া ও জরুরি সাপোর্ট" 
            icon={<BriefcaseMedical className="w-10 h-10" />} 
            color="bg-red-600 shadow-red-200" 
            onClick={() => setView('first-aid-list')} 
          />
          <HubCard 
            title="দুর্যোগ ব্যবস্থাপনা" 
            sub="ঘূর্ণিঝড়, ভূমিকম্প ও ভূমিধস সুরক্ষা" 
            icon={<Mountain className="w-10 h-10" />} 
            color="bg-indigo-600 shadow-indigo-200" 
            onClick={() => setView('disaster-list')} 
          />
          <HubCard 
            title="মানসিক প্রশান্তি" 
            sub="স্ট্রেস কমানো ও কাউন্সেলিং" 
            icon={<HeartHandshake className="w-10 h-10" />} 
            color="bg-teal-600 shadow-teal-200" 
            onClick={() => setView('mental-health')} 
          />
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-start space-x-4 shadow-sm">
            <Info className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
              "জরুরি মুহূর্তে শান্ত থাকা জীবন বাঁচাতে পারে। উপরে যেকোনো একটি অপশন বেছে নিয়ে নির্দেশিকা অনুসরণ করুন।"
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'mental-health') {
    return (
      <div className="h-full flex flex-col">
        <SubHeader title="মানসিক প্রশান্তি" onBack={() => setView('hub')} color="bg-teal-600" />
        <MentalHealth />
      </div>
    );
  }

  if (view === 'detail' && selectedItem) {
    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300">
        <SubHeader title={selectedItem.title} onBack={() => setView(selectedItem.category === 'natural-disaster' ? 'disaster-list' : 'first-aid-list')} color={selectedItem.category === 'natural-disaster' ? 'bg-indigo-600' : 'bg-red-600'} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
            <p className="text-slate-500 font-bold mb-8 leading-relaxed text-lg">{selectedItem.description}</p>
            <div className="space-y-6">
              {selectedItem.steps.map((step, i) => (
                <div key={i} className="flex space-x-5 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${selectedItem.category === 'natural-disaster' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'}`}>
                    {i + 1}
                  </div>
                  <p className="text-slate-800 font-black text-sm leading-relaxed pt-2">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 p-5 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start space-x-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <p className="text-[11px] font-black text-amber-900 leading-relaxed uppercase">
                সতর্কতা: এটি শুধুমাত্র একটি প্রাথমিক নির্দেশিকা। জীবন বিপন্ন হলে দ্রুত অ্যাম্বুলেন্স (৯৯৯) কল করুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      <SubHeader 
        title={view === 'first-aid-list' ? "প্রাথমিক চিকিৎসা" : "দুর্যোগ ব্যবস্থাপনা"} 
        onBack={() => setView('hub')} 
        color={view === 'first-aid-list' ? 'bg-red-600' : 'bg-indigo-600'} 
      />
      
      <div className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="খুঁজুন..." 
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
                <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${view === 'first-aid-list' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {getIcon(item.id)}
                </div>
                <div className="text-left">
                  <h5 className="font-black text-slate-800 tracking-tight">{item.title}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{item.steps.length} টি কার্যকর ধাপ</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-sm text-slate-400 font-bold">কোনো ফলাফল পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HubCard = ({ title, sub, icon, color, onClick }: { title: string, sub: string, icon: any, color: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`${color} w-full p-8 rounded-[3rem] shadow-xl flex items-center justify-between text-white active:scale-95 transition-all group overflow-hidden relative`}
  >
    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
      {icon}
    </div>
    <div className="flex items-center space-x-6 relative z-10">
      <div className="bg-white/20 p-4 rounded-[1.5rem] backdrop-blur-md">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="text-2xl font-black italic tracking-tighter">{title}</h3>
        <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <div className="bg-white/20 p-2 rounded-full relative z-10">
      <ChevronRight className="w-5 h-5" />
    </div>
  </button>
);

const SubHeader = ({ title, onBack, color }: { title: string, onBack: () => void, color: string }) => (
  <div className={`${color} p-6 flex items-center space-x-4 text-white shadow-lg sticky top-0 z-10`}>
    <button onClick={onBack} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
      <ArrowLeft className="w-6 h-6" />
    </button>
    <h2 className="text-xl font-black italic tracking-tight">{title}</h2>
  </div>
);

export default FirstAid;
