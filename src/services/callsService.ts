import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { CallStats } from '../types/calls';

export const fetchCallStats = async (): Promise<CallStats> => {
  try {
    console.log('🔍 Fetching call stats from admin_analytics/call_stats...');
    
    const callStatsDoc = await getDoc(doc(db, 'admin_analytics', 'call_stats'));
    
    if (!callStatsDoc.exists()) {
      console.warn('⚠️ Call stats document does not exist');
      return {
        callsToday: 0,
        callDurationTodayMinutes: 0,
        totalCalls: 0,
        totalCompletedCalls: 0,
        totalDeclinedCalls: 0,
        totalFailedCalls: 0,
        totalAudioCallsCompleted: 0,
        totalVideoCallsCompleted: 0,
        totalCallDurationMinutes: 0,
        averageCallDurationMinutes: 0
      };
    }

    const data = callStatsDoc.data();
    console.log('✅ Call stats fetched:', data);

    const callStats: CallStats = {
      callsToday: data.callsToday || 0,
      callDurationTodayMinutes: data.callDurationTodayMinutes || 0,
      totalCalls: data.totalCalls || 0,
      totalCompletedCalls: data.totalCompletedCalls || 0,
      totalDeclinedCalls: data.totalDeclinedCalls || 0,
      totalFailedCalls: data.totalFailedCalls || 0,
      totalAudioCallsCompleted: data.totalAudioCallsCompleted || 0,
      totalVideoCallsCompleted: data.totalVideoCallsCompleted || 0,
      totalCallDurationMinutes: data.totalCallDurationMinutes || 0,
      averageCallDurationMinutes: data.averageCallDurationMinutes || 0
    };

    return callStats;
  } catch (error) {
    console.error('❌ Error fetching call stats:', error);
    throw error;
  }
};
