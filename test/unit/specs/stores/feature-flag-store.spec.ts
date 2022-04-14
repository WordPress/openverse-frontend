import { setActivePinia, createPinia } from 'pinia'

import { useFeatureFlagStore } from '~/stores/feature-flag'
import { FeatureState, OFF, ON } from '~/constants/feature-flag'

jest.mock(
  '~~/feat/feature-flags.json',
  () => ({
    features: {
      feat_enabled: {
        status: 'enabled',
        description: 'Will always be enabled',
      },
      feat_disabled: {
        status: 'disabled',
        description: 'Will always be disabled',
      },
      feat_switchable_optout: {
        status: 'switchable',
        description: 'Can be switched between on and off',
        defaultState: 'on',
      },
      feat_switchable_optin: {
        status: 'switchable',
        description: 'Can be switched between on and off',
        defaultState: 'off',
      },
    },
  }),
  { virtual: true }
)

describe('Feature flag store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises state from JSON', () => {
    const featureFlagStore = useFeatureFlagStore()
    expect(Object.keys(featureFlagStore.flags).length).toBe(4)
  })

  it.each`
    flagName           | featureState
    ${'feat_enabled'}  | ${'on'}
    ${'feat_disabled'} | ${'off'}
  `(
    'does not allow modification of fixed flags',
    ({
      flagName,
      featureState,
    }: {
      flagName: string
      featureState: FeatureState
    }) => {
      const featureFlagStore = useFeatureFlagStore()
      expect(featureFlagStore.featureState(flagName)).toEqual(featureState)
    }
  )

  it.each`
    flagName                    | doCookieInit | featureState
    ${'feat_switchable_optout'} | ${false}     | ${'on'}
    ${'feat_switchable_optin'}  | ${false}     | ${'off'}
    ${'feat_switchable_optout'} | ${true}      | ${'off'}
    ${'feat_switchable_optin'}  | ${true}      | ${'on'}
  `(
    'cascades flag $flagName from cookies',
    ({
      flagName,
      doCookieInit,
      featureState,
    }: {
      flagName: string
      doCookieInit: boolean
      featureState: FeatureState
    }) => {
      const featureFlagStore = useFeatureFlagStore()
      if (doCookieInit)
        featureFlagStore.initFromCookies({
          feat_switchable_optout: OFF,
          feat_switchable_optin: ON,
        })
      expect(featureFlagStore.featureState(flagName)).toEqual(featureState)
    }
  )

  it('returns mapping of switchable flags', () => {
    const featureFlagStore = useFeatureFlagStore()
    const flagStateMap = featureFlagStore.flagStateMap

    expect(flagStateMap).toHaveProperty('feat_switchable_optout')
    expect(flagStateMap).toHaveProperty('feat_switchable_optin')

    expect(flagStateMap).not.toHaveProperty('feat_enabled')
    expect(flagStateMap).not.toHaveProperty('feat_disabled')
  })
})
