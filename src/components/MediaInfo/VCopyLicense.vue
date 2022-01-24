<template>
  <div>
    <h5 class="mb-4 md:text-2xl">
      {{ $t('media-details.reuse.copy-license.title') }}
    </h5>
    <nav class="flex borber-b-none" role="tablist">
      <button
        v-for="(tab, idx) in tabs"
        :key="idx"
        role="tab"
        :aria-controls="`tab-${tab}`"
        :aria-selected="activeTab === tab"
        class="px-6 py-4 border-t border-x rounded-sm bg-white z-10 font-bold relative pb-[.625rem]"
        :class="[
          activeTab === tab
            ? 'border-t-dark-charcoal-20 border-x-dark-charcoal-20'
            : 'border-b-tx border-t-tx border-x-tx',
        ]"
        @click.prevent="setActiveTab(tab)"
        @keyup.enter.prevent="setActiveTab(tab)"
      >
        {{ $t(`media-details.reuse.copy-license.${tab}`) }}
      </button>
    </nav>
    <div
      v-for="(tab, idx) in tabs"
      :id="`tab-${tab}`"
      :key="idx"
      :aria-labelledby="tab"
      role="tabpanel"
      tabindex="0"
      class="border border-dark-charcoal-20 p-6"
      :class="{ hidden: activeTab !== tab }"
    >
      <template v-if="activeTab === 'rich'">
        <i18n
          id="attribution"
          path="media-details.reuse.credit.text"
          tag="span"
        >
          <template #title>
            <a
              :href="media.foreign_landing_url"
              target="_blank"
              rel="noopener"
              class="text-pink"
              @click="onSourceLinkClicked"
              @keyup.enter="onSourceLinkClicked"
              >{{ media.title }}</a
            ></template
          >
          <template #creator>
            <i18n
              v-if="media.creator"
              path="media-details.reuse.credit.creator-text"
              tag="span"
            >
              <template #creator-name>
                <a
                  v-if="media.creator_url"
                  :href="media.creator_url"
                  target="_blank"
                  rel="noopener"
                  class="text-pink"
                  @click="onCreatorLinkClicked"
                  @keyup.enter="onCreatorLinkClicked"
                  >{{ media.creator }}</a
                >
                <span v-else>{{ media.creator }}</span>
              </template>
            </i18n>
          </template>
          <template #marked-licensed>
            {{
              isPDM
                ? $t('media-details.reuse.credit.marked')
                : $t('media-details.reuse.credit.licensed')
            }}
          </template>
          <template #license>
            <a
              class="uppercase text-pink"
              :href="media.license_url"
              target="_blank"
              rel="noopener"
              >{{ fullLicenseName }}</a
            >
          </template>
        </i18n>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'

import {
  SEND_DETAIL_PAGE_EVENT,
  DETAIL_PAGE_EVENTS,
} from '~/constants/usage-data-analytics-types'
import {
  // ATTRIBUTION,
  USAGE_DATA,
} from '~/constants/store-modules'
import { isPublicDomain } from '~/utils/license'

const VCopyLicense = defineComponent({
  name: 'VCopyLicense',
  props: {
    media: {
      type: Object,
    },
    fullLicenseName: {
      type: String,
    },
  },
  setup(props) {
    const { store } = useContext()

    const activeTab = ref('rich')
    const tabs = ['rich', 'html', 'plain']

    const setActiveTab = (tabIdx) => (activeTab.value = tabIdx)

    const isPDM = () => isPublicDomain(props.fullLicenseName)

    const sendDetailPageEvent = (eventType) => {
      const eventData = {
        eventType,
        resultUuid: props.media.id,
      }
      store.dispatch(`${USAGE_DATA}/${SEND_DETAIL_PAGE_EVENT}`, eventData)
    }

    const onCreatorLinkClicked = () => {
      sendDetailPageEvent(DETAIL_PAGE_EVENTS.CREATOR_CLICKED)
    }

    const onSourceLinkClicked = () =>
      sendDetailPageEvent(DETAIL_PAGE_EVENTS.SOURCE_CLICKED)

    return {
      activeTab,
      isPDM,
      onCreatorLinkClicked,
      onSourceLinkClicked,
      tabs,
      setActiveTab,
    }
  },
})
export default VCopyLicense
</script>
