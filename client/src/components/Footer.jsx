import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, Globe, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Leaf className="w-6 h-6 text-slate-950" fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Food<span className="text-emerald-400">Bridge</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              An AI-powered real-time surplus food redistribution platform connecting restaurants, hotels, bakeries, and food businesses directly with verified local NGOs.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Hygienic Verification Protocol · Zero Profit Mission</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/available" className="hover:text-emerald-400 transition-colors">Find Available Food</Link></li>
              <li><Link to="/signup?role=donor" className="hover:text-emerald-400 transition-colors">Donate Surplus Food</Link></li>
              <li><Link to="/signup?role=ngo" className="hover:text-emerald-400 transition-colors">Register as NGO Partner</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition-colors">Environmental Impact Dashboard</Link></li>
            </ul>
          </div>

          {/* CSR & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/reports" className="hover:text-emerald-400 transition-colors">CSR Compliance Audit Reports</Link></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How FoodBridge Works</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">AI Freshness Engine Docs</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Food Safety Guidelines</span></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Contact & Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@foodbridge.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+1 (800) 555-FOOD</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>San Francisco, CA & Global Partners</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} FoodBridge Platform. Built for Maximum Social & Environmental Impact.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
