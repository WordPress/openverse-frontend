<template>
  <section>
    <div
      v-if="isFor == 'all'"
      class="grid gap-4 p-4 tab:grid-cols-2 desk:grid-cols-5"
    >
      <div v-for="idx in 10" :key="idx" class="square bg-dark-charcoal-10">
        &nbsp;
      </div>
    </div>

    <div v-if="isFor == 'image'" class="masonry px-10 pb-16">
      <div
        v-for="idx in 15"
        :key="idx"
        class="bg-dark-charcoal-10 mb-4"
        :style="{ height: `${getRandomSize()}px` }"
      >
        &nbsp;
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SkeletonGrid',
  props: {
    isFor: {
      type: String,
      default: 'image',
      // Use supportedMediaTypes from src/constants/media.js when video is available?
      validator: (val) => ['all', 'image', 'audio'].includes(val),
    },
    items: {
      type: Number,
      default: 15,
    },
  },
  methods: {
    getRandomSize() {
      return Math.floor(Math.random() * (200 - 30) + 200)
    },
  },
}
</script>

<style lang="scss" scoped>
.square {
  aspect-ratio: 1 / 1;
}

.masonry {
  column-count: 2;
  column-gap: 1rem;

  @screen tab {
    column-count: 3;
  }

  @screen desk {
    column-count: 5;
  }
}
</style>
