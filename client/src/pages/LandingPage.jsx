import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Utensils, 
  Leaf, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';
import { impactAPI } from '../services/api';

export function LandingPage() {
  const [stats, setStats] = useState({
    totalMealsDonated: 1250,
    estimatedPeopleFed: 1250,
    co2SavedKg: 3125,
    ngosConnected: 14
  });

  useEffect(() => {
    impactAPI.getMetrics()
      .then((res) => {
        if (res.metrics) {
          setStats(res.metrics);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Smart AI-Powered Food Waste Reduction Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Reduce Food Waste, <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Feed More Lives
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              FoodBridge connects restaurants, bakeries, hotels, and supermarkets with local NGOs in real-time. Turn surplus food into immediate nourishment for families in need.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup?role=donor"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Donate Food Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/available"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-100 bg-slate-900 border border-emerald-500/40 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
              >
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>Find Food for NGO</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant NGO Match</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Freshness Guarantee</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tax CSR Audit Ready</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-12 bg-slate-900/60 border-y border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-900/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">
                {stats.totalMealsDonated.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-slate-300">Meals Saved</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-900/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 mb-1">
                {stats.co2SavedKg.toLocaleString()} kg
              </div>
              <div className="text-sm font-medium text-slate-300">CO₂ Emissions Prevented</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-900/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">
                {stats.ngosConnected}
              </div>
              <div className="text-sm font-medium text-slate-300">NGOs Connected</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-900/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 mb-1">
                100%
              </div>
              <div className="text-sm font-medium text-slate-300">Hygienic Traceability</div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Why Choose FoodBridge</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white">Empowering Surplus Food Redistribution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Donate Food</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Post available surplus meals in under 60 seconds with pickup deadlines, location, and photo upload.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Find Donations</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              NGOs instantly browse pending food listings sorted by proximity and nearest deadline for rapid retrieval.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Impact Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visualize meals saved, people fed, and carbon emissions prevented using real-time interactive charts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">CSR Reporting</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generate downloadable PDF and printable CSR reports for corporate sustainability and compliance.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-900/40 border-y border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Simple 4-Step Process</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white">How FoodBridge Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative text-center p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-lg">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Donor Posts Food</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restaurants or bakeries list surplus food items along with pickup location and deadline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-lg">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">NGO Reserves Food</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verified NGOs claim the donation with a single click, locking it to prevent double reservation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-lg">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Food Collected</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                NGO collects food from donor location before deadline and marks item as collected.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-lg">
                4
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Impact Recorded</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform automatically records meals saved and updates carbon offset metrics for CSR reports.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Community Voices</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white">What Our Partners Say</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "FoodBridge transformed our hotel's food management. Instead of throwing away untouched banquet meals, we now feed over 200 people every week!"
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                R
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white">Rajesh Kumar</h5>
                <p className="text-xs text-slate-400">Banquet Manager, Grand Hotel</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "The AI freshness estimates and deadline alerts give us total peace of mind. We collect fresh meals within 1 hour of reservation."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center">
                S
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white">Sister Maria</h5>
                <p className="text-xs text-slate-400">Coordinator, Hope Foundation NGO</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "The automated CSR reporting helped our bakery chain achieve our annual carbon offset targets and tax exemption documentation effortlessly."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                A
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white">Anita Sharma</h5>
                <p className="text-xs text-slate-400">CSR Director, Green Bakery Chain</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-t border-emerald-900/40">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Join the Movement?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Start saving meals and nourishing communities today. Register as a food donor or NGO partner in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              to="/signup?role=donor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg"
            >
              Sign Up as Donor
            </Link>
            <Link
              to="/signup?role=ngo"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 transition-colors"
            >
              Sign Up as NGO
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
