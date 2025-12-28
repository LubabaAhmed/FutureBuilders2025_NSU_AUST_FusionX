
import React, { useState, useEffect } from 'react';
import { Wind, Heart, MessageCircle, Send, Brain, Sparkles, Activity } from 'lucide-react';
import { getAIMentalSupport } from '../services/geminiService';

const MentalHealth: React.FC = () => {
  const [view, setView] = useState<'menu' | 'breathe' | 'chat'>('menu');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathPhase(p => {
          if (p === 'In') return 'Hold';
          if (p === 'Hold') return 'Out';
          return 'In';
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleChat = async () => {
    if (!input.trim() || isThinking) return;
    const userText = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);
    const response = await getAIMentalSupport(userText);
    setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsThinking(false);
  };

  return (
    <div className="h-full bg-teal-50/30 flex flex-col overflow-hidden">
      <div className="bg-teal-600 p-8 text-white">
        <h2 className="text-2xl font-black">মানসিক প্রশান্তি</h2>
        <p className="text-xs opacity-80 mt-1 font-bold uppercase tracking-wider">বিপদের সময় নিজেকে শান্ত রাখুন</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {view === 'menu' && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setView('breathe')}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-teal-100 flex items-center space-x-6 hover:bg-teal-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                <Wind className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-800">শ্বাসের ব্যায়াম</h3>
                <p className="text-xs text-slate-400 font-medium italic">৪-সেকেন্ড বক্স ব্রিদিং</p>
              </div>
            </button>

            <button 
              onClick={() => setView('chat')}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-teal-100 flex items-center space-x-6 hover:bg-teal-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-800">কাউন্সেলর এআই</h3>
                <p className="text-xs text-slate-400 font-medium italic">মনের কথা শেয়ার করুন</p>
              </div>
            </button>

            <div className="p-6 bg-white/50 rounded-[2rem] border border-teal-100 border-dashed">
              <div className="flex items-center space-x-2 mb-3 text-teal-700">
                <Activity className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-widest">আজকের টিপস</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "সবচেয়ে বড় সাহসের কাজ হলো শান্ত থাকা। আপনার চারপাশের মানুষকেও শান্ত থাকতে উৎসাহিত করুন।"
              </p>
            </div>
          </div>
        )}

        {view === 'breathe' && (
          <div className="flex flex-col items-center justify-center space-y-12 py-10 animate-in zoom-in duration-300">
            <div className={`w-64 h-64 rounded-full border-8 border-teal-200 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
              isBreathing ? (breathPhase === 'In' ? 'scale-125 bg-teal-100' : breathPhase === 'Out' ? 'scale-75 bg-white' : 'scale-110 bg-teal-50') : 'scale-100'
            }`}>
              <div className="text-center">
                <p className="text-2xl font-black text-teal-600">{isBreathing ? breathPhase : 'ব্যায়াম শুরু'}</p>
                <Wind className={`w-8 h-8 text-teal-400 mx-auto mt-2 ${isBreathing ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            
            <div className="space-y-4 w-full">
              <button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all ${isBreathing ? 'bg-red-500' : 'bg-teal-600'}`}
              >
                {isBreathing ? 'থামুন' : 'শুরু করুন'}
              </button>
              <button onClick={() => setView('menu')} className="w-full text-teal-600 font-bold text-sm">পিছনে যান</button>
            </div>
          </div>
        )}

        {view === 'chat' && (
          <div className="flex flex-col h-[calc(100vh-280px)] animate-in slide-in-from-right duration-300">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-10">
                  <Brain className="w-12 h-12 text-teal-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">আপনার দুশ্চিন্তার কথা লিখুন। আমি শুনতে প্রস্তুত।</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-teal-100 text-slate-800 rounded-tl-none shadow-sm'}`}>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {isThinking && <div className="text-teal-400 text-xs italic font-bold ml-4">কাউন্সেলর চিন্তা করছে...</div>}
            </div>
            <div className="flex space-x-2 mt-2">
              <input 
                className="flex-1 bg-white border border-teal-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="কিছু বলুন..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              />
              <button onClick={handleChat} className="bg-teal-600 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <button onClick={() => setView('menu')} className="mt-4 text-teal-600 font-bold text-sm text-center">পিছনে যান</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealth;
