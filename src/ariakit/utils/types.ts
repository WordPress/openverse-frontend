import {
  ref,
  Ref,
  customRef,
  ComponentPublicInstance,
} from '@nuxtjs/composition-api'

export type SetState<T> = (value: T) => void
export type OptionalRef<T> = T | Ref<T>
export type NodeRef = ReturnType<typeof nodeRef>
export const nodeRef = () =>
  customRef<HTMLElement | null>((track, trigger) => {
    const node = ref<HTMLElement | null>(null)
    return {
      get() {
        track()
        return node.value
      },
      set(value: HTMLElement | ComponentPublicInstance | null) {
        if (value instanceof HTMLElement) {
          node.value = value
        } else {
          node.value = value?.$el
        }
        trigger()
      },
    }
  })
