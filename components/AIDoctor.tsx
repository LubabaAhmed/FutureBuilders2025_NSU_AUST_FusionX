
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Stethoscope, Send, Brain, ShieldCheck, Loader2, Sparkles, MessageCircle, Thermometer, Info, AlertTriangle, ChevronRight, Shield, Activity, ClipboardList } from 'lucide-react';
import { getAIDoctorAdvice } from '../services/geminiService';
import { COMMON_SYMPTOMS } from '../constants';

interface AIDoctorProps {
  user: User;
}

const AIDoctor: React.FC<AIDoctorProps> = ({ user }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `মেডিকেল কনসালট্যান্ট সিস্টেম লোড করা হয়েছে। আইডি: ${user.id}। আপনার শারীরিক লক্ষণসমূহ বিস্তারিত বর্ণনা করুন। এই এআই সিস্টেমটি ক্লিনিক্যাল প্রটোকল অনুযায়ী আপনাকে পরামর্শ প্রদান করবে।` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (customText?: string) => {
    const userText = customText || input;
    if (!userText.trim() || isThinking) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    const advice = await getAIDoctorAdvice(userText);
    
    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setIsThinking(false);
  };

  const handleSymptomSelect = (label: string) => {
    handleSend(`লক্ষণ: ${label}। ক্লিনিক্যাল অ্যাসেসমেন্ট এবং গাইডলাইন প্রয়োজন।`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
      {/* Strict Professional Header */}
      <div className="bg-indigo-950 p-6 text-white relative overflow-hidden shadow-xl border-b border-indigo-900">
        <div className="absolute -top-6 -right-6 p-8 opacity-5">
          <ClipboardList className="w-32 h-32" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-indigo-900/40 rounded-xl flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight uppercase">মেডিকেল এআই <span className="text-indigo-400">কনসালট্যান্ট</span></h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest">ক্লিনিক্যাল ডেটাসেট ভার্সন: ২.৫.০</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block bg-indigo-900/80 px-4 py-2 rounded-lg border border-indigo-800">
             <span className="text-[10px] font-black text-indigo-100 uppercase">অফলাইন ডায়াগনস্টিক এনাবলড</span>
          </div>
        </div>
      </div>

      {/* Symptom Selection Grid */}
      {messages.length === 1 && (
        <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1 flex items-center">
             <Activity className="w-3 h-3 mr-1" /> প্রাথমিক ডায়াগনস্টিক প্যারামিটার:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {COMMON_SYMPTOMS.map(s => (
              <button 
                key={s.id}
                onClick={() => handleSymptomSelect(s.label)}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1 active:scale-95 transition-all hover:bg-indigo-950 hover:text-white group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-white">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report-style Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-5 shadow-sm text-sm leading-relaxed transition-all ${
              m.role === 'user' 
                ? 'bg-slate-200 text-slate-800 rounded-2xl rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-900 rounded-2xl rounded-bl-none shadow-md'
            }`}>
              {m.role === 'ai' && (
                <div className="flex items-center space-x-2 mb-3 border-b border-slate-100 pb-2">
                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">ক্লিনিক্যাল রিপোর্ট</span>
                </div>
              )}
              <div className="space-y-3 font-medium">
                {m.text.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('-') || /^\d+\./.test(line) ? 'pl-4 border-l-2 border-indigo-600 py-1 bg-indigo-50/30' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">ডেটা প্রসেসিং...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Clinical Input Field */}
      <div className="p-4 bg-white border-t border-slate-100 pb-10 shadow-lg">
        <div className="flex space-x-3 max-w-3xl mx-auto relative">
          <input 
            type="text"
            className="flex-1 bg-slate-100 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-6 py-4 text-sm transition-all outline-none font-medium"
            placeholder="লক্ষণসমূহ ইনপুট দিন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isThinking}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isThinking}
            className="bg-indigo-950 hover:bg-indigo-900 text-white p-5 rounded-xl disabled:opacity-50 shadow-md active:scale-95 transition-all border-b-4 border-indigo-800"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter italic">এই পরামর্শ শুধুমাত্র তথ্যগত সহায়তার জন্য। জরুরি অবস্থায় সরাসরি হাসপাতালের সাহায্য নিন।</span>
        </div>
      </div>
    </div>
  );
};

export default AIDoctor;
