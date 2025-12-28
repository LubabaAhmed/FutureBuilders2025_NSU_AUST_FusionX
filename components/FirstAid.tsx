
import React, { useState } from 'react';
import { Activity, Search, ChevronRight, Heart, Wind, ShieldAlert, HeartHandshake, ArrowLeft, Thermometer, BriefcaseMedical, Baby, HeartPulse, Stethoscope } from 'lucide-react';
import { FIRST_AID_DATA } from '../constants';
import { FirstAidStep } from '../types';
import MentalHealth from './MentalHealth';

const FirstAid: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FirstAidStep | null>(null);
  const [showMentalHealth, setShowMentalHealth] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'injury' | 'natural-disaster' | 'medical'>('all');

  const filtered = FIRST_AID_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getIcon = (title: string) => {
    if (title.includes('গর্ভবতী')) return <Baby className="w-6 h-6" />;
    if (title.includes('হার্ট')) return <HeartPulse className="w-6 h-6" />;
    if (title.includes('রক্তক্ষরণ')) return <Activity className="w-6 h-6" />;
    if (title.includes('রোগীর সেবা')) return <Stethoscope className="w-6 h-6" />;
    return <BriefcaseMedical className="w-6 h-6" />;
  };

  if (showMentalHealth) {
    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setShowMentalHealth(false)}
          className="bg-teal-600 text-white p-4 flex items-center font-bold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> ফিরে যান
        </button>
        <MentalHealth />
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-red-600 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex items-center space-x-3 mb-1">
          <BriefcaseMedical className="w-8 h-8" />
          <h2 className="text-3xl font-black italic">ফার্স্ট এইড</h2>
        </div>
        <p className="text-[10px] opacity-90 font-bold uppercase tracking-widest">জরুরি চিকিৎসা সহায়িকা ও প্রটোকল</p>
        
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input 
            type="text" 
            placeholder="কি হয়েছে? (উদা: গর্ভবতী মা, হার্ট অ্যাটাক...)" 
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:outline-none transition-all shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-6 animate-in slide-in-from-bottom duration-300">
            <button 
              onClick={() => setSelected(null)} 
              className="text-red-600 text-sm font-black mb-6 flex items-center bg-red-50 px-4 py-2 rounded-xl w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> তালিকা দেখুন
            </button>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                   {getIcon(selected.title)}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selected.title}</h3>
              </div>
              <p className="text-slate-500 mb-8 font-medium leading-relaxed">{selected.description}</p>
              
              <div className="space-y-6">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex space-x-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 font-bold text-sm leading-relaxed pt-2">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start space-x-4">
                <ShieldAlert className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <p className="text-[11px] text-indigo-900 font-bold leading-relaxed">
                  গুরুত্বপূর্ণ: অ্যাম্বুলেন্স আসার আগ পর্যন্ত রোগীকে শান্ত রাখুন। কোনো অবস্থাতেই ভয় দেখাবেন না। আপনার চিকিৎসা ইতিহাস (প্রোফাইল) উদ্ধারকারীদের দেখান।
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-8 pb-32">
            {/* Category Dashboard */}
            <div className="grid grid-cols-2 gap-4">
              <CategoryCard 
                icon={<HeartHandshake className="w-8 h-8" />} 
                label="মানসিক প্রশান্তি" 
                color="bg-teal-600" 
                onClick={() => setShowMentalHealth(true)}
              />
              <CategoryCard 
                icon={<Baby className="w-8 h-8" />} 
                label="মাতৃ স্বাস্থ্য" 
                color="bg-rose-600" 
                onClick={() => {
                   const item = FIRST_AID_DATA.find(f => f.title.includes('গর্ভবতী'));
                   if(item) setSelected(item);
                }}
              />
              <CategoryCard 
                icon={<HeartPulse className="w-8 h-8" />} 
                label="হৃদরোগ সাপোর্ট" 
                color="bg-red-600" 
                onClick={() => {
                   const item = FIRST_AID_DATA.find(f => f.title.includes('হার্ট'));
                   if(item) setSelected(item);
                }}
              />
              <CategoryCard 
                icon={<BriefcaseMedical className="w-8 h-8" />} 
                label="জরুরি প্রটোকল" 
                color="bg-indigo-600" 
                onClick={() => setActiveTab('medical')}
              />
            </div>

            {/* Filter Chips */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <Chip active={activeTab === 'all'} onClick={() => setActiveTab('all')}>সবগুলো</Chip>
              <Chip active={activeTab === 'injury'} onClick={() => setActiveTab('injury')}>আঘাত</Chip>
              <Chip active={activeTab === 'medical'} onClick={() => setActiveTab('medical')}>মেডিকেল</Chip>
              <Chip active={activeTab === 'natural-disaster'} onClick={() => setActiveTab('natural-disaster')}>দুর্যোগ</Chip>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">শীর্ষ নির্দেশিকা ({filtered.length})</h4>
              {filtered.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="w-full bg-white p-5 rounded-[1.75rem] border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all text-left active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${
                      item.category === 'injury' ? 'bg-orange-50 text-orange-600' : 
                      item.category === 'medical' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {getIcon(item.title)}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 tracking-tight">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.steps.length} টি ধাপ</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                  <Activity className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 font-bold">কোনো ফলাফল পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryCard = ({ icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`${color} p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center justify-center space-y-3 text-white active:scale-95 transition-all w-full text-center group`}
  >
    <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-sm font-black tracking-tight leading-tight">{label}</span>
  </button>
);

const Chip = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${
      active 
      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
      : 'bg-white text-slate-400 border-slate-100'
    }`}
  >
    {children}
  </button>
);

export default FirstAid;
