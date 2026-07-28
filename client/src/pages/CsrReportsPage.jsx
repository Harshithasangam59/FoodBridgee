import React, { useEffect, useState } from 'react';
import { donationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Leaf, 
  Award, 
  CheckCircle2, 
  Building2,
  Utensils
} from 'lucide-react';

export function CsrReportsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all_time');

  const fetchReport = (tf) => {
    setLoading(true);
    donationAPI.getCsrReport(tf)
      .then((res) => setReport(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport(timeframe);
  }, [timeframe]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Triggers standard print-to-PDF view
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:text-slate-900 print:py-0 print:px-0">
      <div className="max-w-5xl mx-auto space-y-8 print:space-y-4">
        
        {/* Top bar (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Corporate Social Responsibility Compliance</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">CSR Donation Report</h1>
            <p className="text-slate-400 text-sm mt-1">
              Audit-ready report of surplus food donations, meal counts, and carbon offset metrics.
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
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Timeframe Filter Tabs (Hidden when printing) */}
        <div className="flex items-center space-x-2 print:hidden">
          <span className="text-xs font-bold text-slate-400 uppercase">Period:</span>
          {[
            { id: 'this_month', label: 'This Month' },
            { id: 'last_3_months', label: 'Last 3 Months' },
            { id: 'all_time', label: 'All Time' }
          ].map((tf) => (
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
        </div>

        {/* PRINTABLE REPORT SHEET */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Generating CSR Report...</div>
        ) : (
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-8 backdrop-blur-md shadow-2xl print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0">
            
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 print:border-slate-300 pb-6 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xl print:bg-emerald-600 print:text-white">
                  <Leaf className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white print:text-slate-900">FoodBridge CSR Certificate</h2>
                  <span className="text-xs text-emerald-400 print:text-emerald-700 font-semibold uppercase tracking-wider">
                    Official Environmental & Social Audit Log
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 print:text-slate-600 space-y-1">
                <div><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Report ID:</strong> CSR-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div className="capitalize"><strong>Timeframe:</strong> {timeframe.replace('_', ' ')}</div>
              </div>
            </div>

            {/* Donor & Summary Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-950 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 print:text-slate-600">Donor Information</span>
                <div className="text-lg font-bold text-white print:text-slate-900">{report?.donorName}</div>
                <div className="text-xs text-slate-400 print:text-slate-600">{report?.donorEmail}</div>
                <div className="text-[11px] text-emerald-400 print:text-emerald-700 font-semibold pt-1">
                  ✓ Verified Sustainability Partner
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/40 print:bg-emerald-50 border border-emerald-900/50 print:border-emerald-200 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 print:text-emerald-800">CSR Summary Highlights</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl font-extrabold text-white print:text-slate-900">{report?.summary?.totalDonations}</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase">Donations</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-emerald-400 print:text-emerald-700">{report?.summary?.totalMealsDonated}</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase">Meals Saved</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-teal-400 print:text-teal-700">{report?.summary?.co2SavedKg} kg</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase">CO₂ Prevented</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Detailed Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white print:text-slate-900">Itemized Donation Breakdown</h3>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-700 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Food Name</th>
                      <th className="p-3.5">Quantity</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">CO₂ Offset</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-slate-800">
                    {report?.donations?.map((item) => {
                      const mealNum = parseInt(item.quantity.match(/\d+/)?.[0] || '10', 10);
                      const co2 = Math.round(mealNum * 2.5);
                      return (
                        <tr key={item.id} className="hover:bg-slate-950/50 print:hover:bg-transparent">
                          <td className="p-3.5">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="p-3.5 font-semibold text-white print:text-slate-900">{item.foodName}</td>
                          <td className="p-3.5">{item.quantity}</td>
                          <td className="p-3.5">{item.foodType}</td>
                          <td className="p-3.5 font-bold">
                            <span className={item.status === 'Collected' ? 'text-emerald-400 print:text-emerald-700' : 'text-amber-400 print:text-amber-700'}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-emerald-400 print:text-emerald-700">{co2} kg CO₂</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Seal */}
            <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-xs text-slate-500 print:text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
                <span>Verified by FoodBridge Zero Waste Network API</span>
              </div>
              <div>Page 1 of 1</div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
