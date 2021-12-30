<template>
  <VTeleport v-if="visible" :to="modalTarget">
    <!-- Prevent FocusTrap from trying to focus the first element. We already do that in a more flexible, adaptive way in our Dialog composables. -->
    <FocusTrap :initial-focus="() => false">
      <div
        class="flex justify-center z-40 bg-dark-charcoal bg-opacity-75 overlay"
        :class="overlayStyles"
      >
        <div
          ref="dialogRef"
          v-bind="$attrs"
          class="flex flex-col w-full"
          role="dialog"
          aria-modal="true"
          v-on="$listeners"
          @keydown="onKeyDown"
          @blur="onBlur"
        >
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
import { defineComponent, toRefs, ref, computed } from '@nuxtjs/composition-api'
import { FocusTrap } from 'focus-trap-vue'
import { useDialogContent } from '~/composables/use-dialog-content'
import { warn } from '~/utils/warn'
import closeIcon from '~/assets/icons/close.svg'
import { VTeleport } from '~/components/VTeleport'
import { isMinScreen } from '@/composables/use-media-query'

/**
 * Renders the inner content of a modal and manages focus.
 */
const VModalContent = defineComponent({
  name: 'VModalContent',
  components: { VTeleport, FocusTrap },
  props: {
    visible: {
      type: Boolean,
      required: true,
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
    const isMdScreen = isMinScreen('md')

    const modalTarget = computed(() => {
      return isMdScreen.value ? 'sidebar' : 'modal'
    })
    const overlayStyles = computed(() =>
      // todo (obulat) adjust top margin for varying header height
      isMdScreen.value ? '' : 'fixed inset-0 mt-20'
    )
    return {
      dialogRef,
      onKeyDown,
      onBlur,
      closeIcon,
      modalTarget,
      overlayStyles,
    }
  },
})

export default VModalContent
</script>

<style module>
.overlay {
  min-height: calc(100vh - 80px);
}
</style>
