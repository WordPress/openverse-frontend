<template>
  <!-- @todo: Seperate the absolute container from the link itself. -->
  <div v-if="show" class="absolute left-0 top-0 right-0 z-40 w-full px-2">
    <NuxtLink
      class="px-6 pt-4 pb-2 flex flex-row items-center font-semibold text-dark-charcoal text-xs md:text-sr"
      :to="path"
    >
      <Chevron class="-ms-2" />
      {{ $t('single-result.back') }}
    </NuxtLink>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import Chevron from '~/assets/icons/chevron-left.svg?inline'

export default defineComponent({
  components: {
    Chevron,
  },
  data() {
    return {
      /** @type {undefined|string} */
      path: undefined,
      show: false,
    }
  },
  created() {
    if (!this.$nuxt?.context?.from?.path) {
      return
    }

    this.path = this.$nuxt.context.from.path
    if (this.path.startsWith('/search')) {
      this.show = true
    }
  },
})
</script>
