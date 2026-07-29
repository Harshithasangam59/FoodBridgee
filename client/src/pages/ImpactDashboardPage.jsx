import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { impactAPI } from '../services/api';
import {
  Leaf,
  BarChart3,
  Globe,
  Award,
  TrendingUp,
  Droplets,
  TreePine,
  Car,
  Utensils,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const monthlyImpactData = [
  { month: 'Jan', meals: 120, co2: 300 },
  { month: 'Feb', meals: 210, co2: 525 },
  { month: 'Mar', meals: 340, co2: 850 },
  { month: 'Apr', meals: 480, co2: 1200 },
  { month: 'May', meals: 650, co2: 1625 },
  { month: 'Jun', meals: 920, co2: 2300 },
  { month: 'Jul', meals: 1250, co2: 3125 }
];

export function ImpactDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalMealsDonated: 1250,
    co2SavedKg: 3125,
    ngosConnected: 50
  });

  useEffect(() => {
    impactAPI.getMetrics()
      .then(res => {
        if (res.metrics) setMetrics(res.metrics);
      })
      .catch(() => {});
  }, []);

  const treesPlantedEquivalent = Math.round(metrics.co2SavedKg / 20);
  const carKmPrevented = Math.round(metrics.co2SavedKg * 4.2);
  const waterSavedLiters = Math.round(metrics.totalMealsDonated * 180);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-extrabold border border-emerald-500/40">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Environmental Transparency Index</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Global Impact Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time tracking of meals saved from landfills and environmental emissions prevented.
          </p>
        </div>

        {/* Environmental Equivalents Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TreePine className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Trees Saved Equivalent</span>
            <h3 className="text-3xl font-black text-emerald-400">≈ {treesPlantedEquivalent} Trees</h3>
            <p className="text-[11px] text-slate-400">Annual CO₂ absorption equivalent</p>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Car Miles Avoided</span>
            <h3 className="text-3xl font-black text-teal-400">≈ {carKmPrevented} km</h3>
            <p className="text-[11px] text-slate-400">Vehicle emissions prevented</p>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Water Saved</span>
            <h3 className="text-3xl font-black text-sky-400">≈ {waterSavedLiters.toLocaleString()} L</h3>
            <p className="text-[11px] text-slate-400">Embedded agricultural water saved</p>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Meals Saved</span>
            <h3 className="text-3xl font-black text-amber-400">{metrics.totalMealsDonated.toLocaleString()}+</h3>
            <p className="text-[11px] text-slate-400">Redirected to local shelters</p>
          </div>
        </div>

        {/* Visual Recharts Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Cumulative Meals Saved (2026 Growth)</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyImpactData}>
                  <defs>
                    <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="meals" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorMeals)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-teal-400" />
              <span>CO₂ Emissions Prevented (kg)</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyImpactData}>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  <Bar dataKey="co2" fill="#2dd4bf" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
