
import React, { useState } from 'react';
import { Activity, Search, ChevronRight, Heart, Wind, ShieldAlert } from 'lucide-react';
import { FIRST_AID_DATA } from '../constants';
import { FirstAidStep } from '../types';

const FirstAid: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FirstAidStep | null>(null);

  const filtered = FIRST_AID_DATA.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="bg-red-600 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-black mb-2">প্রাথমিক চিকিৎসা</h2>
        <p className="text-xs opacity-90">বিপদের সময় দ্রুত কার্যকর পদক্ষেপ নিন</p>
        
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="খুঁজুন..." 
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {selected ? (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 animate-in slide-in-from-right duration-300">
            <button onClick={() => setSelected(null)} className="text-red-600 text-sm font-bold mb-4 flex items-center">
              ← ফিরে যান
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{selected.title}</h3>
            <p className="text-slate-500 mb-6">{selected.description}</p>
            
            <div className="space-y-4">
              {selected.steps.map((step, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">সতর্কতা: এটি শুধুমাত্র সাময়িক ব্যবস্থা। দ্রুত নিকটস্থ হাসপাতালে যোগাযোগ করুন।</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <CategoryBtn icon={<Heart className="w-5 h-5" />} label="আঘাত" active />
              <CategoryBtn icon={<Wind className="w-5 h-5" />} label="প্রাকৃতিক" />
              <CategoryBtn icon={<Activity className="w-5 h-5" />} label="মেডিকেল" />
            </div>
            
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">শীর্ষ নির্দেশিকা</h4>
            {filtered.map(item => (
              <button 
                key={item.id}
                onClick={() => setSelected(item)}
                className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-red-200 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Activity className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{item.title}</h5>
                    <p className="text-[10px] text-slate-400">{item.steps.length} টি ধাপ</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const CategoryBtn = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${active ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
    {icon}
    <span className="text-[10px] mt-1 font-bold">{label}</span>
  </button>
);

export default FirstAid;
