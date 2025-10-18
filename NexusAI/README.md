# Nexus AI - iOS App

This is the iOS version of the Nexus AI web application, built as a WebView wrapper.

## 🚀 Quick Start

### Prerequisites
- Xcode 15.0 or later
- macOS 12.0 or later
- Apple Developer Account (for App Store submission)

### Setup Instructions

1. **Open the Project**
   ```bash
   cd NexusAI
   open NexusAI.xcodeproj
   ```

2. **Configure Bundle Identifier**
   - Select the project in Xcode
   - Go to "Signing & Capabilities"
   - Change the Bundle Identifier to your own (e.g., `com.yourcompany.nexusai`)
   - Select your development team

3. **Add App Icons**
   - Open `Assets.xcassets` → `AppIcon`
   - Drag and drop your app icons in the appropriate sizes:
     - 1024x1024 (App Store)
     - 180x180 (iPhone)
     - 167x167 (iPad Pro)
     - 152x152 (iPad)
     - 120x120 (iPhone)
     - 87x87 (iPhone)
     - 80x80 (iPhone)
     - 76x76 (iPad)
     - 60x60 (iPhone)
     - 58x58 (iPhone)
     - 40x40 (iPhone)
     - 29x29 (iPhone)

4. **Build and Run**
   - Select your target device or simulator
   - Press `Cmd + R` to build and run

## 📱 App Features

- **WebView Integration**: Loads your deployed React app
- **Native iOS Experience**: Full-screen web app with native navigation
- **Loading States**: Smooth loading animations
- **Error Handling**: Network error recovery
- **External Link Support**: Opens external links in Safari

## 🌐 Web App URL

The app loads your deployed React app from:
**https://nexus-ai-1760745696.netlify.app**

To change this URL, update the `loadWebsite()` function in `ViewController.swift`.

## 📦 App Store Submission

### 1. Prepare for Submission
- Update app version in project settings
- Add app icons for all required sizes
- Configure app metadata in App Store Connect

### 2. Build for Archive
- Select "Any iOS Device" as target
- Product → Archive
- Upload to App Store Connect

### 3. App Store Connect
- Create new app in App Store Connect
- Add app information, screenshots, and description
- Submit for review

## 🔧 Customization

### Change Web App URL
```swift
// In ViewController.swift, update this line:
guard let url = URL(string: "https://your-new-url.com") else {
```

### Modify Loading Screen
- Edit `LaunchScreen.storyboard` to customize the launch screen
- Update colors, logo, or layout as needed

### Add Native Features
- Add native iOS features like push notifications
- Integrate with iOS-specific APIs
- Add offline functionality

## 📋 Requirements

- **iOS Deployment Target**: 13.0+
- **Devices**: iPhone and iPad
- **Orientations**: Portrait, Landscape Left, Landscape Right
- **Permissions**: Network access for web content

## 🐛 Troubleshooting

### Build Errors
- Make sure you have the correct development team selected
- Verify bundle identifier is unique
- Check that all required app icons are added

### WebView Issues
- Verify the web app URL is accessible
- Check network connectivity
- Review console logs for JavaScript errors

### App Store Rejection
- Ensure your web app follows App Store guidelines
- Add native functionality beyond just a web wrapper
- Provide clear app description and screenshots

## 📞 Support

For issues or questions:
- Check the web app deployment at: https://nexus-ai-1760745696.netlify.app
- Review Xcode console logs for debugging
- Ensure your Apple Developer account is active

---

**Note**: This app is a WebView wrapper around your React application. For a more native experience, consider using React Native or adding more native iOS features.
