<template>
  <section class="px-10 pb-16">
    <template v-if="isForTab == 'audio'">
      <AudioTrackSkeleton v-for="idx in numElems" :key="idx" />
    </template>

    <div
      v-if="isForTab == 'all'"
      class="grid gap-4 tab:grid-cols-2 desk:grid-cols-5"
    >
      <div
        v-for="idx in numElems"
        :key="idx"
        class="square bg-dark-charcoal-10"
      >
        &nbsp;
      </div>
    </div>

    <div v-if="isForTab == 'image'" class="masonry">
      <div
        v-for="idx in numElems"
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
  name: 'GridSkeleton',
  props: {
    isForTab: {
      type: String,
      default: 'image',
      validator: (val) => ['all', 'image', 'audio'].includes(val),
    },
    numElems: {
      type: Number,
      default: function () {
        if (this.isForTab === 'all') return 10
        if (this.isForTab === 'image') return 30
        return 8
      },
    },
  },
  methods: {
    getRandomSize(max = 300, min = 100) {
      return Math.floor(Math.random() * (max - min) + min)
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
