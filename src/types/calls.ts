export interface CallStats {
  // Today's stats
  callsToday: number;
  callDurationTodayMinutes: number;
  
  // Total stats
  totalCalls: number;
  totalCompletedCalls: number;
  totalDeclinedCalls: number;
  totalFailedCalls: number;
  
  // Call type stats
  totalAudioCallsCompleted: number;
  totalVideoCallsCompleted: number;
  
  // Duration stats
  totalCallDurationMinutes: number;
  averageCallDurationMinutes: number;
}
