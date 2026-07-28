import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  PlusCircle, 
  History, 
  FileText, 
  BarChart3, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Utensils, 
  Search,
  UserCheck
} from 'lucide-react';
import { notificationAPI } from '../services/api';

export function Navbar() {
  const { user, logout, isDonor, isNgo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      notificationAPI.getNotifications()
        .then((res) => setUnreadCount(res.unreadCount || 0))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                FoodBridge
              </span>
              <span className="block text-[10px] text-emerald-400/80 font-medium -mt-1 tracking-wider uppercase">
                Zero Waste • Feed Hope
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                  : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>

            <Link
              to="/impact"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/impact') 
                  ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                  : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Impact</span>
            </Link>

            {/* Donor Navigation Options */}
            {isDonor && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/donate"
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Donate Food</span>
                </Link>

                <Link
                  to="/history"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/history') 
                      ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>My History</span>
                </Link>

                <Link
                  to="/reports"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/reports') 
                      ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>CSR Reports</span>
                </Link>
              </>
            )}

            {/* NGO Navigation Options */}
            {isNgo && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
                  }`}
                >
                  NGO Dashboard
                </Link>

                <Link
                  to="/available"
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Find Donations</span>
                </Link>
              </>
            )}

            {/* Public view link to available donations if not logged in */}
            {!user && (
              <Link
                to="/available"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/available') 
                    ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30' 
                    : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
                }`}
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Available Food</span>
              </Link>
            )}
          </nav>

          {/* User Controls & Notifications */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Tag */}
                <div className="flex items-center space-x-2 bg-slate-800/80 border border-emerald-900/50 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-slate-200 leading-none">
                      {user.name}
                    </span>
                    <span className="inline-block text-[9px] uppercase font-bold text-emerald-400 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <Link
                to="/notifications"
                className="relative p-2 text-slate-300 hover:text-emerald-400 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-emerald-900/50 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Impact Dashboard
          </Link>
          <Link
            to="/available"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Available Food
          </Link>

          {isDonor && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Donor Dashboard
              </Link>
              <Link
                to="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-400 hover:bg-slate-800"
              >
                + Donate Food
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Donation History
              </Link>
              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                CSR Reports
              </Link>
            </>
          )}

          {isNgo && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                NGO Dashboard
              </Link>
              <Link
                to="/available"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-teal-400 hover:bg-slate-800"
              >
                Find & Reserve Food
              </Link>
            </>
          )}

          {user ? (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                  <div className="text-xs text-emerald-400 capitalize">{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-rose-400 px-3 py-1.5 rounded-lg text-sm bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-slate-200 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
