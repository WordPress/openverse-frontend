<template>
  <section class="p-4 grid tab:grid-cols-2 desk:grid-cols-5 gap-4">
    <div v-for="idx in 20" :key="idx" class="square bg-dark-charcoal-10">
      &nbsp;
    </div>
  </section>
</template>

<script>
export default {
  name: 'SkeletonGrid',
}
</script>

<style lang="scss" scoped>
.square {
  aspect-ratio: 1 / 1;
}
</style>
