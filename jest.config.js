module.exports = {
  globals: {
    'vue-jest': {
      experimentalCSSCompile: false,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'mjs', 'vue', 'json'],
  moduleNameMapper: {
    '^#app$':
      '.pnpm/@nuxt+bridge-edge@3.0.0-27393784.b110c8c_sass@1.45.0/node_modules/@nuxt/bridge-edge/dist/runtime/index.mjs',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*.svg)\\?inline$': '<rootDir>/src/$1',
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
  testPathIgnorePatterns: ['/e2e/'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.vue',
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/**/*.stories.js',
  ],
  transformIgnorePatterns: ['node_modules/.pnpm/(?!@nuxt)'],
}
