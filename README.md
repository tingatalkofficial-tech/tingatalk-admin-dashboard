# COINEST - Financial Dashboard

A modern, fully responsive financial dashboard built with React, TypeScript, and Tailwind CSS. Features a beautiful UI with comprehensive financial tracking, savings plans, and analytics.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173/`

## 🛠️ Tech Stack

- **React** 18.2 - UI library
- **TypeScript** 5.1 - Type safety
- **Vite** 4.3 - Build tool
- **Tailwind CSS** 3.3 - Styling
- **Urbanist Font** - Typography

## 📁 Project Structure

```
src/
├── Assets/              # Images and static assets
│   ├── logo.png        # COINEST logo
│   └── reference images
├── components/          # Reusable UI components
│   ├── Card/           # Financial card components
│   ├── DailyLimit/     # Daily spending limit
│   ├── Header/         # Header with search and profile
│   ├── SavingPlans/    # Savings plan components
│   ├── Sidebar/        # Navigation sidebar
│   └── Stats/          # Financial statistics
├── context/            # React Context for state
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── page/               # Global styles
└── App.tsx             # Root component
```

## ✨ Features

### Core Functionality
- 💳 **Financial Card** - Display balance, card details
- 📊 **Statistics Dashboard** - Income, expenses, savings tracking
- 💰 **Saving Plans** - Multiple savings goals with progress tracking
- 📈 **Daily Limit** - Spending limit monitoring
- ⚡ **Quick Actions** - Top-up, transfer, request, history

### Responsive Design
- 📱 **Mobile** (320px+) - Single column, hamburger menu
- 📱 **Tablet** (640px-1023px) - Two-column layout
- 💻 **Desktop** (1024px+) - Full layout with sidebar

### UI/UX
- 🎨 Modern, clean design
- 🌈 Consistent color scheme
- ✨ Smooth animations and transitions
- 👆 Touch-optimized for mobile
- ♿ Accessible components
- 🎯 Intuitive navigation

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | 320px - 639px | Single column, hidden sidebar |
| Tablet | 640px - 1023px | Two columns, visible sidebar |
| Desktop | 1024px+ | Fixed + flexible columns |

## 🎨 Design System

### Colors
- **Background**: `#ecf4e9` (Light green)
- **Content**: `#fbfbfc` (Off-white)
- **Primary**: `#1e4841` (Dark green)
- **Accent**: `#bbf49c` (Light green)
- **Text**: `#232d2c` (Dark gray)

### Typography
- **Font**: Urbanist
- **Weights**: 400, 500, 600, 700

## 📖 Documentation

Comprehensive documentation is available:

- **[RESPONSIVE_DESIGN_GUIDE.md](./RESPONSIVE_DESIGN_GUIDE.md)** - Implementation details
- **[RESPONSIVE_TESTING_CHECKLIST.md](./RESPONSIVE_TESTING_CHECKLIST.md)** - Testing guide
- **[VISUAL_COMPARISON_GUIDE.md](./VISUAL_COMPARISON_GUIDE.md)** - Visual reference
- **[RESPONSIVE_IMPLEMENTATION_SUMMARY.md](./RESPONSIVE_IMPLEMENTATION_SUMMARY.md)** - Summary

## 🧪 Testing

### Manual Testing
1. Start dev server: `npm run dev`
2. Open browser DevTools (F12)
3. Enable device toolbar (Ctrl+Shift+M)
4. Test at different breakpoints:
   - 375px (iPhone)
   - 768px (iPad)
   - 1024px (Desktop)
   - 1440px (Large Desktop)

### What to Test
- ✅ Mobile menu functionality
- ✅ Layout responsiveness
- ✅ Component rendering
- ✅ Interactive elements
- ✅ No horizontal scrolling
- ✅ Logo display

See [RESPONSIVE_TESTING_CHECKLIST.md](./RESPONSIVE_TESTING_CHECKLIST.md) for detailed testing steps.

## 🏗️ Component Architecture

### Context Provider
- `DashboardContext` - Manages global state for dashboard data

### Main Components
- `Dashboard` - Main page layout
- `Sidebar` - Navigation with mobile menu
- `Header` - Search, notifications, user profile
- `FinancialCard` - Card display with balance
- `QuickActions` - Action buttons
- `DailyLimit` - Spending limit tracker
- `SavingPlans` - Savings goals
- `FinancialStats` - Income/expense/savings stats

## 🔧 Development

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Mobile-first responsive design

### Best Practices
- Component modularity
- Type definitions for all props
- Consistent naming conventions
- Clean, readable code
- Proper error handling

## 📦 Build

```bash
# Production build
npm run build

# Output directory: dist/
```

The build is optimized for production with:
- Minified JavaScript
- Optimized CSS
- Asset optimization
- Code splitting

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project was generated and enhanced for responsive design.

## 🤝 Contributing

1. Follow the existing code style
2. Test on all breakpoints
3. Ensure no console errors
4. Update documentation if needed

## 📞 Support

For issues or questions, refer to the documentation files or check the code comments.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
