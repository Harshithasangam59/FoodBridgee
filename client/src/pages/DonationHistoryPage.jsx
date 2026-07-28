import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donationAPI } from '../services/api';
import { 
  History, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  PlusCircle, 
  Building2, 
  Calendar,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export function DonationHistoryPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    donationAPI.getMyDonations()
      .then((res) => setDonations(res.donations || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = donations.filter(d => {
    if (filterStatus === 'All') return true;
    return d.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              <span>Donation Tracking Log</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">My Food Donations</h1>
            <p className="text-slate-400 text-sm mt-1">
              Review history, pickup deadlines, AI freshness recommendations, and status updates.
            </p>
          </div>

          <Link
            to="/donate"
            className="px-5 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 text-sm flex items-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate New Surplus</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {['All', 'Pending', 'Reserved', 'Collected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {status === 'All' && 'All Donations'}
              {status === 'Pending' && '🟡 Pending'}
              {status === 'Reserved' && '🔵 Reserved'}
              {status === 'Collected' && '🟢 Collected'}
            </button>
          ))}
        </div>

        {/* CARDS LIST */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading donation history...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <History className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-base">No donations found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  {/* Image or Header graphic */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.foodName}
                      className="w-full h-full object-cover opacity-80"
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          item.status === 'Pending'
                            ? 'bg-amber-500/90 text-slate-950'
                            : item.status === 'Reserved'
                            ? 'bg-sky-500/90 text-slate-950'
                            : 'bg-emerald-500/90 text-slate-950'
                        }`}
                      >
                        {item.status === 'Pending' && '🟡 Pending'}
                        {item.status === 'Reserved' && '🔵 Reserved'}
                        {item.status === 'Collected' && '🟢 Collected'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">{item.foodName}</h3>
                      <p className="text-sm font-semibold text-emerald-400 mt-0.5">Quantity: {item.quantity}</p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description || 'Freshly prepared surplus food ready for immediate distribution.'}
                    </p>

                    <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Deadline: {new Date(item.pickupDeadline).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Posted: {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>

                      {item.ngoName && (
                        <div className="flex items-center space-x-2 text-teal-300 font-semibold bg-teal-950/40 p-2 rounded-lg border border-teal-900/40">
                          <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>Assigned NGO: {item.ngoName}</span>
                        </div>
                      )}
                    </div>

                    {/* AI Freshness Estimate Display */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 flex items-start space-x-2.5 text-xs text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.freshnessEstimate}</span>
                    </div>

                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
                  <span>ID: #{item.id}</span>
                  <span className="capitalize">Status: {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
