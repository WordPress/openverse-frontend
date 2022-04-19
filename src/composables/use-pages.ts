import { computed, useRoute } from '#app'

import { useLocalePath } from '~/composables/use-i18n'

export default function usePages() {
  const localePath = useLocalePath()

  const pages = [
    {
      id: 'about',
      name: 'header.about-nav-item',
      link: localePath('/about'),
    },
    {
      id: 'sources',
      name: 'header.source-nav-item',
      link: localePath('/sources'),
    },
    {
      id: 'licenses',
      name: 'header.licenses-nav-item',
      link: 'https://creativecommons.org/about/cclicenses/',
    },
    {
      id: 'search-help',
      name: 'header.search-guide-nav-item',
      link: localePath('/search-help'),
    },
    {
      id: 'meta-search',
      name: 'header.meta-search-nav-item',
      link: localePath('/meta-search'),
    },
    {
      id: 'feedback',
      name: 'header.feedback-nav-item',
      link: localePath('/feedback'),
    },
    {
      id: 'api',
      name: 'header.api-nav-item',
      link: 'https://api.openverse.engineering/v1/',
    },
    {
      id: 'extension',
      name: 'header.extension-nav-item',
      link: localePath('/extension'),
    },
    {
      id: 'privacy',
      name: 'header.privacy-nav-item',
      link: 'https://wordpress.org/privacy',
    },
  ]

  const route = useRoute()
  const currentPageId = computed(() => route.name)

  return { all: pages, current: currentPageId }
}
