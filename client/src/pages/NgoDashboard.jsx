import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';

export function NgoDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchNgoData = () => {
    donationAPI.getNgoDashboard()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNgoData();
  }, []);

  const handleMarkCollected = async (donationId) => {
    try {
      setActionLoading(donationId);
      await donationAPI.markCollected(donationId);
      addToast('Donation marked as collected! Thank you for reducing food waste.', 'success');
      fetchNgoData();
    } catch (err) {
      addToast(err.message || 'Failed to update collection status.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>NGO Dispatch Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome, {user?.name}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Reserve available food donations from local donors, track pickup deadlines, and record successful distributions.
            </p>
          </div>

          <Link
            to="/available"
            className="px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
          >
            <Search className="w-5 h-5" />
            <span>Browse Available Food</span>
          </Link>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-amber-400">Available Near You</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Utensils className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{data?.counts?.available || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Ready for instant reservation</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-sky-400">Reserved (Pending Pickup)</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-sky-400">{data?.counts?.reserved || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Claimed by your NGO</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400">Collected & Distributed</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{data?.counts?.collected || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Successfully fed people</p>
          </div>

        </div>

        {/* ACTIVE RESERVATIONS SECTION */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-white">Active Reservations</h3>
              <p className="text-xs text-slate-400">Items reserved by your NGO awaiting physical collection</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30">
              🔵 Reserved ({data?.reserved?.length || 0})
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading active reservations...</div>
          ) : !data?.reserved || data.reserved.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">No active pending pickups. Reserve available food items now.</p>
              <Link
                to="/available"
                className="inline-block px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-teal-400 text-xs"
              >
                Browse Available Donations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.reserved.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-teal-400 border border-teal-900/40">
                        {item.foodType}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30">
                        🔵 Reserved
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">{item.foodName}</h4>
                    <p className="text-xs font-semibold text-emerald-400">Quantity: {item.quantity}</p>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2">
                      <div className="flex items-center space-x-2 text-slate-400">
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

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 text-xs text-emerald-300 italic">
                      💡 {item.freshnessEstimate}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkCollected(item.id)}
                    disabled={actionLoading === item.id}
                    className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all flex items-center justify-center space-x-2 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionLoading === item.id ? 'Marking Collected...' : 'Mark Collected'}</span>
                  </button>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
