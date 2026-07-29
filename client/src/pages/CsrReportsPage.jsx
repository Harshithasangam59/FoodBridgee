import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { donationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Printer,
  Download,
  Leaf,
  CheckCircle2,
  Utensils,
  Calendar,
  Award,
  TrendingUp,
  Building2
} from 'lucide-react';

function parseMeal(q) {
  const m = q?.match(/\d+/);
  return m ? parseInt(m[0]) : 10;
}

export function CsrReportsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all_time');

  useEffect(() => {
    setLoading(true);
    donationAPI.getCsrReport(timeframe)
      .then(res => setReport(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [timeframe]);

  const handlePrint = () => window.print();

  const timeframes = [
    { id: 'this_month', label: 'This Month' },
    { id: 'last_3_months', label: 'Last 3 Months' },
    { id: 'all_time', label: 'All Time' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:text-slate-900 print:py-0">
      <div className="max-w-5xl mx-auto space-y-6 print:space-y-4">

        {/* Controls (hidden when printing) */}
        <div className="print:hidden">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6"
          >
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4" />
                <span>Corporate Social Responsibility Compliance</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">CSR Donation Report</h1>
              <p className="text-slate-400 text-sm mt-1">
                Professional audit-ready report of surplus food donations and carbon offset metrics.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors text-xs flex items-center space-x-2"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Report</span>
              </button>
              <button
                onClick={handlePrint}
                className="btn-emerald px-4 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </motion.div>

          {/* Timeframe Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <span className="text-xs font-bold text-slate-400 uppercase">Period:</span>
            {timeframes.map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timeframe === tf.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-2 border-slate-700 border-t-emerald-400 rounded-full mx-auto"
            />
            <p className="text-slate-400 text-sm">Generating CSR Report...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-8 backdrop-blur-md shadow-2xl print:bg-white print:text-slate-900 print:border-none print:shadow-none print:rounded-none"
          >
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 print:border-slate-300 pb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <Leaf className="w-8 h-8 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white print:text-slate-900">FoodBridge</h2>
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">CSR Sustainability Certificate</p>
                  <p className="text-xs text-slate-400 print:text-slate-600">Official Environmental & Social Audit Log</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 print:text-slate-600 space-y-1">
                <div><strong>Date Generated:</strong> {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</div>
                <div><strong>Report ID:</strong> CSR-{String(Date.now()).slice(-8)}</div>
                <div className="capitalize"><strong>Period:</strong> {timeframe.replace(/_/g, ' ')}</div>
              </div>
            </div>

            {/* Donor Info + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-400 print:text-slate-600">Donor Information</span>
                <div className="text-xl font-bold text-white print:text-slate-900">{report?.donorName}</div>
                <div className="text-sm text-slate-400 print:text-slate-600">{report?.donorEmail}</div>
                <div className="flex items-center space-x-2 pt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 print:text-emerald-700 font-semibold">Verified Sustainability Partner</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs text-teal-400 print:text-teal-700 font-semibold">FoodBridge Zero Waste Network</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-teal-950/40 print:bg-emerald-50 border border-emerald-900/40 print:border-emerald-200 space-y-4">
                <span className="text-xs font-bold uppercase text-emerald-400 print:text-emerald-800">Impact Summary</span>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-extrabold text-white print:text-slate-900">{report?.summary?.totalDonations || 0}</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase mt-0.5">Donations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-emerald-400 print:text-emerald-700">{report?.summary?.totalMealsDonated || 0}</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase mt-0.5">Meals Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-teal-400 print:text-teal-700">{report?.summary?.co2SavedKg || 0} kg</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase mt-0.5">CO₂ Offset</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 print:text-slate-600 pt-1">
                  Formula: Each meal = 2.5 kg CO₂ equivalent offset
                </div>
              </div>
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'People Fed', value: report?.summary?.estimatedPeopleFed || 0, icon: '👥', color: 'text-white' },
                { label: 'CO₂ Prevented', value: `${report?.summary?.co2SavedKg || 0} kg`, icon: '🌿', color: 'text-emerald-400' },
                { label: 'Total Batches', value: report?.summary?.totalDonations || 0, icon: '📦', color: 'text-teal-400' },
                { label: 'Meals Donated', value: report?.summary?.totalMealsDonated || 0, icon: '🍽️', color: 'text-amber-400' }
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-xl font-extrabold ${s.color} print:text-slate-900`}>{s.value}</div>
                  <div className="text-[10px] text-slate-500 print:text-slate-600 uppercase mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Itemized Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white print:text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Itemized Donation Breakdown</span>
              </h3>
              {!report?.donations || report.donations.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No donations found for this period.</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-600 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="p-3.5 pl-5">#</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Food Name</th>
                        <th className="p-3.5">Quantity</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Location</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 pr-5">CO₂ Offset</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 print:divide-slate-200">
                      {report.donations.map((item, idx) => {
                        const mealNum = parseMeal(item.quantity);
                        const co2 = Math.round(mealNum * 2.5);
                        return (
                          <tr key={item.id} className="text-slate-300 print:text-slate-700 hover:bg-slate-950/60 transition-colors">
                            <td className="p-3.5 pl-5 font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-3.5">{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                            <td className="p-3.5 font-semibold text-white print:text-slate-900">{item.foodName}</td>
                            <td className="p-3.5">{item.quantity}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.foodType === 'Veg' ? 'bg-emerald-950 text-emerald-400 print:text-emerald-700' : 'bg-amber-950 text-amber-400 print:text-amber-700'}`}>
                                {item.foodType}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-400">{item.location}</td>
                            <td className="p-3.5">
                              <span className={`font-bold ${item.status === 'Collected' ? 'text-emerald-400 print:text-emerald-700' : item.status === 'Reserved' ? 'text-sky-400 print:text-sky-700' : 'text-amber-400 print:text-amber-700'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3.5 pr-5 font-semibold text-emerald-400 print:text-emerald-700">{co2} kg</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-950/80 print:bg-slate-100">
                      <tr className="font-bold text-white print:text-slate-900">
                        <td colSpan={3} className="p-3.5 pl-5 text-emerald-400 print:text-emerald-700">TOTALS</td>
                        <td className="p-3.5">{report.summary?.totalMealsDonated} meals</td>
                        <td className="p-3.5"></td>
                        <td className="p-3.5"></td>
                        <td className="p-3.5 text-emerald-400">{report.summary?.totalDonations} items</td>
                        <td className="p-3.5 pr-5 text-emerald-400">{report.summary?.co2SavedKg} kg CO₂</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Certification */}
            <div className="pt-4 border-t border-slate-800 print:border-slate-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 print:text-slate-600">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
                    <span>Certified by FoodBridge Zero Waste Network API v2.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400 print:text-amber-600" />
                    <span>Eligible for CSR Tax Deduction under applicable sections</span>
                  </div>
                </div>
                <div className="text-right">
                  <div>Generated: {new Date().toLocaleString()}</div>
                  <div>Page 1 of 1</div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 print:bg-emerald-50 border border-emerald-900/30 print:border-emerald-200 text-xs text-emerald-300 print:text-emerald-800">
                <strong>Disclosure:</strong> This report is generated from verified FoodBridge platform data. CO₂ offset calculations use the UN FAO food waste emission factor of 2.5 kg CO₂e per kg food waste prevented. This document may be submitted for corporate sustainability reporting and CSR compliance purposes.
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
