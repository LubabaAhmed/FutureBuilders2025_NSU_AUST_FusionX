
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, AlertCircle } from 'lucide-react';

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
      name: name || 'Emergency Responder',
      email,
      role: 'citizen'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-red-100 rounded-full mb-4">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">HillShield</h1>
          <p className="text-slate-500 text-center mt-2">Disaster Resilient Communication for Rural Regions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-slate-100 border-transparent focus:border-red-500 focus:bg-white focus:ring-0 rounded-xl transition-all"
                placeholder="Rahim Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email / Phone</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-100 border-transparent focus:border-red-500 focus:bg-white focus:ring-0 rounded-xl transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-100 border-transparent focus:border-red-500 focus:bg-white focus:ring-0 rounded-xl transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform active:scale-95 transition-all mt-6"
          >
            {isSignUp ? 'Create Account' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-red-600 font-semibold hover:underline"
          >
            {isSignUp ? 'Already have an account? Log in' : "New to HillShield? Create account"}
          </button>
        </div>

        <div className="mt-6 p-3 bg-amber-50 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Registration ensures responders can reach you faster during SOS emergencies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
