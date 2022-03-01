import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: '.',
  use: {
    baseURL: 'http://host.docker.internal:8443',
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  timeout: 60 * 1000,
  workers: 4,
}

export default config
