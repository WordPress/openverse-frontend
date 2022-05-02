import {
  isRef,
  Ref,
  ref,
  computed,
  inject,
  provide,
} from '@nuxtjs/composition-api'

import { HeadingLevel, HeadingContextKey } from '~/ariakit/heading/use-heading'

export interface UseHeadingLevelOptions {
  level: HeadingLevel | Ref<HeadingLevel>
}

export const useHeadingLevel = ({ level }: UseHeadingLevelOptions) => {
  const unwrappedLevel = computed(() => (isRef(level) ? level.value : level))
  const contextLevel = inject(HeadingContextKey, ref(0))
  const nextLevel = computed(
    () =>
      Math.max(
        Math.min(unwrappedLevel.value || contextLevel.value + 1, 6),
        1
      ) as HeadingLevel
  )
  provide(HeadingContextKey, nextLevel)
}
