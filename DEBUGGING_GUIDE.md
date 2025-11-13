# 🐛 Debugging Guide - Analytics Showing Zero

## Issue: User analytics work, but earnings/calls show 0

### Step 1: Check Firebase Configuration

**Open your browser console (F12) and look for:**

```
🔍 Fetching analytics data...
✅ Fetched X users
👨 Male users: X, 👩 Female users: X
💰 Fetched X female earnings records
📊 Sample earnings data: {...}
💵 Total Earnings: ₹X
📞 Total Calls: X (Audio: X, Video: X)
✅ Analytics data calculated: {...}
```

### Step 2: Verify Firebase Config

**Check `.env` file has real values:**
```env
VITE_FIREBASE_API_KEY=AIza... (should start with AIza)
VITE_FIREBASE_APP_ID=1:... (should have colons)
```

**If values are still "YOUR_API_KEY_HERE":**
1. Go to Firebase Console
2. Project Settings > Your apps
3. Copy the actual config values
4. Update `.env`
5. Restart dev server

### Step 3: Check Firestore Data

**In Firebase Console:**
1. Go to Firestore Database
2. Check `femal_earnings` collection exists
3. Click on a document
4. Verify these fields exist:
   - `totalEarnings` (number)
   - `totalCalls` (number)
   - `totalAudioCalls` (number)
   - `rating` (number)

### Step 4: Check Firestore Rules

**In Firebase Console > Firestore > Rules:**

Should allow read access:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;  // For testing
      allow write: if false;
    }
  }
}
```

### Step 5: Common Issues

#### Issue: "Permission denied"
**Solution:** Update Firestore rules to allow read

#### Issue: "Firebase not initialized"
**Solution:** 
- Check `.env` has correct values
- Restart dev server: `npm run dev`

#### Issue: Data exists but shows 0
**Possible causes:**
1. Field names don't match (case-sensitive!)
   - Should be: `totalEarnings` not `TotalEarnings`
   - Should be: `totalCalls` not `total_calls`

2. Data type mismatch
   - Fields should be numbers, not strings
   - Check in Firebase Console

3. Collection name typo
   - Should be: `femal_earnings` (as you specified)
   - Not: `female_earnings`

### Step 6: Manual Test

**Open browser console and run:**

```javascript
// Test Firebase connection
import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/utils/firebase';

// Check users
const users = await getDocs(collection(db, 'users'));
console.log('Users count:', users.size);

// Check female earnings
const earnings = await getDocs(collection(db, 'femal_earnings'));
console.log('Earnings count:', earnings.size);
earnings.forEach(doc => {
  console.log(doc.id, doc.data());
});
```

### Step 7: Check Network Tab

**In browser DevTools > Network tab:**
1. Refresh the page
2. Look for requests to `firestore.googleapis.com`
3. Check if they return 200 OK or errors
4. Click on a request to see response data

### Expected Console Output

**If working correctly:**
```
🔍 Fetching analytics data...
✅ Fetched 10 users
👨 Male users: 5, 👩 Female users: 5
💰 Fetched 5 female earnings records
📊 Sample earnings data: {
  userId: "user_1758437441394_9345364408",
  totalEarnings: 420.4999999,
  totalCalls: 22,
  totalAudioCalls: 9,
  rating: 6.8,
  ...
}
💵 Total Earnings: ₹420.5
📞 Total Calls: 22 (Audio: 9, Video: 13)
✅ Analytics data calculated: { totalEarnings: 420.5, ... }
```

**If NOT working:**
```
❌ Error fetching analytics data: [error message]
```

### Quick Checklist

- [ ] `.env` file has real Firebase config (not placeholders)
- [ ] Dev server restarted after updating `.env`
- [ ] Firestore rules allow read access
- [ ] `femal_earnings` collection exists in Firestore
- [ ] Documents have `totalEarnings`, `totalCalls`, `totalAudioCalls` fields
- [ ] Field values are numbers, not strings
- [ ] Browser console shows no errors

### Still Not Working?

**Share the console output with:**
1. Any error messages (red text)
2. The log output from fetching data
3. Screenshot of your Firestore structure

---

**Most Common Fix:** Update `.env` with real Firebase config and restart server! 🔥
