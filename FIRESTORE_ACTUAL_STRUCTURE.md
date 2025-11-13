# 🔥 ACTUAL FIRESTORE STRUCTURE - TingaTalk Admin

## Project Information
- **Project ID:** tingatalk-53057
- **Database:** (default)
- **Last Verified:** November 11, 2025

---

## 📊 Collections Available

### 1. admin_analytics
Central analytics collection for admin dashboard

#### Documents:
- **user_stats** - User statistics and counts
- **financial_stats** - Revenue, payouts, and profit data
- **call_stats** - Call statistics and metrics

#### Subcollections:
- **financial_stats/RevenueByDate** - Daily revenue tracking

---

### 2. users
Main user collection (both male and female)

---

### 3. calls
Global call registry

---

### 4. rankings
Top performers rankings

#### Documents:
- **by_rating** - Top rated female users

---

### 5. female_users_admin
Denormalized female user data for admin queries

---

### 6. male_users_admin
Denormalized male user data for admin queries

---

### 7. transactions
Global transaction log

---

### 8. favorites
User favorites tracking

---

### 9. favorite_counts
Favorite count aggregations

---

### 10. female_earnings
Female user earnings tracking

---

## 📋 Actual Data Structure

### admin_analytics/user_stats
```javascript
{
  totalUsers: 2,
  totalMaleUsers: 1,
  totalFemaleUsers: 1,
  totalVerifiedFemales: 0,
  totalOnlineUsers: 0,
  activeUsersToday: 0,
  activeUsersThisWeek: 0,
  activeUsersThisMonth: 0,
  newUsersToday: 2,
  newUsersThisWeek: 0,
  newUsersThisMonth: 0,
  lastUpdated: Timestamp
}
```

### admin_analytics/financial_stats
```javascript
{
  totalRevenue: 396,           // Total coins purchased (INR)
  todayRevenue: 396,
  thisWeekRevenue: 0,
  thisMonthRevenue: 0,
  totalPayouts: 0,             // Completed withdrawals
  pendingPayouts: 35.4,        // Female earnings not yet withdrawn
  todayPayouts: 0,
  thisWeekPayouts: 0,
  thisMonthPayouts: 0,
  netProfit: 396,              // totalRevenue - totalPayouts
  trueProfit: 360.6,           // totalRevenue - pendingPayouts
  pendingWithdrawalRequests: 0,
  pendingWithdrawalAmount: 0,
  lastUpdated: Timestamp
}
```

### admin_analytics/call_stats
```javascript
{
  totalCalls: 6,
  totalCompletedCalls: 6,
  totalVideoCallsCompleted: 2,
  totalAudioCallsCompleted: 4,
  totalFailedCalls: 0,
  totalDeclinedCalls: 0,
  totalCallDurationMinutes: 1.73,
  averageCallDurationMinutes: 0.29,
  callsToday: 6,
  callDurationTodayMinutes: 1.73,
  callsThisWeek: 0,
  callDurationThisWeekMinutes: 0,
  callsThisMonth: 0,
  callDurationThisMonthMinutes: 0,
  lastUpdated: Timestamp
}
```

### rankings/by_rating
```javascript
{
  topFemales: [
    {
      userId: "user_1762845643411_9150272441",
      name: "Lisa",
      avatarUrl: "assets/Female Avatar/fem7_dp.png",
      rating: 8.3,
      totalLikes: 5,
      totalCalls: 6,
      favoritedByCount: 1
    }
  ],
  count: 1,
  lastUpdated: Timestamp
}
```

### female_users_admin/{userId}
```javascript
{
  userId: string,
  name: string,
  phoneNumber: string,
  age: number,
  city: string | null,
  joinedAt: Timestamp,
  lastActiveAt: Timestamp,
  isActive: boolean,
  
  // Rating
  rating: number,
  totalLikes: number,
  totalDislikes: number,
  
  // Calls
  totalCallsReceived: number,
  totalCallDurationMinutes: number,
  totalVideoCallsReceived: number,
  totalAudioCallsReceived: number,
  
  // Earnings
  totalEarningsINR: number,
  availableBalanceINR: number,
  claimedAmountINR: number,
  highestDayEarningsINR: number,
  highestDayEarningsDate: string,
  todayEarningsINR: number,
  
  // Popularity
  favoritedByCount: number,
  
  lastUpdated: Timestamp
}
```

### male_users_admin/{userId}
```javascript
{
  userId: string,
  name: string,
  phoneNumber: string,
  age: number,
  city: string | null,
  joinedAt: Timestamp,
  lastActiveAt: Timestamp,
  isActive: boolean,
  
  // Calls
  totalCallsMade: number,
  totalCallDurationMinutes: number,
  totalVideoCallsMade: number,
  totalAudioCallsMade: number,
  
  // Financial
  totalCoinsPurchased: number,
  totalPurchaseCount: number,
  totalCoinsSpent: number,
  currentBalance: number,
  totalSpentINR: number,
  
  // Favorites
  favoritesCount: number,
  
  // Daily Rewards
  currentStreak: number,
  highestStreak: number,
  totalDailyRewardsCollected: number,
  
  lastUpdated: Timestamp
}
```

---

## 🔍 Query Patterns

### Get Admin Analytics
```javascript
// User stats
const userStatsDoc = await getDoc(doc(db, 'admin_analytics', 'user_stats'));

// Financial stats
const financialStatsDoc = await getDoc(doc(db, 'admin_analytics', 'financial_stats'));

// Call stats
const callStatsDoc = await getDoc(doc(db, 'admin_analytics', 'call_stats'));
```

### Get Top Performers
```javascript
// Top earners
const topEarnersQuery = query(
  collection(db, 'female_users_admin'),
  orderBy('totalEarningsINR', 'desc'),
  limit(10)
);

// Top rated
const rankingsDoc = await getDoc(doc(db, 'rankings', 'by_rating'));

// Top callers
const topCallersQuery = query(
  collection(db, 'female_users_admin'),
  orderBy('totalCallsReceived', 'desc'),
  limit(10)
);
```

---

## 💡 Key Insights

1. **Revenue Tracking:**
   - Total revenue comes from coin purchases by male users
   - Pending payouts represent female earnings not yet withdrawn
   - True profit = totalRevenue - pendingPayouts

2. **Call Statistics:**
   - All calls are tracked in real-time
   - Separate counts for audio and video calls
   - Duration tracked in minutes

3. **User Management:**
   - Separate admin collections for male and female users
   - Denormalized data for fast queries
   - Activity tracking for engagement metrics

4. **Rankings:**
   - Currently only by_rating is populated
   - Can add by_earnings and by_favorites as needed
   - Updated in real-time via Cloud Functions

---

## 🚀 Next Steps

1. ✅ Analytics service updated to use admin_analytics
2. ✅ Test connection file created
3. ⏳ Test the connection using test-analytics-connection.html
4. ⏳ Verify data displays correctly in admin dashboard
5. ⏳ Add revenue chart using RevenueByDate subcollection

---

## 📝 Notes

- All timestamps are Firestore Timestamp objects
- Financial values are in INR (Indian Rupees)
- Call durations are in minutes
- Ratings are on a scale of 0-10
- User IDs follow format: user_{timestamp}_{phoneNumber}
