<template>
  <main
    class="bg-yellow h-screen flex justify-center items-center overflow-hidden"
  >
    <header class="flex flex-col justify-center w-1/2 xl:w-2/3 pl-4 xl:pl-64">
      <h1>
        <span class="sr-only">Openverse</span>
        <OpenverseLogoText class="w-80" />
      </h1>
      <h2>Browse through over 600 million items to reuse</h2>
      <VSearchBar :placeholder="featuredSearch.term" />
      <p>
        All Openverse content is under a creative Comons license or is in the
        public domain.
      </p>
    </header>
    <div class="homepage-images w-1/2 xl:w-1/3 grid grid-cols-2 grid-rows-4">
      <Transition
        v-for="(image, index) in featuredSearch.images"
        :key="image.alt"
        tag="div"
        name="fade"
        mode="out-in"
      >
        <div
          :key="image.alt"
          class="p-4 xl:p-8 block aspect-square"
          :style="{ '--transition-index': `${index * 0.05}s` }"
        >
          <!-- <NuxtLink
          :to="image.url"
          class="aspect-square block rounded-full overflow-hidden h-full w-full"
        > -->
          <img
            class="object-cover h-full w-full rounded-full"
            :src="require(`~/assets/homepage-images/${image.src}`)"
            :alt="image.alt"
          />
        </div>
        <!-- </NuxtLink> -->
      </Transition>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from '@nuxtjs/composition-api'
import OpenverseLogoText from '~/assets/icons/openverse-logo-text.svg?inline'

const HomePage = {
  name: 'home-page',
  layout: 'blank',
  components: {
    OpenverseLogoText,
  },
  setup() {
    const makeImageArray = (prefix = '') =>
      new Array(7).fill({}).map((_, index) => ({
        src: `${prefix}-${index + 1}.jpg`,
        alt: `${prefix} image ${index + 1}`,
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
    const featuredSearch = ref(featuredSearches[1])
    onMounted(() => {
      setInterval(() => {
        let activeIndex = featuredSearches.indexOf(featuredSearch.value)
        featuredSearch.value =
          featuredSearches[
            activeIndex < featuredSearches.length - 1 ? activeIndex + 1 : 0
          ]
      }, 6000)
    })

    return {
      featuredSearch,
    }
  },
}

export default HomePage
</script>

<style>
.homepage-images > *:nth-child(even) {
  transform: translateY(50%);
}

.homepage-images > * {
  transition-delay: var(--transition-index) !important;
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
