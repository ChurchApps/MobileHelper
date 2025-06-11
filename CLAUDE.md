# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the MobileHelper package (`@churchapps/mobilehelper`), a React Native/Expo utility library that is part of the ChurchApps monorepo. It provides mobile-specific utilities and components for church management applications built with React Native and Expo SDK.

## Package Purpose

MobileHelper provides:
- Device information collection and caching (using Expo APIs)
- Push notification handling via Expo Notifications
- JavaScript error tracking and reporting infrastructure
- Responsive styling constants and utilities
- Church-specific TypeScript interfaces for mobile apps
- Re-exports all utilities from `@churchapps/helpers`

## Development Commands

```bash
# Clean build artifacts
npm run clean

# TypeScript compilation only
npm run tsc

# Full build (clean + compile)
npm run build

# Local development linking
npm run build && npm link
# In consuming app: npm link @churchapps/mobilehelper
```

## Key Dependencies

- **Expo SDK ~52.0**: Core platform (expo-application, expo-constants, expo-device, expo-notifications)
- **React Native 0.79+**: Peer dependency
- **@churchapps/helpers**: Parent package with shared utilities
- **AsyncStorage**: For persistent device ID storage
- **react-native-exception-handler**: Global error catching

## Architecture Notes

### Export Structure
The package exports these helpers through `src/index.ts`:
- `DeviceInfo`: Collects and caches device metadata, generates unique IDs
- `PushNotificationHelper`: Expo push notification permissions and listeners
- `ErrorHelper`: Global JavaScript/native error handling setup
- `StyleConstants`: Responsive sizes, colors, font families
- `ValidationHelper`: Email validation
- `Interfaces`: Church-specific TypeScript types
- All exports from `@churchapps/helpers` are re-exported

### Event Communication
Uses `DeviceEventEmitter` for:
- Push notification events: "notificationReceived", "notificationResponseReceived"
- Error events: "NOTICE", "WARNING", "FATAL"

### Firebase Migration Status
All Firebase Analytics code is currently commented out but structure remains. The package uses Expo's native solutions instead of React Native Firebase.

## TypeScript Configuration

- Target: ES2020 with CommonJS modules
- JSX: react-native
- Declaration files generated
- No strict mode
- Source maps enabled

## Testing Integration

No dedicated test commands. Test by linking to a React Native/Expo project:
```bash
npm run build
npm link
# In test app:
npm link @churchapps/mobilehelper
```

## Important Implementation Details

1. **Device ID Generation**: Uses Expo Constants installationId or generates UUID, persists in AsyncStorage
2. **Push Notifications**: Requires explicit permission request, uses Expo's token generation
3. **Error Handling**: Sets up both JS and native error handlers, integrates with analytics when available
4. **Responsive Design**: Font sizes scale based on device width (375px baseline)
5. **Platform Detection**: Uses Expo Device API for device type classification

## Current Limitations

- Firebase Analytics integration is stubbed out (all code commented)
- AppCenterHelper exists but is not exported or used
- No asset copying needed during build (unlike AppHelper)
- Minimal test coverage or example implementations