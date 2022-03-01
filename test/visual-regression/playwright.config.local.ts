import baseConfig from './playwright.config'

const config: typeof baseConfig = {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:8443',
  },
}

export default config
