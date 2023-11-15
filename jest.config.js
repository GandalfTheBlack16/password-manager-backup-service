/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'test/coverage',
  coverageProvider: 'v8',
  setupFiles: [
    './test/setupJest.ts'
  ]
}
