<template>
  <div>
    <p class="px-6 py-4 bg-dark-charcoal-06 font-bold">
      {{ $t('image-details.back') }}
    </p>

    <div class="bg-dark-charcoal-06">
      <figure class="mx-6 mb-4 md:mb-6">
        <img :src="image.url" alt="" class="mx-auto" />
        <!-- TODO: SketchFabViewer -->
      </figure>
    </div>

    <div
      class="px-6 md:px-16 flex flex-row flex-wrap justify-between md:flex-row-reverse"
    >
      <VButton class="w-full mb-4 md:w-auto md:mb-0 font-bold">{{
        $t('image-details.weblink')
      }}</VButton>
      <span>
        <h1 class="text-base md:text-3xl">
          {{ image.title }}
        </h1>
        <i18n path="image-details.creator" tag="span" class="font-bold">
          <template #name>
            <a
              v-if="image.creator_url"
              :aria-label="
                $t('photo-details.aria.creator-url', {
                  creator: image.creator,
                })
              "
              :href="image.creator_url"
            >
              <!-- TODO: keep handling source link clicked event? -->
              {{ image.creator }}
            </a>
            <span v-else>{{ image.creator }}</span>
          </template>
        </i18n>
      </span>
    </div>

    <!-- <MediaReuse
        class="mt-10"
        :media="{ license: image.license }"
        :license-url="image.license_url"
        full-license-name="CC BY"
      /> -->

    <VImageDetails :image="image" />

    <VRelatedImages :image-id="image.id" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

// import MediaReuse from '~/components/MediaInfo/MediaReuse.vue'
import VImageDetails from '~/components/VImageDetails/VImageDetails.vue'
import VButton from '~/components/VButton.vue'

const VImageDetailsPage = defineComponent({
  name: 'VImageDetailsPage',
  components: { /* MediaReuse, */ VButton, VImageDetails },
  layout: 'blank',
  data() {
    return {
      image: {
        id: '58cefb7b-8008-4016-b3bc-b4246fa3baec',
        title: 'Galah (Eolophus roseicapilla)',
        foreign_landing_url:
          'https://www.flickr.com/photos/16520061@N08/1917526108',
        creator: 'David Cook Wildlife Photography',
        creator_url: 'https://www.flickr.com/photos/16520061@N08',
        url: 'https://live.staticflickr.com/2002/1917526108_1f9a8564c1_b.jpg',
        filesize: null,
        filetype: null,
        license: 'by',
        license_version: '2.0',
        license_url: 'https://creativecommons.org/licenses/by/2.0/',
        provider: 'flickr',
        source: 'flickr',
        category: null,
        tags: [
          {
            name: 'australia',
          },
          {
            name: 'australianbirds',
          },
          {
            name: 'birds',
          },
          {
            name: 'cacatuaroseicapilla',
          },
          {
            name: 'eolophusroseicapilla',
          },
          {
            name: 'galah',
          },
          {
            name: 'kookr',
          },
          {
            name: 'nsw',
          },
          {
            name: 'wamboin',
          },
          {
            name: 'animal',
            accuracy: 0.96539,
          },
          {
            name: 'avian',
            accuracy: 0.94129,
          },
          {
            name: 'beak',
            accuracy: 0.94514,
          },
          {
            name: 'bird',
            accuracy: 0.99636,
          },
          {
            name: 'feather',
            accuracy: 0.94206,
          },
          {
            name: 'nature',
            accuracy: 0.9596,
          },
          {
            name: 'one',
            accuracy: 0.92752,
          },
          {
            name: 'parrot',
            accuracy: 0.97829,
          },
          {
            name: 'portrait',
            accuracy: 0.92445,
          },
          {
            name: 'wild',
            accuracy: 0.93848,
          },
          {
            name: 'wildlife',
            accuracy: 0.97757,
          },
          {
            name: 'wing',
            accuracy: 0.94363,
          },
        ],
        attribution:
          '"Galah (Eolophus roseicapilla)" by David Cook Wildlife Photography is licensed under CC-BY 2.0. To view a copy of this license, visit https://creativecommons.org/licenses/by/2.0/.',
        height: 1024,
        width: 768,
        thumbnail:
          'http://api.openverse.engineering/v1/images/58cefb7b-8008-4016-b3bc-b4246fa3baec/thumb/',
        detail_url:
          'http://api.openverse.engineering/v1/images/58cefb7b-8008-4016-b3bc-b4246fa3baec/',
        related_url:
          'http://api.openverse.engineering/v1/images/58cefb7b-8008-4016-b3bc-b4246fa3baec/related/',
      },
    }
  },
  // setup() {
  //   return {}
  // },
})

export default VImageDetailsPage
</script>

<style scoped>
a {
  @apply text-pink;
}

section,
aside {
  @apply px-6 md:px-16 my-10 md:my-16 md:max-w-lg;
}
</style>
