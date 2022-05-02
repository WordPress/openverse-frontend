import { Ref, computed, InjectionKey, inject } from '@nuxtjs/composition-api'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export const HeadingContextKey: InjectionKey<Ref<HeadingLevel | 0>> =
  Symbol.for('heading')

export interface UseHeadingOptions {
  node: Ref<HTMLElement | null>
}

export const useHeading = ({ node }: UseHeadingOptions) => {
  const headingContext = inject(HeadingContextKey)
  const level = computed(() => headingContext?.value || 1)

  const attributes = computed(() =>
    /^h\d$/.test(node.value?.tagName ?? '')
      ? {} // it's a native heading, we don't need to add a11y attributes
      : {
          role: 'heading',
          'aria-level': level.value,
        }
  )

  return { attributes }
}
