# TingaTalk Admin Dashboard

A comprehensive admin dashboard for managing the TingaTalk dating and calling application. Built with React, TypeScript, and Firebase.

## Features

- **Analytics Dashboard**: Real-time metrics for revenue, calls, and user statistics
- **User Management**: Detailed views for male and female users with comprehensive data
- **Call Management**: Track call statistics and view individual user call logs
- **Firebase Integration**: Real-time data synchronization with Firestore
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: React Context API
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account with Firestore enabled
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tingatalkofficial-tech/tingatalk-admin-dashboard.git
cd tingatalk-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration values
   - See `FIREBASE_SETUP_GUIDE.md` for detailed instructions

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Project Structure

```
tingatalk-admin-dashboard/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Main application pages
│   ├── services/       # Firebase and API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── context/        # React context providers
├── public/             # Static assets
└── firebase.json       # Firebase configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Setup

See `FIREBASE_SETUP_GUIDE.md` for detailed Firebase configuration instructions.

## Documentation

- `START_HERE.md` - Quick start guide
- `FIREBASE_SETUP_GUIDE.md` - Firebase configuration guide

## License

Private - TingaTalk © 2025

## Contact

For support or inquiries, contact: tingatalkofficial@gmail.com
