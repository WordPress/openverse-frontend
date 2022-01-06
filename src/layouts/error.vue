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
        {{ $t('404.title') }}
      </h1>
      <p class="font-semibold">
        <i18n path="404.main">
          <template #link>
            <NuxtLink
              class="underline text-current hover:text-current active:text-current"
              to="/"
            >
              {{ $t('404.link-title') }}
            </NuxtLink>
          </template>
        </i18n>
      </p>
      <div class="bg-white">
        <SearchBar
          :value="query"
          autofocus
          :label-text="$t('404.search-placeholder')"
          field-id="404-search"
          :placeholder="$t('404.search-placeholder')"
          @input.prevent="setLocalQuery"
          @submit="onSubmit"
        />
      </div>
    </header>
  </main>
</template>

<script>
import {
  UPDATE_QUERY,
  TOGGLE_FILTER,
  FETCH_MEDIA,
} from '~/constants/action-types'
import { MEDIA, SEARCH } from '~/constants/store-modules'
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(SEARCH, ['searchQueryParams']),
  },
  layout: 'blank',
  data() {
    return {
      query: '',
    }
  },
  methods: {
    ...mapActions(SEARCH, {
      setSearchTerm: UPDATE_QUERY,
      checkFilter: TOGGLE_FILTER,
    }),
    ...mapActions(MEDIA, { fetchMedia: FETCH_MEDIA }),
    setLocalQuery(event) {
      console.log(event)
      this.query = event.target.value
    },
    onSubmit() {
      this.setSearchTerm({ q: this.query })
      this.fetchMedia({})
      const newPath = this.localePath({
        path: `/search/all`,
        query: this.searchQueryParams,
      })
      this.$router.push(newPath)
    },
  },
}
export default Error
</script>
