import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartHandshake, User, Mail, Lock, Building2, Utensils, ArrowRight } from 'lucide-react';

export function SignupPage() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'ngo' || roleParam === 'donor') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      addToast('Please fill in all registration fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await register({ name, email, password, role });
      addToast(`Account created successfully! Welcome to FoodBridge, ${res.user.name}.`, 'success');
      
      if (res.user.role === 'donor') {
        navigate('/dashboard');
      } else {
        navigate('/available');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8 bg-slate-900/80 p-8 rounded-3xl border border-emerald-900/40 shadow-2xl backdrop-blur-md">
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20 mb-4">
            <HeartHandshake className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Join FoodBridge</h2>
          <p className="mt-2 text-sm text-slate-400">
            Create an account to donate or receive surplus food.
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === 'donor'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Food Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ngo')}
                className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === 'ngo'
                    ? 'bg-teal-950/80 border-teal-500 text-teal-300 shadow-md shadow-teal-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>NGO Partner</span>
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              {role === 'donor'
                ? 'For Restaurants, Bakeries, Hotels, Supermarkets, Caterers & Individuals.'
                : 'For Verified NGOs, Non-Profits, Shelters & Community Kitchens.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {role === 'donor' ? 'Organization / Donor Name' : 'NGO / Organization Name'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'donor' ? 'e.g. Green Bakery & Restaurant' : 'e.g. Hope Foundation NGO'}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>

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
                placeholder="contact@org.com"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
