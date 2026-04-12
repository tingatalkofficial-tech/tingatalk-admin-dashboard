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
                💰 Revenue Management
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Track revenue and financial performance
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
              {/* Revenue Overview */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  💵 Revenue Overview
                </h2>
                <div className="flex flex-wrap gap-[18px]">
                  <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[24px]">🪙</span>
                      <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Revenue</span>
                    </div>
                    <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                      {formatCurrency(stats.totalRevenue)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[24px]">💰</span>
                      <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Net Profit</span>
                    </div>
                    <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                      {formatCurrency(stats.netProfit)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[24px]">⏳</span>
                      <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Pending Payouts</span>
                    </div>
                    <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                      {formatCurrency(stats.pendingPayouts)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white min-w-[200px] flex-1">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[24px]">💎</span>
                      <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Actual Profit</span>
                    </div>
                    <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                      {formatCurrency(stats.trueProfit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📅 Revenue Breakdown
                </h2>
                <div className="bg-white rounded-[16px] border border-[#e4e6e5] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#ecf4e9]">
                        <tr>
                          <th className="px-[16px] py-[12px] text-left font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                            Period
                          </th>
                          <th className="px-[16px] py-[12px] text-right font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                            Revenue
                          </th>
                          <th className="px-[16px] py-[12px] text-right font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                            Payouts
                          </th>
                          <th className="px-[16px] py-[12px] text-right font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                            Profit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#e4e6e5] hover:bg-[#fbfbfc] transition-colors">
                          <td className="px-[16px] py-[14px]">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">Today</span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#1e4841]">
                              {formatCurrency(stats.todayRevenue)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                              {formatCurrency(stats.todayPayouts)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                              {formatCurrency(stats.todayRevenue - stats.todayPayouts)}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-t border-[#e4e6e5] hover:bg-[#fbfbfc] transition-colors bg-gray-50">
                          <td className="px-[16px] py-[14px]">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">This Week</span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#1e4841]">
                              {formatCurrency(stats.thisWeekRevenue)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                              {formatCurrency(stats.thisWeekPayouts)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                              {formatCurrency(stats.thisWeekRevenue - stats.thisWeekPayouts)}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-t border-[#e4e6e5] hover:bg-[#fbfbfc] transition-colors">
                          <td className="px-[16px] py-[14px]">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">This Month</span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#1e4841]">
                              {formatCurrency(stats.thisMonthRevenue)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                              {formatCurrency(stats.thisMonthPayouts)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                              {formatCurrency(stats.thisMonthRevenue - stats.thisMonthPayouts)}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-t-2 border-[#1e4841] hover:bg-[#fbfbfc] transition-colors bg-[#ecf4e9]">
                          <td className="px-[16px] py-[14px]">
                            <span className="font-['Urbanist'] text-[14px] font-bold text-[#1e4841]">All Time</span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-bold text-[#1e4841]">
                              {formatCurrency(stats.totalRevenue)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-semibold text-[#6b7270]">
                              {formatCurrency(stats.totalPayouts)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[14px] font-bold text-[#1e4841]">
                              {formatCurrency(stats.netProfit)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Withdrawal Info */}
              {(stats.pendingWithdrawalRequests > 0 || stats.pendingWithdrawalAmount > 0) && (
                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                    📤 Pending Withdrawals
                  </h2>
                  <div className="flex flex-wrap gap-[18px]">
                    <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-orange-200 bg-orange-50 min-w-[200px] flex-1">
                      <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Pending Requests</span>
                      <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                        {stats.pendingWithdrawalRequests}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-orange-200 bg-orange-50 min-w-[200px] flex-1">
                      <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Pending Amount</span>
                      <span className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                        {formatCurrency(stats.pendingWithdrawalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
