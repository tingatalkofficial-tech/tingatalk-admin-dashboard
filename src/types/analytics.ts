// Type definitions for dating app analytics

export interface EarningsStat {
  id: string;
  label: string;
  amount: number;
  change?: number;
  icon: string;
  currency: 'INR' | 'COINS';
}

export interface CallStat {
  id: string;
  label: string;
  count: number;
  change?: number;
  icon: string;
}

export interface UserStat {
  id: string;
  label: string;
  count: number;
  change?: number;
  icon: string;
}

export interface TopFemaleUser {
  id: string;
  name: string;
  avatar?: string;
  earnings?: number;
  rating?: number;
  totalCalls?: number;
  rank: number;
}

export interface AnalyticsData {
  totalEarnings: number;
  audioCallEarnings: number;
  videoCallEarnings: number;
  coinPurchaseEarnings: number;
  totalCalls: number;
  totalAudioCalls: number;
  totalVideoCalls: number;
  totalUsers: number;
  totalMaleUsers: number;
  totalFemaleUsers: number;
  topEarners: TopFemaleUser[];
  topRated: TopFemaleUser[];
  topCallers: TopFemaleUser[];
}
