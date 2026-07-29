import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Utensils,
  Search,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  Filter,
  ShieldCheck,
  LogIn,
  Leaf,
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';

export function AvailableDonationsPage() {
  const { user, isNgo } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [reservingId, setReservingId] = useState(null);

  const fetchAvailable = (sq = searchQuery, ft = foodTypeFilter, loc = locationFilter) => {
    setLoading(true);
    donationAPI.getAvailableDonations({ search: sq, foodType: ft, location: loc })
      .then(res => setDonations(res.donations || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAvailable('', 'All'); }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAvailable();
  };

  const handleTypeFilter = (type) => {
    setFoodTypeFilter(type);
    fetchAvailable(searchQuery, type);
  };

  const handleReserve = async (donationId) => {
    if (!user) {
      addToast('Please sign in as an NGO to reserve food donations.', 'error');
      navigate('/login');
      return;
    }
    if (!isNgo) {
      addToast('Only registered NGO accounts can reserve food donations.', 'error');
      return;
    }
    try {
      setReservingId(donationId);
      await donationAPI.reserveDonation(donationId);
      addToast('Donation reserved successfully! 🎉 View in your NGO Dashboard.', 'success');
      fetchAvailable();
    } catch (err) {
      addToast(err.message || 'Failed to reserve donation.', 'error');
    } finally {
      setReservingId(null);
    }
  };

  const getDeadlineUrgency = (deadline) => {
    const hours = (new Date(deadline) - new Date()) / 3600000;
    if (hours <= 2) return { color: 'text-red-400', bg: 'bg-red-950/50 border-red-800/50', label: '🔴 Urgent' };
    if (hours <= 5) return { color: 'text-amber-400', bg: 'bg-amber-950/50 border-amber-800/50', label: '🟡 Soon' };
    return { color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-900/30', label: '🟢 Fresh' };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6"
        >
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>Real-Time Surplus Listings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Available Food Donations</h1>
            <p className="text-slate-400 text-sm mt-1">
              Surplus meals from local donors. Sorted by nearest pickup deadline first.
            </p>
          </div>

          {/* NGO Status Badge */}
          {user && isNgo && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-950/40 border border-teal-500/20 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified NGO — Reservation Enabled</span>
            </div>
          )}
          {!user && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs">
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Sign in as NGO to reserve donations</span>
            </div>
          )}
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-3"
        >
          <form onSubmit={handleSearchSubmit} className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search food name or description..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm transition-all"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={locationFilter || ''}
                onChange={e => { setLocationFilter(e.target.value); fetchAvailable(searchQuery, foodTypeFilter, e.target.value); }}
                placeholder="Filter Location..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-emerald-400 transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Type Filters */}
          <div className="flex items-center space-x-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            {['All', 'Veg', 'Non-Veg'].map(type => (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  foodTypeFilter === type
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <div className="text-xs text-slate-500">
            Found <span className="text-emerald-400 font-bold">{donations.length}</span> available donation{donations.length !== 1 ? 's' : ''} sorted by nearest deadline
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-800" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                  <div className="h-10 bg-slate-800 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : donations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 space-y-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
              <Utensils className="w-10 h-10 text-slate-700" />
            </div>
            <div>
              <p className="text-slate-300 text-lg font-semibold">No donations available right now</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or check back soon.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {donations.map((item, i) => {
                const urgency = getDeadlineUrgency(item.pickupDeadline);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col group backdrop-blur-md shadow-lg hover:shadow-emerald-900/20 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="h-48 relative overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={item.image}
                        alt={item.foodName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.foodType === 'Veg' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/50' : 'bg-amber-950/90 text-amber-300 border border-amber-700/50'}`}>
                          {item.foodType === 'Veg' ? '🟢' : '🔴'} {item.foodType}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${urgency.bg} ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3 flex-1">
                      <div>
                        <h3 className="text-lg font-extrabold text-white leading-tight">{item.foodName}</h3>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">📦 {item.quantity}</p>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description || 'Surplus prepared food packaged safely for NGO collection.'}
                      </p>

                      <div className="space-y-1.5 text-xs border-t border-slate-800/80 pt-3">
                        <div className="flex items-center space-x-2 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>By: <strong className="text-white">{item.donorName}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className={`flex items-center space-x-2 font-semibold ${urgency.color}`}>
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Pickup by: {new Date(item.pickupDeadline).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                      </div>

                      {/* AI Freshness */}
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 flex items-start space-x-2 text-xs text-emerald-300">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item.freshnessEstimate}</span>
                      </div>
                    </div>

                    {/* Reserve Button */}
                    <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                      <button
                        onClick={() => handleReserve(item.id)}
                        disabled={reservingId === item.id}
                        className="btn-emerald w-full py-3 rounded-xl font-bold disabled:opacity-60 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm"
                      >
                        {reservingId === item.id ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full" />
                            <span>Reserving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{user && isNgo ? 'Reserve Donation' : 'Sign in to Reserve'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
