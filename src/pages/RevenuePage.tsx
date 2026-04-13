import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { fetchRevenueStats, RevenueStats } from '../services/revenueService';

const RevenuePage: React.FC = () => {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRevenueStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading revenue:', err);
      setError(err instanceof Error ? err.message : 'Failed to load revenue data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoading) {
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
                Revenue Management
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Financial overview and profit tracking
              </p>
            </div>
            <button
              onClick={loadRevenue}
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
                onClick={loadRevenue}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {stats && (
            <>
              {/* Revenue Cards */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  💵 Revenue Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                  {/* Total Revenue */}
                  <div className="flex flex-col gap-[8px] p-[24px] rounded-[16px] border border-[#e4e6e5] bg-white">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[28px]">🪙</span>
                      <span className="font-['Urbanist'] text-[13px] text-[#6b7270] font-medium">Total Revenue</span>
                    </div>
                    <span className="font-['Urbanist'] text-[32px] font-bold text-[#232d2c]">
                      {formatCurrency(stats.totalRevenue)}
                    </span>
                  </div>

                  {/* Total Payouts */}
                  <div className="flex flex-col gap-[8px] p-[24px] rounded-[16px] border border-[#e4e6e5] bg-white">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[28px]">💸</span>
                      <span className="font-['Urbanist'] text-[13px] text-[#6b7270] font-medium">Total Payouts</span>
                    </div>
                    <span className="font-['Urbanist'] text-[32px] font-bold text-[#232d2c]">
                      {formatCurrency(stats.totalPayouts)}
                    </span>
                  </div>

                  {/* Actual Profit */}
                  <div className="flex flex-col gap-[8px] p-[24px] rounded-[16px] border-2 border-[#1e4841] bg-[#ecf4e9]">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[28px]">💰</span>
                      <span className="font-['Urbanist'] text-[13px] text-[#1e4841] font-medium">Actual Profit</span>
                    </div>
                    <span className="font-['Urbanist'] text-[32px] font-bold text-[#1e4841]">
                      {formatCurrency(stats.actualProfit)}
                    </span>
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
                      Revenue - Payouts - Pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Payouts + Female Wallet */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  👛 Wallet & Payouts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
                  {/* Pending Payouts */}
                  <div className="flex flex-col gap-[8px] p-[24px] rounded-[16px] border border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[28px]">⏳</span>
                      <span className="font-['Urbanist'] text-[13px] text-[#6b7270] font-medium">Pending Payouts</span>
                    </div>
                    <span className="font-['Urbanist'] text-[32px] font-bold text-orange-600">
                      {formatCurrency(stats.pendingPayouts)}
                    </span>
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
                      Payout requests waiting for approval
                    </span>
                  </div>

                  {/* Female Wallet Balance */}
                  <div className="flex flex-col gap-[8px] p-[24px] rounded-[16px] border border-purple-200 bg-purple-50">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[28px]">👛</span>
                      <span className="font-['Urbanist'] text-[13px] text-[#6b7270] font-medium">Female Wallet Balance</span>
                    </div>
                    <span className="font-['Urbanist'] text-[32px] font-bold text-purple-700">
                      {formatCurrency(stats.femaleWalletBalance)}
                    </span>
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
                      Total available balance across all female wallets (yet to be claimed)
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              {stats.lastUpdated && (
                <p className="font-['Urbanist'] text-[12px] text-[#6b7270] text-right">
                  Last updated: {stats.lastUpdated?.toDate?.()?.toLocaleString() || new Date(stats.lastUpdated).toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RevenuePage;
