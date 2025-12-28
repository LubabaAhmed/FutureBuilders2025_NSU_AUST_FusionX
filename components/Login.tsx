
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, AlertCircle, Stethoscope } from 'lucide-react';
import { STRINGS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'উদ্ধারকারী',
      email,
      role: 'citizen',
      medicalHistory: {
        bloodGroup: 'O+',
        allergies: [],
        conditions: [],
        medications: []
      },
      contacts: [],
      settings: {
        notifications: true,
        offlineMode: true,
        theme: 'light'
      },
      privacy: {
        shareLocation: true,
        visibleToResponders: true,
        dataUsageAnalytics: false
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border-4 border-indigo-900">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-red-100 rounded-2xl mb-4 rotate-3">
            <Stethoscope className="w-12 h-12 text-red-600 -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter text-center">ডাক্তার আছে?</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Doctor Ache?</p>
          <p className="text-slate-500 text-center mt-4 text-sm font-medium">দুর্যোগের সময়ে আপনার সবচেয়ে বিশ্বস্ত এআই সহকারী।</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">পুরো নাম</label>
              <input
                type="text"
                required
                className="block w-full px-4 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-red-500 focus:bg-white rounded-2xl transition-all outline-none"
                placeholder="রহিম আহমেদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">ইমেইল / ফোন</label>
            <input
              type="text"
              required
              className="block w-full px-4 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-red-500 focus:bg-white rounded-2xl transition-all outline-none"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              className="block w-full px-4 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-red-500 focus:bg-white rounded-2xl transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-4 rounded-2xl shadow-xl transform active:scale-95 transition-all mt-6 text-lg"
          >
            {isSignUp ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-black hover:underline text-sm"
          >
            {isSignUp ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন' : "নতুন ব্যবহারকারী? অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </div>

        <div className="mt-8 p-4 bg-indigo-50 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-900 font-bold leading-relaxed uppercase">
            রেজিস্ট্রেশন করলে উদ্ধারকারীরা বিপদের সময় আপনার চিকিৎসা ইতিহাস দেখতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
