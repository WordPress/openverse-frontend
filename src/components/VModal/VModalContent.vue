<template>
  <VTeleport v-if="visible" to="modal">
    <div
      class="flex justify-start items-center flex-col z-10 inset-0 overflow-y-auto fixed inset-0 bg-dark-charcoal bg-opacity-75 transition-opacity min-h-screen"
      v-bind="$attrs"
      aria-modal="true"
      role="dialog"
      v-on="$listeners"
      @keydown="onKeyDown"
      @blur="onBlur"
    >
      <div class="w-4/5 flex justify-end">
        <VButton
          size="disabled"
          variant="floating"
          class="text-white py-2"
          @click="hide()"
        >
          {{ $t('modal.close') }} <VIcon :icon-path="closeIcon" />
        </VButton>
      </div>

      <div
        ref="dialogRef"
        class="w-4/5 flex-grow align-bottom bg-white rounded-t-sm text-left overflow-y-auto shadow-xl transform transition-all"
      >
        <slot />
      </div>
    </div>
  </VTeleport>
</template>

<script>
import { defineComponent, toRefs, ref } from '@nuxtjs/composition-api'
import { VTeleport } from '~/components/VTeleport'
import { useDialogContent } from '~/composables/use-dialog-content'
import { warn } from '~/utils/warn'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import closeIcon from '~/assets/icons/close.svg'

/**
 * Renders the inner content of a modal and wires up focus management
 * via the `useModalContent` composable. An extension of the "dialog"
 * concept.
 */
const VModalContent = defineComponent({
  name: 'VModalContent',
  components: { VTeleport, VButton, VIcon },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    hide: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<() => void>} */ (Function),
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
      type: /** @type {import('@nuxtjs/composition-api').PropType<HTMLElement>} */ (process.server
        ? Object
        : HTMLElement),
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

<style module></style>
