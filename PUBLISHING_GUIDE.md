# Publishing Road Quizin to App Stores

This guide will walk you through publishing your Expo app to both iOS App Store and Google Play Store.

## Prerequisites

### For iOS App Store:
1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com
   - Enroll in the Apple Developer Program

2. **macOS with Xcode** (for local builds) OR use EAS Build (recommended)
   - Xcode 16.1+ required for Expo SDK 54

### For Google Play Store:
1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at https://play.google.com/console

## Step 1: Update app.json Configuration

Your `app.json` needs additional fields for publishing. Here's what you should add:

### Required Fields:
- `bundleIdentifier` (iOS) - Unique identifier like `com.yourcompany.roadquizin`
- `package` (Android) - Same format as bundleIdentifier
- `privacy` - Privacy policy URL (required for App Store)
- `description` - App description
- `primaryColor` - Brand color

### Recommended Fields:
- `sdkVersion` - Your Expo SDK version
- `ios.infoPlist` - Additional iOS configuration
- `android.permissions` - Required Android permissions

## Step 2: Install EAS CLI (Recommended)

EAS (Expo Application Services) is the modern way to build and submit Expo apps:

```bash
npm install -g eas-cli
eas login
```

## Step 3: Configure EAS Build

Initialize EAS in your project:

```bash
eas build:configure
```

This creates an `eas.json` file with build configurations.

## Step 4: Build Your App

### For iOS (App Store):
```bash
eas build --platform ios --profile production
```

### For Android (Google Play):
```bash
eas build --platform android --profile production
```

### For Both:
```bash
eas build --platform all --profile production
```

**Note:** First build will take longer (20-40 minutes) as it sets up certificates and provisioning profiles.

## Step 5: Submit to App Stores

### iOS App Store Submission:

1. **Prepare App Store Listing:**
   - App name, description, keywords
   - Screenshots (required sizes vary by device)
   - App icon (1024x1024)
   - Privacy policy URL
   - Support URL

2. **Submit using EAS:**
   ```bash
   eas submit --platform ios
   ```
   
   Or manually:
   - Download the `.ipa` file from EAS
   - Use Transporter app or Xcode to upload to App Store Connect

3. **In App Store Connect:**
   - Create new app listing
   - Fill in all required metadata
   - Upload screenshots and app preview
   - Submit for review

### Google Play Store Submission:

1. **Prepare Play Store Listing:**
   - App name, description, short description
   - Screenshots (phone, tablet, TV)
   - Feature graphic (1024x500)
   - Privacy policy URL

2. **Submit using EAS:**
   ```bash
   eas submit --platform android
   ```
   
   Or manually:
   - Download the `.aab` file from EAS
   - Upload to Google Play Console
   - Fill in store listing
   - Submit for review

## Step 6: Update app.json (Required Fields)

Update your `app.json` with these fields before building:

```json
{
  "expo": {
    "name": "Road Quizin",
    "slug": "roadquizin",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/RoadQuizinIcon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/RoadQuizinSplash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.roadquizin",
      "buildNumber": "1",
      "infoPlist": {
        "NSUserTrackingUsageDescription": "This app uses tracking to improve your experience."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.roadquizin",
      "versionCode": 1,
      "permissions": []
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font"
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

## Important Notes:

1. **Bundle Identifier/Package Name:**
   - Must be unique and follow reverse domain notation
   - Example: `com.yourcompany.roadquizin`
   - Cannot be changed after first submission

2. **Version Numbers:**
   - `version` (1.0.0) - User-facing version
   - `buildNumber` (iOS) / `versionCode` (Android) - Increment with each build

3. **Privacy Policy:**
   - Required for both stores
   - Must be accessible via HTTPS URL
   - Should cover data collection, Firebase usage, etc.

4. **App Icons:**
   - iOS: 1024x1024 PNG (no transparency)
   - Android: 1024x1024 PNG (adaptive icon)

5. **Firebase Configuration:**
   - Your Firebase config is in `src/firebase.ts`
   - Make sure Firebase project is configured for production
   - Consider using environment variables for sensitive data

## Testing Before Submission:

1. **Test on Real Devices:**
   ```bash
   eas build --platform ios --profile preview
   eas build --platform android --profile preview
   ```

2. **Test Internal Distribution:**
   - Use TestFlight (iOS) or Internal Testing (Android)
   - Share with beta testers before public release

## Common Issues:

1. **Build Fails:**
   - Check EAS build logs
   - Ensure all dependencies are compatible
   - Verify app.json configuration

2. **App Store Rejection:**
   - Common reasons: missing privacy policy, incomplete metadata
   - Review App Store guidelines

3. **Google Play Rejection:**
   - Common reasons: missing privacy policy, incorrect permissions
   - Review Google Play policies

## Resources:

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

## Quick Start Commands:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for production
eas build --platform all --profile production

# Submit to stores (after build completes)
eas submit --platform ios
eas submit --platform android
```

