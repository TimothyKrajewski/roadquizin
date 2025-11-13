# iOS App Store Publishing Guide

This guide will walk you through publishing Road Quizin to the iOS App Store.

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com/programs/
   - You'll need this to publish to the App Store

2. **Expo Account** (Free)
   - Sign up at https://expo.dev/ if you don't have one
   - Used for EAS Build service

3. **EAS CLI** (✅ Already installed)

## Step-by-Step Process

### Step 1: Login to Expo

```bash
npx eas login
```

This will prompt you to create an Expo account or login if you already have one.

### Step 2: Configure Your Project

Your `app.json` is already configured with:
- Bundle Identifier: `com.roadquizin.app`
- Version: `1.0.0`
- Build Number: `1` (will auto-increment)

**Important:** Make sure you have:
- ✅ App icon: `./assets/RoadQuizinIcon.png` (1024x1024px)
- ✅ Splash screen: `./assets/RoadQuizinSplash.png`

### Step 3: Build for iOS

```bash
npx eas build --platform ios --profile production
```

This will:
1. Ask you to create an EAS project (if first time)
2. Build your app in the cloud
3. Take about 15-30 minutes

**Options during build:**
- **Credentials:** EAS can manage these automatically (recommended)
- **Apple Developer Account:** You'll need to provide your Apple ID and password
- **Distribution Certificate:** EAS will create one for you
- **Provisioning Profile:** EAS will create one for you

### Step 4: Submit to App Store

Once the build completes:

```bash
npx eas submit --platform ios
```

This will:
1. Ask for your Apple ID credentials
2. Upload the build to App Store Connect
3. Create an app listing (if first time)

### Step 5: Complete App Store Connect Setup

1. Go to https://appstoreconnect.apple.com/
2. Log in with your Apple Developer account
3. Complete your app listing:
   - **App Name:** Road Quizin
   - **Subtitle:** Test your knowledge with fun quizzes
   - **Description:** Test your knowledge with fun quizzes on a wide variety of topics including history, science, sports, and more!
   - **Keywords:** quiz, trivia, knowledge, education, games
   - **Category:** Education or Games
   - **Privacy Policy URL:** (Required - you'll need to create one)
   - **Screenshots:** Upload screenshots of your app
   - **App Icon:** Already configured in app.json

4. **Required Information:**
   - Age rating questionnaire
   - Export compliance information
   - App Review Information (contact details)

### Step 6: Submit for Review

1. In App Store Connect, select your build
2. Fill out all required information
3. Click "Submit for Review"
4. Wait for Apple's review (typically 1-3 days)

## Important Notes

### Privacy Policy
You **must** have a privacy policy URL. Options:
- Host on your website
- Use a free service like https://www.freeprivacypolicy.com/
- Use GitHub Pages if you have a GitHub repo

### App Icons and Screenshots
- **Icon:** 1024x1024px PNG (no transparency)
- **Screenshots:** Required for different device sizes
  - iPhone 6.7" (iPhone 14 Pro Max, etc.)
  - iPhone 6.5" (iPhone 11 Pro Max, etc.)
  - iPhone 5.5" (iPhone 8 Plus, etc.)

### Bundle Identifier
Your bundle identifier is: `com.roadquizin.app`
- Make sure this matches in App Store Connect
- Must be unique (if taken, change it in `app.json`)

### Version Management
- **Version:** User-facing version (e.g., 1.0.0)
- **Build Number:** Internal build number (auto-increments with EAS)

## Troubleshooting

### Build Fails
- Check the build logs in Expo dashboard
- Ensure all dependencies are compatible
- Verify app.json configuration

### Credential Issues
- EAS can manage credentials automatically
- Or manually manage in Apple Developer portal

### App Rejected
- Read Apple's feedback carefully
- Common issues: missing privacy policy, incomplete information
- Fix and resubmit

## Quick Commands Reference

```bash
# Login to Expo
npx eas login

# Build for iOS
npx eas build --platform ios --profile production

# Submit to App Store
npx eas submit --platform ios

# Check build status
npx eas build:list

# View build logs
npx eas build:view [BUILD_ID]
```

## Next Steps After Publishing

1. Monitor app performance in App Store Connect
2. Respond to user reviews
3. Update app with new features
4. Increment version in `app.json` for updates

## Support

- EAS Documentation: https://docs.expo.dev/build/introduction/
- App Store Connect Help: https://help.apple.com/app-store-connect/
- Expo Forums: https://forums.expo.dev/

Good luck with your app launch! 🚀

