import {
  Ref,
  ref,
  computed,
  watch,
  inject,
  InjectionKey,
} from '@nuxtjs/composition-api'

import { UseHeadingOptions, useHeading } from '~/ariakit/heading/use-heading'

export const DialogHeadingContextKey: InjectionKey<
  Ref<(id: string | undefined) => void>
> = Symbol.for('dialog-heading')

export interface UseDialogHeadingOptions extends UseHeadingOptions {
  id: string
}

/**
 * A composable that generates a11y attributes
 * for a dialog heading and enforces the usage of
 * an ID, registered into context such that the
 * `aria-labelledby` attribute for the dialog itself
 * is able to be automatically set.
 */
export const useDialogHeading = ({
  id,
  ...options
}: UseDialogHeadingOptions) => {
  const setHeadingId = inject(DialogHeadingContextKey) || ref(undefined)

  watch(setHeadingId, (doSetHeadingId, _, onInvalidate) => {
    doSetHeadingId?.(id)
    onInvalidate(() => doSetHeadingId?.(undefined))
  })

  const heading = useHeading(options)

  const attributes = computed(() => ({
    ...heading.attributes.value,
    id,
  }))

  return { attributes }
}
