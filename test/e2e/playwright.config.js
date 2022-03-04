/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: '.',
  use: {
    baseURL: 'http://web:8443',
  },
  timeout: 60 * 1000,
}
module.exports = config
