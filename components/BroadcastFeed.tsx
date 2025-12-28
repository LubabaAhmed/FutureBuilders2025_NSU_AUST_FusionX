
import React from 'react';
import { Broadcast } from '../types';
import { Megaphone, AlertCircle, Info, Clock } from 'lucide-react';

interface FeedProps {
  broadcasts: Broadcast[];
}

const BroadcastFeed: React.FC<FeedProps> = ({ broadcasts }) => {
  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="bg-red-600 p-6 text-white shadow-lg sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Megaphone className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter">EMERGENCY ALERTS</h2>
            <p className="text-xs text-red-100 font-bold uppercase tracking-widest">Authored by Local Authorities</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {broadcasts.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-red-200 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                b.type === 'critical' ? 'bg-red-600 text-white' : 
                b.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {b.type}
              </div>
              <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                <Clock className="w-3 h-3" />
                <span>{new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                b.type === 'critical' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
              }`}>
                {b.type === 'critical' ? <AlertCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{b.authority}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{b.message}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <button className="text-[10px] font-bold text-indigo-600 hover:underline">View on Map</button>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline">Share via Mesh</button>
            </div>
          </div>
        ))}
        
        {/* Placeholder for no more alerts */}
        <div className="py-10 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheckIcon className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-xs text-slate-400 font-medium">No other active alerts in your vicinity.</p>
        </div>
      </div>
    </div>
  );
};

const ShieldCheckIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default BroadcastFeed;
