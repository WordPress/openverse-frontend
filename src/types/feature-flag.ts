import type { FeatureState, FlagStatus } from '~/constants/feature-flag'

interface BaseFeatureFlag {
  status: FlagStatus
  description?: string
  data?: unknown
}

export type FeatureFlag = BaseFeatureFlag &
  (
    | {
        status: 'enabled' | 'disabled'
      }
    | {
        status: 'switchable'

        defaultState: FeatureState
        preferredState?: FeatureState // only set for switchable flag with known preference
      }
  )
