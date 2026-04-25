module.exports = {
  preset: "react-native",

  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],

  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-native-community|expo|expo-status-bar|expo-localization|@expo|native-base|@gluestack-ui|react-navigation|@react-navigation|@expo/vector-icons)/)"
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{ts,tsx}"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "html"],

  // Coverage threshold — đảm bảo >= 70% theo yêu cầu SonarCloud
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(png|jpg|jpeg|gif|webp|svg|ttf|otf|woff|woff2)$": "<rootDir>/__mocks__/fileMock.js",
    "^expo/src/winter(.*)$": "<rootDir>/__mocks__/expoWinterMock.js"
  }
};
