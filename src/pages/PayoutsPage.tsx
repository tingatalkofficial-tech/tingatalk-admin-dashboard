import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import {
  fetchAllPayoutRequests,
  fetchFemalePaymentAccount,
  updatePayoutStatus,
  updateFemaleEarningsOnApproval,
  updateFemaleEarningsOnRejection,
  computePayoutStats,
} from '../services/payoutService';
import { PayoutRequest, PayoutStatus, FemalePaymentAccount, PayoutStats } from '../types/payouts';

const STATUS_COLORS: Record<PayoutStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-[#fff3cd]', text: 'text-[#856404]', dot: 'bg-[#856404]' },
  processing: { bg: 'bg-[#cce5ff]', text: 'text-[#004085]', dot: 'bg-[#004085]' },
  completed: { bg: 'bg-[#d4edda]', text: 'text-[#155724]', dot: 'bg-[#155724]' },
  rejected: { bg: 'bg-[#fcced1]', text: 'text-[#721c24]', dot: 'bg-[#721c24]' },
};

const PayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | PayoutStatus>('all');

  // Detail modal state
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [paymentAccount, setPaymentAccount] = useState<FemalePaymentAccount | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);

  // Action modal state
  const [actionModal, setActionModal] = useState<{ payout: PayoutRequest; action: 'approve' | 'reject' | 'complete' } | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPayouts();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPayouts(payouts);
    } else {
      setFilteredPayouts(payouts.filter(p => p.status === activeFilter));
    }
  }, [activeFilter, payouts]);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAllPayoutRequests();
      setPayouts(data);
      setStats(computePayoutStats(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payout requests');
    } finally {
      setIsLoading(false);
    }
  };

  const openDetail = async (payout: PayoutRequest) => {
    setSelectedPayout(payout);
    setPaymentAccount(null);
    setAccountLoading(true);
    try {
      const account = await fetchFemalePaymentAccount(payout.userId);
      setPaymentAccount(account);
    } catch {
      // silent — bankDetails from payout doc is fallback
    } finally {
      setAccountLoading(false);
    }
  };

  const openActionModal = (payout: PayoutRequest, action: 'approve' | 'reject' | 'complete') => {
    setActionModal({ payout, action });
    setAdminNotes('');
    setTransactionId('');
  };

  const handleAction = async () => {
    if (!actionModal) return;
    const { payout, action } = actionModal;
    setActionLoading(true);

    try {
      let newStatus: PayoutStatus;
      if (action === 'approve') newStatus = 'processing';
      else if (action === 'complete') newStatus = 'completed';
      else newStatus = 'rejected';

      await updatePayoutStatus(
        payout.id,
        newStatus,
        adminNotes || undefined,
        action === 'complete' ? transactionId || undefined : undefined
      );

      // Update female_earnings balances
      if (action === 'complete') {
        await updateFemaleEarningsOnApproval(payout.userId, payout.amount);
      } else if (action === 'reject') {
        await updateFemaleEarningsOnRejection(payout.userId, payout.amount);
      }

      // Update local state
      setPayouts(prev =>
        prev.map(p =>
          p.id === payout.id
            ? { ...p, status: newStatus, adminNotes: adminNotes || p.adminNotes, transactionId: action === 'complete' ? transactionId || p.transactionId : p.transactionId }
            : p
        )
      );
      setStats(computePayoutStats(
        payouts.map(p =>
          p.id === payout.id ? { ...p, status: newStatus } : p
        )
      ));

      setActionModal(null);
      if (selectedPayout?.id === payout.id) {
        setSelectedPayout({ ...payout, status: newStatus, adminNotes: adminNotes || payout.adminNotes });
      }
    } catch (err) {
      alert(`Failed to ${action} payout. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTimestamp = (ts: any): string => {
    if (!ts) return 'N/A';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskAccount = (num: string): string => {
    if (!num || num.length < 4) return num || '';
    return '●●●● ' + num.slice(-4);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading payout requests...</p>
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
                Female Payouts
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Manage and track female payout requests
              </p>
            </div>
            <button
              onClick={loadPayouts}
              className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[#1e4841] text-white rounded-[8px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[14px] font-medium"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-[12px] p-[16px] bg-[#fcced1] border border-[#f63440] rounded-[12px]">
              <span className="text-[20px]">⚠️</span>
              <div className="flex-1">
                <p className="font-['Urbanist'] text-[14px] font-semibold text-[#f63440]">Error loading data</p>
                <p className="font-['Urbanist'] text-[12px] text-[#232d2c]">{error}</p>
              </div>
              <button
                onClick={loadPayouts}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                Payout Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-[12px]">
                {/* Total Payouts */}
                <div className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border border-[#e4e6e5] bg-white">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[20px]">📋</span>
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Requests</span>
                  </div>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                    {stats.totalPayouts}
                  </span>
                </div>

                {/* Pending */}
                <div
                  className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border-2 border-[#ffc107] bg-[#fffdf0] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[20px]">⏳</span>
                    <span className="font-['Urbanist'] text-[12px] text-[#856404]">Pending</span>
                  </div>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#856404]">
                    {stats.pendingCount}
                  </span>
                  <span className="font-['Urbanist'] text-[12px] text-[#856404]">
                    {formatCurrency(stats.pendingAmount)}
                  </span>
                </div>

                {/* Processing */}
                <div
                  className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border-2 border-[#007bff] bg-[#f0f7ff] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveFilter(activeFilter === 'processing' ? 'all' : 'processing')}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[20px]">🔄</span>
                    <span className="font-['Urbanist'] text-[12px] text-[#004085]">Processing</span>
                  </div>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#004085]">
                    {stats.processingCount}
                  </span>
                  <span className="font-['Urbanist'] text-[12px] text-[#004085]">
                    {formatCurrency(stats.processingAmount)}
                  </span>
                </div>

                {/* Completed */}
                <div
                  className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border-2 border-[#28a745] bg-[#f0fff4] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveFilter(activeFilter === 'completed' ? 'all' : 'completed')}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[20px]">✅</span>
                    <span className="font-['Urbanist'] text-[12px] text-[#155724]">Completed</span>
                  </div>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#155724]">
                    {stats.completedCount}
                  </span>
                  <span className="font-['Urbanist'] text-[12px] text-[#155724]">
                    {formatCurrency(stats.completedAmount)}
                  </span>
                </div>

                {/* Rejected */}
                <div
                  className="flex flex-col gap-[8px] p-[20px] rounded-[16px] border-2 border-[#dc3545] bg-[#fff5f5] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveFilter(activeFilter === 'rejected' ? 'all' : 'rejected')}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[20px]">❌</span>
                    <span className="font-['Urbanist'] text-[12px] text-[#721c24]">Rejected</span>
                  </div>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#721c24]">
                    {stats.rejectedCount}
                  </span>
                  <span className="font-['Urbanist'] text-[12px] text-[#721c24]">
                    {formatCurrency(stats.rejectedAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Visual Progress Bar */}
          {stats && stats.totalPayouts > 0 && (
            <div className="bg-white rounded-[16px] border border-[#e4e6e5] p-[20px]">
              <h3 className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c] mb-[12px]">
                Payout Distribution
              </h3>
              <div className="flex w-full h-[32px] rounded-[8px] overflow-hidden">
                {stats.pendingCount > 0 && (
                  <div
                    className="bg-[#ffc107] flex items-center justify-center transition-all"
                    style={{ width: `${(stats.pendingCount / stats.totalPayouts) * 100}%` }}
                  >
                    <span className="font-['Urbanist'] text-[11px] font-bold text-[#856404]">
                      {stats.pendingCount}
                    </span>
                  </div>
                )}
                {stats.processingCount > 0 && (
                  <div
                    className="bg-[#007bff] flex items-center justify-center transition-all"
                    style={{ width: `${(stats.processingCount / stats.totalPayouts) * 100}%` }}
                  >
                    <span className="font-['Urbanist'] text-[11px] font-bold text-white">
                      {stats.processingCount}
                    </span>
                  </div>
                )}
                {stats.completedCount > 0 && (
                  <div
                    className="bg-[#28a745] flex items-center justify-center transition-all"
                    style={{ width: `${(stats.completedCount / stats.totalPayouts) * 100}%` }}
                  >
                    <span className="font-['Urbanist'] text-[11px] font-bold text-white">
                      {stats.completedCount}
                    </span>
                  </div>
                )}
                {stats.rejectedCount > 0 && (
                  <div
                    className="bg-[#dc3545] flex items-center justify-center transition-all"
                    style={{ width: `${(stats.rejectedCount / stats.totalPayouts) * 100}%` }}
                  >
                    <span className="font-['Urbanist'] text-[11px] font-bold text-white">
                      {stats.rejectedCount}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-[16px] mt-[12px]">
                <div className="flex items-center gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#ffc107]"></div>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Pending</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#007bff]"></div>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Processing</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#28a745]"></div>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Completed</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#dc3545]"></div>
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Rejected</span>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-[8px]">
            {(['all', 'pending', 'processing', 'completed', 'rejected'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-[16px] py-[8px] rounded-[8px] font-['Urbanist'] text-[13px] font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#1e4841] text-white'
                    : 'bg-white text-[#6b7270] border border-[#e4e6e5] hover:bg-[#ecf4e9]'
                }`}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter !== 'all' && stats && (
                  <span className="ml-[6px] opacity-80">
                    ({stats[`${filter}Count` as keyof PayoutStats]})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Payout Requests Table */}
          <div className="bg-white rounded-[16px] border border-[#e4e6e5] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#ecf4e9]">
                  <tr>
                    <th className="px-[16px] py-[12px] text-left font-['Urbanist'] text-[13px] font-semibold text-[#232d2c]">
                      User
                    </th>
                    <th className="px-[16px] py-[12px] text-right font-['Urbanist'] text-[13px] font-semibold text-[#232d2c]">
                      Amount
                    </th>
                    <th className="px-[16px] py-[12px] text-center font-['Urbanist'] text-[13px] font-semibold text-[#232d2c]">
                      Status
                    </th>
                    <th className="px-[16px] py-[12px] text-left font-['Urbanist'] text-[13px] font-semibold text-[#232d2c]">
                      Bank Account
                    </th>
                    <th className="px-[16px] py-[12px] text-left font-['Urbanist'] text-[13px] font-semibold text-[#232d2c]">
                      Requested
                    </th>
                    <th className="px-[16px] py-[12px] text-center font-['Urbanist'] text-[13px] font-semibold text-[#232d2c]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayouts.length > 0 ? (
                    filteredPayouts.map((payout, index) => {
                      const statusStyle = STATUS_COLORS[payout.status];
                      return (
                        <tr
                          key={payout.id}
                          className={`border-t border-[#e4e6e5] hover:bg-[#fbfbfc] transition-colors cursor-pointer ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                          onClick={() => openDetail(payout)}
                        >
                          <td className="px-[16px] py-[14px]">
                            <div className="flex flex-col gap-[2px]">
                              <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                                {payout.userName || 'Unknown'}
                              </span>
                              <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">
                                {payout.userId.slice(0, 12)}...
                              </span>
                            </div>
                          </td>
                          <td className="px-[16px] py-[14px] text-right">
                            <span className="font-['Urbanist'] text-[15px] font-bold text-[#1e4841]">
                              {formatCurrency(payout.amount)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-center">
                            <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[12px] font-['Urbanist'] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                              <span className={`w-[6px] h-[6px] rounded-full ${statusStyle.dot}`}></span>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px]">
                            <div className="flex flex-col gap-[2px]">
                              <span className="font-['Urbanist'] text-[13px] text-[#232d2c]">
                                {payout.bankDetails?.accountHolderName || 'N/A'}
                              </span>
                              <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">
                                {payout.bankDetails?.accountNumber ? maskAccount(payout.bankDetails.accountNumber) : 'No account'}
                                {payout.bankDetails?.ifsc ? ` | ${payout.bankDetails.ifsc}` : ''}
                              </span>
                            </div>
                          </td>
                          <td className="px-[16px] py-[14px]">
                            <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
                              {formatTimestamp(payout.requestedAt)}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px]">
                            <div className="flex items-center justify-center gap-[6px]" onClick={e => e.stopPropagation()}>
                              {payout.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => openActionModal(payout, 'approve')}
                                    className="px-[10px] py-[6px] bg-[#1e4841] text-white rounded-[6px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[11px] font-semibold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => openActionModal(payout, 'reject')}
                                    className="px-[10px] py-[6px] bg-white text-[#f63440] border border-[#f63440] rounded-[6px] hover:bg-[#fcced1] transition-colors font-['Urbanist'] text-[11px] font-semibold"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {payout.status === 'processing' && (
                                <button
                                  onClick={() => openActionModal(payout, 'complete')}
                                  className="px-[10px] py-[6px] bg-[#28a745] text-white rounded-[6px] hover:bg-[#218838] transition-colors font-['Urbanist'] text-[11px] font-semibold"
                                >
                                  Mark Paid
                                </button>
                              )}
                              {(payout.status === 'completed' || payout.status === 'rejected') && (
                                <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">
                                  {payout.status === 'completed' ? 'Done' : 'Closed'}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-[16px] py-[40px] text-center">
                        <span className="text-[48px] block mb-[8px]">📭</span>
                        <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                          {activeFilter === 'all'
                            ? 'No payout requests yet'
                            : `No ${activeFilter} payout requests`}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedPayout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedPayout(null)}
        >
          <div
            className="bg-white rounded-[16px] w-[90vw] max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-[20px] border-b border-[#e4e6e5]">
              <div>
                <h2 className="font-['Urbanist'] text-[20px] font-bold text-[#232d2c]">Payout Details</h2>
                <p className="font-['Urbanist'] text-[12px] text-[#6b7270] mt-[2px]">ID: {selectedPayout.id}</p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#ecf4e9] transition-colors"
              >
                <span className="text-[18px]">✕</span>
              </button>
            </div>

            <div className="p-[20px] flex flex-col gap-[20px]">
              {/* Amount + Status */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[4px]">
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Amount</span>
                  <span className="font-['Urbanist'] text-[32px] font-bold text-[#1e4841]">
                    {formatCurrency(selectedPayout.amount)}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-[4px] px-[14px] py-[6px] rounded-full text-[13px] font-['Urbanist'] font-semibold ${STATUS_COLORS[selectedPayout.status].bg} ${STATUS_COLORS[selectedPayout.status].text}`}>
                  <span className={`w-[8px] h-[8px] rounded-full ${STATUS_COLORS[selectedPayout.status].dot}`}></span>
                  {selectedPayout.status.charAt(0).toUpperCase() + selectedPayout.status.slice(1)}
                </span>
              </div>

              {/* User Info */}
              <div className="bg-[#ecf4e9] rounded-[12px] p-[16px] flex flex-col gap-[8px]">
                <h3 className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">User Information</h3>
                <div className="grid grid-cols-2 gap-[8px]">
                  <div>
                    <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Name</span>
                    <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c]">
                      {selectedPayout.userName || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">User ID</span>
                    <p className="font-['Urbanist'] text-[13px] font-medium text-[#232d2c] break-all">
                      {selectedPayout.userId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-white rounded-[12px] border border-[#e4e6e5] p-[16px] flex flex-col gap-[10px]">
                <h3 className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">Bank Details</h3>
                {accountLoading ? (
                  <div className="flex items-center gap-[8px]">
                    <div className="w-4 h-4 border-2 border-[#1e4841] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Loading account...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-[10px]">
                    <div>
                      <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Account Holder</span>
                      <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c]">
                        {paymentAccount?.accountHolderName || selectedPayout.bankDetails?.accountHolderName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Account Number</span>
                      <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c]">
                        {paymentAccount?.accountNumber || selectedPayout.bankDetails?.accountNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">IFSC Code</span>
                      <p className="font-['Urbanist'] text-[14px] font-medium text-[#1e4841]">
                        {paymentAccount?.ifscCode || selectedPayout.bankDetails?.ifsc || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Bank Name</span>
                      <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c]">
                        {paymentAccount?.bankName || selectedPayout.bankDetails?.bankName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Account Type</span>
                      <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c] capitalize">
                        {paymentAccount?.accountType || selectedPayout.bankDetails?.accountType || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">UPI ID</span>
                      <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c]">
                        {paymentAccount?.upiId || selectedPayout.bankDetails?.upiId || 'N/A'}
                      </p>
                    </div>
                    {paymentAccount && (
                      <>
                        <div>
                          <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Branch</span>
                          <p className="font-['Urbanist'] text-[14px] font-medium text-[#232d2c]">
                            {paymentAccount.bankBranchName || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Account Status</span>
                          <p className={`font-['Urbanist'] text-[14px] font-medium capitalize ${
                            paymentAccount.status === 'verified' ? 'text-[#155724]' :
                            paymentAccount.status === 'failed' ? 'text-[#721c24]' :
                            'text-[#856404]'
                          }`}>
                            {paymentAccount.status}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Requested At</span>
                  <p className="font-['Urbanist'] text-[13px] font-medium text-[#232d2c]">
                    {formatTimestamp(selectedPayout.requestedAt)}
                  </p>
                </div>
                <div>
                  <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Processed At</span>
                  <p className="font-['Urbanist'] text-[13px] font-medium text-[#232d2c]">
                    {formatTimestamp(selectedPayout.processedAt)}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedPayout.adminNotes && (
                <div className="bg-[#f8f9fa] rounded-[8px] p-[12px]">
                  <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Admin Notes</span>
                  <p className="font-['Urbanist'] text-[13px] text-[#232d2c] mt-[4px]">
                    {selectedPayout.adminNotes}
                  </p>
                </div>
              )}

              {/* Transaction ID */}
              {selectedPayout.transactionId && (
                <div className="bg-[#f0fff4] rounded-[8px] p-[12px]">
                  <span className="font-['Urbanist'] text-[11px] text-[#6b7270]">Transaction ID (Razorpay)</span>
                  <p className="font-['Urbanist'] text-[14px] font-mono font-medium text-[#1e4841] mt-[4px]">
                    {selectedPayout.transactionId}
                  </p>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex gap-[8px] pt-[8px] border-t border-[#e4e6e5]">
                {selectedPayout.status === 'pending' && (
                  <>
                    <button
                      onClick={() => { setSelectedPayout(null); openActionModal(selectedPayout, 'approve'); }}
                      className="flex-1 py-[10px] bg-[#1e4841] text-white rounded-[8px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[14px] font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => { setSelectedPayout(null); openActionModal(selectedPayout, 'reject'); }}
                      className="flex-1 py-[10px] bg-white text-[#f63440] border border-[#f63440] rounded-[8px] hover:bg-[#fcced1] transition-colors font-['Urbanist'] text-[14px] font-semibold"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedPayout.status === 'processing' && (
                  <button
                    onClick={() => { setSelectedPayout(null); openActionModal(selectedPayout, 'complete'); }}
                    className="flex-1 py-[10px] bg-[#28a745] text-white rounded-[8px] hover:bg-[#218838] transition-colors font-['Urbanist'] text-[14px] font-semibold"
                  >
                    Mark as Paid
                  </button>
                )}
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="px-[20px] py-[10px] bg-[#ecf4e9] text-[#232d2c] rounded-[8px] hover:bg-[#d9e8d4] transition-colors font-['Urbanist'] text-[14px] font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => !actionLoading && setActionModal(null)}
        >
          <div
            className="bg-white rounded-[16px] w-[90vw] max-w-[440px] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-[20px] border-b border-[#e4e6e5]">
              <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                {actionModal.action === 'approve' && 'Approve Payout'}
                {actionModal.action === 'reject' && 'Reject Payout'}
                {actionModal.action === 'complete' && 'Mark Payout as Paid'}
              </h2>
              <p className="font-['Urbanist'] text-[13px] text-[#6b7270] mt-[4px]">
                {actionModal.action === 'approve' && 'This will move the payout to "Processing" status. You will need to manually transfer via Razorpay.'}
                {actionModal.action === 'reject' && 'This will reject the payout and restore the amount to the female\'s available balance.'}
                {actionModal.action === 'complete' && 'Confirm that the payment has been successfully transferred via Razorpay.'}
              </p>
            </div>

            <div className="p-[20px] flex flex-col gap-[16px]">
              {/* Payout Summary */}
              <div className="flex items-center justify-between bg-[#ecf4e9] rounded-[8px] p-[12px]">
                <span className="font-['Urbanist'] text-[13px] text-[#6b7270]">
                  {actionModal.payout.userName || 'Unknown'}
                </span>
                <span className="font-['Urbanist'] text-[18px] font-bold text-[#1e4841]">
                  {formatCurrency(actionModal.payout.amount)}
                </span>
              </div>

              {/* Transaction ID (for complete) */}
              {actionModal.action === 'complete' && (
                <div className="flex flex-col gap-[6px]">
                  <label className="font-['Urbanist'] text-[13px] font-medium text-[#232d2c]">
                    Razorpay Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="e.g. pay_xyz123..."
                    className="w-full px-[12px] py-[10px] border border-[#e4e6e5] rounded-[8px] font-['Urbanist'] text-[14px] text-[#232d2c] focus:outline-none focus:border-[#1e4841] focus:ring-1 focus:ring-[#1e4841]"
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-['Urbanist'] text-[13px] font-medium text-[#232d2c]">
                  Admin Notes {actionModal.action === 'reject' ? '(reason)' : '(optional)'}
                </label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    actionModal.action === 'reject'
                      ? 'Reason for rejection...'
                      : 'Add any notes...'
                  }
                  className="w-full px-[12px] py-[10px] border border-[#e4e6e5] rounded-[8px] font-['Urbanist'] text-[14px] text-[#232d2c] resize-none focus:outline-none focus:border-[#1e4841] focus:ring-1 focus:ring-[#1e4841]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-[8px]">
                <button
                  onClick={handleAction}
                  disabled={actionLoading}
                  className={`flex-1 flex items-center justify-center gap-[6px] py-[10px] rounded-[8px] font-['Urbanist'] text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    actionModal.action === 'reject'
                      ? 'bg-[#f63440] text-white hover:bg-[#d32535]'
                      : actionModal.action === 'complete'
                      ? 'bg-[#28a745] text-white hover:bg-[#218838]'
                      : 'bg-[#1e4841] text-white hover:bg-[#2d5f56]'
                  }`}
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {actionModal.action === 'approve' && 'Approve'}
                      {actionModal.action === 'reject' && 'Reject'}
                      {actionModal.action === 'complete' && 'Confirm Paid'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActionModal(null)}
                  disabled={actionLoading}
                  className="px-[20px] py-[10px] bg-[#ecf4e9] text-[#232d2c] rounded-[8px] hover:bg-[#d9e8d4] transition-colors font-['Urbanist'] text-[14px] font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutsPage;
