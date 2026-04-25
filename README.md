# PocketFlow Mobile

[![NPM Version](https://img.shields.io/npm/v/react-native-expo-redux-template)](https://www.npmjs.com/package/react-native-expo-redux-template)
[![Build Expo OTA](https://github.com/hpccbk/react-native-expo-redux-template/actions/workflows/update.yml/badge.svg)](https://github.com/hpccbk/react-native-expo-redux-template/actions/workflows/update.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=MobileDev-ExpenseTracker_pocketflow_mobile&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=MobileDev-ExpenseTracker_pocketflow_mobile)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=MobileDev-ExpenseTracker_pocketflow_mobile&metric=coverage)](https://sonarcloud.io/summary/new_code?id=MobileDev-ExpenseTracker_pocketflow_mobile)
[![GitHub Actions Tests](https://github.com/MobileDev-ExpenseTracker/pocketflow_mobile/actions/workflows/test_ci.yml/badge.svg)](https://github.com/MobileDev-ExpenseTracker/pocketflow_mobile/actions/workflows/test_ci.yml)

React Native Expo app với Redux state management, TypeScript, và clean architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`

### Installation
```bash
# Clone repository
git clone <repo-url>
cd pocketflow_mobile

# Install dependencies
npm install
```

### Running the App
```bash
# Start development server
npm start

# Platform specific
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## 🧪 Testing

```bash
# Run tests with coverage
npm test

# Run tests in CI mode
npm run test:ci

# View coverage report
open coverage/lcov-report/index.html
```


## 📁 Project Structure

```
src/
├── Components/      # Reusable UI components
├── Screens/         # App screens (Container/Presentational pattern)
├── Store/           # Redux store & reducers
├── Services/        # API calls & external services
├── Hooks/           # Custom React hooks
├── Types/           # TypeScript interfaces
├── Constants/       # App constants
├── Utils/           # Helper functions
├── Localization/    # i18n translations
├── Navigation/      # Screen routing
├── Theme/           # UI theme config
└── index.tsx        # App entry point

__tests__/           # Unit tests
```

### Architecture Patterns
- **Container/Presentational**: Screens tách UI và logic
- **Redux Toolkit**: State management với type safety
- **Barrel Exports**: Clean imports với absolute paths
- **TypeScript**: Full type safety


## 📋 Development Guidelines

### Code Quality
- TypeScript strict mode
- JSDoc comments cho functions
- Absolute imports: `@/Components`
- No `any` types, no `console.log`


### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Commit convention
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "test: add unit tests"
```

## 🐛 Known Issues

```js
ApiV2Error: Not Authorized.
```
**Solution**: https://github.com/expo/expo-cli/issues/2436#issuecomment-1308534521

## 📄 License

This project is part of Mobile Development course assignment.

- **Theme/**: Centralized theme configuration (colors, spacing, typography) for consistency across the app.

- **Types/**: TypeScript interfaces and type definitions for better type safety throughout the app.

- **Constants/**: Centralized constants like screen names, storage keys, API endpoints, and default values.

- **Utils/**: Pure utility functions (validators, formatters) that don't depend on React or Redux.

### Coding Standards

- **TypeScript**: All files should be `.tsx` (components) or `.ts` (non-React files) with proper types
- **Components**: Use functional components with hooks
- **Imports**: Use barrel exports (index.ts) for cleaner import statements
- **State Management**: Redux for global state, local state with useState for component-specific state
- **Testing**: Jest + React Native Testing Library with ≥ 70% coverage

### 4. Naming Conventions
- **Files**: Use PascalCase for components (`HomeScreen.tsx`), camelCase for utilities (`apiClient.ts`)
- **Components**: PascalCase (`LoadingSpinner`, `HomeScreen`)
- **Functions**: camelCase (`useAppDispatch`, `formatDate`)
- **Constants**: SCREAMING_SNAKE_CASE (`SCREEN_NAMES`, `API_ENDPOINTS`)


## Common Development Tasks

### Add a new screen
1. Create folder: `src/Screens/MyScreen/`
2. Create files:
   - `MyScreen.tsx` (UI)
   - `MyScreenContainer.tsx` (logic)
   - `index.ts` (export)
3. Add route in `src/Navigation/Main/index.tsx`
4. Create test: `__tests__/MyScreen.test.tsx`

### Add a new utility function
1. Add to `src/Utils/index.ts` with JSDoc comments
2. Export from index
3. Add unit test with examples

### Debug Redux state
1. Uncomment redux-flipper in `src/Store/index.ts`
2. Use React Native Debugger to inspect state changes

If you have suggestions for how this template could be improved, or want to report a bug, please open an issue or a pull request. We welcome contributions from the community!


