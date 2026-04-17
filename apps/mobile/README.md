# 📱 VCSA Pocket - Mobile App

**AI Sales Coach for Vacation Club Sales Professionals**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- For physical device testing: Expo Go app

### Installation

```bash
# Install dependencies
cd apps/mobile
npm install

# Start development server
npm start

# Or for specific platforms
npm run ios     # iOS Simulator
npm run android   # Android Emulator
npm run web      # Web browser (development only)
```

### With Physical Device

```bash
# 1. Install Expo Go on your device
# - iOS: App Store
# - Android: Google Play Store

# 2. Start development server
npm start

# 3. Scan QR code with Expo Go app
```

---

## 📂 Project Structure

```
apps/mobile/
├── src/
│   ├── components/         # UI Components
│   │   ├── ai-coach/       # AI Coach specific components
│   │   ├── quick-wins/     # Quick Wins components
│   │   ├── performance/    # Performance tracking components
│   │   └── shared/         # Shared/reusable components
│   ├── screens/            # App Screens
│   │   ├── Dashboard.tsx
│   │   ├── PreTourMode.tsx
│   │   ├── AICoachChat.tsx
│   │   ├── QuickWinsLibrary.tsx
│   │   └── PostTourDebrief.tsx
│   ├── services/          # Business Logic
│   │   ├── api/           # API client
│   │   ├── ai/            # AI Coach services
│   │   └── sync/          # Offline sync services
│   ├── store/             # Redux Store
│   │   ├── slices/        # Redux slices
│   │   └── hooks.ts       # Custom hooks
│   ├── navigation/        # Navigation config
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── App.tsx                # Root component
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── app.json              # Expo config
```

---

## 🎯 Features

### 1. **AI Coach** 🤖
Real-time sales coaching with 3 different approaches:
- Emotional approach
- Logical approach
- Story-based approach

### 2. **Quick Wins Library** ⚡
50+ battle-tested sales tactics organized by:
- Before tour preparation
- Closing techniques
- Objection handling
- Relationship building

### 3. **Pre-Tour Mode** 🎯
2-minute mental preparation before each tour:
- Mindset affirmation
- Quick Win of the day
- Objection preparation
- Daily goal reminder

### 4. **Performance Tracking** 📊
Daily performance metrics:
- Readiness score calculation
- Daily goals tracking
- Weekly trends
- Team comparison

### 5. **Post-Tour Debrief** 📝
1-minute reflection after each tour:
- Tour outcome recording
- Confidence tracking
- AI-generated insights
- Automatic learning loop

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

### Environment Variables

Create a `.env` file in the `apps/mobile` directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8001/api

