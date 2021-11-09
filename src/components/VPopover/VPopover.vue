<template>
  <div>
    <div
      ref="triggerContainerRef"
      class="w-min whitespace-nowrap"
      @click="onTriggerClick"
    >
      <!--
        @slot The trigger, should be a button 99.99% of the time. If you need custom event handling on the trigger button, ensure bubbling is not prevented or else the popover will not open
          @binding {object} a11yProps
          @binding {boolean} visible
      -->
      <slot
        name="trigger"
        :a11y-props="triggerA11yProps"
        :visible="visibleRef"
      />
    </div>
    <VPopoverContent
      :visible="visibleRef"
      :trigger-element="triggerRef"
      :placement="placement"
      :fixed="fixed"
      :hide-on-esc="hideOnEsc"
      :hide-on-click-outside="hideOnClickOutside"
      :auto-focus-on-show="autoFocusOnShow"
      :auto-focus-on-hide="autoFocusOnHide"
      :gutter="gutter"
      :hide="close"
      :aria-label="label"
      :aria-labelledby="labelledBy"
    >
      <!-- @slot The content of the popover -->
      <slot name="content" />
    </VPopoverContent>
  </div>
</template>

<script>
import VPopoverContent from '~/components/VPopover/VPopoverContent.vue'
import {
  defineComponent,
  ref,
  watch,
  reactive,
  computed,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'VPopover',
  components: { VPopoverContent },
  props: {
    hideVisually: {
      type: Boolean,
      default: undefined,
    },
    hideOnEsc: { type: Boolean, default: undefined },
    hideOnClickOutside: { type: Boolean, default: undefined },
    autoFocusOnShow: { type: Boolean, default: undefined },
    autoFocusOnHide: { type: Boolean, default: undefined },
    gutter: { type: Number, default: undefined },
    placement: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<import('@popperjs/core').Placement>} */ (String),
    },
    fixed: { type: Boolean, default: undefined },
    label: { type: String },
    labelledBy: { type: String },
  },
  emits: ['open', 'close'],
  setup(_, { emit }) {
    const visibleRef = ref(false)
    /** @type {import('@nuxtjs/composition-api').Ref<HTMLElement | undefined>} */
    const triggerContainerRef = ref()
    /** @type {import('@nuxtjs/composition-api').Ref<HTMLElement | undefined>} */
    const finalFocusElementRef = ref()
    /** @type {import('@nuxtjs/composition-api').Ref<HTMLElement | undefined>} */
    const disclosureRef = ref()
    const getDisclosureRef = () => disclosureRef
    const triggerA11yProps = reactive({
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    })

    const triggerRef = computed(() => triggerContainerRef.value?.firstChild)

    watch(
      [disclosureRef, finalFocusElementRef, visibleRef],
      ([disclosure, finalFocusElement, visible]) => {
        if (!(disclosure && finalFocusElement)) return

        if (disclosure === finalFocusElement && visible) {
          triggerA11yProps['aria-expanded'] = true
        } else {
          triggerA11yProps['aria-expanded'] = false
        }
      }
    )

    const open = () => {
      visibleRef.value = true
      emit('open')
    }

    const close = () => {
      visibleRef.value = false
      emit('close')
    }

    const onTriggerClick = () => {
      console.log('clicking!', visibleRef.value)
      if (visibleRef.value === true) {
        close()
      } else {
        open()
      }
    }

    return {
      visibleRef,
      close,
      triggerContainerRef,
      triggerRef,
      onTriggerClick,
      getDisclosureRef,
      triggerA11yProps,
      finalFocusElementRef,
    }
  },
})
</script>
