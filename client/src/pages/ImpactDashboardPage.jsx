import React, { useEffect, useState } from 'react';
import { impactAPI } from '../services/api';
import { 
  BarChart3, 
  Utensils, 
  Users, 
  Leaf, 
  TrendingUp, 
  Building2, 
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export function ImpactDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    impactAPI.getMetrics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics || {
    totalMealsDonated: 1250,
    estimatedPeopleFed: 1250,
    totalDonations: 45,
    co2SavedKg: 3125,
    ngosConnected: 14
  };

  const overTimeData = data?.charts?.overTimeData || [
    { month: 'May 26', meals: 250, donations: 8, co2Saved: 625 },
    { month: 'Jun 26', meals: 450, donations: 15, co2Saved: 1125 },
    { month: 'Jul 26', meals: 550, donations: 22, co2Saved: 1375 },
  ];

  const pieData = data?.charts?.foodTypeDistribution || [
    { name: 'Vegetarian', value: 35, fill: '#10B981' },
    { name: 'Non-Vegetarian', value: 10, fill: '#F59E0B' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Sustainability & Zero Waste Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Impact Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time tracking of meals saved, individuals fed, and carbon footprint reduction achieved through FoodBridge.
          </p>
        </div>

        {/* LARGE STATISTIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-900/50 backdrop-blur-md shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400">Total Meals Donated</span>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Utensils className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">{metrics.totalMealsDonated.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Meals rescued from waste</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-900/50 backdrop-blur-md shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-teal-400">Estimated People Fed</span>
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-teal-300 mb-1">{metrics.estimatedPeopleFed.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Nourished individuals</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-sky-900/50 backdrop-blur-md shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-sky-400">Total Donations</span>
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-sky-300 mb-1">{metrics.totalDonations}</div>
            <p className="text-xs text-slate-400">Completed donor batches</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-900/50 backdrop-blur-md shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400">CO₂ Prevented</span>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-emerald-400 mb-1">{metrics.co2SavedKg.toLocaleString()} kg</div>
            <p className="text-xs text-slate-400">Formula: Meals × 2.5 kg CO₂</p>
          </div>

        </div>

        {/* RECHARTS VISUALIZATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart 1: Area chart over time */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Donations & Meals Over Time</h3>
                <p className="text-xs text-slate-400">Growth of rescued meals and completed donations</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overTimeData}>
                  <defs>
                    <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="meals" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorMeals)" name="Meals Saved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Pie distribution */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Food Type Distribution</h3>
                <p className="text-xs text-slate-400">Veg vs Non-Veg breakdown</p>
              </div>
              <PieIcon className="w-5 h-5 text-teal-400" />
            </div>

            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Chart 3: Monthly CO2 Savings Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Environmental Impact (CO₂ Offset)</h3>
              <p className="text-xs text-slate-400">Equivalent greenhouse gas emissions prevented (kg CO₂)</p>
            </div>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="co2Saved" fill="#10B981" radius={[8, 8, 0, 0]} name="CO₂ Offset (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
