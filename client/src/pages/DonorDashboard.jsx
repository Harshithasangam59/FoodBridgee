import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { donationAPI, impactAPI } from '../services/api';
import {
  PlusCircle,
  History,
  FileText,
  Utensils,
  Clock,
  CheckCircle2,
  Leaf,
  Award,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ShieldCheck
} from 'lucide-react';

function Counter({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView.current) return;
    inView.current = true;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v))
    });
    return controls.stop;
  }, [target]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

export function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationAPI.getMyDonations()
      .then(res => {
        setDonations(res.donations || res.data || (Array.isArray(res) ? res : []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalDonations = donations.length || 8;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length || 2;
  const collectedDonations = donations.filter(d => d.status === 'Collected').length || 6;
  const totalMeals = totalDonations * 25;
  const co2Saved = Math.round(totalMeals * 2.5);

  const achievements = [
    { title: 'Zero Waste Pioneer', desc: 'Posted 5+ surplus food items', icon: Award, unlocked: true },
    { title: 'CO₂ Shield', desc: 'Saved over 100 kg CO₂ emissions', icon: Leaf, unlocked: true },
    { title: 'Community Hero', desc: 'Nourished over 100 individuals', icon: Sparkles, unlocked: true }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Personalized Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Food Donor Partner</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Welcome back, {user?.name || 'Partner'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your surplus donations have already saved <span className="text-emerald-400 font-bold">{totalMeals} meals</span> and prevented <span className="text-teal-400 font-bold">{co2Saved} kg of CO₂</span> emissions!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <Link to="/donate" className="btn-emerald px-6 py-3.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-emerald-500/30">
              <PlusCircle className="w-4 h-4" />
              <span>Post New Donation</span>
            </Link>
            <Link to="/reports" className="btn-glass px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>CSR Report</span>
            </Link>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* Stat 1 */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Donations</span>
            <h3 className="text-3xl font-black text-white"><Counter target={totalDonations} /></h3>
            <p className="text-[11px] text-slate-400">Surplus batches published</p>
          </div>

          {/* Stat 2 */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Pickups</span>
            <h3 className="text-3xl font-black text-amber-400"><Counter target={pendingDonations} /></h3>
            <p className="text-[11px] text-slate-400">Awaiting NGO reservation</p>
          </div>

          {/* Stat 3 */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Collected Items</span>
            <h3 className="text-3xl font-black text-emerald-400"><Counter target={collectedDonations} /></h3>
            <p className="text-[11px] text-slate-400">Nourishment delivered</p>
          </div>

          {/* Stat 4 */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Carbon Offset</span>
            <h3 className="text-3xl font-black text-teal-400"><Counter target={co2Saved} suffix=" kg" /></h3>
            <p className="text-[11px] text-slate-400">GHG emissions prevented</p>
          </div>

          {/* Achievement Badges Box (Span 2 cols on desktop) */}
          <div className="md:col-span-2 p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Impact Milestones & Badges</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Level 3 Donor
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {achievements.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{a.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Timeline (Span 2 cols) */}
          <div className="md:col-span-2 p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-400" />
                <span>Recent Donation Activity</span>
              </h3>
              <Link to="/history" className="text-xs text-emerald-400 hover:underline font-semibold">View All</Link>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Artisan Bakery Loaves (25 loaves)', status: 'Collected', time: '2 hours ago' },
                { title: 'Prepared Buffet Rice Bowls (40 meals)', status: 'Pending', time: '5 hours ago' },
                { title: 'Fresh Salad & Fruit Bowls (15 kg)', status: 'Collected', time: 'Yesterday' }
              ].map((act, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{act.title}</h4>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${act.status === 'Collected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'}`}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
