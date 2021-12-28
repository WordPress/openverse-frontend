<template>
  <VTeleport v-if="visible" to="modal">
    <!-- Prevent FocusTrap from trying to focus the first element. We already do that in a more flexible, adaptive way in our Dialog composables. -->
    <FocusTrap :initial-focus="() => false">
      <div :class="$style.overlay">
        <div
          ref="dialogRef"
          v-bind="$attrs"
          class="flex flex-col"
          :class="mode === 'mobile' ? 'w-full' : 'w-4/5'"
          role="dialog"
          aria-modal="true"
          v-on="$listeners"
          @keydown="onKeyDown"
          @blur="onBlur"
        >
          <!-- For mobile modal, the height should be the same  as the header height -->
          <div
            class="w-full flex justify-end"
            :class="{ 'h-20 px-6 py-6 shrink-0': mode === 'mobile' }"
          >
            <VButton
              size="disabled"
              variant="plain"
              class="py-2"
              :class="{ 'text-white': mode === 'desktop' }"
              @click="hide()"
            >
              {{ $t('modal.close') }}
              <VIcon
                :icon-path="closeIcon"
                :class="{ 'ms-2': mode === 'mobile' }"
              />
            </VButton>
          </div>

          <div
            class="w-full flex-grow align-bottom bg-white rounded-t-sm text-left overflow-y-auto"
          >
            <slot />
          </div>
        </div>
      </div>
    </FocusTrap>
  </VTeleport>
</template>

<script>
import { defineComponent, toRefs, ref } from '@nuxtjs/composition-api'
import { FocusTrap } from 'focus-trap-vue'
import { useDialogContent } from '~/composables/use-dialog-content'
import { warn } from '~/utils/warn'

import closeIcon from '~/assets/icons/close.svg'

import VTeleport from '~/components/VTeleport/VTeleport.vue'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

/**
 * Renders the inner content of a modal and manages focus.
 */
const VModalContent = defineComponent({
  name: 'VModalContent',
  components: { VTeleport, VButton, VIcon, FocusTrap },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String,
      default: 'desktop',
      validator: (val) => ['desktop', 'mobile'].includes(val),
    },
    hide: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<() => void>} */ (
        Function
      ),
      required: true,
    },
    hideOnEsc: {
      type: Boolean,
      default: true,
    },
    hideOnClickOutside: {
      type: Boolean,
      default: true,
    },
    autoFocusOnShow: {
      type: Boolean,
      default: true,
    },
    autoFocusOnHide: {
      type: Boolean,
      default: true,
    },
    triggerElement: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<HTMLElement>} */ (
        process.server ? Object : HTMLElement
      ),
    },
  },
  setup(props, { emit, attrs }) {
    if (!attrs['aria-label'] && !attrs['aria-labelledby']) {
      warn('You should provide either `aria-label` or `aria-labelledby` props.')
    }

    const propsRefs = toRefs(props)
    const dialogRef = ref()
    const { onKeyDown, onBlur } = useDialogContent({
      dialogRef,
      visibleRef: propsRefs.visible,
      autoFocusOnShowRef: propsRefs.autoFocusOnShow,
      autoFocusOnHideRef: propsRefs.autoFocusOnHide,
      triggerElementRef: propsRefs.triggerElement,
      hideOnClickOutsideRef: propsRefs.hideOnClickOutside,
      hideRef: propsRefs.hide,
      hideOnEscRef: propsRefs.hideOnEsc,
      emit,
    })

    return { dialogRef, onKeyDown, onBlur, closeIcon }
  },
})

export default VModalContent
</script>

<style module>
.overlay {
  @apply flex justify-center z-50 fixed inset-0 min-h-screen;
}
.overlay-desktop {
  @apply bg-dark-charcoal bg-opacity-75;
}
.overlay-mobile {
  background: transparent;
}
</style>
