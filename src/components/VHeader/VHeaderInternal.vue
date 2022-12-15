<template>
  <header
    ref="nodeRef"
    class="main-header z-30 flex h-20 w-full items-stretch justify-between gap-x-2 bg-white py-4 pe-3 ps-6 md:py-4 md:px-7"
  >
    <VHomeLink variant="dark" />
    <nav class="lg:justify-stretch hidden ms-auto lg:flex">
      <VPageLinks
        mode="light"
        class="md:justify-stretch flex hidden flex-row items-center gap-8 text-sm ms-auto md:flex"
        nav-link-classes="ps-3"
        @close="closePageMenu"
      />
    </nav>
    <div class="flex lg:hidden">
      <VIconButton
        ref="menuButtonRef"
        :icon-props="{ iconPath: menuIcon }"
        :aria-label="$t('header.aria.menu')"
        v-bind="triggerA11yProps"
        class="border-tx hover:bg-dark-charcoal hover:text-white"
        :class="{ 'bg-dark-charcoal text-white': isModalVisible }"
        @click="onTriggerClick"
      />
      <template v-if="triggerElement">
        <VPopoverContent
          v-if="isMd"
          z-index="popover"
          :hide="closePageMenu"
          :visible="isModalVisible"
          :trigger-element="triggerElement"
          :aria-label="$t('header.aria.menu')"
        >
          <VPageLinks
            mode="dark"
            variant="itemgroup"
            class="label-regular w-50 items-start"
            @close="closePageMenu"
          />
        </VPopoverContent>
        <VModalContent
          v-else-if="!isMd"
          :label="$t('header.aria.menu').toString()"
          :hide="closePageMenu"
          variant="full"
          mode="dark"
          modal-content-classes="flex md:hidden"
          :visible="isModalVisible"
          @open="openPageMenu"
        >
          <template #top-bar>
            <div
              class="flex h-20 w-full justify-between bg-dark-charcoal py-4 text-white pe-3 ps-6"
            >
              <VHomeLink variant="light" />
              <VIconButton
                ref="closeButton"
                :icon-props="{ iconPath: closeIcon }"
                class="border-tx text-white focus-visible:ring-offset-tx"
                :aria-label="$t('modal.close')"
                @click="closePageMenu"
              />
            </div>
          </template>
          <template #default>
            <nav>
              <VPageLinks
                mode="dark"
                class="mt-3 flex flex-col items-end gap-y-2"
                nav-link-classes="heading-5 py-3"
                @close="closePageMenu"
              />
            </nav>
            <VWordPressLink class="mt-auto" mode="dark" />
          </template>
        </VModalContent>
      </template>
    </div>
  </header>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useRoute,
  watch,
} from "@nuxtjs/composition-api"

import { useDialogControl } from "~/composables/use-dialog-control"
import usePages from "~/composables/use-pages"

import { useUiStore } from "~/stores/ui"

import VHomeLink from "~/components/VHeader/VHomeLink.vue"
import VIconButton from "~/components/VIconButton/VIconButton.vue"
import VPageLinks from "~/components/VHeader/VPageLinks.vue"
import VModalContent from "~/components/VModal/VModalContent.vue"
import VPopoverContent from "~/components/VPopover/VPopoverContent.vue"
import VWordPressLink from "~/components/VHeader/VWordPressLink.vue"

import closeIcon from "~/assets/icons/close.svg"
import menuIcon from "~/assets/icons/menu.svg"

export default defineComponent({
  name: "VHeaderInternal",
  components: {
    VModalContent,
    VPopoverContent,
    VHomeLink,
    VIconButton,
    VPageLinks,
    VWordPressLink,
  },
  setup(_, { emit }) {
    const menuButtonRef = ref<InstanceType<typeof VIconButton> | null>(null)
    const nodeRef = ref<HTMLElement | null>(null)

    const route = useRoute()

    const { all: allPages, current: currentPage } = usePages(true)

    const isModalVisible = ref(false)
    const uiStore = useUiStore()
    const isLg = computed(() => uiStore.isBreakpoint("lg"))
    watch(isLg, (isLg) => {
      if (isLg && isModalVisible.value) {
        closePageMenu()
      }
    })

    const isMd = computed(() => uiStore.isBreakpoint("md"))

    const triggerElement = computed(
      () => (menuButtonRef.value?.$el as HTMLElement) || null
    )
    const {
      close: closePageMenu,
      open: openPageMenu,
      onTriggerClick,
      triggerA11yProps,
    } = useDialogControl({
      visibleRef: isModalVisible,
      nodeRef,
      shouldLockBodyScrollRef: computed(() => !isMd.value),
      emit,
    })

    // When clicking on an internal link in the modal, close the modal
    watch(route, () => {
      if (isModalVisible.value) {
        closePageMenu()
      }
    })

    return {
      menuButtonRef,
      nodeRef,

      closeIcon,
      menuIcon,

      allPages,
      currentPage,

      isModalVisible,
      closePageMenu,
      openPageMenu,
      isMd,
      onTriggerClick,
      triggerA11yProps,
      triggerElement,
    }
  },
})
</script>
