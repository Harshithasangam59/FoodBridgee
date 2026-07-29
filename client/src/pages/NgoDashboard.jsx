import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  Utensils,
  Clock,
  CheckCircle2,
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Package,
  Leaf,
  TrendingUp,
  Calendar
} from 'lucide-react';

function parseMealCount(q) {
  if (!q) return 10;
  const m = q.match(/\d+/);
  return m ? parseInt(m[0], 10) : 10;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } })
};

export function NgoDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('reserved');

  const fetchNgoData = () => {
    setLoading(true);
    donationAPI.getNgoDashboard()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNgoData(); }, []);

  const handleMarkCollected = async (donationId) => {
    try {
      setActionLoading(donationId);
      await donationAPI.markCollected(donationId);
      addToast('Donation marked as collected! Thank you for reducing food waste. 🌱', 'success');
      fetchNgoData();
    } catch (err) {
      addToast(err.message || 'Failed to update collection status.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const totalMeals = [...(data?.reserved || []), ...(data?.collected || [])].reduce((acc, d) => acc + parseMealCount(d.quantity), 0);
  const co2Saved = Math.round(totalMeals * 2.5);

  const tabs = [
    { id: 'reserved', label: 'Active Reservations', count: data?.reserved?.length || 0, color: 'sky' },
    { id: 'collected', label: 'Collected', count: data?.collected?.length || 0, color: 'emerald' },
    { id: 'available', label: 'Available Now', count: data?.counts?.available || 0, color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-900/40 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>NGO Dispatch Center</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                Welcome, <span className="text-teal-400">{user?.name?.split(' ')[0]}</span>! 🤝
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                Reserve available food donations from local donors, track pickup deadlines, and record successful distributions.
              </p>
            </div>
            <Link
              to="/available"
              className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-xl shadow-teal-500/20 transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Browse Available Food</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Available Near You', value: data?.counts?.available || 0, sub: 'Ready for instant reservation', icon: Utensils, colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10 text-amber-400', borderClass: 'border-amber-900/30' },
            { label: 'Reserved (Pending Pickup)', value: data?.counts?.reserved || 0, sub: 'Claimed by your NGO', icon: Clock, colorClass: 'text-sky-400', bgClass: 'bg-sky-500/10 text-sky-400', borderClass: 'border-sky-900/30' },
            { label: 'Collected & Distributed', value: data?.counts?.collected || 0, sub: 'Successfully fed people', icon: CheckCircle2, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 text-emerald-400', borderClass: 'border-emerald-900/30' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`p-6 rounded-2xl bg-slate-900/80 border ${card.borderClass} backdrop-blur-sm transition-all group hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold uppercase ${card.colorClass}`}>{card.label}</span>
                  <div className={`p-2 rounded-xl ${card.bgClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`text-4xl font-extrabold ${card.colorClass}`}>
                  {loading ? <div className="h-10 w-12 bg-slate-800 rounded animate-pulse" /> : (data ? card.value : 0)}
                </div>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Impact Summary */}
        {!loading && data && (data.counts?.collected > 0 || data.counts?.reserved > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-900/30 flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase text-emerald-400">Your NGO's Cumulative Impact</span>
            </div>
            <div className="flex flex-wrap gap-6 text-center ml-auto">
              <div>
                <div className="text-xl font-extrabold text-emerald-400">{totalMeals}</div>
                <div className="text-xs text-slate-400">Meals Saved</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-teal-400">{co2Saved} kg</div>
                <div className="text-xs text-slate-400">CO₂ Offset</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{data.counts?.collected || 0}</div>
                <div className="text-xs text-slate-400">Pickups Done</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 -mb-px text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? tab.color === 'sky' ? 'border-sky-400 text-sky-300'
                    : tab.color === 'emerald' ? 'border-emerald-400 text-emerald-300'
                    : 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                tab.color === 'sky' ? 'bg-sky-950 text-sky-400'
                  : tab.color === 'emerald' ? 'bg-emerald-950 text-emerald-400'
                  : 'bg-amber-950 text-amber-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Reserved Tab */}
          {activeTab === 'reserved' && (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                      <div className="h-3 bg-slate-800 rounded w-2/3" />
                      <div className="h-10 bg-slate-800 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : !data?.reserved || data.reserved.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium">No active reservations</p>
                    <p className="text-slate-500 text-sm">Reserve available food items now to feed your community.</p>
                  </div>
                  <Link
                    to="/available"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors text-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>Browse Available Donations</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.reserved.map((item, i) => (
                    <motion.div
                      key={item.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-5 rounded-2xl bg-slate-900 border border-sky-900/30 space-y-4 flex flex-col justify-between hover:border-sky-500/30 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${item.foodType === 'Veg' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/60 text-amber-400'}`}>
                            {item.foodType}
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30">
                            🔵 Reserved
                          </span>
                        </div>

                        {item.image && (
                          <div className="h-36 rounded-xl overflow-hidden">
                            <img src={item.image} alt={item.foodName} className="w-full h-full object-cover opacity-80"
                              onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        )}

                        <h4 className="text-lg font-bold text-white">{item.foodName}</h4>
                        <p className="text-xs font-semibold text-emerald-400">Quantity: {item.quantity}</p>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Donor: <strong className="text-white">{item.donorName}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>Pickup by: {new Date(item.pickupDeadline).toLocaleString()}</span>
                          </div>
                        </div>

                        {item.freshnessEstimate && (
                          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 flex items-start space-x-2.5 text-xs text-emerald-300">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item.freshnessEstimate}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleMarkCollected(item.id)}
                        disabled={actionLoading === item.id}
                        className="btn-emerald w-full py-3 rounded-xl font-bold disabled:opacity-60 transition-all flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{actionLoading === item.id ? 'Marking Collected...' : '✓ Mark as Collected'}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collected Tab */}
          {activeTab === 'collected' && (
            <div>
              {!data?.collected || data.collected.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-slate-400 text-sm">No collected donations yet. Start reserving and collecting food!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.collected.map((item, i) => (
                    <motion.div
                      key={item.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-4 rounded-2xl bg-slate-900 border border-emerald-900/30 space-y-3"
                    >
                      {item.image && (
                        <div className="h-28 rounded-xl overflow-hidden">
                          <img src={item.image} alt={item.foodName} className="w-full h-full object-cover opacity-70"
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">{item.foodType}</span>
                        <span className="text-[10px] font-bold text-emerald-400">🟢 Collected</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.foodName}</h4>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <Utensils className="w-3 h-3 text-emerald-400" />
                          <span>{item.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="w-3 h-3 text-emerald-400" />
                          <span>{item.donorName}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Available Tab */}
          {activeTab === 'available' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Utensils className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-400">{data?.counts?.available || 0}</p>
                <p className="text-slate-300 font-medium">Donations Available Right Now</p>
                <p className="text-slate-500 text-sm">Browse and reserve surplus food from local donors.</p>
              </div>
              <Link
                to="/available"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg"
              >
                <Search className="w-5 h-5" />
                <span>Browse All Available Food</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
