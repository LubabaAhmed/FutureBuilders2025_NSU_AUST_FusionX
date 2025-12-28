
import React, { useState, useEffect } from 'react';
import { User, SOSAlert, TriageLevel } from '../types';
import { AlertCircle, X, Send, Loader2, Signal, MapPin, Phone, Users, CheckCircle2, ShieldAlert, Baby, Siren, Activity, Bug } from 'lucide-react';
import { getAIPrioritization } from '../services/geminiService';
import { STRINGS, PUBLIC_EMERGENCY_CONTACTS } from '../constants';

interface SOSButtonProps {
  user: User;
  onSOS: (alert: SOSAlert) => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ user, onSOS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'writing' | 'sending' | 'tracking'>('idle');
  const [details, setDetails] = useState('');
  const [signal, setSignal] = useState(85);
  const [eta, setEta] = useState(12);
  const [medicalType, setMedicalType] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setSignal(Math.floor(60 + Math.random() * 40));
        if (status === 'tracking') setEta(e => Math.max(1, e - 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, status]);

  const triggerSOS = async () => {
    setStatus('sending');
    const lat = 22.6485 + (Math.random() - 0.5) * 0.01;
    const lng = 92.1747 + (Math.random() - 0.5) * 0.01;
    
    const combinedDetails = medicalType ? `[${medicalType}] ${details}` : details;
    const aiResult = await getAIPrioritization(combinedDetails || "সহযোগিতা প্রয়োজন");

    const newAlert: SOSAlert = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      location: { lat, lng },
      timestamp: Date.now(),
      priority: aiResult.priority,
      details: combinedDetails || "জরুরি সহযোগিতা প্রয়োজন",
      aiAssessment: aiResult.reasoning,
      signalStrength: signal,
      triageCategory: medicalType
    };

    onSOS(newAlert);
    
    setTimeout(() => {
      setStatus('tracking');
    }, 2000);
  };

  const closeSOS = () => {
    setIsOpen(false);
    setStatus('idle');
    setDetails('');
    setMedicalType('');
    setEta(12);
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setStatus('writing'); }}
        className="fixed bottom-28 right-6 w-24 h-24 bg-red-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)] border-8 border-white z-[2000] active:scale-90 transition-transform animate-pulse"
      >
        <span className="text-white font-black text-2xl italic tracking-tighter">SOS</span>
        <span className="text-white/80 font-bold text-[8px] uppercase">প্রেস করুন</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-indigo-950/95 backdrop-blur-lg z-[3000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-red-600 p-8 flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-white animate-bounce" />
                <h3 className="text-3xl font-black text-white italic">SOS</h3>
              </div>
              <button onClick={closeSOS} className="bg-white/20 text-white p-2 rounded-2xl hover:bg-white/40 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {status === 'writing' && (
                <>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ধরণ নির্বাচন করুন</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <TriageChip 
                        active={medicalType === 'Epidemic/Outbreak'} 
                        label="মহামারী / প্রাদুর্ভাব" 
                        icon={<Bug className="w-4 h-4" />}
                        onClick={() => setMedicalType(medicalType === 'Epidemic/Outbreak' ? '' : 'Epidemic/Outbreak')}
                      />
                      <TriageChip 
                        active={medicalType === 'Pregnant'} 
                        label="গর্ভবতী" 
                        icon={<Baby className="w-4 h-4" />}
                        onClick={() => setMedicalType(medicalType === 'Pregnant' ? '' : 'Pregnant')}
                      />
                      <TriageChip 
                        active={medicalType === 'Child'} 
                        label="শিশু" 
                        icon={<Users className="w-4 h-4" />}
                        onClick={() => setMedicalType(medicalType === 'Child' ? '' : 'Child')}
                      />
                      <TriageChip 
                        active={medicalType === 'Head Injury'} 
                        label="মাথায় আঘাত" 
                        icon={<Siren className="w-4 h-4" />}
                        onClick={() => setMedicalType(medicalType === 'Head Injury' ? '' : 'Head Injury')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {PUBLIC_EMERGENCY_CONTACTS.slice(0, 4).map(c => (
                      <a key={c.id} href={`tel:${c.phone}`} className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-2xl border border-red-100 active:scale-95 transition-all group">
                        <Phone className="w-5 h-5 text-red-600 mb-1" />
                        <span className="text-[9px] font-black text-slate-800 leading-tight text-center">{c.name}</span>
                        <span className="text-xs font-black text-red-600 mt-1">{c.phone}</span>
                      </a>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">অতিরিক্ত তথ্য (ঐচ্ছিক)</p>
                    <textarea 
                      className="w-full bg-slate-100 border-none rounded-3xl p-5 text-slate-700 text-sm h-24 outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                      placeholder="উদা: জ্বর ও কাশির প্রাদুর্ভাব দেখা দিয়েছে..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={triggerSOS}
                    className="w-full bg-red-600 text-white font-black py-5 rounded-3xl shadow-xl flex items-center justify-center space-x-3 text-lg"
                  >
                    <Send className="w-6 h-6" />
                    <span>সিগন্যাল পাঠান</span>
                  </button>
                </>
              )}

              {status === 'sending' && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                  <div className="relative">
                    <Loader2 className="w-20 h-20 text-red-600 animate-spin" />
                    <Signal className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-xl font-black text-slate-800 animate-pulse uppercase">স্যাটেলাইট যোগাযোগ সংযোগ করা হচ্ছে...</p>
                </div>
              )}

              {status === 'tracking' && (
                <div className="space-y-8 py-4 text-center animate-in slide-in-from-bottom duration-500">
                  <div className="relative w-40 h-40 mx-auto">
                     <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                     <div className="relative w-full h-full bg-white border-8 border-green-500 rounded-full flex flex-col items-center justify-center shadow-lg">
                        <Users className="w-10 h-10 text-green-600 mb-1" />
                        <span className="text-3xl font-black text-green-700">{eta}</span>
                        <span className="text-[8px] font-black uppercase text-green-600">মিনিট বাকি</span>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-slate-800">সাহায্য আসছে!</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {medicalType && <span className="text-red-600 font-bold block mb-1">[{medicalType} কন্ট্যাক্ট চিহ্নিত]</span>}
                      নিকটস্থ ভলান্টিয়ার এবং স্বাস্থ্যকর্মী দল আপনার দিকে রওনা হয়েছে। শান্ত থাকুন এবং সামাজিক দূরত্ব বজায় রাখুন।
                    </p>
                  </div>

                  <button 
                    onClick={closeSOS}
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl active:scale-95 transition-all"
                  >
                    বিপদ শেষ (বন্ধ করুন)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TriageChip = ({ active, label, icon, onClick }: { active: boolean, label: string, icon: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-xl flex items-center space-x-2 border-2 transition-all ${
      active 
        ? 'bg-red-600 border-red-600 text-white shadow-md' 
        : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-red-200'
    }`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase whitespace-nowrap">{label}</span>
  </button>
);

export default SOSButton;
