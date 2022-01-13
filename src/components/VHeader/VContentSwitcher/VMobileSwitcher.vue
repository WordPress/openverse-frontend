<template>
  <div ref="nodeRef" class="flex justify-center">
    <div ref="triggerContainerRef" @click="onTriggerClick">
      <slot
        name="content-switcher-button"
        :a11y-props="triggerA11yProps"
        :visible="visibleRef"
      />
    </div>
    <VMobileModalContent
      :visible="visibleRef"
      :trigger-element="triggerRef"
      :hide-on-esc="hideOnEsc"
      :hide-on-click-outside="hideOnClickOutside"
      :auto-focus-on-show="autoFocusOnShow"
      :auto-focus-on-hide="autoFocusOnHide"
      :hide="close"
      :aria-label="$t('header.filter-button.simple')"
    >
      <nav class="p-4">
        <slot name="content-switcher-content" />
        <slot name="page-switcher-content" />
      </nav>
    </VMobileModalContent>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from '@nuxtjs/composition-api'

import VMobileModalContent from '@/components/VModal/VMobileModalContent'
import { useBodyScrollLock } from '@/composables/use-body-scroll-lock'

export default {
  name: 'VMobileSwitcher',
  components: { VMobileModalContent },
  props: {
    /**
     * Whether the popover should hide when the <kbd>Escape</kbd> key is pressed.
     *
     * @default true
     */
    hideOnEsc: { type: Boolean, default: undefined },
    /**
     * Whether the popover should hide when a click happens outside the popover content,
     * excluding the trigger. When the trigger is clicked and the popover is open, nothing
     * will happen.
     *
     * @default true
     */
    hideOnClickOutside: { type: Boolean, default: undefined },
    /**
     * Whether the popover content should automatically receive focus when the popover
     * opens.
     *
     * @default true
     */
    autoFocusOnShow: { type: Boolean, default: undefined },
    /**
     * Whether the trigger should automatically receive focus when the popover closes.
     *
     * @default true
     */
    autoFocusOnHide: { type: Boolean, default: undefined },
  },
  setup(props, { emit }) {
    const modalRef = ref(null)

    const closeMenu = () => close()

    const visibleRef = ref(false)
    const nodeRef = ref(null)

    const triggerA11yProps = reactive({
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    })

    const triggerRef = computed(() => nodeRef.value?.firstChild.firstChild)

    watch([visibleRef], ([visible]) => {
      triggerA11yProps['aria-expanded'] = visible
    })

    const { lock, unlock } = useBodyScrollLock({ nodeRef })

    const open = () => {
      visibleRef.value = true
      emit('open')
      lock()
    }

    const close = () => {
      visibleRef.value = false
      emit('close')
      unlock()
    }

    const onTriggerClick = () => {
      if (visibleRef.value === true) {
        close()
      } else {
        open()
      }
    }

    return {
      close,
      modalRef,
      nodeRef,
      closeMenu,

      triggerRef,
      onTriggerClick,

      triggerA11yProps,
      visibleRef,
    }
  },
}
</script>
