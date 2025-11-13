# 🚀 Quick Start Guide

## ✅ What's Built

### 3 Complete Screens:

1. **📊 Analytics Dashboard** - Revenue, calls, users, top performers
2. **👥 Users Management** - List all users, filter by gender, search
3. **📋 User Details** - Complete profile, earnings, call history

---

## ⚡ 2-Minute Setup

### Step 1: Get Firebase Config (2 minutes)

1. Go to https://console.firebase.google.com/
2. Select **tingatalk-53057**
3. Click ⚙️ → **Project Settings**
4. Scroll to **Your apps** → Click **Web app** (or add one)
5. Copy the config values

### Step 2: Update `.env` File

Open `.env` and paste your values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tingatalk-53057.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tingatalk-53057
VITE_FIREBASE_STORAGE_BUCKET=tingatalk-53057.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123...
VITE_FIREBASE_APP_ID=1:123...
```

### Step 3: Restart Server

```bash
# Press Ctrl+C in terminal
npm run dev
```

### Step 4: Open Dashboard

http://localhost:5173/

---

## 🎯 How to Use

### View Analytics
1. Open http://localhost:5173/analytics
2. See all metrics and top performers
3. Click 🔄 Refresh to update data

### Browse Users
1. Click **"Users"** in sidebar
2. Toggle between All/Male/Female
3. Search by name or ID
4. Click any user card

### View User Details
1. Click any user from the list
2. See complete profile
3. For females: earnings, calls, daily history
4. Click "← Back to Users" to return

---

## 🐛 Troubleshooting

### Data shows 0?
→ Add Firebase config to `.env` and restart

### "Permission denied"?
→ Check Firestore rules allow read access

### Users not loading?
→ Open browser console (F12) to see errors

---

## 📚 Full Documentation

- `COMPLETE_FEATURES.md` - All features explained
- `START_HERE.md` - Detailed setup
- `FIREBASE_SETUP_GUIDE.md` - Firebase configuration
- `DEBUGGING_GUIDE.md` - Troubleshooting help

---

**Dashboard:** http://localhost:5173/
**Status:** ✅ Ready (needs Firebase config)
