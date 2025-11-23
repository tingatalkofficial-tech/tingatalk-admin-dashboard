import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalyticsProvider } from './context/AnalyticsContext';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UsersManagement from './pages/UsersManagement';
import UserDetailPage from './pages/UserDetail';
import CallsManagement from './pages/CallsManagement';
import RevenuePage from './pages/RevenuePage';
import './page/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/users/:userId" element={<UserDetailPage />} />
          <Route path="/calls" element={<CallsManagement />} />
        </Routes>
      </AnalyticsProvider>
    </BrowserRouter>
  );
}
