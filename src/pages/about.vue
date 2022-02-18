<template>
  <div class="section" dir="ltr">
    <div class="container">
      <div>
        <h1 class="text-5xl mb-10">
          {{ $t('about.title', { openverse: 'Openverse' }) }}
        </h1>
        <div class="content">
          <p>
            {{ $t('about.description.content', { openverse: 'Openverse' }) }}
          </p>

          <i18n path="about.collection.content" tag="p">
            <template #common-crawl>
              <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
              <a href="http://commoncrawl.org/">Common Crawl</a>
            </template>
          </i18n>

          <i18n path="about.planning.content" tag="p">
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <template #openverse>Openverse</template>
            <template #meta>
              <NuxtLink :to="localePath('/meta-search')">{{
                $t('about.planning.meta')
              }}</NuxtLink>
            </template>
            <template #search>
              <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
              <a href="https://github.com/wordpress/openverse-frontend/"
                >Openverse</a
              >
              <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
            </template>
            <template #api>
              <a href="https://github.com/wordpress/openverse-api/">{{
                $t('about.planning.api', { openverse: 'Openverse' })
              }}</a>
            </template>
            <template #catalog>
              <a href="https://github.com/wordpress/openverse-catalog/">{{
                $t('about.planning.catalog', { openverse: 'Openverse' })
              }}</a>
            </template>
            <template #community>
              <a href="https://make.wordpress.org/openverse/">{{
                $t('about.planning.community')
              }}</a>
            </template>
            <template #working>
              <a href="https://github.com/orgs/WordPress/projects/3">{{
                $t('about.planning.working')
              }}</a>
            </template>
          </i18n>

          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          <i18n path="about.transfer.content" tag="p">
            <template #openverse>Openverse</template>
            <template #creative-commons>
              <a
                href="https://creativecommons.org/2021/05/03/cc-search-to-join-wordpress/"
                >Creative Commons</a
              >
            </template>
            <template #wordpress>
              <a href="https://ma.tt/2021/04/cc-search-to-join-wordpress-org/"
                >WordPress</a
              >
            </template>
          </i18n>
          <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->

          <i18n path="about.declaration.content" tag="p">
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <template #openverse>Openverse</template>
            <template #terms>
              <a href="https://creativecommons.org/terms/">{{
                $t('about.declaration.terms', { openverse: 'Openverse' })
              }}</a>
            </template>
          </i18n>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const AboutPage = {
  name: 'about-page',
  head() {
    return {
      title: `${this.$t('about.title', {
        openverse: 'Openverse',
      })} | Openverse`,
    }
  },
}

export default AboutPage
</script>

<style lang="scss" scoped>
@import '~/styles/text-only-page.scss';

.table.is-bordered {
  td,
  th {
    word-break: initial;
  }
}
</style>
