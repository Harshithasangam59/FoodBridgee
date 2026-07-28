import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartHandshake, LogIn, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter your email and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      
      if (res.user.role === 'donor') {
        navigate('/dashboard');
      } else if (res.user.role === 'ngo') {
        navigate('/available');
      } else {
        navigate('/');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'donor') {
      setEmail('donor@foodbridge.org');
      setPassword('password123');
    } else {
      setEmail('ngo@foodbridge.org');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8 bg-slate-900/80 p-8 rounded-3xl border border-emerald-900/40 shadow-2xl backdrop-blur-md">
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20 mb-4">
            <HeartHandshake className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign In to FoodBridge</h2>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Enter your details below.
          </p>
        </div>

        {/* Demo Quick Logins */}
        <div className="bg-slate-955 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <span className="block text-[11px] font-semibold uppercase text-emerald-400 tracking-wider text-center">
            Quick Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('donor')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950/60 text-slate-200 border border-slate-700 hover:border-emerald-500/40 transition-colors flex items-center justify-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo Donor</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('ngo')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-teal-950/60 text-slate-200 border border-slate-700 hover:border-teal-500/40 transition-colors flex items-center justify-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Demo NGO</span>
            </button>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-slate-950 font-bold bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
            Register as Donor or NGO
          </Link>
        </div>

      </div>
    </div>
  );
}
