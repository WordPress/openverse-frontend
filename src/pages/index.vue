<template>
  <main
    class="flex flex-col lg:flex-row items-center justify-center gap-2 bg-yellow h-screen overflow-hidden"
  >
    <!-- TODO: Refine min-width for different breakpoints -->
    <header
      class="w-full sm:w-auto sm:min-w-[32rem] xl:min-w-[64rem] box-border px-4 sm:px-40 mx-auto mt-auto mb-0 sm:mb-auto lg:my-0 flex flex-col justify-center"
    >
      <h1 class="hidden sm:block">
        <span class="sr-only">{{ $t('hero.brand') }}</span>
        <!-- width and height chosen w.r.t. viewBox "0 0 280 42" -->
        <OpenverseLogo width="420" height="63" class="sm:translate-x-[-98px]" />
      </h1>
      <h2 class="text-6xl mt-6">{{ $t('hero.subtitle') }}</h2>

      <VSearchBar class="mt-8" :placeholder="featuredSearch.term">
        <VContentSwitcherPopover
          v-if="isMounted && isMinScreenMd"
          ref="contentSwitcher"
          class="mx-3"
          :active-item="contentType"
          @select="setContentType"
        />
      </VSearchBar>

      <i18n
        path="hero.disclaimer.content"
        tag="p"
        class="hidden sm:block text-sr mt-4"
      >
        <template #license>
          <a
            href="https://creativecommons.org/licenses/"
            class="text-dark-charcoal hover:text-dark-charcoal underline"
            >{{ $t('hero.disclaimer.license') }}</a
          >
        </template>
      </i18n>
    </header>

    <!-- Image carousel -->
    <div
      class="overflow-x-scroll lg:overflow-hidden w-full lg:w-auto lg:h-full"
    >
      <div
        class="homepage-images flex flex-row lg:grid lg:grid-cols-2 lg:grid-rows-4 lg:w-[57.143vh] lg:h-[114.287vh]"
      >
        <Transition
          v-for="(image, index) in featuredSearch.images"
          :key="image.alt"
          tag="div"
          name="fade"
          mode="out-in"
        >
          <div
            :key="image.alt"
            class="block aspect-square p-4 lg:p-[2vh] h-40 w-40 lg:h-auto lg:w-auto"
            :style="{ '--transition-index': `${index * 0.05}s` }"
          >
            <!-- <NuxtLink
            :to="image.url"
            class="aspect-square block rounded-full overflow-hidden h-full w-full"
          > -->
            <img
              class="object-cover h-full w-full rounded-full"
              :src="require(`~/assets/homepage_images/${image.src}`)"
              :alt="image.alt"
              :title="image.title"
            />
          </div>
          <!-- </NuxtLink> -->
        </Transition>
      </div>
    </div>

    <i18n
      path="hero.disclaimer.content"
      tag="p"
      class="sm:hidden text-sr p-4 mt-auto"
    >
      <template #license>
        <a
          href="https://creativecommons.org/licenses/"
          class="text-dark-charcoal hover:text-dark-charcoal underline"
          >{{ $t('hero.disclaimer.license') }}</a
        >
      </template>
    </i18n>
  </main>
</template>

<script>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from '@nuxtjs/composition-api'

import VContentSwitcherPopover from '~/components/VContentSwitcher/VContentSwitcherPopover.vue'

import { isMinScreen } from '~/composables/use-media-query'
import { ALL_MEDIA } from '~/constants/media'

import imageInfo from '~/assets/homepage_images/image_info.json'

import OpenverseLogo from '~/assets/logo.svg?inline'

const HomePage = {
  name: 'home-page',
  layout: 'blank',
  components: {
    OpenverseLogo,
    VContentSwitcherPopover,
  },
  setup() {
    const makeImageArray = (prefix = '') =>
      imageInfo.sets
        .find((item) => item.prefix === prefix)
        .images.map((item) => ({
          src: `${prefix}-${item.index}.jpg`,
          alt: item.title,
          title: item.title,
        }))
    const featuredSearches = [
      {
        term: 'Universe',
        images: makeImageArray('Universe'),
      },
      {
        term: 'Indigenous pottery',
        images: makeImageArray('Pottery'),
      },
      {
        term: 'Olympic games',
        images: makeImageArray('Olympics'),
      },
    ]
    const featuredSearch = computed(
      () => featuredSearches[featuredSearchIdx.value]
    )

    const featuredSearchIdx = ref(0)
    let rotInterval = null
    onMounted(() => {
      rotInterval = setInterval(() => {
        // featuredSearchIdx.value += 1
        featuredSearchIdx.value %= featuredSearches.length
      }, 6000)
    })
    onBeforeUnmount(() => {
      if (rotInterval) {
        clearInterval(rotInterval)
      }
    })

    const isMounted = ref(false)
    onMounted(() => {
      isMounted.value = true
    })
    onBeforeUnmount(() => {
      isMounted.value = false
    })

    const isMinScreenMd = isMinScreen('md', { shouldPassInSSR: true })

    const contentSwitcher = ref(null)
    const contentType = ref(ALL_MEDIA)
    const setContentType = (type) => {
      contentType.value = type
      contentSwitcher.value?.closeMenu()
    }

    return {
      featuredSearch,

      isMounted,

      isMinScreenMd,

      contentSwitcher,
      contentType,
      setContentType,
    }
  },
}

export default HomePage
</script>

<style>
@screen lg {
  .homepage-images {
    transform: translateY(-7.143vh);
  }

  .homepage-images > *:nth-child(even) {
    transform: translateY(50%);
  }

  .homepage-images > * {
    transition-delay: var(--transition-index) !important;
  }
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.5s;
}
</style>
