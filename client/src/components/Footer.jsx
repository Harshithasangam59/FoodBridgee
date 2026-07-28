import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Leaf, Heart, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-100">FoodBridge</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting restaurants, supermarkets, and food donors with NGOs to prevent food waste and nourish communities in need.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Certified Sustainable CSR Initiative</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-emerald-400 transition-colors">Impact Analytics</Link>
              </li>
              <li>
                <Link to="/available" className="hover:text-emerald-400 transition-colors">Available Food Donations</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-emerald-400 transition-colors">Register as Donor / NGO</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Donors & NGOs */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">Roles & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donate" className="hover:text-emerald-400 transition-colors">Donate Surplus Food</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-emerald-400 transition-colors">CSR Compliance Reports</Link>
              </li>
              <li>
                <Link to="/available" className="hover:text-emerald-400 transition-colors">NGO Pickups</Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Safety Guidelines</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">Contact & Help</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@foodbridge.org</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 1800-FOOD-BRIDGE</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hyderabad • Vijayawada • Vizag</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FoodBridge Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Zero Hunger & Zero Waste</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
