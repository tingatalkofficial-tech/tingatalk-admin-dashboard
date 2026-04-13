import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface RevenueStats {
  totalRevenue: number;
  completedPayoutsCount: number;
  completedPayoutsAmount: number;
  pendingPayoutsCount: number;
  pendingPayoutsAmount: number;
  actualProfit: number;
  femaleWalletBalance: number;
  lastUpdated: any;
}

export const fetchRevenueStats = async (): Promise<RevenueStats> => {
  try {
    const [financialDoc, allPayoutsSnapshot, femaleEarningsSnapshot] = await Promise.all([
      getDoc(doc(db, 'admin_analytics', 'financial_stats')),
      getDocs(collection(db, 'payout_requests')),
      getDocs(collection(db, 'female_earnings')),
    ]);

    const data = financialDoc.exists() ? financialDoc.data() : {};
    const totalRevenue = data.totalRevenue || 0;

    // Compute payout stats from actual payout_requests
    let completedPayoutsCount = 0;
    let completedPayoutsAmount = 0;
    let pendingPayoutsCount = 0;
    let pendingPayoutsAmount = 0;
    allPayoutsSnapshot.docs.forEach(d => {
      const payout = d.data();
      if (payout.status === 'completed') {
        completedPayoutsCount++;
        completedPayoutsAmount += payout.amount || 0;
      } else if (payout.status === 'pending' || payout.status === 'processing') {
        pendingPayoutsCount++;
        pendingPayoutsAmount += payout.amount || 0;
      }
    });

    // Female wallet: sum of availableBalance across all female_earnings docs
    let femaleWalletBalance = 0;
    femaleEarningsSnapshot.docs.forEach(d => {
      femaleWalletBalance += d.data().availableBalance || 0;
    });

    const stats: RevenueStats = {
      totalRevenue,
      completedPayoutsCount,
      completedPayoutsAmount,
      pendingPayoutsCount,
      pendingPayoutsAmount,
      actualProfit: totalRevenue - completedPayoutsAmount - pendingPayoutsAmount,
      femaleWalletBalance: Math.round(femaleWalletBalance * 100) / 100,
      lastUpdated: data.lastUpdated || null,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    throw error;
  }
};
