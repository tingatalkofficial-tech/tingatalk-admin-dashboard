import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AnalyticsData, TopFemaleUser } from '../types/analytics';

interface AdminAnalyticsUserStats {
  totalUsers: number;
  totalMaleUsers: number;
  totalFemaleUsers: number;
  totalVerifiedFemales: number;
  totalOnlineUsers: number;
  activeUsersToday: number;
  activeUsersThisWeek: number;
  activeUsersThisMonth: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface AdminAnalyticsFinancialStats {
  totalRevenue: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  totalPayouts: number;
  pendingPayouts: number;
  todayPayouts: number;
  thisWeekPayouts: number;
  thisMonthPayouts: number;
  netProfit: number;
  trueProfit?: number;
  pendingWithdrawalRequests: number;
  pendingWithdrawalAmount: number;
}

interface AdminAnalyticsCallStats {
  totalCalls: number;
  totalCompletedCalls: number;
  totalVideoCallsCompleted: number;
  totalAudioCallsCompleted: number;
  totalFailedCalls: number;
  totalDeclinedCalls: number;
  totalCallDurationMinutes: number;
  averageCallDurationMinutes: number;
  callsToday: number;
  callDurationTodayMinutes: number;
  callsThisWeek: number;
  callDurationThisWeekMinutes: number;
  callsThisMonth: number;
  callDurationThisMonthMinutes: number;
}

interface RankingFemale {
  userId: string;
  name: string;
  avatarUrl: string;
  rating?: number;
  totalLikes?: number;
  totalCalls?: number;
  totalEarningsINR?: number;
  favoritedByCount?: number;
}

interface RankingsData {
  topFemales: RankingFemale[];
  count?: number;
}

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    console.log('🔍 Fetching analytics data from admin_analytics collection...');
    
    // Fetch admin analytics documents
    const [userStatsDoc, financialStatsDoc, callStatsDoc, rankingsDoc] = await Promise.all([
      getDoc(doc(db, 'admin_analytics', 'user_stats')),
      getDoc(doc(db, 'admin_analytics', 'financial_stats')),
      getDoc(doc(db, 'admin_analytics', 'call_stats')),
      getDoc(doc(db, 'rankings', 'by_rating'))
    ]);

    // Extract data with defaults
    const userStats = userStatsDoc.exists() 
      ? userStatsDoc.data() as AdminAnalyticsUserStats
      : {
          totalUsers: 0,
          totalMaleUsers: 0,
          totalFemaleUsers: 0,
          totalVerifiedFemales: 0,
          totalOnlineUsers: 0,
          activeUsersToday: 0,
          activeUsersThisWeek: 0,
          activeUsersThisMonth: 0,
          newUsersToday: 0,
          newUsersThisWeek: 0,
          newUsersThisMonth: 0
        };

    const financialStats = financialStatsDoc.exists()
      ? financialStatsDoc.data() as AdminAnalyticsFinancialStats
      : {
          totalRevenue: 0,
          todayRevenue: 0,
          thisWeekRevenue: 0,
          thisMonthRevenue: 0,
          totalPayouts: 0,
          pendingPayouts: 0,
          todayPayouts: 0,
          thisWeekPayouts: 0,
          thisMonthPayouts: 0,
          netProfit: 0,
          pendingWithdrawalRequests: 0,
          pendingWithdrawalAmount: 0
        };

    const callStats = callStatsDoc.exists()
      ? callStatsDoc.data() as AdminAnalyticsCallStats
      : {
          totalCalls: 0,
          totalCompletedCalls: 0,
          totalVideoCallsCompleted: 0,
          totalAudioCallsCompleted: 0,
          totalFailedCalls: 0,
          totalDeclinedCalls: 0,
          totalCallDurationMinutes: 0,
          averageCallDurationMinutes: 0,
          callsToday: 0,
          callDurationTodayMinutes: 0,
          callsThisWeek: 0,
          callDurationThisWeekMinutes: 0,
          callsThisMonth: 0,
          callDurationThisMonthMinutes: 0
        };

    const rankingsData = rankingsDoc.exists()
      ? rankingsDoc.data() as RankingsData
      : { topFemales: [] };

    console.log('✅ Admin analytics fetched:', {
      users: userStats.totalUsers,
      revenue: financialStats.totalRevenue,
      calls: callStats.totalCalls
    });

    // Get top earners from female_users_admin collection
    const topEarnersQuery = query(
      collection(db, 'female_users_admin'),
      orderBy('totalEarningsINR', 'desc'),
      limit(3)
    );
    const topEarnersSnapshot = await getDocs(topEarnersQuery);
    const topEarners: TopFemaleUser[] = topEarnersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        avatar: data.avatarUrl || undefined,
        earnings: data.totalEarningsINR || 0,
        rank: index + 1
      };
    });

    // Get top rated from rankings
    const topRated: TopFemaleUser[] = rankingsData.topFemales
      .slice(0, 3)
      .map((female, index) => ({
        id: female.userId,
        name: female.name,
        avatar: female.avatarUrl || undefined,
        rating: female.rating || 0,
        rank: index + 1
      }));

    // Get top callers (most calls) from female_users_admin
    const topCallersQuery = query(
      collection(db, 'female_users_admin'),
      orderBy('totalCallsReceived', 'desc'),
      limit(3)
    );
    const topCallersSnapshot = await getDocs(topCallersQuery);
    const topCallers: TopFemaleUser[] = topCallersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        avatar: data.avatarUrl || undefined,
        totalCalls: data.totalCallsReceived || 0,
        rank: index + 1
      };
    });

    const result: AnalyticsData = {
      // Financial data - mapped to correct Firestore fields
      totalEarnings: Math.round(financialStats.totalRevenue * 100) / 100,        // Coin Revenue
      audioCallEarnings: Math.round(financialStats.netProfit * 100) / 100,       // Net Profit
      videoCallEarnings: Math.round(financialStats.pendingPayouts * 100) / 100,  // Pending Payouts
      coinPurchaseEarnings: Math.round((financialStats.trueProfit || financialStats.netProfit) * 100) / 100, // Actual Profit
      
      // Call statistics
      totalCalls: callStats.totalCompletedCalls,
      totalAudioCalls: callStats.totalAudioCallsCompleted,
      totalVideoCalls: callStats.totalVideoCallsCompleted,
      
      // User statistics
      totalUsers: userStats.totalUsers,
      totalMaleUsers: userStats.totalMaleUsers,
      totalFemaleUsers: userStats.totalFemaleUsers,
      
      // Top performers
      topEarners,
      topRated,
      topCallers
    };
    
    console.log('✅ Analytics data prepared:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching analytics data:', error);
    throw error;
  }
};
