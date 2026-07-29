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
  Search
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
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-emerald-900/30 shadow-lg shadow-emerald-900/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Leaf className="w-4.5 h-4.5 text-slate-950" fill="currentColor" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Food<span className="text-emerald-400">Bridge</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {user ? (
                navLinks.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive(to)
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))
              ) : (
                publicLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive(to)
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
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
                    className="relative p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className={`w-7 h-7 rounded-lg ${user.role === 'donor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'} flex items-center justify-center text-xs font-bold`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-slate-800">
                            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'donor' ? 'bg-emerald-950 text-emerald-400' : 'bg-teal-950 text-teal-400'}`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="p-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-emerald px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-slate-950/98 border-t border-slate-800 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 mb-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className={`w-9 h-9 rounded-xl ${user.role === 'donor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'} flex items-center justify-center font-bold`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <span className={`text-[10px] font-bold uppercase ${user.role === 'donor' ? 'text-emerald-400' : 'text-teal-400'}`}>{user.role}</span>
                      </div>
                    </div>
                    {navLinks.map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(to) ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </Link>
                    ))}
                    <Link to="/notifications" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800">
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                      {unreadCount > 0 && <span className="ml-auto text-xs font-bold text-emerald-400">({unreadCount})</span>}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    {publicLinks.map(({ to, label }) => (
                      <Link key={to} to={to} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        {label}
                      </Link>
                    ))}
                    <div className="pt-3 space-y-2">
                      <Link to="/login" className="block w-full px-4 py-3 rounded-xl text-sm font-medium text-center text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all">
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

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </>
  );
}
