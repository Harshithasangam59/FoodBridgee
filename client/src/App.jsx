import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { DonateFoodPage } from './pages/DonateFoodPage';
import { DonationHistoryPage } from './pages/DonationHistoryPage';
import { AvailableDonationsPage } from './pages/AvailableDonationsPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { CsrReportsPage } from './pages/CsrReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 text-sm font-semibold animate-pulse">Loading FoodBridge...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Dashboard Router - send to role-appropriate dashboard
function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 text-sm font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'donor') return <DonorDashboard />;
  if (user.role === 'ngo') return <NgoDashboard />;
  return <Navigate to="/" replace />;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/available" element={<AvailableDonationsPage />} />
          <Route path="/impact" element={<ImpactDashboardPage />} />

          {/* Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* Donor Only Routes */}
          <Route
            path="/donate"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonateFoodPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonationHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <CsrReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
