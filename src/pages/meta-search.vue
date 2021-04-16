<template>
  <div class="section mb-large">
    <div class="container is-fluid">
      <div class="mb-large">
        <h1 class="title is-2">
          {{ $t('meta-search-page.title') }}
        </h1>
      </div>

      <i18n path="meta-search-page.intro" tag="p" class="mb-normal">
        <template #link>
          <a aria-label="sources" href="/sources">sources</a>
        </template>
      </i18n>
      <p>{{ $t('meta-search-page.license') }}</p>
      <h4 class="b-header">
        {{ $t('meta-search-page.content') }}
      </h4>
      <p>{{ $t('meta-search-page.content-types') }}</p>
      <h4 class="b-header">
        {{ $t('meta-search-page.images.title') }}
      </h4>
      <p>{{ $t('meta-search-page.images.content') }}</p>
      <div class="content">
        <ol>
          <li>
            {{ $t('meta-search-page.images.continue') }}
          </li>
          <li>
            {{ $t('meta-search-page.images.not-finding') }}
          </li>
        </ol>
      </div>
      <i18n path="meta-search-page.images.info" tag="p" class="mb-small">
        <template #use>
          <strong> Use </strong>
        </template>
      </i18n>
      <figure class="image my-large">
        <img
          src="@/assets/meta-search-images.gif"
          alt="Meta Search Images - Cars"
        />
      </figure>
      <h4 class="b-header mt-large">
        {{ $t('meta-search-page.audio-video.title') }}
      </h4>
      <p>{{ $t('meta-search-page.audio-video.content') }}</p>
      <i18n path="meta-search-page.audio-video.filter" tag="p" class="my-small">
        <template #use>
          <strong> Use </strong>
        </template>
      </i18n>
      <figure class="image my-large">
        <img
          src="@/assets/meta-search-audio.gif"
          alt="Meta Search Audio - Drums"
        />
      </figure>
      <h4 class="b-header mt-large">
        {{ $t('meta-search-page.new.title') }}
      </h4>
      <i18n path="meta-search-page.new.content" tag="p" class="mb-small">
        <template #issue>
          <a
            aria-label="issue"
            href="https://github.com/creativecommons/cccatalog/issues/new?assignees=&labels=awaiting+triage%2C+ticket+work+required%2C+providers&template=new-source-suggestion.md&title=%5BSource+Suggestion%5D+Insert+source+name+here"
            >issue</a
          >
        </template>
        <template #email>
          <a aria-label="email" href="mailto:support-search@creativecommons.org"
            >email</a
          >
        </template>
      </i18n>
      <h4 class="b-header mt-large">
        {{ $t('meta-search-page.why.title') }}
      </h4>
      <p>{{ $t('meta-search-page.why.content') }}</p>
      <figure class="image my-large">
        <img
          src="@/assets/cc-meta-search.gif"
          alt="Old CC Meta Search Portal Demo"
        />
      </figure>
      <p class="my-small">
        {{ $t('meta-search-page.why.new') }}
      </p>
      <i18n path="meta-search-page.why.feedback" tag="p">
        <template #feedback>
          <a
            aria-label="sources"
            href="https://search.creativecommons.org/feedback"
            >feedback.</a
          >
        </template>
      </i18n>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetaSearchPage',
  layout: 'with-nav-search',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~/styles/text-only-page.scss';

figure {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid black;
}

h4 {
  margin: 1rem 0;
}
</style>
