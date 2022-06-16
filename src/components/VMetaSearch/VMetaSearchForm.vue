<template>
  <section
    :key="type"
    ref="sectionRef"
    class="p-6 additional-sources text-center mt-12"
    data-testid="additional-sources-form"
    @keydown.tab.exact="handleTab"
  >
    <header class="mb-10">
      <i18n
        v-if="!hasNoResults"
        :path="
          isSupported
            ? 'additional-sources.form.supported-title'
            : 'additional-sources.form.unsupported-title'
        "
        tag="h4"
        class="text-4xl mb-2"
      >
        <template #openverse>Openverse</template>
        <template #type>{{ $t(`meta-search.form.types.${type}`) }}</template>
      </i18n>
      <i18n
        v-else
        path="additional-sources.form.no-results-title"
        tag="h4"
        class="text-4xl mb-2"
      >
        <template #type>{{ $t(`meta-search.form.types.${type}`) }}</template>
        <template #query>{{ query.q }}</template>
      </i18n>
      <i18n path="additional-sources.form.caption" tag="p">
        <template #type>{{
          $t(`meta-search.form.types-plural.${type}`)
        }}</template>
        <template #break>
          <br />
        </template>
      </i18n>
    </header>

    <VMetaSourceList
      class="md:justify-center mt-6 mb-10"
      :type="type"
      :query="query"
    />

    <p class="text-sm font-semibold max-w-3xl my-0 mx-auto">
      {{ $t('additional-sources.caption', { openverse: 'Openverse' }) }}
    </p>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@nuxtjs/composition-api'

import type { MediaType } from '~/constants/media'
import type { ApiQueryParams } from '~/utils/search-query-transform'
import { getFocusableElements } from '~/utils/focus-management'
import { defineEvent } from '~/types/emits'

import VMetaSourceList from './VMetaSourceList.vue'

export default defineComponent({
  name: 'VMetaSearchForm',
  components: {
    VMetaSourceList,
  },
  props: {
    query: { type: Object as PropType<ApiQueryParams>, required: true },
    type: { type: String as PropType<MediaType>, required: true },
    isSupported: { type: Boolean, default: false },
    hasNoResults: { type: Boolean, required: true },
  },
  emits: {
    tab: defineEvent<[KeyboardEvent]>(),
  },
  setup(_, { emit }) {
    const sectionRef = ref<HTMLElement>()

    /**
     * Find the last focusable element in VSearchGridFilter to add a 'Tab' keydown event
     * handler to it.
     * We could actually hard-code this because 'searchBy' is always the last now.
     */
    const lastFocusableElement = computed<HTMLElement>(() => {
      const focusable = getFocusableElements(sectionRef.value)
      return focusable[focusable.length - 1]
    })

    const handleTab = (event: KeyboardEvent) => {
      if (event.target === lastFocusableElement.value) {
        emit('tab', event)
      }
    }
    return {
      sectionRef,
      handleTab,
    }
  },
})
</script>
