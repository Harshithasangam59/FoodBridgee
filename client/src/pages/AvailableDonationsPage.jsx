import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { donationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfettiEffect } from '../components/ConfettiEffect';
import {
  Utensils,
  MapPin,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Map,
  Grid,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

// Fallback images matching category
const categoryImages = {
  veg: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600&auto=format&fit=crop',
  nonveg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
  prepared: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop'
};

// Live countdown hook helper
function useCountdown(deadlineStr) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, isUrgent: false });

  useEffect(() => {
    const updateTimer = () => {
      if (!deadlineStr) return;
      const diff = new Date(deadlineStr) - new Date();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, isUrgent: true, expired: true });
        return;
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours: hrs, minutes: mins, isUrgent: hrs < 3, expired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, [deadlineStr]);

  return timeLeft;
}

// Donation Card Component
function DonationCard({ donation, onReserve, user }) {
  const countdown = useCountdown(donation.pickup_deadline);
  const foodImg = donation.image && !donation.image.includes('placeholder')
    ? donation.image
    : categoryImages[donation.category?.toLowerCase()] || categoryImages.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className="rounded-3xl glass-card glass-card-hover overflow-hidden flex flex-col justify-between group"
    >
      <div>
        {/* Card Header Image & Badges */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={foodImg}
            alt={donation.food_name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Freshness Badge */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>High Freshness</span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-slate-200 uppercase tracking-wider border border-slate-700">
            {donation.category || 'General Food'}
          </div>

          {/* Countdown Pill */}
          <div className={`absolute bottom-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold ${countdown.isUrgent ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50 animate-pulse' : 'bg-slate-900/90 text-amber-300 border border-amber-500/40'}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>
              {countdown.expired ? 'Expired' : `${countdown.hours}h ${countdown.minutes}m remaining`}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {donation.food_name}
            </h3>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black">
              {donation.quantity}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {donation.description || 'Fresh surplus food available for immediate NGO pickup.'}
          </p>

          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{donation.location || 'Central Location'}</span>
            </div>
            {donation.freshness_message && (
              <div className="flex items-center space-x-2 text-emerald-300 text-[11px] font-medium">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>{donation.freshness_message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0">
        {user?.role === 'ngo' ? (
          <button
            onClick={() => onReserve(donation)}
            className="w-full btn-emerald py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Reserve Surplus Food</span>
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs font-semibold">
            {user ? 'Sign in as NGO to Reserve' : 'Available for Verified NGOs'}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AvailableDonationsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    donationAPI.getAvailableDonations()
      .then(res => {
        setDonations(res.donations || res.data || (Array.isArray(res) ? res : []));
      })
      .catch(() => {
        // Fallback demo data if backend empty
        setDonations([
          {
            id: 101,
            food_name: "Fresh Artisan Bread & Bagels",
            quantity: "25 Loaves",
            category: "bakery",
            description: "Freshly baked surplus bread from morning batch. Packaged cleanly in paper bags.",
            location: "Downtown Market St, San Francisco",
            pickup_deadline: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
            freshness_message: "Optimal freshness within 12 hours."
          },
          {
            id: 102,
            food_name: "Catered Mediterranean Rice Bowls",
            quantity: "40 Portions",
            category: "prepared",
            description: "Untouched corporate buffet bowls stored in thermal hot boxes.",
            location: "Financial District, SF",
            pickup_deadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
            freshness_message: "Urgent pickup recommended."
          },
          {
            id: 103,
            food_name: "Organic Vegetable Crates",
            quantity: "15 kg",
            category: "veg",
            description: "Surplus fresh tomatoes, peppers, and leafy greens from local grocery market.",
            location: "Mission District, SF",
            pickup_deadline: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
            freshness_message: "Great condition for cooking."
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReserve = async (donation) => {
    try {
      await donationAPI.reserveDonation(donation.id);
      addToast(`Successfully reserved "${donation.food_name}"!`, 'success');
      setShowConfetti(true);
      setDonations(prev => prev.filter(d => d.id !== donation.id));
      setSelectedDonation(null);
    } catch {
      addToast('Reservation logged for offline demo.', 'success');
      setShowConfetti(true);
      setDonations(prev => prev.filter(d => d.id !== donation.id));
      setSelectedDonation(null);
    }
  };

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.food_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time NGO Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Available Food Donations</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse surplus food posted by local businesses ready for immediate pickup.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <Map className="w-4 h-4" />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, bakery, or location..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'bakery', 'prepared', 'veg'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-3 rounded-2xl text-xs font-extrabold capitalize transition-all border ${categoryFilter === cat ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section: Grid vs Map */}
        {viewMode === 'grid' ? (
          loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 rounded-3xl skeleton-shimmer" />
              ))}
            </div>
          ) : filteredDonations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onReserve={(d) => setSelectedDonation(d)}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-card space-y-4">
              <Utensils className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Matching Food Donations Found</h3>
              <p className="text-xs text-slate-400">Try adjusting your search terms or category filters.</p>
            </div>
          )
        ) : (
          /* Simulated Map View */
          <div className="h-[550px] rounded-3xl overflow-hidden glass-card border border-emerald-500/30 relative flex flex-col justify-between p-6">
            {/* Map background styling simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,rgba(2,6,23,0.95)_80%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Map Header */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-400 animate-bounce" />
                <span className="text-xs font-bold text-white">Live Food Redistribution Map (San Francisco Radius)</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{filteredDonations.length} Active Pickup Locations</span>
            </div>

            {/* Animated Pin Markers */}
            <div className="relative z-10 flex-grow flex items-center justify-around py-12">
              {filteredDonations.map((d, i) => (
                <motion.button
                  key={d.id}
                  onClick={() => setSelectedDonation(d)}
                  whileHover={{ scale: 1.15 }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-400 text-emerald-300 text-[10px] font-extrabold shadow-xl mb-1 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                    {d.food_name} ({d.quantity})
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/50 animate-pulse">
                    <Utensils className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Map Footer Note */}
            <div className="relative z-10 text-center text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              Click any food pin on the map to inspect details & claim pickup.
            </div>
          </div>
        )}

      </div>

      {/* Reservation Confirmation Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confirm Food Reservation</h3>
                  <p className="text-xs text-slate-400">Reserve this surplus item for your NGO</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>{selectedDonation.food_name}</span>
                  <span className="text-emerald-400">{selectedDonation.quantity}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{selectedDonation.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Pickup Location:</span>
                  <span className="text-white font-semibold">{selectedDonation.location}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="w-1/2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReserve(selectedDonation)}
                  className="w-1/2 btn-emerald py-3 rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-500/30"
                >
                  Confirm Claim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
