<template>
  <div class="flex flex-row flex-nowrap">
    <slot name="default" />
  </div>
</template>

<script>
import { defineComponent, provide } from '@nuxtjs/composition-api'

/** @type {import('@nuxtjs/composition-api').InjectionKey<boolean>} */
export const VButtonGroupContextKey = Symbol('VButtonGroupContext')

export default defineComponent({
  name: 'VButtonGroup',
  setup() {
    provide(VButtonGroupContextKey, true)
  },
})
</script>
