
import React, { useState } from 'react';
import { User, SOSAlert } from '../types';
import { AlertCircle, X, Send, Loader2 } from 'lucide-react';
import { getAIPrioritization } from '../services/geminiService';

interface SOSButtonProps {
  user: User;
  onSOS: (alert: SOSAlert) => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ user, onSOS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [isSending, setIsSending] = useState(false);

  const triggerSOS = async () => {
    setIsSending(true);
    
    // Simulate getting real location
    const lat = 22.6485 + (Math.random() - 0.5) * 0.01;
    const lng = 92.1747 + (Math.random() - 0.5) * 0.01;

    // AI Prioritization
    const aiResult = await getAIPrioritization(details || "General emergency help needed.");

    const newAlert: SOSAlert = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      location: { lat, lng },
      timestamp: Date.now(),
      priority: aiResult.priority,
      details: details || "Immediate assistance required",
      aiAssessment: aiResult.reasoning
    };

    onSOS(newAlert);
    
    // Realistic delay for 'transmitting'
    setTimeout(() => {
      setIsSending(false);
      setIsOpen(false);
      setDetails('');
      alert("SOS Successfully Broadcasted to nearby responders!");
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-24 right-6 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-red-200 z-[2000] active:scale-90 transition-transform animate-pulse"
      >
        <span className="text-white font-black text-xs">SOS</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-sm z-[3000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-white">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">EMERGENCY SOS</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                Your live location will be shared with authorities and nearby responders immediately.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Emergency Details (Optional)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 text-sm h-24 focus:ring-red-500 focus:border-red-500"
                  placeholder="E.g. House flooding, medical injury, landslide..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={isSending}
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={triggerSOS}
                  disabled={isSending}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>ACTIVATE LIFELINE</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4">
                  HillShield uses AI to prioritize critical life-threatening situations first.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
