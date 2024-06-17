import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.test.ts'],
}

export default config
