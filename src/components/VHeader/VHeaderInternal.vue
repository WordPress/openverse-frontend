<template>
  <header
    class="main-header z-30 flex h-20 w-full items-stretch justify-between gap-x-2 bg-white py-4 pe-3 ps-6 md:py-4 md:px-7"
  >
    <VBrand :is-fetching="false" />
    <nav class="justify-stretch md:justify-stretch hidden ms-auto md:flex">
      <ul class="flex flex-row items-center gap-8 text-sm">
        <li v-for="page in allPages" :key="page.id">
          <VLink
            class="text-dark-charcoal"
            :class="currentPage === page.id ? 'font-bold' : ''"
            :href="page.link"
            show-external-icon
            >{{ $t(`navigation.${page.id}`) }}</VLink
          >
        </li>
      </ul>
    </nav>
    <VModal
      :label="$t('header.aria.menu').toString()"
      variant="full"
      mode="dark"
      modal-content-classes="flex md:hidden"
      :visible="isModalVisible"
      @open="setModalVisibility(true)"
    >
      <template #trigger="{ a11yProps }">
        <VIconButton
          ref="menuButtonRef"
          :icon-props="{ iconPath: menuIcon }"
          :button-props="{ variant: 'plain' }"
          v-bind="a11yProps"
          class="border-tx"
          size="search-medium"
        />
      </template>

      <template #top-bar>
        <div
          class="flex h-20 w-full justify-between bg-dark-charcoal py-4 text-white pe-3 ps-6"
        >
          <VBrand :is-fetching="false" />
          <VIconButton
            ref="closeButton"
            :button-props="{ variant: 'plain' }"
            :icon-props="{ iconPath: closeIcon }"
            size="search-medium"
            class="border-tx text-white"
            :aria-label="$t('modal.close')"
            @click="setModalVisibility(false)"
          />
        </div>
      </template>
      <template #default>
        <ul class="flex flex-col items-end bg-dark-charcoal text-white">
          <li v-for="page in allPages" :key="page.id" class="mt-6">
            <VLink
              class="heading-5 text-white"
              :class="currentPage === page.id ? 'font-bold' : ''"
              :href="page.link"
              show-external-icon
              @click="setModalVisibility(false)"
              >{{ $t(`navigation.${page.id}`) }}</VLink
            >
          </li>
        </ul>
        <VLink
          href="https://wordpress.org"
          class="text-white hover:no-underline"
        >
          <i18n
            tag="p"
            path="footer.wordpress-affiliation"
            class="mt-auto flex flex-row items-center text-sm"
          >
            <template #wordpress>
              <WordPress class="aria-hidden text-white" />
              <span class="sr-only">WordPress</span>
            </template>
          </i18n>
        </VLink>
      </template>
    </VModal>
  </header>
</template>
<script lang="ts">
import { defineComponent, ref, useRoute, watch } from '@nuxtjs/composition-api'

import usePages from '~/composables/use-pages'

import VIconButton from '~/components/VIconButton/VIconButton.vue'
import VBrand from '~/components/VBrand/VBrand.vue'
import VLink from '~/components/VLink.vue'
import VModal from '~/components/VModal/VModal.vue'

import closeIcon from '~/assets/icons/close.svg'
import menuIcon from '~/assets/icons/menu.svg'
import WordPress from '~/assets/wordpress.svg?inline'

export default defineComponent({
  name: 'VHeaderInternal',
  components: { VBrand, VIconButton, VLink, VModal, WordPress },
  setup() {
    const menuButtonRef = ref<InstanceType<typeof VIconButton>>(null)

    const { all: allPages, current: currentPage } = usePages(true)
    const route = useRoute()

    const isModalVisible = ref(false)
    const setModalVisibility = (visibility: boolean) => {
      isModalVisible.value = visibility
    }

    // When clicking on an internal link in the modal, close the modal
    watch(route, () => {
      if (isModalVisible.value) {
        setModalVisibility(false)
      }
    })

    return {
      menuButtonRef,

      closeIcon,
      menuIcon,

      allPages,
      currentPage,

      isModalVisible,
      setModalVisibility,
    }
  },
})
</script>
