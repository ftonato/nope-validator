module.exports = {
  transform: {
    '^.+\\.ts$': ['@swc-node/jest'],
  },
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
};
