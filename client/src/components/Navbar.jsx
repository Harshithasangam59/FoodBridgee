import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import {
  Leaf,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  PlusCircle,
  History,
  FileText,
  BarChart3,
  Building2,
  Utensils,
  ChevronDown,
  Search,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      notificationAPI.getNotifications()
        .then(res => {
          const notifications = res.notifications || res.data || [];
          setUnreadCount(notifications.filter(n => !n.isRead).length);
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const donorLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/donate', icon: PlusCircle, label: 'Donate Food' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/reports', icon: FileText, label: 'CSR Report' },
    { to: '/impact', icon: BarChart3, label: 'Impact' },
  ];

  const ngoLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/available', icon: Search, label: 'Find Food' },
    { to: '/impact', icon: BarChart3, label: 'Impact' },
  ];

  const publicLinks = [
    { to: '/available', label: 'Find Food' },
    { to: '/impact', label: 'Impact' },
  ];

  const navLinks = user?.role === 'donor' ? donorLinks : user?.role === 'ngo' ? ngoLinks : [];

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-emerald-900/30 shadow-lg shadow-emerald-900/10'
            : 'bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-slate-950" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                  Food<span className="text-emerald-400">Bridge</span>
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/80 mt-0.5">
                  Zero Waste · Feed Lives
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {user ? (
                navLinks.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive(to)
                        ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {isActive(to) && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full"
                      />
                    )}
                  </Link>
                ))
              ) : (
                publicLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive(to)
                        ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {label}
                  </Link>
                ))
              )}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="relative p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-emerald-500 text-slate-950 text-[11px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-md shadow-emerald-500/50"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </Link>

                  {/* User Profile Pill */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group shadow-md"
                    >
                      <div className={`w-7 h-7 rounded-lg ${user.role === 'donor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'} flex items-center justify-center text-xs font-black border border-emerald-500/30`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-200 max-w-[110px] truncate">{user.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60">
                            <p className="text-xs font-bold text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${user.role === 'donor' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-teal-950 text-teal-300 border border-teal-500/30'}`}>
                              {user.role} Account
                            </span>
                          </div>
                          <div className="p-1.5 space-y-1">
                            <Link
                              to="/dashboard"
                              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                              <span>Dashboard Overview</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-emerald px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-500/25 flex items-center space-x-1.5"
                  >
                    <span>Get Started</span>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950/98 border-t border-slate-800 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1.5">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 mb-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className={`w-10 h-10 rounded-xl ${user.role === 'donor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'} flex items-center justify-center font-bold text-sm`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <span className={`text-[10px] font-bold uppercase ${user.role === 'donor' ? 'text-emerald-400' : 'text-teal-400'}`}>{user.role} Partner</span>
                      </div>
                    </div>
                    {navLinks.map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive(to) ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'}`}
                      >
                        <Icon className="w-4.5 h-4.5 text-emerald-400" />
                        <span>{label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all mt-2"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    {publicLinks.map(({ to, label }) => (
                      <Link key={to} to={to} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all">
                        {label}
                      </Link>
                    ))}
                    <div className="pt-3 space-y-2">
                      <Link to="/login" className="block w-full px-4 py-3 rounded-xl text-sm font-bold text-center text-slate-200 bg-slate-900 border border-slate-800">
                        Sign In
                      </Link>
                      <Link to="/signup" className="btn-emerald block w-full px-4 py-3 rounded-xl text-sm font-bold text-center">
                        Get Started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="h-16 sm:h-20" />

      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </>
  );
}
