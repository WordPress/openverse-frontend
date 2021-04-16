<template>
  <div class="my-large">
    <span class="is-block px-big has-text-centered">
      {{ $t('photo-details.content-report.dmca.thanks') }}
    </span>
    <i18n
      path="photo-details.content-report.dmca.provider"
      tag="span"
      class="is-block px-big mt-large has-text-centered"
    >
      <template #link>
        <a
          :aria-label="providerName + 'form'"
          :href="imageURL"
          target="_blank"
          rel="noopener"
          >{{ providerName }}</a
        >.
      </template>
    </i18n>
  </div>
</template>

<script>
export default {
  name: 'DoneMessage',
  props: ['imageURL', 'providerName'],
}
</script>
