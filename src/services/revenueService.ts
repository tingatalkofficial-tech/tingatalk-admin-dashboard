import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface RevenueStats {
  totalRevenue: number;
  totalPayouts: number;
  pendingPayouts: number;
  actualProfit: number;
  femaleWalletBalance: number;
  lastUpdated: any;
}

export const fetchRevenueStats = async (): Promise<RevenueStats> => {
  try {
    const [financialDoc, pendingPayoutsSnapshot, femaleEarningsSnapshot] = await Promise.all([
      getDoc(doc(db, 'admin_analytics', 'financial_stats')),
      getDocs(query(
        collection(db, 'payout_requests'),
        where('status', '==', 'pending')
      )),
      getDocs(collection(db, 'female_earnings')),
    ]);

    const data = financialDoc.exists() ? financialDoc.data() : {};
    const totalRevenue = data.totalRevenue || 0;
    const totalPayouts = data.totalPayouts || 0;

    // Live pending payouts from actual payout_requests
    let pendingPayouts = 0;
    pendingPayoutsSnapshot.docs.forEach(d => {
      pendingPayouts += d.data().amount || 0;
    });

    // Female wallet: sum of availableBalance across all female_earnings docs
    let femaleWalletBalance = 0;
    femaleEarningsSnapshot.docs.forEach(d => {
      femaleWalletBalance += d.data().availableBalance || 0;
    });

    const stats: RevenueStats = {
      totalRevenue,
      totalPayouts,
      pendingPayouts,
      actualProfit: totalRevenue - totalPayouts - pendingPayouts,
      femaleWalletBalance: Math.round(femaleWalletBalance * 100) / 100,
      lastUpdated: data.lastUpdated || null,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    throw error;
  }
};
