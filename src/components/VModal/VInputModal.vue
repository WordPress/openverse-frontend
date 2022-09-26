<template>
  <div ref="nodeRef">
    <div v-if="!isActive" class="flex w-full"><slot /></div>
    <VTeleport v-else to="modal">
      <!-- Prevent FocusTrap from trying to focus the first element.
      We already do that in a more flexible, adaptive way in our Dialog composables. -->
      <FocusTrap :initial-focus="() => false">
        <div
          class="fixed inset-0 z-40 flex min-h-screen w-full justify-center overflow-y-auto bg-white"
        >
          <div
            ref="dialogRef"
            v-bind="$attrs"
            class="flex w-full flex-col py-3 px-4"
            role="dialog"
            aria-modal="true"
            @keydown="onKeyDown"
            @blur="onBlur"
          >
            <div class="flex w-full flex-grow flex-col text-left align-bottom">
              <slot />
            </div>
          </div>
        </div>
      </FocusTrap>
    </VTeleport>
  </div>
</template>
<script>
import { defineComponent, ref, watch, toRef } from '@nuxtjs/composition-api'

import { Portal as VTeleport } from 'portal-vue'

import { FocusTrap } from 'focus-trap-vue'

import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'
import { useDialogContent } from '~/composables/use-dialog-content'

export default defineComponent({
  name: 'VInputModal',
  components: { VTeleport, FocusTrap },

  /**
   * NB: Most of these technically default to `undefined` so that the underlying `VPopoverContent`
   * default for each of them can take over.
   */
  props: {
    /**
     * This props allows for the modal to be opened or closed programmatically.
     * The modal handles the visibility internally if this prop is not provided.
     *
     * @default undefined
     */
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    /**
     * Fires when the popover opens, regardless of reason. There are no extra parameters.
     */
    'open',
    /**
     * Fires when the popover closes, regardless of reason. There are no extra parameters.
     */
    'close',
  ],
  setup(props, { emit }) {
    const focusTrapRef =
      /** @type {import('@nuxtjs/composition-api').Ref<InstanceType<typeof FocusTrap> | null>} */ (
        ref(null)
      )
    const visibleRef = toRef(props, 'isActive')
    const internalVisibleRef =
      /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */ (
        ref(props.isActive === undefined ? false : visibleRef.value)
      )
    const nodeRef =
      /** @type {import ('@nuxtjs/composition-api').Ref<HTMLElement | null>} */ (
        ref(null)
      )

    /**
     * When the `visible` prop is set to a different value than internalVisibleRef,
     * we update the internalVisibleRef to match the prop.
     */
    watch(visibleRef, (visible) => {
      if (visible === undefined || visible === internalVisibleRef.value) return

      if (visible) {
        open()
      } else {
        close()
      }
    })

    const { lock, unlock } = useBodyScrollLock({ nodeRef })

    const open = () => {
      internalVisibleRef.value = true
      lock()
      if (props.isActive !== internalVisibleRef.value) {
        emit('open')
      }
    }

    const close = () => {
      internalVisibleRef.value = false
      unlock()
      emit('close')
    }

    const dialogRef =
      /** @type {import ('@nuxtjs/composition-api').Ref<HTMLElement | null>} */ (
        ref(null)
      )

    const { onKeyDown, onBlur } = useDialogContent({
      dialogRef,
      visibleRef: toRef(props, 'isActive'),
      autoFocusOnShowRef: ref(true),
      autoFocusOnHideRef: ref(false),
      triggerElementRef: ref(null),
      hideOnClickOutsideRef: ref(false),
      hideRef: ref(close),
      hideOnEscRef: ref(true),
      emit,
    })

    return {
      focusTrapRef,
      dialogRef,
      nodeRef,
      internalVisibleRef,

      close,
      onKeyDown,
      onBlur,
    }
  },
})
</script>
