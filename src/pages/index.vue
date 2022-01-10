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
      <label for="">
        <span class="sr-only">Cool</span>
        <input type="text" />
      </label>
      <p>
        All Openverse content is under a creative Comons license or is in the
        public domain.
      </p>
    </header>
    <div class="images w-1/2 xl:w-1/3 grid grid-cols-2 grid-rows-4">
      <div
        v-for="(image, index) in featuredSearch.images"
        :key="index"
        class="p-4 xl:p-8 block aspect-square"
      >
        <NuxtLink
          :to="image.url"
          class="aspect-square block rounded-full overflow-hidden h-full w-full"
        >
          <img
            class="object-cover h-full w-full"
            :src="image.src"
            :alt="image.alt"
          />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script>
import OpenverseLogoText from '~/assets/icons/openverse-logo-text.svg?inline'

const HomePage = {
  name: 'home-page',
  layout: 'blank',
  components: {
    OpenverseLogoText,
  },
  setup() {
    const featuredSearches = [
      {
        term: 'Indigenous pottery',
        images: [
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
          {
            url: '/about',
            src: 'https://source.unsplash.com/1600x900/?party',
            alt: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          },
        ],
      },
    ]
    const featuredSearch = featuredSearches[0]

    return {
      featuredSearch,
    }
  },
}

export default HomePage
</script>

<style scoped>
.images > *:nth-child(even) {
  transform: translateY(50%);
}
</style>
