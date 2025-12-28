
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Stethoscope, Send, Brain, ShieldCheck, Loader2, Sparkles, MessageCircle, Thermometer, Info, AlertTriangle, ChevronRight, Heart, Shield, Activity } from 'lucide-react';
import { getAIDoctorAdvice } from '../services/geminiService';
import { COMMON_SYMPTOMS } from '../constants';

interface AIDoctorProps {
  user: User;
  initialQuery?: string | null;
}

const AIDoctor: React.FC<AIDoctorProps> = ({ user, initialQuery }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `${user.name}, আপনার কোনো শারীরিক অস্বস্তি বা লক্ষণ থাকলে আমাকে বিস্তারিত বলুন। আমি আপনার লক্ষণগুলো বিশ্লেষণ (Symptom Checking) করে প্রয়োজনীয় প্রাথমিক পরামর্শ দিতে প্রস্তুত।\n\nআপনি চাইলে নিচের সাধারণ লক্ষণগুলো থেকে একটি বেছে নিতে পারেন অথবা আপনার সমস্যাটি লিখে জানাতে পারেন।` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Handle voice command entry
  useEffect(() => {
    if (initialQuery) {
      handleSend(`ভয়েস কমান্ড থেকে: ${initialQuery}`);
    }
  }, [initialQuery]);

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
    handleSend(`লক্ষণ: ${label}। এই সমস্যার জন্য আমার সম্ভাব্য ঝুঁকিগুলো কী এবং কী পদক্ষেপ নেওয়া উচিত?`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-indigo-950 p-6 text-white relative overflow-hidden shadow-xl border-b border-indigo-900">
        <div className="absolute -top-6 -right-6 p-8 opacity-10">
          <Stethoscope className="w-32 h-32" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
              <Brain className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">ভার্চুয়াল <span className="text-indigo-400">কনসালট্যান্ট</span></h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest italic">Symptom Checker Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom Picker */}
      {messages.length === 1 && (
        <div className="p-4 bg-white border-b border-slate-200 shadow-sm animate-in slide-in-from-top duration-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center">
             <Activity className="w-3 h-3 mr-1" /> প্রধান লক্ষণটি বাছাই করুন:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {COMMON_SYMPTOMS.map(s => (
              <button 
                key={s.id}
                onClick={() => handleSymptomSelect(s.label)}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1 active:scale-95 transition-all hover:bg-indigo-50 hover:border-indigo-300 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
                <span className="text-[11px] font-bold text-slate-700">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-5 shadow-sm text-sm leading-relaxed transition-all ${
              m.role === 'user' 
                ? 'bg-indigo-900 text-white rounded-[1.75rem] rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-[1.75rem] rounded-bl-none shadow-md'
            }`}>
              {m.role === 'ai' && (
                <div className="flex items-center space-x-2 mb-3 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">মেডিকেল বিশ্লেষণ</span>
                </div>
              )}
              <div className="space-y-3 font-medium">
                {m.text.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('-') || /^\d+\./.test(line) ? 'pl-4 border-l-2 border-indigo-200 py-0.5' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-5 rounded-[1.75rem] rounded-bl-none flex items-center space-x-4 shadow-md">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">লক্ষণ বিশ্লেষণ করা হচ্ছে...</span>
            </div>
          </div>
        )}
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
            disabled={isThinking}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isThinking}
            className="bg-indigo-950 hover:bg-indigo-900 text-white p-5 rounded-2xl disabled:opacity-50 shadow-xl transform active:scale-95 transition-all flex items-center justify-center border-b-4 border-indigo-800"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDoctor;
