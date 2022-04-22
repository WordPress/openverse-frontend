import type { ComponentPublicInstance } from '@vue/runtime-dom'
import type { Ref } from '@nuxtjs/composition-api'

export function dom<T extends Element | ComponentPublicInstance>(
  ref?: Ref<T | null>
): T | null {
  console.log('will get dom for ', ref?.value)
  if (ref != null && ref.value != null) {
    console.log('$el in?', '$el' in ref.value)
    console.log('$el' in ref.value ? (ref.value.$el as T | null) : ref.value)
  }
  if (ref == null) return null
  if (ref.value == null) return null

  return '$el' in ref.value ? (ref.value.$el as T | null) : ref.value
}
