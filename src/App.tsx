import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import LoginPage from './pages/LoginPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UsersManagement from './pages/UsersManagement';
import UserDetailPage from './pages/UserDetail';
import CallsManagement from './pages/CallsManagement';
import RevenuePage from './pages/RevenuePage';
import PayoutsPage from './pages/PayoutsPage';
import VerificationPage from './pages/VerificationPage';
import './page/index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #0f2b26 0%, #1a3f39 30%, #1e4841 60%, #234f48 100%)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#bbf49c]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#7fb89e] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AnalyticsProvider>
                  <Routes>
                    <Route path="/" element={<Navigate to="/analytics" replace />} />
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/revenue" element={<RevenuePage />} />
                    <Route path="/payouts" element={<PayoutsPage />} />
                    <Route path="/users" element={<UsersManagement />} />
                    <Route path="/users/:userId" element={<UserDetailPage />} />
                    <Route path="/verification" element={<VerificationPage />} />
                    <Route path="/calls" element={<CallsManagement />} />
                  </Routes>
                </AnalyticsProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
