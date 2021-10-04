<template>
  <div class="full-track w-full">
    <slot name="controller" />

    <div class="flex flex-row justify-between mx-16 my-6">
      <div class="left-content flex flex-row items-center gap-6">
        <slot name="play-pause" />

        <div class="audio-info">
          <h1 class="text-3xl font-heading font-semibold">{{ audio.title }}</h1>
          <div class="subtitle mt-1">
            <i18n
              as="span"
              path="audio-track.creator"
              class="font-semibold leading-snug mt-1"
            >
              <template #creator>
                <a
                  class="text-pink hover:text-pink"
                  :href="audio.creator_url"
                  >{{ audio.creator }}</a
                >
              </template>
            </i18n>
            <span class="text-dark-charcoal-70">{{ $t('interpunct') }}</span>
            {{ timeFmt(audio.duration) }}
          </div>
        </div>
      </div>

      <DownloadButton
        class="right-content h-14 flex"
        :formats="getFormats(audio)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Full',
  props: ['audio'],
  setup() {
    /**
     * Format the time as hh:mm:ss, dropping the hour part if it is zero.
     * @param {number} ms - the number of milliseconds in the duration
     * @returns {string} the duration in a human-friendly format
     */
    const timeFmt = (ms) => {
      if (ms) {
        const date = new Date(0)
        date.setSeconds(ms / 1e3)
        return date.toISOString().substr(11, 8).replace(/^00:/, '')
      }
      return '--:--'
    }
    /**
     * Creates a list of { extension_name, download_url } objects
     * for DownloadButton
     * @param {AudioDetail} audio
     */
    const getFormats = (audio) => {
      // TODO: finalize the property names in
      //  formats objects and alt_files objects
      let formats = [
        { extension_name: audio.filetype, download_url: audio.url },
      ]
      if (audio.alt_files) {
        formats = formats.concat(
          audio.alt_files.map((altFile) => ({
            extension_name: altFile.extension,
            download_url: altFile.url,
          }))
        )
      }
      return formats
    }
    return {
      timeFmt,
      getFormats,
    }
  },
}
</script>

<style>
.full-track .waveform {
  @apply h-30 rounded-sm;
}

.full-track .play-pause {
  @apply h-14 w-14 rounded-sm;
}
</style>
