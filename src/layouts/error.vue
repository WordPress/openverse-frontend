<template>
  <main class="bg-yellow h-screen relative">
    <Logo class="mt-6 ms-6 md:ms-10 md:mt-8 w-30 lg:w-80 h-auto" />
    <Oops
      aria-hidden="true"
      class="absolute opacity-5 fill-dark-charcoal -mt-[10%] -ml-[20%] lg:mx-auto w-[140%] lg:w-full px-6 lg:px-16"
    />
    <header
      class="absolute lg:max-w-2xl space-y-4 top-1/4 z-10 left-0 right-0 mx-auto px-6 lg:px-0"
    >
      <h1 class="mb-6 lg:leading-tight text-4xl lg:text-[50px]">
        The content you’re looking for kind of disappeared.
      </h1>
      <p class="font-semibold">
        Return to
        <NuxtLink
          class="underline text-current hover:text-current active:text-current"
          to="/"
          >Openverse</NuxtLink
        >
        or search something similar from the field below.
      </p>
      <div class="bg-white">
        <SearchBar
          label-text="Search Openverse"
          field-id="404-search"
          placeholder="Search for content to resuse"
        />
      </div>
    </header>
  </main>
</template>

<script>
import Oops from '~/assets/oops.svg?inline'
import Logo from '~/assets/logo.svg?inline'
import SearchBar from '../components/Header/SearchBar/SearchBar.vue'

const Error = {
  name: 'home-page',
  props: ['error'],
  components: {
    Logo,
    Oops,
    SearchBar,
  },
  layout: 'blank',
}
export default Error
</script>
