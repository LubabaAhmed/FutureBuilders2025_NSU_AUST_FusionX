
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Stethoscope, Send, Brain, ShieldCheck, Loader2 } from 'lucide-react';
import { getAIDoctorAdvice } from '../services/geminiService';

interface AIDoctorProps {
  user: User;
}

const AIDoctor: React.FC<AIDoctorProps> = ({ user }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello, I am HillShield's AI Medical Assistant. I can provide emergency first aid advice while help is on the way. What is the medical emergency?" }
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
    <div className="flex flex-col h-full bg-indigo-50/50">
      <div className="bg-indigo-950 text-white p-5">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 p-2 rounded-xl">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center">
              HillShield AI Doctor
              <span className="ml-2 bg-blue-500 text-[8px] px-1.5 py-0.5 rounded uppercase font-black">Beta</span>
            </h3>
            <p className="text-xs text-indigo-300 font-medium">Triage Assistant for Rural BD</p>
          </div>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur px-4 py-2 border-b border-indigo-100 flex items-center justify-between text-[10px]">
        <div className="flex items-center space-x-2 text-slate-500">
          <ShieldCheck className="w-3 h-3 text-green-500" />
          <span>Professional medical AI model enabled</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <Brain className="w-3 h-3 text-indigo-500" />
          <span>Local processing active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-indigo-100 text-slate-800 rounded-bl-none'
            }`}>
              {m.text.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-indigo-100 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-xs font-medium text-slate-500 italic">Analyzing symptoms...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-indigo-100">
        <div className="flex items-center space-x-2">
          <input 
            type="text"
            className="flex-1 bg-indigo-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all"
            placeholder="Describe injury or symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isThinking}
          />
          <button 
            onClick={handleSend}
            disabled={isThinking}
            className="bg-indigo-950 hover:bg-black text-white p-3 rounded-xl disabled:opacity-50 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2 px-6">
          DISCLAIMER: This is an AI tool. Use only for first-aid guidance. If possible, seek a licensed physician immediately.
        </p>
      </div>
    </div>
  );
};

export default AIDoctor;
