<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <HeaderSection />
    <main class="embedded">
      <NotificationBanner v-show="!shouldHideBanner" @close="dismissBanner">
        <i18n path="notification.translation.text">
          <template #link>
            <a :href="translationLink" target="_blank">{{
              $t('notification.translation.link')
            }}</a>
          </template>
          <template #locale>
            {{ bannerLocale.name }}
          </template>
        </i18n>
      </NotificationBanner>
      <Nuxt />
    </main>
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'

import { NAV } from '~/constants/store-modules'
import { StorageSerializers, useStorage } from '~/composables/use-storage'
import useI18nSync from '~/composables/use-i18n-sync'

import { computed, useContext } from '@nuxtjs/composition-api'

const BASE_URL = 'https://translate.wordpress.org/projects/meta/openverse/'

const embeddedPage = {
  name: 'embedded',
  layout: 'embedded',
  mixins: [iframeHeight],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  setup() {
    const { showBanner, bannerLocale } = useI18nSync()
    const bannerDismissedForLocales = useStorage(
      'openverse-dismissed-banner-locales',
      [],
      {
        serializer: StorageSerializers.object,
      }
    )

    const shouldHideBanner = computed(() => {
      return (
        !showBanner.value ||
        bannerDismissedForLocales.value.includes(bannerLocale.code)
      )
    })
    const dismissBanner = () => {
      bannerDismissedForLocales.value = [
        ...bannerDismissedForLocales.value,
        bannerLocale.code,
      ]
    }
    const translationLink = computed(
      () => `${BASE_URL}${bannerLocale.code}/default/`
    )
    const { store } = useContext()
    const isReferredFromCc = store.state[NAV].isReferredFromCc

    return {
      dismissBanner,
      shouldHideBanner,
      bannerLocale,
      translationLink,
      isReferredFromCc,
    }
  },
}
export default embeddedPage
</script>
