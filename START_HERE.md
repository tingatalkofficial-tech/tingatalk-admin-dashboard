# Quick Start Guide

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Copy `.env.example` to `.env` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to: http://localhost:5173

## Main Features

### Analytics Dashboard
- View real-time financial metrics
- Track call statistics
- Monitor user growth

### User Management
- Browse all users (male and female)
- View detailed user profiles
- Track user activity and statistics

### Call Management
- View call statistics overview
- Access individual user call logs
- Monitor call durations and types

## Project Structure

```
src/
├── pages/              # Main pages (Dashboard, Analytics, Users, Calls)
├── components/         # Reusable UI components
├── services/          # Firebase integration
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

## Need Help?

See `FIREBASE_SETUP_GUIDE.md` for detailed Firebase configuration.

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.
