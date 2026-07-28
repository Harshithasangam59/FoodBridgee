import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  UserCheck
} from 'lucide-react';

export function AvailableDonationsPage() {
  const { user, isNgo } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [reservingId, setReservingId] = useState(null);

  const fetchAvailable = () => {
    setLoading(true);
    donationAPI.getAvailableDonations({ search: searchQuery, foodType: foodTypeFilter })
      .then((res) => setDonations(res.donations || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAvailable();
  }, [foodTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAvailable();
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
      addToast('Donation reserved successfully! View in your NGO Dashboard.', 'success');
      fetchAvailable();
    } catch (err) {
      addToast(err.message || 'Failed to reserve donation.', 'error');
    } finally {
      setReservingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>Real-Time Surplus Listings</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Available Food Donations</h1>
            <p className="text-slate-400 text-sm mt-1">
              Surplus meals listed by local donors. Sorted by nearest pickup deadline first.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Filter Type:</span>
            {['All', 'Veg', 'Non-Veg'].map((type) => (
              <button
                key={type}
                onClick={() => setFoodTypeFilter(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  foodTypeFilter === type
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl flex gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by food name or location (e.g. Biryani, Hyderabad, Guntur)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-emerald-400 transition-colors"
          >
            Search
          </button>
        </form>

        {/* DONATION CARDS LIST */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Searching available donations...</div>
        ) : donations.length === 0 ? (
          <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <Utensils className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-base">No available donations match your search criteria right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col justify-between backdrop-blur-md group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.foodName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/90 text-emerald-300 border border-emerald-500/30">
                        {item.foodType}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                        🟡 Pending Pickup
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">{item.foodName}</h3>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">Quantity: {item.quantity}</p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description || 'Surplus prepared food packaged safely for NGO collection.'}
                    </p>

                    <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Donor: <strong>{item.donorName}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Deadline: {new Date(item.pickupDeadline).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* AI Freshness Estimate */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 flex items-start space-x-2.5 text-xs text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.freshnessEstimate}</span>
                    </div>

                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800">
                  <button
                    onClick={() => handleReserve(item.id)}
                    disabled={reservingId === item.id}
                    className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{reservingId === item.id ? 'Reserving...' : 'Reserve Donation'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
