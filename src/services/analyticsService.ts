import { doc, getDoc, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AnalyticsData, TopFemaleUser } from '../types/analytics';

interface AdminAnalyticsUserStats {
  totalUsers: number;
  totalMaleUsers: number;
  totalFemaleUsers: number;
  totalVerifiedFemales: number;
  totalOnlineUsers: number;
  activeUsersToday: number;
  newUsersToday: number;
}

interface AdminAnalyticsFinancialStats {
  totalRevenue: number;
  todayRevenue: number;
  totalPayouts: number;
  pendingPayouts: number;
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
}

interface RankingFemale {
  userId: string;
  name: string;
  avatarUrl: string;
  rating?: number;
  totalLikes?: number;
  totalCalls?: number;
  favoritedByCount?: number;
}

interface RankingsData {
  topFemales: RankingFemale[];
  count?: number;
}

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    console.log('🔍 Fetching analytics data from admin_analytics collection...');

    // Fetch admin analytics documents + top earners/callers from users collection
    const [userStatsDoc, financialStatsDoc, callStatsDoc, rankingsDoc, topEarnersSnapshot, topCallersSnapshot] = await Promise.all([
      getDoc(doc(db, 'admin_analytics', 'user_stats')),
      getDoc(doc(db, 'admin_analytics', 'financial_stats')),
      getDoc(doc(db, 'admin_analytics', 'call_stats')),
      getDoc(doc(db, 'rankings', 'by_rating')),
      // Top earners: query users collection directly (female_earnings data is synced to users doc)
      getDocs(query(
        collection(db, 'users'),
        where('gender', '==', 'female'),
        orderBy('totalEarnings', 'desc'),
        limit(3)
      )),
      // Top callers: query users collection directly
      getDocs(query(
        collection(db, 'users'),
        where('gender', '==', 'female'),
        orderBy('totalCalls', 'desc'),
        limit(3)
      ))
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
          newUsersToday: 0
        };

    const rawFinancial = financialStatsDoc.exists()
      ? financialStatsDoc.data() as AdminAnalyticsFinancialStats
      : {
          totalRevenue: 0,
          todayRevenue: 0,
          totalPayouts: 0,
          pendingPayouts: 0,
          netProfit: 0,
          pendingWithdrawalRequests: 0,
          pendingWithdrawalAmount: 0
        };

    // Always recalculate profits on-read to avoid stale values from dual-write race conditions
    const totalRevenue = rawFinancial.totalRevenue || 0;
    const totalPayouts = rawFinancial.totalPayouts || 0;
    const pendingPayouts = rawFinancial.pendingPayouts || 0;
    const financialStats = {
      ...rawFinancial,
      netProfit: totalRevenue - totalPayouts,
      trueProfit: totalRevenue - totalPayouts - pendingPayouts,
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
          callDurationTodayMinutes: 0
        };

    const rankingsData = rankingsDoc.exists()
      ? rankingsDoc.data() as RankingsData
      : { topFemales: [] };

    console.log('✅ Admin analytics fetched:', {
      users: userStats.totalUsers,
      revenue: financialStats.totalRevenue,
      calls: callStats.totalCalls
    });

    // Build top earners from users collection (source of truth)
    const topEarners: TopFemaleUser[] = topEarnersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.displayName || 'Unknown',
        avatar: data.avatarUrl || data.profilePhotoUrl || undefined,
        earnings: data.totalEarnings || 0,
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

    // Build top callers from users collection (source of truth)
    const topCallers: TopFemaleUser[] = topCallersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.displayName || 'Unknown',
        avatar: data.avatarUrl || data.profilePhotoUrl || undefined,
        totalCalls: data.totalCalls || 0,
        rank: index + 1
      };
    });

    const result: AnalyticsData = {
      // Financial data - recalculated on read for accuracy
      totalRevenue: Math.round(financialStats.totalRevenue * 100) / 100,
      netProfit: Math.round(financialStats.netProfit * 100) / 100,
      pendingPayouts: Math.round(financialStats.pendingPayouts * 100) / 100,
      actualProfit: Math.round((financialStats.trueProfit ?? 0) * 100) / 100,
      todayRevenue: Math.round((rawFinancial.todayRevenue || 0) * 100) / 100,

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
