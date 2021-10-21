module.exports = {
  moduleFileExtensions: ['js', 'ts', 'vue', 'json', 'mjs'],
  moduleNameMapper: {
    '^#app$': '@nuxt/bridge/dist/runtime/index.mjs',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '(.*svg)(\\?inline)$': '<rootDir>/test/unit/test-utils/svgTransform.js',
  },
  setupFiles: ['<rootDir>/test/unit/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup-after-env.js'],
  transform: {
    '^.+\\.m?[tj]s$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.svg$': '<rootDir>/test/unit/svg-transform.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!@nuxt/bridge)'],
  testPathIgnorePatterns: ['/e2e/'],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.vue',
    '<rootDir>/src/**/*.js',
    '<rootDir>/src/**/*.ts',
  ],
}
