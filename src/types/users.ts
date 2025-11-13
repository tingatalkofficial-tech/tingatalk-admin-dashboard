// User management types

export interface User {
  id: string;
  displayName: string;
  gender: 'male' | 'female';
  age?: number;
  createdAt?: any;
  dailyRewardCount?: number;
  profileImage?: string;
  phoneNumber?: string;
}

export interface FemaleEarnings {
  userId: string;
  availableBalance: number;
  claimedAmount: number;
  rating: number;
  totalAudioCalls: number;
  totalCalls: number;
  totalEarnings: number;
  totalPowerUps: number;
}

export interface DailyEarning {
  date: string;
  audioCalls: number;
  calls: number;
  earnings: number;
  videoCalls: number;
}

export interface FavoriteCount {
  userId: string;
  count: number;
}

export interface MaleUserAdmin {
  userId: string;
  name: string;
  phoneNumber: string;
  age: number;
  joinedAt: any;
  lastActiveAt: any;
  
  // Call Stats
  totalCallsMade: number;
  totalCallDurationMinutes: number;
  totalVideoCallsMade: number;
  totalAudioCallsMade: number;
  
  // Financial
  totalCoinsPurchased: number;
  totalPurchaseCount: number;
  totalCoinsSpent: number;
  currentBalance: number;
  totalSpentINR: number;
  
  // Favorites
  favoritesCount: number;
  
  // Daily Rewards
  currentStreak: number;
  highestStreak: number;
  totalDailyRewardsCollected: number;
}

export interface FemaleUserAdmin {
  userId: string;
  name: string;
  phoneNumber: string;
  age: number;
  joinedAt: any;
  lastActiveAt: any;
  
  // Rating
  rating: number;
  totalLikes: number;
  totalDislikes: number;
  
  // Calls
  totalCallsReceived: number;
  totalCallDurationMinutes: number;
  totalVideoCallsReceived: number;
  totalAudioCallsReceived: number;
  
  // Earnings
  totalEarningsINR: number;
  availableBalanceINR: number;
  claimedAmountINR: number;
  highestDayEarningsINR: number;
  highestDayEarningsDate: string;
  todayEarningsINR: number;
  
  // Popularity
  favoritedByCount: number;
}

export interface UserDetail extends User {
  earnings?: FemaleEarnings;
  dailyEarnings?: DailyEarning[];
  favoriteCount?: number;
  maleAdminData?: MaleUserAdmin;
  femaleAdminData?: FemaleUserAdmin;
}
