
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Stethoscope, Send, Brain, ShieldCheck, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { getAIDoctorAdvice } from '../services/geminiService';

interface AIDoctorProps {
  user: User;
}

const AIDoctor: React.FC<AIDoctorProps> = ({ user }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `আসসালামু আলাইকুম ${user.name}! আমি হিলশিল্ড এআই সহকারী। বিপদের সময় আপনার চিকিৎসা সংক্রান্ত যে কোনো প্রশ্ন করতে পারেন। আপনার লক্ষণগুলো আমাকে বলুন।` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    const advice = await getAIDoctorAdvice(userText);
    
    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-indigo-950 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain className="w-32 h-32" />
        </div>
        <div className="relative flex items-center space-x-4">
          <div className="w-14 h-14 bg-red-600 rounded-[1.25rem] flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black">হিলশিল্ড এআই সহকারী</h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">অনলাইন সাপোর্ট • জেমিনি ৩.০</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 shadow-sm text-sm leading-relaxed transition-all ${
              m.role === 'user' 
                ? 'bg-red-600 text-white rounded-[1.5rem] rounded-br-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-[1.5rem] rounded-bl-none'
            }`}>
              {m.role === 'ai' && (
                <div className="flex items-center space-x-1 mb-2">
                  <Brain className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">মেডিকেল সহকারী</span>
                </div>
              )}
              <div className="space-y-1">
                {m.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-bl-none flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-xs font-bold text-slate-400">এআই বিশ্লেষণ করছে...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 pb-8">
        <div className="flex items-center space-x-2 max-w-lg mx-auto">
          <input 
            type="text"
            className="flex-1 bg-slate-100 border-none focus:ring-2 focus:ring-red-500 focus:bg-white rounded-2xl px-5 py-4 text-sm transition-all outline-none"
            placeholder="আপনার প্রশ্ন এখানে লিখুন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isThinking}
          />
          <button 
            onClick={handleSend}
            disabled={isThinking}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl disabled:opacity-50 shadow-lg transform active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-4 px-6 font-medium">
          সতর্কীকরণ: এটি একটি এআই টুল। জীবন বিপন্ন হলে নিকটস্থ চিকিৎসকের পরামর্শ নিন।
        </p>
      </div>
    </div>
  );
};

export default AIDoctor;
