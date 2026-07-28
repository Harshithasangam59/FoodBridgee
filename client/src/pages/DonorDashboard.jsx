import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';
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
  AlertCircle
} from 'lucide-react';

function parseMealCount(quantityStr) {
  if (!quantityStr) return 10;
  const match = quantityStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

export function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationAPI.getMyDonations()
      .then((res) => {
        setDonations(res.donations || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length;
  const reservedDonations = donations.filter(d => d.status === 'Reserved').length;
  const collectedDonations = donations.filter(d => d.status === 'Collected').length;

  let estimatedMeals = 0;
  donations.forEach(d => {
    estimatedMeals += parseMealCount(d.quantity);
  });

  const co2Saved = Math.round(estimatedMeals * 2.5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Donor Overview Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome, {user?.name}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your food donations, track real-time reservations, and monitor your environmental impact.
            </p>
          </div>

          <Link
            to="/donate"
            className="px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Donate Surplus Food</span>
          </Link>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-slate-400">Total Donations</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Utensils className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{totalDonations}</div>
            <p className="text-xs text-slate-500 mt-1">Surplus items posted</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-amber-400">Pending</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{pendingDonations}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting NGO reservation</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400">Collected</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{collectedDonations}</div>
            <p className="text-xs text-slate-500 mt-1">Successfully delivered</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-teal-400">Estimated Meals</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-teal-400">{estimatedMeals}</div>
            <p className="text-xs text-slate-500 mt-1">Approx. {co2Saved} kg CO₂ saved</p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/donate"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group flex items-start space-x-4"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Donate Food</h3>
              <p className="text-xs text-slate-400">
                Post new surplus food items with location, photo, and pickup time.
              </p>
            </div>
          </Link>

          <Link
            to="/history"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group flex items-start space-x-4"
          >
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">View History</h3>
              <p className="text-xs text-slate-400">
                Check status of all posted donations (Pending, Reserved, Collected).
              </p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group flex items-start space-x-4"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">CSR Reports</h3>
              <p className="text-xs text-slate-400">
                Generate printable & PDF CSR audit reports for sustainability metrics.
              </p>
            </div>
          </Link>

        </div>

        {/* RECENT DONATIONS TABLE / WIDGET */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Donations</h3>
              <p className="text-xs text-slate-400">Your latest posted surplus items</p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1">
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm">Loading recent donations...</div>
          ) : donations.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">You haven't posted any food donations yet.</p>
              <Link
                to="/donate"
                className="inline-block px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-emerald-400 text-xs"
              >
                Post Your First Donation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.slice(0, 3).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                      {item.foodType}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        item.status === 'Pending'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                          : item.status === 'Reserved'
                          ? 'bg-sky-950/80 text-sky-400 border border-sky-500/30'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.status === 'Pending' && '🟡 Pending'}
                      {item.status === 'Reserved' && '🔵 Reserved'}
                      {item.status === 'Collected' && '🟢 Collected'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-tight">{item.foodName}</h4>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Qty: {item.quantity}</span>
                    <span>📍 {item.location}</span>
                  </div>

                  <p className="text-[11px] text-emerald-400/90 italic bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/30">
                    💡 {item.freshnessEstimate}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
