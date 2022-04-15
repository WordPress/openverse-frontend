<template>
  <div
    v-show="enabled && shouldShow"
    class="px-4 md:px-7 py-2 flex items-center justify-between"
    :class="$style[variant]"
    :data-testid="`banner-${id}`"
  >
    <p class="text-left">
      <slot name="default" />
    </p>
    <div class="flex">
      <slot name="buttons">
        <VIconButton
          v-for="variation in iconButtonVariations"
          v-bind="variation.props"
          :key="variation.key"
          :button-props="{ variant: 'plain' }"
          :class="variant === 'announcement' && 'text-white'"
          :aria-label="closeLabel"
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
import { defineComponent, PropType } from '@nuxtjs/composition-api'

import { useI18n } from '~/composables/use-i18n'
import { useStorage } from '~/composables/use-storage'

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
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const i18n = useI18n()
    const shouldShow = useStorage(`banner:show-${props.id}`, true)
    const dismissBanner = () => (shouldShow.value = false)
    const handleClose = () => {
      dismissBanner()
      emit('close')
    }
    const closeLabel = i18n.t('modal.close') as string
    const iconButtonVariations = [
      {
        key: 'small',
        props: { size: 'small' as const, class: 'flex md:hidden border-none' },
      },
      {
        key: 'medium',
        props: { class: 'hidden md:flex border-none' },
      },
    ]
    return {
      closeIcon,
      closeLabel,
      handleClose,
      shouldShow,
      iconButtonVariations,
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
}
</style>
