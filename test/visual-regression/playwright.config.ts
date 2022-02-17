import { PlaywrightTestConfig } from '@playwright/test'

export default {
  testDir: '.',
  use: {
    baseURL: 'http://host.docker.internal:8443',
  },
  timeout: 60 * 1000,
} as PlaywrightTestConfig
