import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { impactAPI } from '../services/api';
import {
  BarChart3,
  Utensils,
  Users,
  Leaf,
  TrendingUp,
  Building2,
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value.toLocaleString()}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, sub, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`p-6 rounded-3xl bg-slate-900/80 border backdrop-blur-md shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform ${
      color === 'teal' ? 'border-teal-900/50' : color === 'sky' ? 'border-sky-900/50' : 'border-emerald-900/50'
    }`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition-all opacity-0 group-hover:opacity-100 ${
      color === 'teal' ? 'bg-teal-500/15' : color === 'sky' ? 'bg-sky-500/15' : 'bg-emerald-500/15'
    }`} />
    <div className="flex items-center justify-between mb-4">
      <span className={`text-xs font-bold uppercase ${color === 'teal' ? 'text-teal-400' : color === 'sky' ? 'text-sky-400' : 'text-emerald-400'}`}>
        {label}
      </span>
      <div className={`p-3 rounded-2xl ${color === 'teal' ? 'bg-teal-500/10 text-teal-400' : color === 'sky' ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className={`text-4xl font-extrabold mb-1 ${color === 'teal' ? 'text-teal-300' : color === 'sky' ? 'text-sky-300' : 'text-emerald-400'}`}>
      {value}
    </div>
    <p className="text-xs text-slate-400">{sub}</p>
  </motion.div>
);

export function ImpactDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    impactAPI.getMetrics()
      .then(res => setData(res))
      .catch(console.error)
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-slate-800 pb-6"
        >
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Sustainability & Zero Waste Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Impact Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time tracking of meals saved, individuals fed, and carbon footprint reduction through FoodBridge.
          </p>
        </motion.div>

        {/* Skeleton or Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 animate-pulse space-y-3">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-10 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Meals Donated" value={metrics.totalMealsDonated.toLocaleString()} sub="Meals rescued from waste" icon={Utensils} color="emerald" delay={0} />
            <StatCard label="People Fed" value={metrics.estimatedPeopleFed.toLocaleString()} sub="Nourished individuals" icon={Users} color="teal" delay={0.1} />
            <StatCard label="Total Donations" value={metrics.totalDonations} sub="Completed donor batches" icon={Activity} color="sky" delay={0.2} />
            <StatCard label="CO₂ Prevented" value={`${metrics.co2SavedKg.toLocaleString()} kg`} sub="Formula: Meals × 2.5 kg CO₂" icon={Leaf} color="emerald" delay={0.3} />
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Area Chart: Meals Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Donations & Meals Over Time</h3>
                <p className="text-xs text-slate-400">Growth of rescued meals and completed donations</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overTimeData}>
                  <defs>
                    <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Area type="monotone" dataKey="meals" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMeals)" name="Meals Saved" />
                  <Area type="monotone" dataKey="donations" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorDonations)" name="Donations" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart: Food Type */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Food Type Distribution</h3>
                <p className="text-xs text-slate-400">Veg vs Non-Veg breakdown</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bar Chart: CO2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly CO₂ Emissions Prevented</h3>
              <p className="text-xs text-slate-400">Equivalent greenhouse gas emissions offset per month (kg CO₂)</p>
            </div>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="co2Saved" fill="#10B981" radius={[6, 6, 0, 0]} name="CO₂ Offset (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SDG Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/30 border border-emerald-900/30 flex flex-wrap gap-4 items-center"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">🌍</div>
            <div>
              <p className="text-sm font-bold text-white">Aligned with UN Sustainable Development Goals</p>
              <p className="text-xs text-slate-400">SDG 2 (Zero Hunger) • SDG 12 (Responsible Consumption) • SDG 13 (Climate Action)</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-3 text-center">
            <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700/30">
              <div className="text-lg font-extrabold text-emerald-400">{metrics.ngosConnected}</div>
              <div className="text-[10px] text-slate-400">NGOs Active</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
