import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { donationAPI } from '../services/api';
import {
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Building2,
  History,
  ArrowLeft,
  Search,
  CalendarDays,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  Pending: {
    color: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
    dot: '🟡',
    label: 'Pending',
    glow: 'hover:border-amber-500/20'
  },
  Reserved: {
    color: 'bg-sky-950/80 text-sky-400 border-sky-500/30',
    dot: '🔵',
    label: 'Reserved',
    glow: 'hover:border-sky-500/20'
  },
  Collected: {
    color: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
    dot: '🟢',
    label: 'Collected',
    glow: 'hover:border-emerald-500/20'
  }
};

export function DonationHistoryPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    donationAPI.getMyDonations()
      .then(res => setDonations(res.donations || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = donations
    .filter(d => filter === 'All' || d.status === filter)
    .filter(d => !search || d.foodName.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    All: donations.length,
    Pending: donations.filter(d => d.status === 'Pending').length,
    Reserved: donations.filter(d => d.status === 'Reserved').length,
    Collected: donations.filter(d => d.status === 'Collected').length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-slate-800 pb-6 space-y-1"
        >
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>My Donation Records</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Donation History</h1>
          <p className="text-slate-400 text-sm">Complete record of all your posted surplus food donations.</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          {/* Status Tabs */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {['All', 'Pending', 'Reserved', 'Collected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === s
                    ? s === 'Pending' ? 'bg-amber-500 text-slate-950'
                      : s === 'Reserved' ? 'bg-sky-500 text-slate-950'
                      : s === 'Collected' ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-100 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{s}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${filter === s ? 'bg-black/20' : 'bg-slate-800 text-slate-400'}`}>
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search donations..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-all"
            />
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3">
                <div className="h-40 bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 space-y-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-slate-700" />
            </div>
            <div>
              <p className="text-slate-300 text-lg font-semibold">
                {donations.length === 0 ? 'No donations yet' : 'No matching donations'}
              </p>
              <p className="text-slate-500 text-sm">
                {donations.length === 0 ? 'Start by posting your first food donation.' : 'Try a different filter or search term.'}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => {
              const sc = statusConfig[item.status] || statusConfig.Pending;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-5 rounded-2xl bg-slate-900/80 border border-slate-800 ${sc.glow} transition-all space-y-4 group hover:-translate-y-0.5`}
                >
                  {/* Image */}
                  {item.image && (
                    <div className="h-40 rounded-xl overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.foodName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    </div>
                  )}

                  {/* Status + Type */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${item.foodType === 'Veg' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' : 'bg-amber-950/60 text-amber-400 border border-amber-900'}`}>
                      {item.foodType === 'Veg' ? '🟢' : '🔴'} {item.foodType}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.color}`}>
                      {sc.dot} {sc.label}
                    </span>
                  </div>

                  {/* Name + Qty */}
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">{item.foodName}</h4>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">📦 {item.quantity}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deadline: {new Date(item.pickupDeadline).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                      <span>Posted: {new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    {item.ngoName && (
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-teal-300">Reserved by: {item.ngoName}</span>
                      </div>
                    )}
                  </div>

                  {/* Freshness */}
                  {item.freshnessEstimate && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/30 flex items-start space-x-2 text-[11px] text-emerald-300">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.freshnessEstimate}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
