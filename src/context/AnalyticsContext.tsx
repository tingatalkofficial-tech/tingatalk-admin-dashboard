import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnalyticsData } from '../types/analytics';
import { fetchAnalyticsData } from '../services/analyticsService';

interface AnalyticsContextType {
  analyticsData: AnalyticsData;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

const initialData: AnalyticsData = {
  totalEarnings: 0,
  audioCallEarnings: 0,
  videoCallEarnings: 0,
  coinPurchaseEarnings: 0,
  totalCalls: 0,
  totalAudioCalls: 0,
  totalVideoCalls: 0,
  totalUsers: 0,
  totalMaleUsers: 0,
  totalFemaleUsers: 0,
  topEarners: [],
  topRated: [],
  topCallers: [],
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsData,
        isLoading,
        error,
        refreshData,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
