<template>
  <div
    :data-prefers-reduced-motion="prefersReducedMotion"
    :data-fake-aria-label="loadingLabel"
    class="hover:bg-yellow w-16 h-16 p-4 rounded-sm inline-flex justify-center items-center"
    :class="{
      [$style.loading]: status === 'loading',
      [$style.quiet]: status === 'loading' && prefersReducedMotion,
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 47 42"
      class="w-full h-full flex-shrink-0"
    >
      <path
        id="part-1"
        class="semi order-1"
        d="M0.999969 9.3975C0.999969 14.5687 5.17217 18.795 10.3353 18.795V0C5.17217 0 0.999969 4.2 0.999969 9.3975Z"
      />
      <path
        id="part-2"
        class="semi order-2"
        d="M14.6118 9.3975C14.6118 14.5687 18.784 18.795 23.9471 18.795V0C18.8101 0 14.6118 4.2 14.6118 9.3975Z"
      />
      <path
        id="part-3"
        class="full order-3"
        d="M37.5589 18.795C42.7146 18.795 46.8942 14.5876 46.8942 9.3975C46.8942 4.2074 42.7146 0 37.5589 0C32.4031 0 28.2236 4.2074 28.2236 9.3975C28.2236 14.5876 32.4031 18.795 37.5589 18.795Z"
      />
      <path
        id="part-4"
        class="semi order-a"
        d="M0.999969 32.6025C0.999969 37.8 5.17217 42 10.3353 42V23.2312C5.17217 23.2312 0.999969 27.4312 0.999969 32.6025Z"
      />
      <path
        id="part-5"
        class="semi order-b"
        d="M14.6118 32.5238C14.6118 37.695 18.784 41.9213 23.9471 41.9213V23.1525C18.8101 23.1525 14.6118 27.3525 14.6118 32.5238Z"
      />
      <path
        id="part-6"
        class="full order-c"
        d="M37.5589 41.9212C42.7146 41.9212 46.8942 37.7138 46.8942 32.5238C46.8942 27.3337 42.7146 23.1263 37.5589 23.1263C32.4031 23.1263 28.2236 27.3337 28.2236 32.5238C28.2236 37.7138 32.4031 41.9212 37.5589 41.9212Z"
      />
    </svg>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useReducedMotion } from '~/composables/use-media-query'
import { warn } from '~/utils/warn'

import { propTypes } from './VLogoLoader.types'

export default defineComponent({
  name: 'VLogoLoader',
  props: propTypes,
  /**
   * @param {import('./VLogoLoader.types').Props} props
   * @param {import('@nuxtjs/composition-api').SetupContext} context
   */
  setup(props) {
    const defaultWindow = typeof window !== 'undefined' ? window : undefined
    const prefersReducedMotion = useReducedMotion({ window: defaultWindow })

    if (!props.loadingLabel) {
      warn(
        'Please provide a label to announce when the component is "loading".'
      )
    }

    return { prefersReducedMotion }
  },
})
</script>

<style module>
.loading {
  animation: blink 1s steps(5, start) infinite;
}

@keyframes blink {
  to {
    visibility: hidden;
  }
}

.quiet {
  opacity: 0.5;
  animation: none !important;
}
</style>
