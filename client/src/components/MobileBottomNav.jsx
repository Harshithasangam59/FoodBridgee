import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Search,
  PlusCircle,
  LayoutDashboard,
  BarChart3,
  Bell,
  Heart
} from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/available', label: 'Browse', icon: Search },
    ...(user?.role === 'donor'
      ? [{ to: '/donate', label: 'Donate', icon: PlusCircle, isPrimary: true }]
      : []),
    { to: user ? '/dashboard' : '/login', label: user ? 'Dashboard' : 'Sign In', icon: LayoutDashboard },
    { to: '/impact', label: 'Impact', icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {links.map(({ to, label, icon: Icon, isPrimary }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
                isPrimary
                  ? 'btn-emerald -translate-y-2 p-3 shadow-lg shadow-emerald-500/40 rounded-full'
                  : active
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isPrimary ? (
                <Icon className="w-6 h-6 text-slate-950" />
              ) : (
                <>
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-medium tracking-tight">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="mobileNavActive"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400"
                    />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
