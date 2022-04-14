import type { FeatureState, FlagStatus } from '~/constants/feature-flag'

interface BaseFeatureFlag {
  status: FlagStatus
  description?: string
  data?: object
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
