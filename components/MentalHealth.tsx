
import React, { useState, useEffect, useRef } from 'react';
import { Wind, Heart, MessageCircle, Send, Brain, Sparkles, Activity, ShieldCheck, Quote, Volume2, ArrowLeft } from 'lucide-react';
import { getAIMentalSupport } from '../services/geminiService';

const AFFIRMATIONS = [
  "আপনি একা নন, আমরা আপনার সাথে আছি।",
  "ধীরগতিতে শ্বাস নিন, এই কঠিন সময় কেটে যাবে।",
  "আপনার নিরাপত্তা এখন সবচেয়ে বেশি গুরুত্বপূর্ণ।",
  "আপনার সাহায্যকারী দল পথে রয়েছে, শান্ত থাকুন।",
  "আপনার প্রতিটি শ্বাস আপনার সাহসের প্রমাণ।"
];

const MentalHealth: React.FC = () => {
  const [view, setView] = useState<'menu' | 'breathe' | 'chat' | 'affirm'>('menu');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

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
    <div className="h-full bg-teal-50/20 flex flex-col overflow-hidden">
      <div className="bg-teal-600 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Heart className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-black">মানসিক প্রশান্তি</h2>
        <p className="text-xs opacity-80 mt-1 font-bold uppercase tracking-wider">মানসিক চাপ ও আতঙ্ক দূর করুন</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {view === 'menu' && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MenuCard 
              icon={<Wind className="w-8 h-8" />} 
              title="শ্বাসের ব্যায়াম" 
              sub="৪-সেকেন্ড বক্স ব্রিদিং" 
              onClick={() => setView('breathe')} 
            />
            <MenuCard 
              icon={<MessageCircle className="w-8 h-8" />} 
              title="এআই কাউন্সিলর" 
              sub="মনের কথা শেয়ার করুন" 
              onClick={() => setView('chat')} 
            />
            <MenuCard 
              icon={<Quote className="w-8 h-8" />} 
              title="আশ্বাস (Affirmations)" 
              sub="সাহস জোগানোর বাণী" 
              onClick={() => setView('affirm')} 
            />

            <div className="p-6 bg-teal-100/50 rounded-[2rem] border border-teal-200 border-dashed mt-4">
              <div className="flex items-center space-x-2 mb-3 text-teal-700">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">নিরাপত্তা টিপস</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                "আতঙ্কিত হলে আমরা ভুল সিদ্ধান্ত নিই। গভীরভাবে ৩ বার শ্বাস নিন এবং আপনার চারপাশের অন্তত ৫টি নীল রঙের বস্তু খুঁজে বের করুন (Grounding)।"
              </p>
            </div>
          </div>
        )}

        {view === 'breathe' && (
          <div className="flex flex-col items-center justify-center space-y-12 py-6 animate-in zoom-in duration-300">
            <div className={`w-64 h-64 rounded-full border-[12px] border-teal-200 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
              isBreathing ? (breathPhase === 'In' ? 'scale-125 bg-teal-100' : breathPhase === 'Out' ? 'scale-75 bg-white' : 'scale-110 bg-teal-50') : 'scale-100'
            }`}>
              <div className="text-center">
                <p className="text-3xl font-black text-teal-600">{isBreathing ? (breathPhase === 'In' ? 'নিশ্বাস নিন' : breathPhase === 'Hold' ? 'ধরে রাখুন' : 'ছেড়ে দিন') : 'শুরু করুন'}</p>
                <Wind className={`w-8 h-8 text-teal-400 mx-auto mt-2 ${isBreathing ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            
            <div className="space-y-4 w-full max-w-xs">
              <button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`w-full py-5 rounded-[2rem] font-black text-white shadow-xl transition-all ${isBreathing ? 'bg-red-500' : 'bg-teal-600'}`}
              >
                {isBreathing ? 'থামুন' : 'ব্যায়াম শুরু করুন'}
              </button>
              <button onClick={() => setView('menu')} className="w-full text-teal-600 font-bold text-sm">পিছনে যান</button>
            </div>
          </div>
        )}

        {view === 'affirm' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('menu')} className="flex items-center text-teal-600 font-bold mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> ফিরে যান
            </button>
            {AFFIRMATIONS.map((text, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-teal-100 shadow-sm flex items-start space-x-4">
                <Volume2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-bold leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        )}

        {view === 'chat' && (
          <div className="flex flex-col h-[calc(100vh-320px)] animate-in slide-in-from-bottom duration-300">
             <button onClick={() => setView('menu')} className="flex items-center text-teal-600 font-bold mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> ফিরে যান
            </button>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <Brain className="w-16 h-16 text-teal-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium px-10 leading-relaxed">বিপদকালীন এই সময়ে আপনার মন কেমন আছে? আমি কথা শুনতে প্রস্তুত।</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-teal-100 text-slate-800 rounded-tl-none shadow-sm'}`}>
                    <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-teal-100/50 px-4 py-2 rounded-2xl animate-pulse text-[10px] font-black text-teal-700 uppercase">কাউন্সেলর চিন্তা করছে...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex space-x-2 mt-4">
              <input 
                className="flex-1 bg-white border border-teal-100 rounded-[1.5rem] px-5 py-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none shadow-inner"
                placeholder="কিছু বলুন..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              />
              <button onClick={handleChat} className="bg-teal-600 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuCard = ({ icon, title, sub, onClick }: { icon: any, title: string, sub: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-teal-100 flex items-center space-x-6 hover:bg-teal-50 transition-all active:scale-[0.98] group"
  >
    <div className="w-16 h-16 bg-teal-100/50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-left">
      <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{sub}</p>
    </div>
  </button>
);

export default MentalHealth;
