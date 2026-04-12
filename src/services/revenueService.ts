import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface RevenueStats {
  totalRevenue: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  totalPayouts: number;
  todayPayouts: number;
  thisWeekPayouts: number;
  thisMonthPayouts: number;
  pendingPayouts: number;
  netProfit: number;
  trueProfit: number;
  pendingWithdrawalRequests: number;
  pendingWithdrawalAmount: number;
  lastUpdated: any;
}

export const fetchRevenueStats = async (): Promise<RevenueStats> => {
  try {
    const financialDoc = await getDoc(doc(db, 'admin_analytics', 'financial_stats'));

    if (!financialDoc.exists()) {
      console.warn('financial_stats document does not exist');
      return {
        totalRevenue: 0,
        todayRevenue: 0,
        thisWeekRevenue: 0,
        thisMonthRevenue: 0,
        totalPayouts: 0,
        todayPayouts: 0,
        thisWeekPayouts: 0,
        thisMonthPayouts: 0,
        pendingPayouts: 0,
        netProfit: 0,
        trueProfit: 0,
        pendingWithdrawalRequests: 0,
        pendingWithdrawalAmount: 0,
        lastUpdated: null,
      };
    }

    const data = financialDoc.data();
    const totalRevenue = data.totalRevenue || 0;
    const totalPayouts = data.totalPayouts || 0;
    const pendingPayouts = data.pendingPayouts || 0;

    const stats: RevenueStats = {
      totalRevenue,
      todayRevenue: data.todayRevenue || 0,
      thisWeekRevenue: data.thisWeekRevenue || 0,
      thisMonthRevenue: data.thisMonthRevenue || 0,
      totalPayouts,
      todayPayouts: data.todayPayouts || 0,
      thisWeekPayouts: data.thisWeekPayouts || 0,
      thisMonthPayouts: data.thisMonthPayouts || 0,
      pendingPayouts,
      netProfit: totalRevenue - totalPayouts,
      trueProfit: totalRevenue - totalPayouts - pendingPayouts,
      pendingWithdrawalRequests: data.pendingWithdrawalRequests || 0,
      pendingWithdrawalAmount: data.pendingWithdrawalAmount || 0,
      lastUpdated: data.lastUpdated || null,
    };

    console.log('Fetched revenue stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    throw error;
  }
};
