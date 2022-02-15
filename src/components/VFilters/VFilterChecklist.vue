<template>
  <fieldset class="mb-8">
    <legend v-if="title" class="text-sm font-semibold">
      {{ title }}
    </legend>
    <div
      v-for="(item, index) in options"
      :key="index"
      class="flex justify-between items-center mt-4"
    >
      <VCheckbox
        :id="item.code"
        :key="index"
        :checked="item.checked"
        :name="itemName"
        :value="item.code"
        :disabled="isDisabled(item)"
        @change="onValueChange"
      >
        <VLicense v-if="filterType === 'licenses'" :license="item.code" />
        <template v-else>{{ itemLabel(item) }}</template>
      </VCheckbox>

      <!-- License explanation -->
      <VPopover v-if="filterType === 'licenses'">
        <template #trigger="{ a11yProps }">
          <button
            v-bind="a11yProps"
            :ref="`${item.code}licenseIcon`"
            :aria-label="$t('browse-page.aria.license-explanation')"
            class="text-dark-charcoal-70"
            type="button"
          >
            <VIcon :icon-path="icons.help" />
          </button>
        </template>
        <template #default="{ close }">
          <div class="relative">
            <VIconButton
              class="absolute top-0 end-0 border-none"
              size="search-medium"
              :icon-props="{ iconPath: icons.closeSmall }"
              @click="close"
            />
            <VLicenseExplanation :license="item.code" />
          </div>
        </template>
      </VPopover>
    </div>
  </fieldset>
</template>

<script>
import VLicenseExplanation from '~/components/VFilters/VLicenseExplanation.vue'
import VCheckbox from '~/components/VCheckbox/VCheckbox.vue'
import VLicense from '~/components/License/VLicense.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import VPopover from '~/components/VPopover/VPopover.vue'

import helpIcon from '~/assets/icons/help.svg'
import closeSmallIcon from '~/assets/icons/close-small.svg'

export default {
  name: 'FilterCheckList',
  components: {
    VCheckbox,
    VIcon,
    VLicense,
    VLicenseExplanation,
    VPopover,
  },
  props: {
    options: { type: Array, required: false },
    title: { type: String },
    filterType: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      icons: { help: helpIcon, closeSmall: closeSmallIcon },
    }
  },
  computed: {
    itemName() {
      return this.filterType === 'searchBy'
        ? this.$t('filters.searchBy.title')
        : this.title
    },
  },
  methods: {
    itemLabel(item) {
      return ['audioProviders', 'imageProviders'].includes(this.filterType)
        ? item.name
        : this.$t(item.name)
    },
    onValueChange({ value }) {
      this.$emit('filterChanged', {
        code: value,
        filterType: this.filterType,
      })
    },
    getFilterTypeValue(filterKey, val) {
      return this.$store.state.search.filters[filterKey].filter((item) =>
        item.code.includes(val)
      )
    },
    isDisabled(item) {
      if (this.filterType === 'licenseTypes') {
        const nc = this.getFilterTypeValue('licenses', 'nc')
        const nd = this.getFilterTypeValue('licenses', 'nd')
        return (
          (item.code === 'commercial' && nc.some((li) => li.checked)) ||
          (item.code === 'modification' && nd.some((li) => li.checked))
        )
      } else if (this.filterType === 'licenses') {
        const commercial = this.getFilterTypeValue('licenseTypes', 'commercial')
        const modification = this.getFilterTypeValue(
          'licenseTypes',
          'modification'
        )
        return (
          (commercial[0].checked && item.code.includes('nc')) ||
          (modification[0].checked && item.code.includes('nd'))
        )
      }
      return this.disabled
    },
  },
}
</script>
