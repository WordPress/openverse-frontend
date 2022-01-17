<template>
  <div ref="nodeRef" class="flex justify-center">
    <div
      ref="triggerContainerRef"
      class="flex items-stretch"
      @click="onTriggerClick"
    >
      <VContentSwitcherButton :a11y-props="triggerA11yProps" />
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
      <nav class="p-6" aria-labelledby="content-switcher-heading">
        <h2
          id="content-switcher-heading"
          class="md:sr-only text-sr pb-4 uppercase font-semibold"
        >
          {{ $t('search-type.heading') }}
        </h2>
        <VItemGroup
          direction="vertical"
          :bordered="true"
          type="radiogroup"
          class="z-10"
        >
          <VItem
            v-for="(item, idx) in content.types"
            :key="idx"
            :selected="item === content.activeType.value"
            :is-first="idx === 0"
            @click.native="handleClick(item)"
          >
            <VIcon :icon-path="content.icons[item]" class="me-2 ms-4 my-4" />
            <span class="pe-20 py-4 font-semibold">{{
              $t(`search-type.${item}`)
            }}</span>
          </VItem>
        </VItemGroup>
        <VItemGroup direction="columns" class="mt-10" :bordered="false">
          <VItem
            v-for="(page, idx) in pages.all"
            :key="page.id"
            class="w-1/2"
            :selected="page.id === pages.current"
            :is-first="idx === 0"
            v-bind="getLinkProps(page)"
          >
            <div class="flex flex-row">
              <span class="pe-2">{{ $t(page.name) }}</span>
              <VIcon
                v-if="isLinkExternal(page)"
                :icon-path="externalLinkIcon"
                :size="5"
                class="self-center mb-0.5"
              />
            </div>
          </VItem>
        </VItemGroup>
      </nav>
    </VMobileModalContent>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from '@nuxtjs/composition-api'
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'
import useContentType from '~/composables/use-content-type'
import usePages from '~/composables/use-pages'

import externalLinkIcon from '~/assets/icons/external-link.svg'

import VMobileModalContent from '~/components/VModal/VMobileModalContent.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'

const externalLinkProps = { as: 'a', target: '_blank', rel: 'noopener' }

export default {
  name: 'VMobileContentSwitcher',
  components: { VMobileModalContent, VItemGroup, VItem, VIcon },
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
    const content = useContentType()
    const pages = usePages()

    const modalRef = ref(null)
    const triggerContainerRef = ref(null)

    const closeMenu = () => close()

    const visibleRef = ref(false)
    const nodeRef = ref(null)

    const triggerA11yProps = reactive({
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    })

    const triggerRef = ref()
    onMounted(() => (triggerRef.value = triggerContainerRef.value?.firstChild))

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
    const handleClick = (item) => {
      emit('select', item)
    }

    const isLinkExternal = (item) => !item.link.startsWith('/')
    const getLinkProps = (item) => {
      return isLinkExternal(item)
        ? { ...externalLinkProps, href: item.link }
        : { as: 'NuxtLink', to: item.link }
    }
    return {
      getLinkProps,
      isLinkExternal,
      externalLinkIcon,
      pages,
      content,
      close,
      modalRef,
      nodeRef,
      triggerContainerRef,
      closeMenu,

      triggerRef,
      onTriggerClick,

      triggerA11yProps,
      visibleRef,
      handleClick,
    }
  },
}
</script>
