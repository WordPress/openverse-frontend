import type { FeatureState, FlagStatus } from '~/constants/feature-flag'
import type { NodeEnv } from '~/constants/node-env'

export interface FeatureFlag {
  status: FlagStatus | Record<NodeEnv, FlagStatus>
  description?: string
  data?: unknown

  defaultState?: FeatureState
  preferredState?: FeatureState // only set for switchable flag with known preference
}
