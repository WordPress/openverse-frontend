import { Ref, ToRefs, watch, isReactive } from '@nuxtjs/composition-api'

import { error } from '~/utils/console'

/**
 * Syncs the value of an internal reactive to the ref value whenver
 * the ref is explicitly updated.
 *
 * The watchers defined in this mutate the `reactive` parameter
 * directly.
 * @param reactive - A Vue Reactive object.
 * @param refs - A collection of refs where the key is a key on the `reactive` parameter.
 */
export function useSyncRefs<T extends Record<string, unknown>>(
  reactive: T,
  refs: Partial<ToRefs<T>>
) {
  if (!isReactive(reactive)) {
    error('`reactive` must be a Vue Reactive object.')
    return
  }
  Object.entries(refs).forEach(([key, refObj]) => {
    watch(refObj as Ref<unknown>, (v) => {
      reactive[key as keyof T] = v as T[keyof T]
    })
  })
}
