export const LOCAL = 'local'
export const DEVELOPMENT = 'development'
export const STAGING = 'staging'
export const CI = 'ci'
export const TEST = 'test'
export const PRODUCTION = 'production'

// The order of the environments is important. They should be arranged in
// increasing order of code-readiness, from local to production.
export const NODE_ENVS = [
  LOCAL,
  TEST,
  DEVELOPMENT,
  CI,
  STAGING,
  PRODUCTION,
] as const

export type NodeEnv = typeof NODE_ENVS[number]
