<template>
  <div ref="nodeRef">
    <VFilterButton
      v-show="isMdScreen || (!isMdScreen && !visibleRef)"
      ref="buttonRef"
      :is-header-scrolled="isHeaderScrolled"
      :pressed="visibleRef"
      v-bind="triggerA11yProps"
      @toggle="onTriggerClick"
    />
    <Component
      :is="isMdScreen ? 'VSidebarContent' : 'VMenuModal'"
      v-bind="options"
      @close="onTriggerClick"
    >
      <VSearchGridFilter @close="onTriggerClick" />
    </Component>
  </div>
</template>

<script>
import {
  ref,
  watch,
  reactive,
  computed,
  onMounted,
  useContext,
  inject,
} from '@nuxtjs/composition-api'
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import VMenuModal from '~/components/VHeader/VMenuModal.vue'
import VSidebarContent from '~/components/VHeader/VSidebarContent.vue'
import { VTeleport } from '~/components/VTeleport'
import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VSearchGridFilter from '~/components/VFilters/VSearchGridFilter.vue'

export default {
  name: 'VHeaderFilter',
  components: {
    VFilterButton,
    VSearchGridFilter,
    VSidebarContent,
    VMenuModal,
    VTeleport,
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
  setup(_, { emit }) {
    const modalRef = ref(null)
    const visibleRef = ref(false)
    const nodeRef = ref(null)

    /** @type {import('@nuxtjs/composition-api').Ref<HTMLElement | undefined>} */
    const buttonRef = ref()
    const filterSidebar = useFilterSidebarVisibility()
    const { i18n } = useContext()
    /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */
    const isMdScreen = inject('isMdScreen')
    /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */
    const isHeaderScrolled = inject('isHeaderScrolled')

    onMounted(() => {
      if (isMdScreen.value && filterSidebar.isVisible.value) {
        open()
      }
    })

    const triggerA11yProps = reactive({
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    })

    watch([visibleRef], ([visible]) => {
      triggerA11yProps['aria-expanded'] = visible
    })

    const { lock, unlock } = useBodyScrollLock({ nodeRef })

    const open = () => {
      visibleRef.value = true
      filterSidebar.isVisible.value = true
      emit('open')
      if (!isMdScreen.value) {
        lock()
      }
    }

    const close = () => {
      visibleRef.value = false
      filterSidebar.isVisible.value = false
      emit('close')
      if (!isMdScreen.value) {
        unlock()
      }
    }

    const onTriggerClick = () => {
      if (visibleRef.value === true) {
        close()
      } else {
        open()
      }
    }

    const options = computed(() => {
      return isMdScreen.value
        ? { to: 'sidebar', visible: visibleRef.value }
        : {
            visible: visibleRef.value,
            'trigger-element': nodeRef?.value?.firstChild,
            hide: close,
            'aria-label': i18n.t('header.filter-button.simple'),
          }
    })

    return {
      modalRef,
      buttonRef,
      isHeaderScrolled,
      nodeRef,
      visibleRef,
      open,
      close,
      onTriggerClick,
      triggerA11yProps,
      isMdScreen,
      options,
    }
  },
}
</script>
