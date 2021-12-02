import { sendWindowMessage } from '~/utils/send-message.js'
import config from '../../nuxt.config.js'
import translated from '../locales/scripts/translated.json'
import allLocales from '../locales/scripts/locales-list.json'

export default {
  methods: {
    /**
     * Show banner inviting to contribute translations if fewer than 90%
     * of strings are translated for current locale.
     * Default locale is `en_US`, but it doesn't have wpLocale property,
     * so its value is hard-coded to false.
     * @param {string} locale - wpLocale property of the current locale
     * @returns {boolean}
     */
    needsTranslationBanner(locale) {
      if (['en', 'en_US'].includes(locale)) return false
      let localeTranslatedStatus = translated.find((item) => {
        return item.code === locale
      })
      if (!localeTranslatedStatus) {
        return true
      }
      return localeTranslatedStatus.translated <= 90
    },
    /**
     * Handles messages of type `localeSet` received by the `iframe`. Any
     * other message types will be discarded.
     *
     * @param {string} type - the nature of the message received.
     * @param {Object} value - the data sent with the message.
     * @param {string} value.locale - wpLocale code of the locale, e.g. 'en_US'.
     * @param {string} value.lang - the iso code for language
     * (and sometimes country), e.g. 'en-US'.
     * Default lang value on wp.org is 'en', and on wp.org/openverse - 'en-US'.
     * @param {'rtl'|'ltr'} [value.dir] - the locale text direction.
     */
    async localeMsgHandler({ data: { type, value } }) {
      if (type !== 'localeSet') return
      // If the locale set by wp.org is 'en_US', not 'en', this is not necessary.
      const wpLocaleValue = value.locale === 'en' ? 'en_US' : value.locale
      let locale = this.$i18n.locales.find(
        (item) => item.wpLocale === wpLocaleValue
      )
      /**
       * i18n.locales list only contains the locales that have at least one
       * translated string.
       */
      if (locale) {
        await this.$i18n.setLocale(locale.code)
      } else {
        locale = Object.values(allLocales).find(
          (item) => item.wp_locale === value.locale
        )
      }
      if (this.needsTranslationBanner(locale.wpLocale)) {
        this.showNotification = true
        this.bannerLocale = locale?.slug || null
        this.bannerLanguageName = locale?.englishName || 'this'
      }
      document.documentElement.lang = locale.wpLocale.replace('_', '-')
      // Always set `dir` property, default to 'ltr'
      document.documentElement.dir = locale.dir === 'rtl' ? 'rtl' : 'ltr'
    },
  },
  mounted() {
    window.addEventListener('message', this.localeMsgHandler)
    sendWindowMessage({
      debug: config.dev,
      type: 'localeGet',
      value: {},
    })
  },
  beforeDestroy() {
    window.removeEventListener('message', this.localeMsgHandler)
  },
}
