  # Firebase Setup Guide

## Prerequisites

- Firebase account
- Firebase project created
- Firestore database enabled

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (tingatalk-53057)
3. Click the gear icon → Project settings
4. Scroll to "Your apps" section
5. Click the web app icon (</>)
6. Copy the configuration values

## Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tingatalk-53057.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tingatalk-53057
VITE_FIREBASE_STORAGE_BUCKET=tingatalk-53057.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=462676704637
VITE_FIREBASE_APP_ID=1:462676704637:web:...
```

## Step 3: Firestore Database Structure

The app expects the following collections:

### Required Collections:
- `admin_analytics` - Analytics data
  - `user_stats` - User statistics
  - `financial_stats` - Financial metrics
  - `call_stats` - Call statistics
- `users` - User profiles
- `male_users_admin` - Male user details
- `female_users_admin` - Female user details
- `rankings` - Top performers
  - `by_rating` - Top rated users

### User Subcollections:
- `users/{userId}/callLogs` - Individual call logs

## Step 4: Firestore Security Rules

Update your Firestore rules (firestore.rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin analytics - read only
    match /admin_analytics/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Users - read only for admin
    match /users/{userId} {
      allow read: if true;
      allow write: if false;
      
      match /callLogs/{callId} {
        allow read: if true;
        allow write: if false;
      }
    }
    
    // Admin collections - read only
    match /{collection}/{document=**} {
      allow read: if collection in ['male_users_admin', 'female_users_admin', 'rankings'];
      allow write: if false;
    }
  }
}
```

## Step 5: Deploy Rules

```bash
firebase deploy --only firestore:rules
```

## Step 6: Test Connection

Start the development server:
```bash
npm run dev
```

Navigate to the Analytics page. If you see data, Firebase is configured correctly!

## Troubleshooting

### Error: "Firebase not initialized"
- Check that `.env` file exists
- Verify all environment variables are set
- Restart the development server

### Error: "Permission denied"
- Check Firestore security rules
- Ensure collections exist in Firestore

### Error: "No data showing"
- Verify collections exist in Firestore
- Check that documents have data
- Open browser console for detailed errors

## Firebase Project Info

- **Project ID**: tingatalk-53057
- **Region**: Default (us-central)
- **Database**: (default)

## Support

For Firebase-specific issues, check the [Firebase Documentation](https://firebase.google.com/docs).
