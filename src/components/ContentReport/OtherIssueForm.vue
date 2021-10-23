<template>
  <form class="other-form">
    <h4 class="b-header">
      {{ $t('photo-details.content-report.title') }}
    </h4>
    <label for="description" class="mb-2">
      {{ $t('photo-details.content-report.issue-description') }}
      <textarea
        id="description"
        v-model="otherReasonDescription"
        class="reason p-2 font-semibold"
        placeholder="Issue description required (with at least 20 characters)"
      />
    </label>

    <div>
      <button
        class="button other-back-button is-text tiny mt-4 bg-white"
        @click="onBackClick()"
        @keyup.enter="onBackClick()"
      >
        <span>
          <i class="icon chevron-left me-2" />
          {{ $t('photo-details.content-report.back') }}
        </span>
      </button>

      <button
        type="button"
        :disabled="!descriptionHasMoreThan20Chars"
        class="float-right bg-trans-blue text-white py-2 px-4 font-semibold border-2 border-tx rounded-sm disabled:opacity-50"
        @click="sendContentReport()"
        @keyup.enter="sendContentReport()"
      >
        {{ $t('photo-details.content-report.submit') }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'OtherIssueForm',
  data() {
    return {
      otherReasonDescription: '',
    }
  },
  computed: {
    descriptionHasMoreThan20Chars() {
      return this.otherReasonDescription.length >= 20
    },
  },
  methods: {
    onBackClick() {
      this.$emit('onBackClick')
    },
    sendContentReport() {
      this.$emit('sendContentReport', {
        description: this.otherReasonDescription,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.reason {
  width: 100%;
  height: 6rem;
  font-size: 13px;
}
</style>
