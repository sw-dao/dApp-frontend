/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  roots: ["<rootDir>/test"],
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  globalSetup: "./test/setup.ts",
  globalTeardown: "./test/teardown.ts",
};
