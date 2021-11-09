<template>
  <fieldset class="home-license-filter mt-16">
    <legend>
      {{ $t('hero.license-filter.label') }}
    </legend>
    <Checkbox
      v-for="[licenseType, isChecked] in Object.entries(filters)"
      :id="licenseType"
      :key="licenseType"
      class="me-6 last:me-0"
      :checked="isChecked"
      name="licenseType"
      @change="onFilterChanged"
    >
      {{ $t(`filters.license-types.${licenseType}`) }}
    </Checkbox>
  </fieldset>
</template>

<script>
export default {
  name: 'LicenseFilter',
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onFilterChanged({ value, checked }) {
      this.$emit('toggle', { code: value, checked })
    },
  },
}
</script>

<style lang="scss" scoped>
.home-license-filter {
  display: flex;
  justify-content: center;
  legend {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.checkbox:not(:last-child) {
  margin-right: 1.5rem;
}
</style>