# Feature Flags
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_OFFLINE=true
```

For go-live planning, `apps/mobile` should be treated as the canonical mobile app. `vcsa-mobile` is useful as legacy/reference work, but not as the primary shipping base.

---

## 🔌 API Integration

### Mobile-Specific Endpoints

The app connects to VCSA Core backend via these endpoints:

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**AI Coach:**
- `POST /api/mobile/ai/coach` - Generate coaching response

**Quick Wins:**
- `GET /api/mobile/quick-wins` - Get quick wins library
- `POST /api/mobile/quick-wins/:id/favorite` - Toggle favorite

**Performance:**
- `GET /api/mobile/performance/readiness` - Get readiness score
- `GET /api/mobile/performance/daily-goal` - Get daily goals
- `POST /api/mobile/performance/tour` - Record tour result

**Sync:**
- `GET /api/mobile/sync/content` - Sync offline content

---

## 📱 Platform Support

### iOS
- **Minimum Version**: iOS 13+
- **Tested On**: iPhone 12+, iPad Pro
- **Build**: Xcode 14+

### Android
- **Minimum Version**: Android 8+ (API 26+)
- **Tested On**: Pixel 5+, Samsung Galaxy S21+
- **Build**: Android Studio 2023+

### Web (Development Only)
- **Browser**: Chrome 90+, Safari 14+
- **Purpose**: Development and testing
- **Note**: Not for production use

---

## 🎨 Design System

### Colors
```typescript
Colors = {
  primary: '#D4AF37',      // Gold
  secondary: '#1E3A8A',    // Navy
  background: '#020204',   // Dark background
  surface: '#1E293B',      // Card background
  text: '#F1F5F9',         // Primary text
  textSecondary: '#94A3B8'  // Secondary text
}
```

### Typography
```typescript
Typography = {
  h1: { fontSize: 32, fontWeight: '700', fontFamily: 'Playfair Display' },
  h2: { fontSize: 24, fontWeight: '600', fontFamily: 'Playfair Display' },
  body: { fontSize: 16, fontWeight: '400', fontFamily: 'DM Sans' }
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test --watch

# Generate coverage report
npm test -- --coverage
```

### E2E Testing

```bash
# Install Detox for E2E testing
npm install --save-dev detox

# Run E2E tests
npm run test:e2e
```

---

## 📦 Build for Production

### iOS

```bash
# Install Expo CLI
npm install -g expo-cli

# Build for iOS
expo build:ios

# Or use EAS Build
eas build --platform ios
```

### Android

```bash
# Build for Android
expo build:android

# Or use EAS Build
eas build --platform android
```

### Standalone Apps

```bash
# Generate standalone app
expo prebuild --platform ios
expo prebuild --platform android

# Run native build
cd ios && pod install
```

---

## 🔐 Security

### Data Protection

- All API communications over HTTPS
- JWT token-based authentication
- Local data encryption (AsyncStorage)
- No voice recordings stored
- GDPR compliance

### Permissions

**Required Permissions:**
- `RECORD_AUDIO` - Voice input for AI Coach
- `INTERNET` - API communication
- `ACCESS_NETWORK_STATE` - Network status

---

## 📊 Analytics & Monitoring

### Implemented Tracking

- Screen views
- Feature usage (AI Coach, Quick Wins)
- Performance metrics
- Error tracking (Sentry)

### Analytics Setup

```typescript
// Analytics events
import { Analytics } from '@segment/analytics-react-native';

Analytics.track('AI Coach Used', {
  objectionType: 'price',
  responseTime: 2.5
});
```

---

## 🚀 Deployment

### App Store Submission

**iOS App Store:**
1. Build production app
2. Create App Store Connect listing
3. Submit for review
4. Wait for approval (1-2 weeks)

**Google Play Store:**
1. Build production APK/AAB
2. Create Play Console listing
3. Submit for review
4. Wait for approval (1-3 days)

---

## 📞 Support & Troubleshooting

### Common Issues

**1. App won't start**
```bash
# Clear cache
expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

**2. Can't connect to API**
```bash
# Verify backend is running
curl http://localhost:8001/api/health

# Check API URL in .env file
```

**3. Build failures**
```bash
# Clean build
expo prebuild --clean

# Update Expo CLI
npm install -g expo-cli@latest
```

---

## 📚 Documentation

- [VCSA Strategic Dashboard](../../VCSA_STRATEGIC_DASHBOARD.md)
- [Technical Specification](../../VCSA_POCKET_TECHNICAL_SPEC.md)
- [API Documentation](../../docs/API.md)

---

## 🎯 Roadmap

### Current Release (v1.0)
- ✅ AI Coach MVP
- ✅ Quick Wins Library
- ✅ Pre-Tour Mode
- ✅ Performance Tracking
- ✅ Post-Tour Debrief

### Next Release (v1.1)
- [ ] Voice input optimization
- [ ] Offline mode enhancements
- [ ] Advanced analytics
- [ ] Team collaboration features

### Future Releases
- [ ] AI Voice Coach (conversational)
- [ ] Real-time transcription
- [ ] Video coaching
- [ ] Manager dashboard

---

## 🤝 Contributing

This is a proprietary project. For questions or support, contact the VCSA development team.

---

## 📄 License

Copyright © 2026 VCSA (Vacation Club Sales Academy). All rights reserved.

---

## 🎉 Ready to Use!

**The VCSA Pocket mobile app is ready to help sales reps close more deals with AI-powered coaching!**

For questions or support, join our Slack channel or create a GitHub issue.
