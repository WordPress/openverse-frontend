<template>
  <div
    class="wrapper px-4 md:px-7 sm:py-3 md:py-1 flex md:items-center md:justify-between border-l-[.25rem] bg-[#fff8e5] border-[#ffb900]"
    dir="ltr"
  >
    <p
      class="text-sm md:text-base text-center leading-tight md:leading-normal md:text-left"
    >
      <slot name="default" />
    </p>
    <div class="flex">
      <slot name="buttons">
        <button
          class="button is-text small dismiss-button aspect-square"
          type="button"
          :aria-label="$t('modal.close')"
          @click="$emit('close')"
        >
          <VIcon :icon-path="closeIcon" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

import VIcon from '~/components/VIcon/VIcon.vue'

import closeIcon from '~/assets/icons/close.svg'

const VNotificationBanner = defineComponent({
  name: 'VNotificationBanner',
  components: {
    VIcon,
  },
  setup() {
    return { closeIcon }
  },
})
export default VNotificationBanner
</script>
