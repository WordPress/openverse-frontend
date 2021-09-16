<template>
  <div
    class="h-0 w-full relative"
    :class="{ 'pt-full': aspect === 'regular', 'pt-half': aspect === 'wide' }"
  >
    <div
      class="box-track absolute inset-0 flex flex-col gap-1"
      :class="`size-${size}`"
    >
      <NuxtLink
        :to="localePath(`/audio/${audio.id}`)"
        class="audio-info flex-grow flex flex-col justify-between bg-yellow text-dark-charcoal hover:text-dark-charcoal"
        :class="{ 'p-8': size === 'l', 'p-4': size === 'm' }"
      >
        <span
          class="font-heading font-semibold"
          :class="{ 'text-2xl': size === 'm', 'text-4xl': size === 'l' }"
          >{{ audio.title }}</span
        >
        <span>{{ $t(`audio-categories.${audio.category}`) }}</span>
      </NuxtLink>
      <div class="player flex-shrink-0 bg-yellow flex flex-row">
        <slot name="play-pause" />
        <slot name="controller" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Box',
  props: ['audio', 'size', 'aspect'],
}
</script>

<style>
.box-track .play-pause {
  @apply bg-yellow text-dark-charcoal flex-shrink-0;
}

.box-track .waveform {
  @apply bg-tx;
}

.box-track .progress.timestamp {
  @apply bg-yellow;
}

.box-track.size-m .play-pause {
  @apply h-14 w-14;
}

.box-track.size-m .waveform {
  @apply h-14;
}

.box-track.size-l .play-pause {
  @apply h-20 w-20;
}

.box-track.size-l .waveform {
  @apply h-20;
}
</style>
