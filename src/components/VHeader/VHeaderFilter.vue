<template>
  <div ref="nodeRef">
    <VFilterButton
      v-show="isMdScreen || (!isMdScreen && !visibleRef && !hideButtons)"
      ref="buttonRef"
      :is-header-scrolled="isHeaderScrolled"
      :pressed="visibleRef"
      v-bind="triggerA11yProps"
      @toggle="onTriggerClick"
    />
    <Component :is="filterComponent" v-bind="options" @close="onTriggerClick">
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
  props: {
    hideButtons: {
      type: Boolean,
      required: true,
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

    const filterComponent = ref(VMenuModal)

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
      emit('open')
    }

    const close = () => {
      visibleRef.value = false
      emit('close')
    }

    watch([visibleRef], () => {
      filterSidebar.setVisibility(visibleRef.value)
      if (!isMdScreen) {
        visibleRef ? lock() : unlock()
      }
    })

    const onTriggerClick = () => {
      if (visibleRef.value === true) {
        close()
      } else {
        open()
      }
    }
    const mobileOptions = {
      visible: computed(() => visibleRef.value),
      'trigger-element': computed(() => nodeRef?.value?.firstChild),
      hide: close,
      'aria-label': i18n.t('header.filter-button.simple'),
    }
    const desktopOptions = {
      to: 'sidebar',
      visible: computed(() => visibleRef.value),
    }
    /**
     * @type {Ref<{'trigger-element'?: ComputedRef<HTMLElement|null>, hide?: close, visible: ComputedRef<boolean>, 'aria-label'?: string, to?: string}>}
     */
    const options = ref(mobileOptions)
    onMounted(() => {
      if (isMdScreen.value && filterSidebar.isVisible.value) {
        open()
      }
    })
    watch(
      [isMdScreen],
      (isMdScreen) => {
        if (isMdScreen) {
          filterComponent.value = VSidebarContent
          options.value = desktopOptions
        } else {
          filterComponent.value = VMenuModal
          options.value = mobileOptions.value
        }
      },
      { immediate: true }
    )

    return {
      filterComponent,
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
