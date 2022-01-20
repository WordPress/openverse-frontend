<template>
  <!-- Should be wrapped by a fixed-width parent -->
  <div class="relative h-0 w-full pt-full" :title="helpText">
    <div class="thumbnail absolute inset-0 bg-yellow">
      <img
        v-if="audio.thumbnail && ok"
        class="h-full w-full object-cover object-center overflow-clip"
        :src="audio.thumbnail"
        :alt="helpText"
        @error="handleError"
      />

      <!-- Programmatic thumbnail -->
      <svg
        v-else
        class="h-full w-full"
        :viewBox="`0 0 ${canvasSize} ${canvasSize}`"
      >
        <template v-for="i in dotCount">
          <circle
            v-for="j in dotCount"
            :key="`${i}-${j}`"
            class="fill-dark-charcoal"
            :cx="offset(j)"
            :cy="offset(i)"
            :r="radius(i, j)"
          />
        </template>
      </svg>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

/**
 * Displays the cover art for the audio in a square aspect ratio.
 */
export default {
  name: 'VAudioThumbnail',
  props: {
    /**
     * the details of the audio whose artwork is to be shown; The properties
     * `thumbnail`, `title` and `creator` are used.
     */
    audio: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    /* Switching */

    const ok = ref(true)
    const handleError = () => {
      ok.value = false
    }

    /* PRNG */

    /**
     * Small Fast Counter is a seedable pseudo-random number generator.
     * @see {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32}
     */
    const sfc32 = (a, b, c, d) => () => {
      a |= 0
      b |= 0
      c |= 0
      d |= 0
      let t = (((a + b) | 0) + d) | 0
      d = (d + 1) | 0
      a = b ^ (b >>> 9)
      b = (c + (c << 3)) | 0
      c = (c << 21) | (c >>> 11)
      c = (c + t) | 0
      return (t >>> 0) / 4294967296
    }
    const rand = (seed) => sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, seed)
    const hash = (str) => {
      let hash = 0
      if (str.length === 0) return hash
      for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
      }
      return hash
    }

    /* Math utilities */

    /**
     * Perform linear interpolation to find a value that is fractionally between
     * the low and high limits of the given range.
     *
     * @param {number} low - the lower limit of the range
     * @param {number} high - the upper limit of the range
     * @param {number} frac - fraction controlling position of interpolated number
     * @returns {number} the interpolated number
     */
    const lerp = (low, high, frac) => low + (high - low) * frac

    /**
     * Interpolate twice to solve the Bézier equation for three points P0, P1
     * and P2.
     *
     * @param {[number, number]} p0 - point #0
     * @param {[number, number]} p1 - point #1
     * @param {[number, number]} p2 - point #2
     * @param {number} frac - the fraction at which to solve the Bézier equation
     * @returns {[number,number]} a solution to the 3-point Bézier equation
     */
    const doubleLerp = (p0, p1, p2, frac) => [
      lerp(lerp(p0[0], p1[0], frac), lerp(p1[0], p2[0], frac), frac),
      lerp(lerp(p0[1], p1[1], frac), lerp(p1[1], p2[1], frac), frac),
    ]

    /**
     * Find the distance between two points P0 and P1.
     *
     * @param {[number, number]} p0 - point #0
     * @param {[number, number]} p1 - point #1
     * @returns {number} the distance between the two points
     */
    const dist = (p0, p1) =>
      Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2))

    /* Artwork */

    const dotCount = 10
    const canvasSize = 768
    const minRadius = 2
    const maxRadius = 27

    const random = rand(hash(props.audio.title ?? ''))
    const ctrlPts = Array.from({ length: 4 }, (_, idx) => [
      random() * canvasSize,
      (idx / 3) * canvasSize,
    ])

    const pointCount = dotCount + 1
    const bezierPoints = []
    for (let i = 0; i <= pointCount; i++) {
      const frac = i / pointCount
      const a = doubleLerp(ctrlPts[0], ctrlPts[1], ctrlPts[2], frac)
      const b = doubleLerp(ctrlPts[1], ctrlPts[2], ctrlPts[3], frac)
      const x = lerp(a[0], b[0], frac)
      bezierPoints.push(x)
    }

    const offset = (i) => {
      return i * (canvasSize / (dotCount + 1))
    }
    const radius = (i, j) => {
      const bezierPoint = bezierPoints[i]
      const distance = dist([0, bezierPoint], [0, offset(j)])
      const maxFeasibleDistance = canvasSize * ((dotCount - 1) / (dotCount + 1))
      return lerp(maxRadius, minRadius, distance / maxFeasibleDistance)
    }

    return {
      ok,
      handleError,

      canvasSize,
      dotCount,
      offset,
      radius,
    }
  },
  computed: {
    helpText() {
      return this.$t('audio-thumbnail.alt', {
        title: this.audio.title,
        creator: this.audio.creator,
      })
    },
  },
}
</script>
