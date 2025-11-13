# Dating App Analytics Dashboard - Frontend Structure

## Overview
Frontend screens built for displaying dating app analytics with the same UI theme (colors, fonts, and elements) as the existing dashboard.

## Analytics Metrics Displayed

### 💵 Revenue Overview
1. **Total Earnings** - Total revenue from the entire app (INR)
2. **Audio Call Earnings** - Revenue from audio calls (INR)
3. **Video Call Earnings** - Revenue from video calls (INR)
4. **Coin Purchase Revenue** - Revenue from male users purchasing coins (INR)

### 📞 Call Statistics
1. **Total Calls** - Total number of calls made
2. **Audio Calls** - Total audio calls
3. **Video Calls** - Total video calls

### 👥 User Statistics
1. **Total Users** - Total registered users
2. **Male Users** - Total male users
3. **Female Users** - Total female service providers

### 🏆 Top Performers
1. **Top 3 Earners** - Female users with highest earnings
2. **Top 3 Rated** - Female users with highest ratings
3. **Top 3 Most Calls** - Female users with most calls attended

## Pricing Model
- **Audio Calls**: 
  - Male: 0.15 coins/second deducted
  - Female: 0.1 INR/second earned
- **Video Calls**: 
  - Male: 0.8 coins/second deducted
  - Female: 0.8 INR/second earned

## Components Created

### Analytics Components
- `src/components/Analytics/EarningsCard.tsx` - Displays earnings metrics
- `src/components/Analytics/CallStatsCard.tsx` - Displays call statistics
- `src/components/Analytics/UserStatsCard.tsx` - Displays user statistics
- `src/components/Analytics/TopUserCard.tsx` - Individual top user card
- `src/components/Analytics/TopUsersSection.tsx` - Section for top performers

### Pages
- `src/pages/AnalyticsDashboard.tsx` - Main analytics dashboard page

### Context & Types
- `src/context/AnalyticsContext.tsx` - Analytics data provider (ready for Firebase integration)
- `src/types/analytics.ts` - TypeScript type definitions

## Design Theme
- **Primary Color**: `#1e4841` (Dark green)
- **Background**: `#ecf4e9` (Light green)
- **Card Background**: `#ffffff` (White)
- **Border**: `#e4e6e5` (Light gray)
- **Success**: `#bbf49c` (Light green)
- **Error**: `#fcced1` (Light red)
- **Font**: Urbanist

## Next Steps
The frontend is ready. Next phase will be:
1. Connect to Firebase Firestore
2. Query collections for call data, user data, and earnings
3. Calculate analytics in real-time
4. Implement data refresh functionality

## File Structure
```
src/
├── components/
│   └── Analytics/
│       ├── EarningsCard.tsx
│       ├── CallStatsCard.tsx
│       ├── UserStatsCard.tsx
│       ├── TopUserCard.tsx
│       └── TopUsersSection.tsx
├── context/
│   └── AnalyticsContext.tsx
├── pages/
│   └── AnalyticsDashboard.tsx
└── types/
    └── analytics.ts
```
