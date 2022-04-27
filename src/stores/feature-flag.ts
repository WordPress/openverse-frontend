import { defineStore } from 'pinia'

import featureData from '~~/feat/feature-flags.json'

import { warn } from '~/utils/console'

import type { FeatureFlag } from '~/types/feature-flag'
import type { FeatureState, FlagStatus } from '~/constants/feature-flag'
import {
  ENABLED,
  SWITCHABLE,
  ON,
  OFF,
  DISABLED,
} from '~/constants/feature-flag'
import type { NodeEnv } from '~/constants/node-env'

export interface FeatureFlagState {
  flags: Record<keyof typeof featureData['features'], FeatureFlag>
}

const FEATURE_FLAG = 'feature_flag'

/**
 * Get the status of the flag. If the flag status is environment dependent, this
 * function will use the flag status for the current environment based on the
 * `NODE_ENV` environment variable.
 *
 * @param flag - the flag for which to get the status
 */
const getFlagStatus = (flag: FeatureFlag): FlagStatus => {
  const node_env = process.env.NODE_ENV as NodeEnv
  return typeof flag.status === 'string'
    ? flag.status
    : node_env && node_env in flag.status
    ? flag.status[node_env] ?? DISABLED
    : DISABLED
}

/**
 * Get the state of the feature based on the status of the feature flag and the
 * preferences of the user.
 *
 * @param flag - the flag for which to get the state
 */
const getFeatureState = (flag: FeatureFlag): FeatureState => {
  const status = getFlagStatus(flag)
  if (status === SWITCHABLE)
    return flag.preferredState ?? flag.defaultState ?? OFF
  if (status === ENABLED) return ON
  return OFF
}

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
        if (name in state.flags) return getFeatureState(state.flags[name])
        else {
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
        if (getFlagStatus(flag) === SWITCHABLE)
          featureMap[name] = getFeatureState(flag)
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
        if (getFlagStatus(flag) === SWITCHABLE)
          flag.preferredState = cookies[name]
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
      if (getFlagStatus(flag) === SWITCHABLE) flag.preferredState = targetState
      else warn(`Cannot set preferred state for non-switchable flag: ${name}`)
    },
  },
})
