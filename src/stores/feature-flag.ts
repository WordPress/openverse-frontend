import { defineStore } from 'pinia'

import featureData from '~~/feat/feature-flags.json'

import { warn } from '~/utils/console'

import type { FeatureFlag } from '~/types/feature-flag'
import type { FeatureState } from '~/constants/feature-flag'
import { ENABLED, SWITCHABLE, ON, OFF } from '~/constants/feature-flag'

export interface FeatureFlagState {
  flags: Record<keyof typeof featureData['features'], FeatureFlag>
}

const FEATURE_FLAG = 'feature_flag'

export const useFeatureFlagStore = defineStore(FEATURE_FLAG, {
  state: () =>
    ({
      flags: featureData.features,
    } as FeatureFlagState),
  getters: {
    /**
     * Get the state of the named feature, based on config and cookie.
     */
    featureState:
      (state: FeatureFlagState) =>
      (name: keyof typeof featureData['features']): FeatureState => {
        if (name in state.flags) {
          const flag = state.flags[name]
          if (flag.status === SWITCHABLE)
            return flag.preferredState ?? flag.defaultState
          else if (flag.status === ENABLED) return ON
          else return OFF
        } else {
          warn(`Invalid feature flag accessed: ${name}`)
          return ON
        }
      },
    /**
     * Get the mapping of switchable features to their preferred states.
     */
    flagStateMap: (state: FeatureFlagState): Record<string, FeatureState> => {
      const featureMap: Record<string, FeatureState> = {}
      Object.entries(state.flags).forEach(([name, flag]) => {
        if (flag.status === SWITCHABLE)
          featureMap[name] = flag.preferredState ?? flag.defaultState
      })
      return featureMap
    },
  },
  actions: {
    /**
     * Given a list of key value pairs of flags and their preferred states,
     * populate the store state to match the cookie.
     *
     * @param cookies - mapping of feature flags and their preferred states
     */
    initFromCookies(cookies: Record<string, FeatureState>) {
      Object.entries(this.flags).forEach(([name, flag]) => {
        if (flag.status === SWITCHABLE) flag.preferredState = cookies[name]
      })
    },
    /**
     * Toggle the feature flag of the given name to the given preferred state.
     *
     * @param name - the name of the flag to toggle
     * @param targetState - the desired state of the feature flag
     */
    toggleFeature(
      name: keyof typeof featureData['features'],
      targetState: FeatureState
    ) {
      const flag = this.flags[name]
      if (flag.status === SWITCHABLE) flag.preferredState = targetState
      else warn(`Cannot set preferred state for non-switchable flag: ${name}`)
    },
  },
})
