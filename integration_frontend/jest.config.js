const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  // Setup after env to add jest-dom matchers and polyfills
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  // Reduce noise from transforms; next/jest handles TS/JS/JSX/TSX.
  transformIgnorePatterns: ["/node_modules/"],
};

module.exports = createJestConfig(customJestConfig);
