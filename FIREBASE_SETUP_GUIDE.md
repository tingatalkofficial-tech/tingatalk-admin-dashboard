# Firebase Setup Guide for Analytics Dashboard

## ✅ What's Already Done

1. **Firebase CLI Connected** - Project: tingatalk-53057
2. **Frontend Components Built** - All analytics UI components ready
3. **Firebase SDK Integrated** - Analytics service created
4. **Firestore Structure Mapped** - Based on your collections

## 🔧 What You Need to Do

### Step 1: Get Firebase Web App Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **tingatalk-53057**
3. Click the gear icon ⚙️ > **Project Settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** > **Web** (</>) icon
6. Copy the `firebaseConfig` object

### Step 2: Update .env File

Open the `.env` file in your project root and replace the placeholder values:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=tingatalk-53057.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tingatalk-53057
VITE_FIREBASE_STORAGE_BUCKET=tingatalk-53057.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### Step 3: Restart Development Server

After updating .env:
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## 📊 Firestore Collections Used

The analytics dashboard reads from these collections:

### 1. `users` Collection
- **Document ID**: user_[timestamp]_[phone]
- **Fields Used**:
  - `displayName` (string) - User's display name
  - `gender` (string) - "male" or "female"
  - `profileImage` (string, optional) - Avatar URL

### 2. `femal_earnings` Collection
- **Document ID**: user_[timestamp]_[phone] (matches user ID)
- **Fields Used**:
  - `totalEarnings` (number) - Total INR earned
  - `totalCalls` (number) - Total calls attended
  - `totalAudioCalls` (number) - Audio calls count
  - `rating` (number) - User rating (0-10)
  - `availableBalance` (number) - Current balance
  - `claimedAmount` (number) - Amount claimed

### 3. `favourite_counts` Collection (Optional)
- **Document ID**: user_[timestamp]_[phone]
- **Fields Used**:
  - `count` (number) - Number of favorites

## 📈 Analytics Calculated

### Revenue Metrics
1. **Total Earnings** - Sum of all `totalEarnings` from `femal_earnings`
2. **Audio Call Earnings** - Calculated from audio call ratio
3. **Video Call Earnings** - Calculated from video call ratio
4. **Coin Purchase Revenue** - Platform fee (10% of total earnings)

### Call Statistics
1. **Total Calls** - Sum of all `totalCalls`
2. **Audio Calls** - Sum of all `totalAudioCalls`
3. **Video Calls** - Total calls minus audio calls

### User Statistics
1. **Total Users** - Count of all documents in `users`
2. **Male Users** - Count where `gender === "male"`
3. **Female Users** - Count where `gender === "female"`

### Top Performers
1. **Top 3 Earners** - Sorted by `totalEarnings` (descending)
2. **Top 3 Rated** - Sorted by `rating` (descending)
3. **Top 3 Most Calls** - Sorted by `totalCalls` (descending)

## 🔒 Security Notes

1. **Firestore Rules** - Already configured for read-only access
2. **Environment Variables** - Never commit `.env` to git
3. **Authentication** - Consider adding Firebase Auth for admin access

## 🐛 Troubleshooting

### Error: "Permission denied"
- Check Firestore rules allow read access
- Ensure you're authenticated if rules require it

### Error: "Firebase not initialized"
- Verify `.env` file has correct values
- Restart dev server after changing `.env`

### Data not showing
- Check Firebase Console to verify data exists
- Open browser console to see error messages
- Click "Refresh" button in the dashboard

## 🚀 Next Steps

1. **Add Authentication** - Secure admin access
2. **Real-time Updates** - Use Firestore listeners instead of manual refresh
3. **Date Filters** - Add date range selection for analytics
4. **Export Data** - Add CSV/PDF export functionality
5. **Charts** - Add visual charts for trends

## 📝 Pricing Model Reference

- **Audio Calls**:
  - Male pays: 0.15 coins/second
  - Female earns: 0.1 INR/second
  
- **Video Calls**:
  - Male pays: 0.8 coins/second
  - Female earns: 0.8 INR/second
