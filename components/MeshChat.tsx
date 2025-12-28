
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { Send, WifiOff, Users, Cpu } from 'lucide-react';
import { predictMeshReliability } from '../services/geminiService';

interface ChatProps {
  user: User;
  isOnline: boolean;
}

const MeshChat: React.FC<ChatProps> = ({ user, isOnline }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: '0', senderName: 'Mesh System', text: 'P2P Mesh Network established via Local Wi-Fi Direct.', timestamp: Date.now() - 50000, status: 'delivered' },
    { id: '2', senderId: 'u2', senderName: 'Jamal', text: 'Anyone near Kaptai road? Looking for a safe route.', timestamp: Date.now() - 30000, status: 'mesh-queued' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [meshReliability, setMeshReliability] = useState<number>(85);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate mesh propagation
    if (!isOnline) {
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Mesh Status Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Local Mesh (Hill-Net)</h3>
            <p className="text-[10px] text-slate-500 font-medium">12 Users within 500m</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
          <Cpu className="w-3 h-3 text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-600">{meshReliability}% Stability</span>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-500 text-white text-[10px] py-1 px-4 flex items-center justify-center space-x-2">
          <WifiOff className="w-3 h-3" />
          <span className="font-bold tracking-wide">NO INTERNET: BROADCASTING VIA MESH-SIM</span>
        </div>
      )}

      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
              msg.senderId === user.id 
                ? 'bg-red-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
            }`}>
              {msg.senderId !== user.id && (
                <p className="text-[10px] font-bold mb-1 text-red-500">{msg.senderName}</p>
              )}
              <p className="text-sm">{msg.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1 opacity-70">
                <span className="text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.senderId === user.id && (
                  <span className="text-[9px] font-bold uppercase">{msg.status}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="Broadcast to nearby..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-2xl shadow-lg transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-2">
          Messages propagate peer-to-peer even without cellular towers.
        </p>
      </div>
    </div>
  );
};

export default MeshChat;
