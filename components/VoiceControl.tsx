
import React, { useState, useEffect, useRef } from 'react';
// Fixed: Removed 'Waveform' as it is not exported by 'lucide-react'
import { Mic, X, Loader2, Volume2 } from 'lucide-react';
import { interpretVoiceCommand } from '../services/geminiService';

interface VoiceControlProps {
  onAction: (action: string, params?: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onAction }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'bn-BD'; // Primary support for Bangla

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        setTranscript(text);
        
        if (result.isFinal) {
          processVoice(text);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setIsProcessing(false);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const processVoice = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    const result = await interpretVoiceCommand(text);
    if (result && result.action !== 'UNKNOWN') {
      onAction(result.action, result.params);
    }
    setTimeout(() => setIsProcessing(false), 1000);
  };

  return (
    <>
      {/* Persistent Mic Toggle FAB */}
      <button 
        onClick={toggleListening}
        className={`fixed bottom-28 left-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-[2500] border-4 border-white transition-all active:scale-90 ${isListening ? 'bg-red-600 scale-110' : 'bg-indigo-950 hover:bg-indigo-900'}`}
      >
        <Mic className={`w-6 h-6 text-white ${isListening ? 'animate-pulse' : ''}`} />
        {isListening && (
          <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-50"></span>
        )}
      </button>

      {/* Listening Overlay */}
      {isListening && (
        <div className="fixed inset-0 bg-indigo-950/90 backdrop-blur-md z-[3500] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsListening(false)}
            className="absolute top-8 right-8 p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(239,68,68,0.5)] animate-pulse">
            <Mic className="w-12 h-12 text-white" />
          </div>

          <div className="text-center space-y-4 max-w-md">
            <h3 className="text-2xl font-black text-white italic tracking-tight">আমি শুনছি...</h3>
            <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mb-8">Disaster Voice Assistant Active</p>
            
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 min-h-[120px] flex items-center justify-center">
              <p className="text-xl font-bold text-white leading-relaxed italic">
                {transcript || "আপনার কমান্ডটি বলুন..."}
              </p>
            </div>
          </div>

          <div className="mt-12 flex space-x-2">
            <div className="w-2 h-8 bg-indigo-500 rounded-full animate-[bounce_1s_infinite]"></div>
            <div className="w-2 h-12 bg-red-500 rounded-full animate-[bounce_1.2s_infinite]"></div>
            <div className="w-2 h-16 bg-indigo-400 rounded-full animate-[bounce_1.1s_infinite]"></div>
            <div className="w-2 h-10 bg-indigo-600 rounded-full animate-[bounce_0.9s_infinite]"></div>
            <div className="w-2 h-6 bg-red-400 rounded-full animate-[bounce_1.3s_infinite]"></div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="fixed bottom-40 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-2xl border border-indigo-100 flex items-center space-x-3 z-[2500] animate-in slide-in-from-bottom duration-300">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
          <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">কমান্ড বিশ্লেষণ করা হচ্ছে...</span>
        </div>
      )}
    </>
  );
};

export default VoiceControl;
