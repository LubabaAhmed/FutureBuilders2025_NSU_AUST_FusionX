
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, AlertCircle, Stethoscope, User as UserIcon, Lock, Mail, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsersRaw = localStorage.getItem('hillshield_accounts');
    const accounts: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    if (isSignUp) {
      // Create Account
      if (accounts.find(a => a.userId === userId)) {
        setError('এই ইউজার আইডি ইতিমধ্যে ব্যবহার করা হয়েছে।');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        userId: userId,
        password: password,
        name: name || 'ব্যবহারকারী',
        email: userId.includes('@') ? userId : '',
        role: 'citizen',
        medicalHistory: {
          bloodGroup: 'O+',
          allergies: [],
          conditions: [],
          medications: [],
          previousMedications: []
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
      };

      const updatedAccounts = [...accounts, newUser];
      localStorage.setItem('hillshield_accounts', JSON.stringify(updatedAccounts));
      onLogin(newUser);
    } else {
      // Login
      const user = accounts.find(a => a.userId === userId && a.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('ইউজার আইডি অথবা পাসওয়ার্ড সঠিক নয়।');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 border-4 border-indigo-900 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="p-5 bg-red-100 rounded-[2rem] mb-5 shadow-lg rotate-3 group">
            <Stethoscope className="w-12 h-12 text-red-600 -rotate-3 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter text-center">ডাক্তার আছে?</h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Doctor Ache?</p>
          <div className="w-12 h-1.5 bg-red-600 rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-[11px] text-red-600 font-bold">{error}</p>
            </div>
          )}

          {isSignUp && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পুরো নাম</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-medium"
                  placeholder="রহিম আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইউজার আইডি / ইমেইল</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-medium"
                placeholder="name@example.com"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-950 hover:bg-indigo-900 text-white font-black py-5 px-4 rounded-[1.5rem] shadow-xl transform active:scale-95 transition-all mt-8 text-lg border-b-4 border-black flex items-center justify-center space-x-3"
          >
            <span>{isSignUp ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-indigo-600 font-black hover:underline text-sm uppercase tracking-tighter"
          >
            {isSignUp ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন' : "নতুন ব্যবহারকারী? অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </div>

        <div className="mt-8 p-5 bg-indigo-50/50 rounded-[2rem] flex items-start space-x-3 border border-indigo-100 border-dashed">
          <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-900 font-bold leading-relaxed uppercase tracking-tight">
            আপনার তথ্যের সুরক্ষা আমাদের অগ্রাধিকার। দুর্যোগকালীন অ্যাক্সেসের জন্য সঠিক তথ্য প্রদান করুন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
