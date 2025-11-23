import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { useAnalytics } from '../context/AnalyticsContext';
import { fetchDailyRevenue } from '../services/revenueService';
import { DailyRevenue } from '../types/revenue';

const RevenuePage: React.FC = () => {
  const { analyticsData, isLoading: analyticsLoading } = useAnalytics();
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDailyRevenue();
  }, []);

  const loadDailyRevenue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDailyRevenue();
      setDailyRevenue(data);
    } catch (err) {
      console.error('Error loading daily revenue:', err);
      setError(err instanceof Error ? err.message : 'Failed to load revenue data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (analyticsLoading || isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading revenue data...</p>
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
                💰 Revenue Management
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Track daily revenue and financial performance
              </p>
            </div>
            <button
              onClick={loadDailyRevenue}
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
                onClick={loadDailyRevenue}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Revenue Overview */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
              💵 Revenue Overview
            </h2>
            <div className="flex flex-wrap gap-[18px]">
              <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[24px]">🪙</span>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Coin Revenue</span>
                </div>
                <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                  {formatCurrency(analyticsData.totalEarnings)}
                </span>
              </div>
              
              <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[24px]">💰</span>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Net Profit</span>
                </div>
                <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                  {formatCurrency(analyticsData.audioCallEarnings)}
                </span>
              </div>
              
              <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[24px]">⏳</span>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Pending Payouts</span>
                </div>
                <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                  {formatCurrency(analyticsData.videoCallEarnings)}
                </span>
              </div>
              
              <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[24px]">💎</span>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Actual Profit</span>
                </div>
                <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                  {formatCurrency(analyticsData.coinPurchaseEarnings)}
                </span>
              </div>
            </div>
          </div>

          {/* Daily Revenue Table */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
              📅 Daily Revenue Breakdown
            </h2>
            
            <div className="bg-white rounded-[16px] border border-[#e4e6e5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#ecf4e9]">
                    <tr>
                      <th className="px-[16px] py-[12px] text-left font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                        Date
                      </th>
                      <th className="px-[16px] py-[12px] text-right font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                        Revenue
                      </th>
                      <th className="px-[16px] py-[12px] text-right font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                        Net Profit
                      </th>
                      <th className="px-[16px] py-[12px] text-left font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRevenue.length > 0 ? (
                      dailyRevenue.map((record, index) => (
                        <tr 
                          key={record.date} 
                          className={`border-t border-[#e4e6e5] hover:bg-[#fbfbfc] transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-[16px] py-[14px]">
                            <div className="flex flex-col gap-[2px]">
                              <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                                {formatDate(record.date)}
                              </span>
                              <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
                                {record.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#1e4841]">
                              {formatCurrency(record.revenue)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                              {formatCurrency(record.netProfit)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px]">
                            <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
                              {record.lastUpdated?.toDate?.()?.toLocaleString() || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-[16px] py-[24px] text-center">
                          <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                            No revenue data available
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenuePage;
