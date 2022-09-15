<template>
  <footer class="flex flex-col gap-10 px-6 py-10 lg:px-10 xl:flex-row xl:gap-8">
    <!-- Logo and links -->
    <div
      v-if="isContent"
      class="flex flex-col gap-10 md:flex-row md:items-center md:justify-between xl:flex-grow"
    >
      <div class="flex h-auto w-30 flex-row gap-1">
        <OpenverseLogo />
        <OpenverseBrand />
      </div>
      <nav>
        <ul class="grid grid-cols-2 gap-6 text-sm sm:flex sm:flex-row sm:gap-8">
          <li v-for="page in allPages" :key="page.id">
            <VLink
              class="text-dark-charcoal"
              :href="page.link"
              show-external-icon
              >{{ $t(page.name) }}</VLink
            >
          </li>
        </ul>
      </nav>
    </div>

    <!-- Locale chooser and WordPress affiliation graphic -->
    <div class="flex flex-col justify-between gap-10 sm:flex-row xl:flex-grow">
      <div
        class="flex h-10 w-full w-full items-center justify-center border border-dark-charcoal-20 sm:w-50"
      >
        {{ $t('🚧') }}
      </div>
      <i18n
        tag="div"
        path="footer.wordpress-affiliation"
        class="flex flex-row items-center gap-2 text-sm"
      >
        <template #wordpress>
          <WordPress class="aria-hidden" />
          <span class="sr-only">WordPress</span>
        </template>
      </i18n>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@nuxtjs/composition-api'

import usePages from '~/composables/use-pages'

import VLink from '~/components/VLink.vue'

import OpenverseLogo from '~/assets/logo.svg?inline'
import OpenverseBrand from '~/assets/brand.svg?inline'
import WordPress from '~/assets/wordpress.svg?inline'

/**
 * The footer is the section displayed at the bottom of a page. It can contain
 * some branding, links to other pages and an option to change the language.
 */
export default defineComponent({
  name: 'VFooter',
  components: {
    VLink,
    OpenverseLogo,
    OpenverseBrand,
    WordPress,
  },
  props: {
    /**
     * whether the footer is being rendered on a content page or an internal
     * page; This determines whether the Openverse logo and other links are
     * displayed.
     */
    mode: {
      type: String as PropType<'internal' | 'content' | undefined>,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    const { all: allPages, current: currentPage } = usePages(true)

    const isContent = computed(() => {
      if (props.mode) {
        return props.mode === 'content'
      } else {
        return ['search', 'audio', 'image'].some((prefix) =>
          currentPage.value.startsWith(prefix)
        )
      }
    })

    return {
      isContent,
      allPages,
    }
  },
})
</script>
