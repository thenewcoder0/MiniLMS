# MiniLMS 📚

A Mini Learning Management System mobile app built with React Native Expo.

## Screenshots
(Add screenshots here after testing)

## Tech Stack
- React Native Expo (SDK 54)
- TypeScript (Strict mode)
- Expo Router (File-based navigation)
- NativeWind (Tailwind for React Native)
- Expo SecureStore (Sensitive data)
- AsyncStorage (App data)
- WebView (Course content)
- Expo Notifications (Local notifications)

## Features
- ✅ Authentication (Login, Register, Auto-login, Logout)
- ✅ Course Catalog with Search & Filter
- ✅ Bookmark Courses
- ✅ Course Details Screen
- ✅ WebView Course Content
- ✅ Local Notifications (Bookmark milestone, 24hr reminder)
- ✅ Offline Mode Banner
- ✅ API Retry Logic & Timeout Handling
- ✅ Secure Token Storage

## Setup Instructions

### Prerequisites
- Node.js v20+
- Expo Go app on your phone
- Git

### Installation
1. Clone the repository
   git clone https://github.com/thenewcoder0/MiniLMS.git

2. Install dependencies
   npm install --legacy-peer-deps

3. Start the app
   npx expo start

4. Scan the QR code with Expo Go

## Environment Variables
No environment variables needed. The app uses the free API at https://api.freeapi.app

## API Endpoints Used
- POST /api/v1/users/register — User registration
- POST /api/v1/users/login — User login
- GET /api/v1/public/randomproducts — Course data
- GET /api/v1/public/randomusers — Instructor data

## Architectural Decisions
- Expo Router for file-based navigation (cleaner structure)
- SecureStore for tokens (security best practice)
- AsyncStorage for non-sensitive data (bookmarks, courses)
- Retry logic with timeout for resilient API calls
- useFocusEffect for real-time bookmark sync across screens

## Known Issues & Limitations
- expo-notifications push notifications not supported in Expo Go (SDK 54)
- Local notifications work fine
- Free API resets periodically (re-register if login fails)
- Images use Lorem Picsum as placeholder (original CDN URLs return 404)

## Build Instructions
1. Install EAS CLI
   npm install -g eas-cli

2. Login to Expo
   eas login

3. Build APK
   eas build -p android --profile preview

4. Demo Video Link
   https://github.com/user-attachments/assets/f839e8d5-7f08-43b4-9e10-57c448568835

5. Download APK
   https://expo.dev/accounts/hari98/projects/MiniLMS/builds/53067666-8157-4b23-bcec-ac8c05f025b6