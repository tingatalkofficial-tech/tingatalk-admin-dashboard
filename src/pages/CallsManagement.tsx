import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { fetchCallStats } from '../services/callsService';
import { CallStats } from '../types/calls';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, bgColor = 'bg-white' }) => {
  return (
    <div className={`${bgColor} rounded-[16px] p-[20px] shadow-sm border border-gray-100 
      flex flex-col gap-[12px] min-w-[200px] flex-1`}>
      <div className="flex items-center justify-between">
        <span className="text-[32px]">{icon}</span>
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="font-['Urbanist'] text-[14px] text-[#6b7270] font-medium">
          {label}
        </p>
        <p className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
};

const CallsManagement: React.FC = () => {
  const [callStats, setCallStats] = useState<CallStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCallStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCallStats();
      setCallStats(data);
    } catch (err) {
      console.error('Error loading call stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load call statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCallStats();
  }, []);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes.toFixed(2)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading call statistics...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
      <Sidebar />
      
      <main className="flex-1 bg-[#fbfbfc] overflow-auto
        pt-[70px] px-[16px] pb-[22px]
        md:pt-[22px] md:px-[20px]
        lg:pt-[22px] lg:pr-[28px] lg:pb-[22px] lg:pl-[28px]
        lg:rounded-tl-[24px] lg:rounded-bl-[24px]
      ">
        <div className="flex flex-col gap-[20px] max-w-[1400px] mx-auto">
          <Header />
          
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <h1 className="font-['Urbanist'] text-[24px] md:text-[28px] font-bold text-[#232d2c]">
                📞 Call Statistics
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Comprehensive overview of call activity and performance
              </p>
            </div>
            <button
              onClick={loadCallStats}
              className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[#1e4841] text-white rounded-[8px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[14px] font-medium"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-[12px] p-[16px] bg-[#fcced1] border border-[#f63440] rounded-[12px]">
              <span className="text-[20px]">⚠️</span>
              <div className="flex-1">
                <p className="font-['Urbanist'] text-[14px] font-semibold text-[#f63440]">Error loading data</p>
                <p className="font-['Urbanist'] text-[12px] text-[#232d2c]">{error}</p>
              </div>
              <button
                onClick={loadCallStats}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {callStats && (
            <>
              {/* Today's Stats */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📅 Today's Activity
                </h2>
                <div className="flex flex-wrap gap-[18px]">
                  <StatCard
                    label="Calls Today"
                    value={callStats.callsToday}
                    icon="📞"
                    bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
                  />
                  <StatCard
                    label="Duration Today"
                    value={formatDuration(callStats.callDurationTodayMinutes)}
                    icon="⏱️"
                    bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
                  />
                </div>
              </div>

              {/* Total Call Statistics */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📈 Total Call Statistics
                </h2>
                <div className="flex flex-wrap gap-[18px]">
                  <StatCard
                    label="Total Calls"
                    value={callStats.totalCalls}
                    icon="📊"
                    bgColor="bg-gradient-to-br from-green-50 to-green-100"
                  />
                  <StatCard
                    label="Completed Calls"
                    value={callStats.totalCompletedCalls}
                    icon="✅"
                    bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
                  />
                  <StatCard
                    label="Declined Calls"
                    value={callStats.totalDeclinedCalls}
                    icon="❌"
                    bgColor="bg-gradient-to-br from-red-50 to-red-100"
                  />
                  <StatCard
                    label="Failed Calls"
                    value={callStats.totalFailedCalls}
                    icon="⚠️"
                    bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
                  />
                </div>
              </div>

              {/* Call Types */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  🎯 Call Types
                </h2>
                <div className="flex flex-wrap gap-[18px]">
                  <StatCard
                    label="Audio Calls Completed"
                    value={callStats.totalAudioCallsCompleted}
                    icon="🎧"
                    bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
                  />
                  <StatCard
                    label="Video Calls Completed"
                    value={callStats.totalVideoCallsCompleted}
                    icon="🎥"
                    bgColor="bg-gradient-to-br from-pink-50 to-pink-100"
                  />
                </div>
              </div>

              {/* Duration Statistics */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  ⏰ Duration Statistics
                </h2>
                <div className="flex flex-wrap gap-[18px]">
                  <StatCard
                    label="Total Call Duration"
                    value={formatDuration(callStats.totalCallDurationMinutes)}
                    icon="⏳"
                    bgColor="bg-gradient-to-br from-cyan-50 to-cyan-100"
                  />
                  <StatCard
                    label="Average Call Duration"
                    value={formatDuration(callStats.averageCallDurationMinutes)}
                    icon="📏"
                    bgColor="bg-gradient-to-br from-teal-50 to-teal-100"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CallsManagement;
