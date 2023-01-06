<template>
  <div ref="nodeRef">
    <h2
      class="mt-auto mb-2 text-[40px] font-light leading-tight lg:text-[63px]"
    >
      {{ $t("hero.subtitle") }}
    </h2>

    <p class="text-base leading-relaxed">
      {{ $t("hero.description") }}
    </p>

    <VStandaloneSearchBar class="mt-4 md:mt-6" @submit="handleSearch">
      <VSearchTypeButton
        id="search-type-button"
        ref="searchTypeButtonRef"
        class="me-2"
        v-bind="{ ...triggerA11yProps, ...searchTypeProps }"
        :show-label="isSm"
        aria-controls="content-switcher-popover"
        @click="onTriggerClick"
      />
      <template v-if="triggerElement">
        <VPopoverContent
          v-if="isLg"
          z-index="popover"
          :hide="closeContentSwitcher"
          :visible="isContentSwitcherVisible"
          :trigger-element="triggerElement"
          aria-labelledby="search-type-button"
        >
          <VSearchTypes size="small" @select="handleSelect" />
        </VPopoverContent>

        <VContentSettingsModalContent
          v-else
          aria-labelledby="search-type-button"
          :close="closeContentSwitcher"
          :visible="isContentSwitcherVisible"
          :use-links="false"
          @open="openContentSwitcher"
          @select="handleSelect"
        />
      </template>
    </VStandaloneSearchBar>

    <!-- Disclaimer for large screens -->
    <i18n path="hero.disclaimer.content" tag="p" class="mt-4 text-sr">
      <template #openverse>Openverse</template>
      <template #license>
        <VLink
          href="https://creativecommons.org/licenses/"
          class="text-dark-charcoal underline hover:text-dark-charcoal"
          >{{ $t("hero.disclaimer.license") }}</VLink
        >
      </template>
    </i18n>
  </div>
</template>
<script lang="ts">
import { computed, ref, PropType } from "@nuxtjs/composition-api"

import type { SearchType } from "~/constants/media"

import useSearchType from "~/composables/use-search-type"
import { useDialogControl } from "~/composables/use-dialog-control"

import { useUiStore } from "~/stores/ui"

import VLink from "~/components/VLink.vue"
import VPopoverContent from "~/components/VPopover/VPopoverContent.vue"
import VSearchTypeButton from "~/components/VContentSwitcher/VSearchTypeButton.vue"
import VSearchTypes from "~/components/VContentSwitcher/VSearchTypes.vue"
import VStandaloneSearchBar from "~/components/VHeader/VSearchBar/VStandaloneSearchBar.vue"

import VContentSettingsModalContent from "./VHeader/VHeaderMobile/VContentSettingsModalContent.vue"

export default {
  name: "VHomepageContent",
  components: {
    VContentSettingsModalContent,
    VSearchTypes,
    VPopoverContent,
    VSearchTypeButton,
    VStandaloneSearchBar,
    VLink,
  },
  props: {
    handleSearch: {
      type: Function as PropType<(query: string) => void>,
      required: true,
    },
    searchType: {
      type: String as PropType<SearchType>,
      required: true,
    },
    setSearchType: {
      type: Function as PropType<(searchType: SearchType) => void>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const nodeRef = ref<HTMLElement | null>(null)
    const searchTypeButtonRef = ref<InstanceType<typeof VSearchTypeButton>>()
    const { getSearchTypeProps } = useSearchType()
    const uiStore = useUiStore()

    const searchTypeProps = computed(() => getSearchTypeProps())

    const isContentSwitcherVisible = ref(false)

    const isSm = computed(() => uiStore.isBreakpoint("sm"))
    const isLg = computed(() => uiStore.isBreakpoint("lg"))

    const triggerElement = computed(
      () => (searchTypeButtonRef.value?.$el as HTMLElement) || null
    )

    const lockBodyScroll = computed(() => !isLg.value)

    const handleSelect = (searchType: SearchType) => {
      props.setSearchType(searchType)
      closeContentSwitcher()
    }

    const {
      close: closeContentSwitcher,
      open: openContentSwitcher,
      onTriggerClick,
      triggerA11yProps,
    } = useDialogControl({
      visibleRef: isContentSwitcherVisible,
      nodeRef,
      lockBodyScroll,
      emit,
    })

    return {
      nodeRef,
      searchTypeButtonRef,

      isLg,

      isSm,
      triggerElement,
      onTriggerClick,
      handleSelect,
      searchTypeProps,
      closeContentSwitcher,
      openContentSwitcher,
      isContentSwitcherVisible,
      triggerA11yProps,
    }
  },
}
</script>
