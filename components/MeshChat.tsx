
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { Send, WifiOff, Users, Cpu, ShieldCheck } from 'lucide-react';
import { predictMeshReliability } from '../services/geminiService';

interface ChatProps {
  user: User;
  isOnline: boolean;
}

const STORAGE_KEY = 'hillshield_mesh_messages';

const MeshChat: React.FC<ChatProps> = ({ user, isOnline }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [meshReliability, setMeshReliability] = useState<number>(85);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const loadMessages = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Initial system messages if none exist
        const initial: Message[] = [
          { id: 'sys-1', senderId: '0', senderName: 'Mesh System', text: 'P2P Mesh Network established via Local Wi-Fi Direct.', timestamp: Date.now() - 50000, status: 'delivered' }
        ];
        setMessages(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    };

    loadMessages();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setMessages(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchReliability = async () => {
      const data = await predictMeshReliability({});
      setMeshReliability(data.reliabilityScore);
    };
    fetchReliability();
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: inputValue,
      timestamp: Date.now(),
      status: isOnline ? 'sent' : 'mesh-queued'
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    setInputValue('');

    // Simulate mesh propagation for "delivered" status
    if (!isOnline) {
      setTimeout(() => {
        const currentStored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const statusUpdated = currentStored.map((m: Message) => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        );
        setMessages(statusUpdated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statusUpdated));
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      {/* Mesh Status Header */}
      <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-2xl shadow-inner">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight italic">Local Mesh (Hill-Net)</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">12 Nodes Connected</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{meshReliability}% Stability</span>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-500 text-white text-[10px] py-2 px-4 flex items-center justify-center space-x-2 shadow-md relative z-10">
          <WifiOff className="w-3 h-3" />
          <span className="font-black uppercase tracking-[0.15em]">No Internet: Synchronizing via P2P Mesh</span>
        </div>
      )}

      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          const isSystem = msg.senderId === '0';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-indigo-100/50 border border-indigo-100 text-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                  <ShieldCheck size={12} />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] rounded-[1.75rem] p-5 shadow-sm transition-all hover:shadow-md ${
                isMe 
                  ? 'bg-indigo-950 text-white rounded-br-none border-b-4 border-indigo-900' 
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
              }`}>
                {!isMe && (
                  <p className="text-[10px] font-black mb-1.5 text-indigo-600 uppercase tracking-widest italic">{msg.senderName}</p>
                )}
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end space-x-2 mt-2 opacity-50 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                  <span className="text-[9px] font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && (
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      {msg.status === 'delivered' ? '✓✓ ' + msg.status : '○ ' + msg.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100 pb-10 shadow-[0_-15px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center space-x-3 max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="আশেপাশের সবার সাথে শেয়ার করুন..."
            className="flex-1 bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm transition-all outline-none shadow-inner font-medium"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl shadow-xl transition-all active:scale-90 border-b-4 border-red-800"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest italic">
          আপনার মেসেজটি ব্লুটুথ ও ওয়াইফাই ডাইরেক্টের মাধ্যমে নিকটস্থ ১০ কিমিতে ছড়িয়ে পড়বে।
        </p>
      </div>
    </div>
  );
};

export default MeshChat;
