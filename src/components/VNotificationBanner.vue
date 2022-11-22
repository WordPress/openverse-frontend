<template>
  <div
    v-show="enabled && shouldShow"
    class="flex items-center justify-between px-4 py-2 md:px-7"
    :class="$style[variant]"
    :data-testid="`banner-${id}`"
  >
    <p class="caption-regular md:description-regular text-left">
      <slot name="default" />
    </p>
    <div class="flex">
      <slot name="buttons">
        <VIconButton
          :class="{ 'text-white': variant === 'announcement' }"
          size="small"
          :aria-label="$t('modal.close')"
          :icon-props="{
            iconPath: closeIcon,
          }"
          @click="handleClose"
        />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'

import { defineEvent } from '~/types/emits'

import { BannerId, useUiStore } from '~/stores/ui'

import VIconButton from '~/components/VIconButton/VIconButton.vue'

import closeIcon from '~/assets/icons/close.svg'

export default defineComponent({
  name: 'VNotificationBanner',
  components: {
    VIconButton,
  },
  props: {
    variant: {
      type: String as PropType<'announcement' | 'informational'>,
      required: true,
    },
    id: {
      type: String as PropType<BannerId>,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    close: defineEvent(),
  },
  setup(props, { emit }) {
    const uiStore = useUiStore()

    /**
     * We only hide the enabled banner if there is a cookie.
     */
    const shouldShow = ref(!uiStore.isBannerDismissed(props.id))

    const dismissBanner = () => {
      uiStore.dismissBanner(props.id)
      shouldShow.value = false
    }

    const handleClose = () => {
      dismissBanner()
      emit('close')
    }

    return {
      closeIcon,
      handleClose,
      shouldShow,
    }
  },
})
</script>

<style module>
/* Styles from learn.wordpress.org */
.informational {
  background-color: #fff8e5;
  border-left: 0.25rem solid #ffb900;
}

.announcement {
  @apply bg-trans-blue text-white;
  border-left: 0.25rem solid transparent;
}
</style>
