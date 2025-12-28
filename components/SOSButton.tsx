
import React, { useState, useEffect } from 'react';
import { User, SOSAlert } from '../types';
import { AlertCircle, X, Send, Loader2, Signal, MapPin } from 'lucide-react';
import { getAIPrioritization } from '../services/geminiService';
import { STRINGS } from '../constants';

interface SOSButtonProps {
  user: User;
  onSOS: (alert: SOSAlert) => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ user, onSOS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [signal, setSignal] = useState(85);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setSignal(Math.floor(60 + Math.random() * 40));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const triggerSOS = async () => {
    setIsSending(true);
    
    const lat = 22.6485 + (Math.random() - 0.5) * 0.01;
    const lng = 92.1747 + (Math.random() - 0.5) * 0.01;

    const aiResult = await getAIPrioritization(details || "সহযোগিতা প্রয়োজন");

    const newAlert: SOSAlert = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      location: { lat, lng },
      timestamp: Date.now(),
      priority: aiResult.priority,
      details: details || "জরুরি সহযোগিতা প্রয়োজন",
      aiAssessment: aiResult.reasoning,
      signalStrength: signal
    };

    onSOS(newAlert);
    
    setTimeout(() => {
      setIsSending(false);
      setIsOpen(false);
      setDetails('');
      alert("SOS সফলভাবে নিকটস্থ রেসপন্ডারদের কাছে পাঠানো হয়েছে!");
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-24 right-6 w-20 h-20 bg-red-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] border-4 border-red-200 z-[2000] active:scale-90 transition-transform animate-pulse"
      >
        <span className="text-white font-black text-lg">SOS</span>
        <span className="text-white/80 font-bold text-[8px] uppercase tracking-tighter">ট্যাপ করুন</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-indigo-950/90 backdrop-blur-md z-[3000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-red-600 p-8 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 text-white mb-2">
                  <AlertCircle className="w-7 h-7" />
                  <h3 className="text-2xl font-black">{STRINGS.sos_button}</h3>
                </div>
                <p className="text-red-100 text-xs leading-relaxed max-w-[200px]">
                  {STRINGS.sos_desc}
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:bg-white/20 p-2 rounded-2xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Signal className={`w-5 h-5 ${signal > 80 ? 'text-green-600' : 'text-amber-500'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{STRINGS.signal_status}</p>
                    <p className="text-sm font-black text-slate-800">{signal}% (মেস প্লাস)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">অবস্থান</p>
                    <p className="text-sm font-black text-slate-800">রাঙ্গামাটি</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">কি ঘটছে? (বিস্তারিত লিখুন)</label>
                <textarea 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-4 text-slate-700 text-sm h-32 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                  placeholder="উদা: হঠাৎ ভূমিধস হয়েছে, ৩ জন আটকা পড়েছে..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={isSending}
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={triggerSOS}
                  disabled={isSending}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-black py-5 rounded-[1.5rem] shadow-xl flex items-center justify-center space-x-3 transform active:scale-95 transition-all"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>সিগন্যাল পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span className="text-lg">সহযোগিতা পাঠান</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
