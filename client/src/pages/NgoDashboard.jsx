import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';
import {
  Search,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Utensils,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';

export function NgoDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalReceived: 180, pending: 12 });

  useEffect(() => {
    donationAPI.getNgoDashboard()
      .then(res => setStats(res))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-950/90 via-slate-900 to-emerald-950/90 border border-teal-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified NGO Partner</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Welcome, {user?.name || 'NGO Partner'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              You have claimed and distributed over <span className="text-emerald-400 font-bold">{stats.totalReceived || 180} meals</span> to families in need!
            </p>
          </div>

          <Link to="/available" className="btn-emerald px-6 py-3.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-emerald-500/30">
            <Search className="w-4 h-4" />
            <span>Browse Available Food</span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card space-y-2">
            <Utensils className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="text-xs font-bold uppercase text-slate-400">Total Meals Received</span>
            <h3 className="text-3xl font-black text-white">{stats.totalReceived || 180}</h3>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-2">
            <Clock className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-xs font-bold uppercase text-slate-400">Active Reservations</span>
            <h3 className="text-3xl font-black text-amber-400">{stats.pending || 12}</h3>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-2">
            <ShieldCheck className="w-8 h-8 text-teal-400 mb-2" />
            <span className="text-xs font-bold uppercase text-slate-400">Compliance Rating</span>
            <h3 className="text-3xl font-black text-teal-400">100% Verified</h3>
          </div>
        </div>

      </div>
    </div>
  );
}
