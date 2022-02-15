<template>
  <NoticeBar>
    {{ $t('migration-notice.intro') }}
    <i18n tag="span" path="migration-notice.more">
      <template #read-more>
        <VLink
          class="text-dark-blue hover:text-dark-blue underline"
          href="https://wordpress.org/news/2021/05/welcome-to-openverse/"
          >{{ $t('migration-notice.read') }}</VLink
        >
      </template>
    </i18n>
  </NoticeBar>
</template>

<script>
import NoticeBar from '~/components/NoticeBar/NoticeBar.vue'
import VLink from '~/components/VLink.vue'

export default {
  name: 'MigrationNotice',
  components: { NoticeBar, VLink },
}
</script>
