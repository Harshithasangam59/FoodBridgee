import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { donationAPI, impactAPI } from '../services/api';
import { animate } from 'framer-motion';
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
  Users
} from 'lucide-react';

// Animated counter
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

function parseMealCount(quantityStr) {
  if (!quantityStr) return 10;
  const match = quantityStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

const statusConfig = {
  Pending: { color: 'bg-amber-950/80 text-amber-400 border-amber-500/30', dot: '🟡', label: 'Pending' },
  Reserved: { color: 'bg-sky-950/80 text-sky-400 border-sky-500/30', dot: '🔵', label: 'Reserved' },
  Collected: { color: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30', dot: '🟢', label: 'Collected' }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

export function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState(null);

  useEffect(() => {
    Promise.all([
      donationAPI.getMyDonations(),
      impactAPI.getMetrics().catch(() => null)
    ]).then(([donRes, impRes]) => {
      setDonations(donRes.donations || []);
      if (impRes) setImpactData(impRes.metrics);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length;
  const reservedDonations = donations.filter(d => d.status === 'Reserved').length;
  const collectedDonations = donations.filter(d => d.status === 'Collected').length;

  let estimatedMeals = 0;
  donations.forEach(d => { estimatedMeals += parseMealCount(d.quantity); });
  const co2Saved = Math.round(estimatedMeals * 2.5);

  const statsCards = [
    { label: 'Total Donations', value: totalDonations, sub: 'Surplus items posted', icon: Utensils, color: 'emerald' },
    { label: 'Pending', value: pendingDonations, sub: 'Awaiting NGO reservation', icon: Clock, color: 'amber', textColor: 'text-amber-400' },
    { label: 'Collected', value: collectedDonations, sub: 'Successfully delivered', icon: CheckCircle2, color: 'emerald' },
    { label: 'Est. Meals', value: estimatedMeals, sub: `≈ ${co2Saved} kg CO₂ saved`, icon: TrendingUp, color: 'teal', textColor: 'text-teal-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-900/40 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Leaf className="w-4 h-4" />
                <span>Donor Overview Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                Manage your food donations, track real-time reservations, and monitor your environmental impact.
              </p>
            </div>
            <Link
              to="/donate"
              className="btn-emerald shrink-0 px-6 py-3.5 rounded-xl font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Donate Surplus Food</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsCards.map((card, i) => {
            const Icon = card.icon;
            const iconBg = card.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                          card.color === 'teal' ? 'bg-teal-500/10 text-teal-400' :
                          'bg-emerald-500/10 text-emerald-400';
            const valColor = card.textColor || (card.color === 'emerald' ? 'text-white' : '');

            return (
              <motion.div
                key={card.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/20 backdrop-blur-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold uppercase ${card.textColor || 'text-slate-400'}`}>{card.label}</span>
                  <div className={`p-2 rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`text-3xl font-extrabold ${valColor}`}>
                  {loading ? <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" /> : <Counter target={card.value} />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { to: '/donate', icon: PlusCircle, label: 'Donate Food', desc: 'Post new surplus food items with location, photo, and pickup time.', color: 'emerald' },
            { to: '/history', icon: History, label: 'View History', desc: 'Check status of all posted donations (Pending, Reserved, Collected).', color: 'teal' },
            { to: '/reports', icon: FileText, label: 'CSR Reports', desc: 'Generate printable & PDF CSR audit reports for sustainability metrics.', color: 'emerald' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  to={item.to}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group flex items-start space-x-4 h-full"
                >
                  <div className={`p-3 rounded-xl ${item.color === 'teal' ? 'bg-teal-500/10 text-teal-400' : 'bg-emerald-500/10 text-emerald-400'} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-1">
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Donations</h3>
              <p className="text-xs text-slate-400">Your latest posted surplus items</p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
                <Utensils className="w-8 h-8 text-slate-700" />
              </div>
              <div>
                <p className="text-slate-300 font-medium">No donations yet</p>
                <p className="text-slate-500 text-sm">Post your first food donation to get started.</p>
              </div>
              <Link
                to="/donate"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post First Donation</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.slice(0, 6).map((item, i) => {
                const sc = statusConfig[item.status] || statusConfig.Pending;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/20 space-y-3 transition-colors group"
                  >
                    {/* Image if available */}
                    {item.image && (
                      <div className="h-32 rounded-xl overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.foodName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${item.foodType === 'Veg' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' : 'bg-amber-950/60 text-amber-400 border border-amber-900'}`}>
                        {item.foodType}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.color}`}>
                        {sc.dot} {sc.label}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight">{item.foodName}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Utensils className="w-3 h-3" />
                        <span>{item.quantity}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{item.location}</span>
                      </span>
                    </div>
                    {item.freshnessEstimate && (
                      <p className="text-[11px] text-emerald-300/90 italic bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/30 flex items-start space-x-1.5">
                        <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" />
                        <span>{item.freshnessEstimate}</span>
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Impact Summary */}
        {!loading && donations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-900/40">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Leaf className="w-4 h-4" />
                <span>Your Environmental Impact</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-extrabold text-emerald-400">{estimatedMeals}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Meals Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-teal-400">{co2Saved} kg</div>
                  <div className="text-xs text-slate-400 mt-0.5">CO₂ Offset</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{collectedDonations}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Completed</div>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <Award className="w-7 h-7 text-amber-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Generate CSR Report</h3>
                <p className="text-xs text-slate-400">Create a professional audit-ready report of your donations and environmental impact.</p>
              </div>
              <Link
                to="/reports"
                className="btn-emerald mt-4 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
