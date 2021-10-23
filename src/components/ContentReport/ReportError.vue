<template>
  <div>
    <span class="block px-6 mt-10 text-center">
      {{ $t('photo-details.content-report.submission-error') }}
    </span>
    <button
      class="button is-text tiny mt-4"
      @click="onBackClick()"
      @keyup.enter="onBackClick()"
    >
      <span>
        <i class="icon chevron-left me-2" />
        {{ $t('photo-details.content-report.back') }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ReportError',
  methods: {
    onBackClick() {
      this.$emit('back-click')
    },
  },
}
</script>
