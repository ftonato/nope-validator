module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc-node/jest',
      {
        dynamicImport: true,
      },
    ],
  },
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
