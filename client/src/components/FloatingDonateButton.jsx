import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function FloatingDonateButton() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide on donate page or if NGO role
  if (location.pathname === '/donate' || user?.role === 'ngo') return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-20 md:bottom-6 left-6 z-40"
    >
      <Link
        to={user?.role === 'donor' ? '/donate' : '/signup?role=donor'}
        className="btn-emerald flex items-center space-x-2 px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/40 text-xs font-extrabold group"
      >
        <PlusCircle className="w-5 h-5 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
        <span className="hidden sm:inline">Donate Surplus Food</span>
        <span className="sm:hidden">Donate</span>
      </Link>
    </motion.div>
  );
}
