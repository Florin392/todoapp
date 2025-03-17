import type { Config } from "jest";

const config: Config = {
  // Use ts-jest to handle TypeScript files
  preset: "ts-jest",

  // Use jsdom to simulate a browser environment
  testEnvironment: "jsdom",

  // Look for test files with these patterns
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

  // Handle various file imports in tests
  moduleNameMapper: {
    // Handle CSS imports (if you use CSS modules)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^nanoid$": "<rootDir>/__mocks__/nanoid.ts",
  },

  // Files to execute before tests run
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // File extensions Jest should look for
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Configure TypeScript transformation
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json", // Use the test-specific config
      },
    ],
  },

  // Important: Tell Jest to transform node_modules/nanoid (and any other ESM modules)
  transformIgnorePatterns: ["/node_modules/(?!(nanoid)/)"],

  // Automatically clear mock calls between every test
  clearMocks: true,
  // Collect coverage information
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
  ],
  coverageDirectory: "coverage",
};

export default config;
