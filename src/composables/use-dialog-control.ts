import { reactive, ref, Ref, watch } from '@nuxtjs/composition-api'

import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'

export function useDialogControl({
  visibleRef,
  nodeRef,
  shouldLockBodyScrollRef = ref(true),
}: {
  visibleRef: Ref<boolean>
  nodeRef?: Ref<HTMLElement | null>
  shouldLockBodyScrollRef?: Ref<boolean>
}) {
  const triggerA11yProps = reactive({
    'aria-expanded': false,
    'aria-haspopup': 'dialog',
  })

  /**
   * When the `visible` prop is set to a different value than internalVisibleRef,
   * we update the internalVisibleRef to match the prop.
   */
  watch(visibleRef, (visible) => {
    triggerA11yProps['aria-expanded'] = visible
    if (visible) {
      open()
    } else {
      close()
    }
  })

  const { lock, unlock } =
    shouldLockBodyScrollRef.value && nodeRef
      ? useBodyScrollLock({ nodeRef })
      : {
          lock: () => {
            /** */
          },
          unlock: () => {
            /** */
          },
        }

  const open = () => {
    lock()
    visibleRef.value = true
  }

  const close = () => {
    visibleRef.value = false
    unlock()
  }

  const onTriggerClick = () => {
    if (visibleRef.value) {
      close()
    } else {
      open()
    }
  }

  return {
    close,
    open,
    onTriggerClick,
    triggerA11yProps,
  }
}
