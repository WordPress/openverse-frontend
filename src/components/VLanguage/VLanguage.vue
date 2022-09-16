<template>
  <VSelectField
    v-bind="$attrs"
    v-model="locale"
    class="max-w-[12.5rem]"
    field-id="language"
    :choices="choices"
    :blank-text="$t('language.language')"
    :label-text="$t('language.language')"
  >
    <template #start>
      <VIcon :icon-path="globeIcon" />
    </template>
  </VSelectField>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { useI18n } from '~/composables/use-i18n'

import VIcon from '~/components/VIcon/VIcon.vue'
import VSelectField, {
  type Choice,
} from '~/components/VSelectField/VSelectField.vue'

import type { LocaleObject } from '@nuxtjs/i18n'

import globeIcon from '~/assets/icons/globe.svg'

/**
 * We put a little extra information in the Vue-i18n `locales` field such as the
 * locale's name and native name, which comes in use here.
 */
interface OpenverseLocale extends LocaleObject {
  name: string
  nativeName?: string
}

/**
 * Presents a way for the users to change the app locale and use a translated
 * version of the app.
 */
export default defineComponent({
  name: 'VLanguage',
  components: { VSelectField, VIcon },
  inheritAttrs: false,
  setup() {
    const i18n = useI18n()
    const locale = computed({
      get: () => i18n.locale,
      set: (value) => {
        i18n.setLocale(value)
      },
    })
    const choices = computed<Choice[]>(() =>
      i18n.locales.map((locale: OpenverseLocale) => ({
        key: locale.code,
        text: locale.nativeName ?? locale.name,
      }))
    )

    return {
      locale,
      choices,

      globeIcon,
    }
  },
})
</script>
