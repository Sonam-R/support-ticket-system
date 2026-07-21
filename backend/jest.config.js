module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  maxWorkers: 1,
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/openapi.js',
    '!src/config/swagger.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      setupFiles: ['<rootDir>/tests/setup-env.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
      setupFiles: ['<rootDir>/tests/setup-env.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
      globalSetup: '<rootDir>/tests/globalSetup.js',
    },
  ],
};
