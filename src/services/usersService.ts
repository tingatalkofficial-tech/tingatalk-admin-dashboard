import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { User, UserDetail } from '../types/users';

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users: User[] = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        displayName: data.displayName || data.name || 'Unknown',
        gender: data.gender,
        age: data.age,
        createdAt: data.createdAt,
        phoneNumber: data.phoneNumber,
        profileImage: data.profilePhotoUrl || data.avatarUrl || undefined,
        isOnline: data.isOnline || false,
        isVerified: data.isVerified || false,
        totalEarnings: data.totalEarnings || 0,
        totalCalls: data.totalCalls || data.totalCallsMade || 0,
        coins: data.coins || 0,
      } as User;
    });

    console.log(`Fetched ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserDetail = async (userId: string): Promise<UserDetail> => {
  try {
    // Fetch user basic info
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const rawData = userDoc.data();
    const userData = { id: userDoc.id, ...rawData } as User;
    const userDetail: UserDetail = { ...userData };

    // Male user: build admin data directly from users document
    // All stats are written here by MaleUserTrackingService + backend payments
    if (userData.gender === 'male') {
      userDetail.maleAdminData = {
        userId,
        name: rawData.name || rawData.displayName || '',
        phoneNumber: rawData.phoneNumber || '',
        age: rawData.age || 0,
        joinedAt: rawData.createdAt || null,
        lastActiveAt: rawData.lastActiveAt || null,
        // Call stats (written by MaleUserTrackingService to users doc)
        totalCallsMade: rawData.totalCallsMade || 0,
        totalCallDurationMinutes: rawData.totalCallDurationMinutes || 0,
        totalVideoCallsMade: rawData.totalVideoCallsMade || 0,
        totalAudioCallsMade: rawData.totalAudioCallsMade || 0,
        // Financial (written by backend + MaleUserTrackingService to users doc)
        totalCoinsPurchased: rawData.totalCoinsPurchased || 0,
        totalPurchaseCount: rawData.totalPurchaseCount || 0,
        totalCoinsSpent: rawData.totalCoinsSpent || 0,
        currentBalance: rawData.coins ?? rawData.coinBalance ?? 0,
        totalSpentINR: rawData.totalSpentINR || 0,
        // Favorites
        favoritesCount: rawData.favoritesCount || 0,
        // Daily Rewards (written by daily_rewards_service to users doc)
        currentStreak: rawData.currentStreak || 0,
        highestStreak: rawData.highestStreak || 0,
        totalDailyRewardsCollected: rawData.totalDailyRewardsCollected || 0,
      } as any;
      console.log('✅ Built male admin data from users doc');
    }

    // Female user: build admin data from users doc + female_earnings (source of truth)
    if (userData.gender === 'female') {
      // Fetch earnings data from female_earnings collection (source of truth for financial + call stats)
      let earningsData: Record<string, any> = {};
      let todayEarnings = 0;
      try {
        const now = new Date();
        const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const [femaleEarningsDoc, todayDoc] = await Promise.all([
          getDoc(doc(db, 'female_earnings', userId)),
          getDoc(doc(db, 'female_earnings', userId, 'daily', dateKey))
        ]);

        if (femaleEarningsDoc.exists()) {
          earningsData = femaleEarningsDoc.data();
          console.log('✅ Fetched female_earnings data');
        }
        if (todayDoc.exists()) {
          todayEarnings = todayDoc.data().earnings || 0;
        }
      } catch (err) {
        console.warn('Could not fetch female earnings for user:', userId);
      }

      userDetail.femaleAdminData = {
        userId,
        name: rawData.name || rawData.displayName || '',
        phoneNumber: rawData.phoneNumber || '',
        age: rawData.age || 0,
        joinedAt: rawData.createdAt || null,
        lastActiveAt: rawData.lastActiveAt || null,
        // Rating & feedback (from users doc, written by statsSyncUtil / powerup_service)
        rating: earningsData.rating ?? rawData.rating ?? 0,
        totalLikes: earningsData.totalLikes ?? rawData.totalLikes ?? 0,
        totalDislikes: earningsData.totalDislikes ?? rawData.totalDislikes ?? 0,
        // Calls (from female_earnings — source of truth)
        totalCallsReceived: earningsData.totalCalls || 0,
        totalCallDurationMinutes: Math.round(((earningsData.totalDurationSeconds || 0) / 60) * 10) / 10,
        totalVideoCallsReceived: earningsData.totalVideoCalls || 0,
        totalAudioCallsReceived: earningsData.totalAudioCalls || 0,
        // Earnings (from female_earnings — source of truth)
        totalEarningsINR: earningsData.totalEarnings || 0,
        availableBalanceINR: earningsData.availableBalance || 0,
        pendingAmountINR: earningsData.pendingAmount || 0,
        claimedAmountINR: earningsData.claimedAmount || 0,
        todayEarningsINR: todayEarnings,
        // Popularity (from users doc)
        favoritedByCount: rawData.favoritedByCount || 0,
      } as any;
      console.log('✅ Built female admin data from users + female_earnings');
    }

    return userDetail;
  } catch (error) {
    console.error('❌ Error fetching user detail:', error);
    throw error;
  }
};
