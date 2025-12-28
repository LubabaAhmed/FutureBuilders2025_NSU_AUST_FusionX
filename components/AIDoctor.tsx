
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { 
  Stethoscope, Send, Brain, ShieldCheck, Loader2, Sparkles, 
  Activity, Heart, Shield, Camera, X, AlertTriangle, Pill, 
  Info, History, CheckCircle2, ChevronRight, Siren, Thermometer,
  Gauge
} from 'lucide-react';
import { getAIDoctorAdvice, identifyMedicine } from '../services/geminiService';

interface AIDoctorProps {
  user: User;
  initialQuery?: string | null;
}

const HISTORY_STORAGE_KEY = 'doctor_ache_medical_history';

const AIDoctor: React.FC<AIDoctorProps> = ({ user, initialQuery }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai' | 'triage', text?: string, data?: any, timestamp: number}[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'medicine' | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence and Sync
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ 
        role: 'ai', 
        text: `${user.name}, আপনার শারীরিক সমস্যা বা ওষুধের নাম জানতে চাইলে আমাকে বলুন। ওষুধের ছবি শেয়ার করলে আমি সেটি চিনতে সাহায্য করতে পারি।`,
        timestamp: Date.now()
      }]);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === HISTORY_STORAGE_KEY && e.newValue) {
        setMessages(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user.name]);

  const updateHistory = (newMsgs: any[]) => {
    setMessages(newMsgs);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newMsgs));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, isScanning]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(`ভয়েস কমান্ড থেকে: ${initialQuery}`);
    }
  }, [initialQuery]);

  const handleSend = async (customText?: string) => {
    const userText = customText || input;
    if (!userText.trim() || isThinking) return;

    setInput('');
    const newMsgList = [...messages, { role: 'user', text: userText, timestamp: Date.now() }];
    updateHistory(newMsgList as any);
    setIsThinking(true);

    try {
      const triage = await getAIDoctorAdvice(userText);
      updateHistory([...newMsgList, { role: 'triage', data: triage, timestamp: Date.now() }] as any);
    } catch (err) {
      updateHistory([...newMsgList, { role: 'ai', text: "পরামর্শ দিতে সমস্যা হচ্ছে।", timestamp: Date.now() }] as any);
    }
    setIsThinking(false);
  };

  const startScan = () => {
    setScanType('medicine');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scanType) return;

    setIsScanning(true);
    const tempMsgList = [...messages, { role: 'user', text: "ওষুধ স্ক্যান করছি...", timestamp: Date.now() }];
    updateHistory(tempMsgList as any);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await identifyMedicine(base64Data, file.type);
        updateHistory([...tempMsgList, { 
          role: 'triage', 
          data: {
            level: result.riskLevel,
            priorityScore: result.priorityScore,
            levelTitle: result.riskLevel === 1 ? 'নিরাপদ' : result.riskLevel === 2 ? 'সতর্কতা' : 'সাবধান',
            assessment: `${result.name} (${result.generic}) - ${result.usage}`,
            actions: result.dosage,
            warningSigns: result.warnings,
            color: result.riskLevel === 1 ? '#22c55e' : result.riskLevel === 2 ? '#eab308' : '#f97316',
            isMedicine: true,
            medicineData: result
          },
          timestamp: Date.now()
        }] as any);
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      updateHistory([...tempMsgList, { role: 'ai', text: "চিত্র বিশ্লেষণ ব্যর্থ।", timestamp: Date.now() }] as any);
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-indigo-950 p-6 text-white relative overflow-hidden shadow-xl border-b border-indigo-900">
        <div className="absolute -top-6 -right-6 p-8 opacity-10 rotate-12">
          <Stethoscope className="w-32 h-32" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
              <Brain className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight italic">এআই <span className="text-indigo-400 font-black">ডাক্তার</span></h3>
              <p className="text-[9px] text-indigo-200 font-black uppercase tracking-widest italic">Clinical Level Detector</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <ScanButton icon={<Pill size={18} />} label="ওষুধ" onClick={startScan} />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 pb-20">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'triage' ? (
              <div className="w-full max-w-[95%] animate-in zoom-in duration-300">
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <div style={{ backgroundColor: m.data.color }} className="p-6 text-white relative">
                    <div className="absolute right-6 top-6 opacity-20">
                      <Gauge size={48} />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                        {m.data.level >= 3 ? <Siren className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black italic leading-none">{m.data.levelTitle}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Priority Score:</span>
                          <span className="bg-white/30 px-2 py-0.5 rounded-full text-[10px] font-black">{m.data.priorityScore}/10</span>
                        </div>
                      </div>
                    </div>
                    {/* Urgency Gauge Visual */}
                    <div className="mt-4 w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-white h-full transition-all duration-1000" 
                        style={{ width: `${m.data.priorityScore * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-7 space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">পর্যবেক্ষণ ও অবস্থা (Stage)</p>
                       <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                         <p className="text-base font-black text-slate-800 leading-relaxed italic">
                           {m.data.assessment}
                         </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                          <div className="flex items-center space-x-2 mb-3 text-indigo-700">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">তাৎক্ষণিক করণীয়</span>
                          </div>
                          <div className="text-sm font-bold text-indigo-900 space-y-2">
                             {m.data.actions.split('\n').map((line: string, i: number) => (
                               <p key={i} className="flex items-start"><span className="mr-2 opacity-50">•</span> {line}</p>
                             ))}
                          </div>
                       </div>
                       <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                          <div className="flex items-center space-x-2 mb-3 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">সতর্ক সংকেত</span>
                          </div>
                          <p className="text-sm font-bold text-red-900 italic leading-relaxed">{m.data.warningSigns}</p>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col space-y-4">
                       <p className="text-[9px] text-slate-400 font-bold leading-tight uppercase italic text-center px-4">
                         {m.data.isMedicine ? m.data.medicineData.disclaimer : "এটি এআই ভিত্তিক প্রাথমিক বিশ্লেষণ। গুরুতর সমস্যায় হাসপাতালে যোগাযোগ করুন।"}
                       </p>
                       {m.data.level >= 3 && (
                         <button onClick={() => window.location.href = "tel:999"} className="w-full bg-red-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl border-b-4 border-red-800 flex items-center justify-center space-x-3 active:scale-95 transition-all">
                            <Siren className="w-6 h-6" />
                            <span>জরুরি সাহায্য কল করুন (৯৯৯)</span>
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`max-w-[88%] p-5 shadow-sm text-sm leading-relaxed transition-all ${
                m.role === 'user' ? 'bg-indigo-900 text-white rounded-[1.75rem] rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-[1.75rem] rounded-bl-none shadow-md'
              }`}>
                {m.role === 'ai' && (
                  <div className="flex items-center space-x-2 mb-3 border-b border-slate-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">AI Assistant</span>
                  </div>
                )}
                <p className="font-medium">{m.text}</p>
              </div>
            )}
          </div>
        ))}
        {isThinking && <LoadingBubble label="বিশ্লেষণ করা হচ্ছে..." />}
        {isScanning && <ScanningBubble label="চিত্র বিশ্লেষণ..." />}
        <div ref={scrollRef} />
      </div>

      {/* Input Field */}
      <div className="p-4 bg-white border-t border-slate-100 pb-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="flex space-x-3 max-w-2xl mx-auto relative">
          <input 
            type="text" 
            className="flex-1 bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm transition-all outline-none shadow-inner font-medium"
            placeholder="আপনার শারীরিক সমস্যার বিবরণ দিন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isThinking || isScanning}
          />
          <button onClick={() => handleSend()} disabled={isThinking || isScanning} className="bg-indigo-950 hover:bg-indigo-900 text-white p-5 rounded-2xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center border-b-4 border-indigo-800">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingBubble = ({ label }: any) => (
  <div className="flex justify-start">
    <div className="bg-white border border-slate-200 p-5 rounded-[1.75rem] rounded-bl-none flex items-center space-x-4 shadow-md">
      <div className="flex space-x-1.5">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">{label}</span>
    </div>
  </div>
);

const ScanningBubble = ({ label }: any) => (
  <div className="flex justify-start">
    <div className="bg-indigo-950 p-6 rounded-[2.5rem] flex items-center space-x-4 shadow-2xl border-4 border-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden"><div className="w-full h-1 bg-indigo-400/50 absolute top-0 left-0 animate-[scan_2s_infinite]"></div></div>
      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">{label}</span>
    </div>
  </div>
);

const ScanButton = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 rounded-2xl border shadow-lg active:scale-95 transition-all min-w-[60px] bg-indigo-800 border-indigo-700 text-indigo-200"
  >
    {icon}
    <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{label}</span>
  </button>
);

export default AIDoctor;
