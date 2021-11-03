<template>
  <section class="px-10 pb-16">
    <template v-if="isFor == 'audio'">
      <AudioTrackSkeleton v-for="idx in 8" :key="idx" />
    </template>
    <div
      v-if="isFor == 'all'"
      class="grid gap-4 tab:grid-cols-2 desk:grid-cols-5"
    >
      <div v-for="idx in 10" :key="idx" class="square bg-dark-charcoal-10">
        &nbsp;
      </div>
    </div>

    <div v-if="isFor == 'image'" class="masonry">
      <div v-for="idx in 30" :key="idx" class="bg-dark-charcoal-10 mb-4">
        &nbsp;
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GridSkeleton',
  props: {
    isFor: {
      type: String,
      default: 'image',
      validator: (val) => ['all', 'image', 'audio'].includes(val),
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

  @for $i from 1 through 30 {
    div:nth-child(#{$i}) {
      $h: (random(300) + 100) + px;
      height: $h;
      line-height: $h;
    }
  }
}
</style>
