import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import EarningsCard from '../components/Analytics/EarningsCard';
import CallStatsCard from '../components/Analytics/CallStatsCard';
import UserStatsCard from '../components/Analytics/UserStatsCard';
import { useAnalytics } from '../context/AnalyticsContext';
import { EarningsStat, CallStat, UserStat } from '../types/analytics';

const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, isLoading, error, refreshData } = useAnalytics();

  const earningsStats: EarningsStat[] = [
    {
      id: '1',
      label: 'Coin Revenue',
      amount: analyticsData.totalRevenue,
      icon: '🪙',
      currency: 'INR'
    },
    {
      id: '2',
      label: 'Net Profit',
      amount: analyticsData.netProfit,
      icon: '💰',
      currency: 'INR'
    },
    {
      id: '3',
      label: 'Pending Payouts',
      amount: analyticsData.pendingPayouts,
      icon: '⏳',
      currency: 'INR'
    },
    {
      id: '4',
      label: 'Actual Profit',
      amount: analyticsData.actualProfit,
      icon: '💎',
      currency: 'INR'
    }
  ];

  const callStats: CallStat[] = [
    {
      id: '1',
      label: 'Total Calls',
      count: analyticsData.totalCalls,
      icon: '📊'
    },
    {
      id: '2',
      label: 'Audio Calls',
      count: analyticsData.totalAudioCalls,
      icon: '🎧'
    },
    {
      id: '3',
      label: 'Video Calls',
      count: analyticsData.totalVideoCalls,
      icon: '🎥'
    }
  ];

  const userStats: UserStat[] = [
    {
      id: '1',
      label: 'Total Users',
      count: analyticsData.totalUsers,
      icon: '👥'
    },
    {
      id: '2',
      label: 'Male Users',
      count: analyticsData.totalMaleUsers,
      icon: '👨'
    },
    {
      id: '3',
      label: 'Female Users',
      count: analyticsData.totalFemaleUsers,
      icon: '👩'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading analytics...</p>
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
                Dating App Analytics
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Real-time insights and performance metrics
              </p>
            </div>
            <button
              onClick={refreshData}
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
                onClick={refreshData}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Earnings Section */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
              💵 Revenue Overview
            </h2>
            <div className="flex flex-wrap gap-[18px]">
              {earningsStats.map((stat) => (
                <EarningsCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>

          {/* Call Statistics Section */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
              📞 Call Statistics
            </h2>
            <div className="flex flex-wrap gap-[18px]">
              {callStats.map((stat) => (
                <CallStatsCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>

          {/* User Statistics Section */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
              👥 User Statistics
            </h2>
            <div className="flex flex-wrap gap-[18px]">
              {userStats.map((stat) => (
                <UserStatsCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
